// City Simulation: CityState + центральный SimulationTick.
// Чистая логика без зависимости от Babylon — тестируется в node.
// 1 тик = 1 игровой день.
import { TYPES, instStats } from "./buildingTypes.js";
import { typeName } from "../i18n.js";

export const FOOD_PER_CAPITA = 0.5; // еды на жителя в день
export const ENERGY_PER_CAPITA = 0.3; // энергии на жителя в день
export const WATER_PER_CAPITA = 0.7; // воды на жителя в день
export const POP_UPKEEP = 0.2; // содержание городской инфраструктуры на жителя в день
export const TAX_PER_CAPITA = 0.3; // стартовый налог с жителя в день (дальше — слайдер)
// Налоговые категории слайдеров «бизнес» и «фабрики»: город собирает
// ставку/0.30 от дохода здания; выше порога предприятие теряет здоровье и
// закрывается (банкротство) — чинится «Ремонтом» после снижения ставки.
// ЖКХ, школы, дороги и жильё налогом не облагаются.
export const TAX_TOLERANCE = { biz: 0.55, ind: 0.6 };
const TAX_CATEGORY = {
  shop: "biz", office: "biz", service: "biz", entertainment: "biz",
  farm: "biz", fishery: "biz", factory: "ind",
};
const TAX_STRESS = 40; // здоровья в день за каждый пункт ставки выше порога
export const ROAD_RADIUS = 10; // дорога рядом: AABB здания + столько по XZ
export const ROAD_PENALTY = 0.5; // множитель эффективности без дороги
export const ROAD_FREE = new Set(["road", "decor"]); // этим типам дорога не нужна
export const BANKRUPT_AT = -5000; // казна ниже — банкротство (поражение)
// Цели-вехи: население → разовый бонус в казну.
export const MILESTONES = [
  { id: "m50", pop: 50, bonus: 500 },
  { id: "m200", pop: 200, bonus: 2000 },
  { id: "m500", pop: 500, bonus: 5000 },
  { id: "m1000", pop: 1000, bonus: 15000 },
];
const REPAIR_PRICE = 0.01; // доля buildCost за 1% здоровья (полный ремонт = цена постройки)
const START_MONEY = 10000;
const START_FOOD = 800;
const START_ENERGY = 400;

const START_WATER = 600;

export function newCityState() {
  return {
    money: START_MONEY,
    population: 0,
    food: START_FOOD,
    energy: START_ENERGY,
    water: START_WATER,
    waste: 0,
    happiness: 70,
    pollution: 0,
    day: 0,
    buildings: [],
    loans: [],
    nextId: 1,
    taxRate: TAX_PER_CAPITA,
    bizTax: TAX_PER_CAPITA,
    indTax: TAX_PER_CAPITA,
    milestones: [],
    bankrupt: false,
    last: null,
  };
}

export function buildCostFor(typeId, dims, tier = 1) {
  return instStats(typeId, dims, tier).buildCost;
}

// Мост «схема → симуляция». Возвращает инстанс (деньги списывает вызывающий).
export function addBuilding(state, { typeId, name, dims, pos, placedBlocks, file, rot, tier }) {
  const t3 = tier === 3 ? 3 : tier === 2 ? 2 : 1;
  const stats = instStats(typeId, dims, t3);
  const inst = {
    id: "b_" + String(state.nextId++).padStart(3, "0"),
    typeId,
    // typeName(), а не TYPES[typeId].name: .name в buildingTypes.js удалён,
    // имена и описания типов живут только в i18n (ru + en).
    name: name || typeName(typeId),
    file: typeof file === "string" ? file : "",
    rot: Number.isFinite(rot) ? rot : 0,
    tier: t3,
    x0: pos.x0, y0: pos.y0, z0: pos.z0,
    W: dims.W, H: dims.H, L: dims.L,
    health: 100,
    workers: 0,
    residents: 0,
    bonus: 0,
    protection: 0,
    active: true,
    stats,
    placedBlocks: Math.max(1, placedBlocks || 1),
  };
  state.buildings.push(inst);
  return inst;
}

export function charge(state, amount) {
  if (state.money < amount) return false;
  state.money = Math.round((state.money - amount) * 100) / 100;
  return true;
}

// ---------- кредиты: деньги сейчас, возврат с процентом потом ----------
// Сумму и срок задаёт игрок; ставка считается автоматически — 0,5% за день
// срока (100 дней = 50%), дальше строго по пропорции к сроку.
export const LOAN_MIN_DAYS = 10;
export const LOAN_MAX_DAYS = 365;
export const MAX_LOANS = 3;
const LOAN_DAILY_RATE = 0.005;

// Ставка за весь срок, % — всегда выводится из срока, менять её нельзя.
export function loanMinRate(days) {
  return Math.ceil(Math.max(LOAN_MIN_DAYS, days) * LOAN_DAILY_RATE * 200) / 2;
}

// Лимит — «под зарплату города»: население, доход, вехи.
export function loanLimit(state) {
  const pop = Math.max(0, state.population || 0);
  const inc = state.last && Number.isFinite(state.last.income) ? Math.max(0, state.last.income) : 0;
  const miles = Array.isArray(state.milestones) ? state.milestones.length : 0;
  return Math.round((1500 + pop * 30 + inc * 15 + miles * 2500) / 100) * 100;
}

// Всего к возврату, платёж в день и ставка за срок.
export function loanQuote(amount, days) {
  const rate = loanMinRate(days);
  const owed = Math.round(amount * (1 + rate / 100) * 100) / 100;
  return { owed, daily: Math.round(owed / Math.max(1, days) * 100) / 100, rate };
}

// Кредит простой как для детей: взял на N дней — первые N дней не платишь
// вообще, следующие N дней платишь равными частями.
export function takeLoan(state, params) {
  if (!params || typeof params !== "object") return { ok: false, reason: "loanNone" };
  if (state.loans.length >= MAX_LOANS) return { ok: false, reason: "loanMany" };
  const d = Math.floor(params.days);
  if (!Number.isFinite(d) || d < LOAN_MIN_DAYS || d > LOAN_MAX_DAYS) return { ok: false, reason: "loanBadDays" };
  const a = Math.round(Number(params.amount));
  const limit = loanLimit(state);
  if (!Number.isFinite(a) || a < 100 || a > limit) return { ok: false, reason: "loanBadAmount" };
  const { owed } = loanQuote(a, d);
  state.money = Math.round((state.money + a) * 100) / 100;
  state.loans.push({ owed, total: owed, daysLeft: d, days: d, graceLeft: d, principal: a, paid: 0 });
  return { ok: true, owed };
}

// Досрочное погашение: основной долг + проценты за прожитые дни цикла
// (цикл = d дней паузы + d дней платежей). Предел — остаток по графику,
// минимум — основной долг плюс проценты за один день. Старые займы без
// полей days/paid закрываются по остатку, как раньше.
export function loanPayoff(loan) {
  const owed = Math.max(0, loan.owed || 0);
  const P = loan.principal, T = loan.total, d = loan.days;
  const grace = Number.isFinite(loan.graceLeft) ? Math.max(0, loan.graceLeft) : 0;
  if (!Number.isFinite(d) || !Number.isFinite(loan.paid) ||
      !(P > 0) || !(T > P) || !(d > 0) ||
      (grace === 0 && loan.daysLeft <= 0)) return owed;
  const elapsed = (d - Math.min(d, grace)) + Math.min(d, d - Math.max(0, loan.daysLeft));
  const cycle = d * 2;
  const I = T - P;
  const accrued = Math.min(I, I * elapsed / cycle);
  const paid = Math.max(0, loan.paid);
  const principalRem = Math.max(0, P - Math.max(0, paid - accrued));
  const unpaidAccrued = Math.max(0, accrued - paid);
  const floor = P + I / cycle;
  return Math.round(Math.min(owed, Math.max(principalRem + unpaidAccrued, floor)) * 100) / 100;
}

// Досрочное погашение целиком.
export function repayLoan(state, idx) {
  const loan = state.loans[idx];
  if (!loan) return { ok: false };
  const cost = loanPayoff(loan);
  if (!charge(state, cost)) return { ok: false, cost };
  state.loans.splice(idx, 1);
  return { ok: true, cost };
}

// Деньги: сначала пауза (graceLeft дни — платёжей нет), потом ежедневные
// автоплатежи; просрочка растёт на 5% в день и бьёт по счастью.
function processLoans(state) {
  let paid = 0;
  let overdue = false;
  for (let i = state.loans.length - 1; i >= 0; i--) {
    const loan = state.loans[i];
    if (loan.graceLeft > 0) {
      loan.graceLeft = Math.max(0, loan.graceLeft - 1);
    } else if (loan.daysLeft > 0) {
      const part = loan.owed / loan.daysLeft;
      const pay = state.money > 0 ? Math.min(state.money, part) : 0;
      loan.owed = Math.round((loan.owed - pay) * 100) / 100;
      state.money = Math.round((state.money - pay) * 100) / 100;
      loan.paid = (Number.isFinite(loan.paid) ? loan.paid : 0) + pay;
      paid += pay;
      loan.daysLeft--;
    } else if (loan.owed > 0) {
      overdue = true;
      loan.owed = Math.round(loan.owed * 1.05 * 100) / 100;
      const pay = state.money > 0 ? Math.min(state.money, loan.owed) : 0;
      loan.owed = Math.round((loan.owed - pay) * 100) / 100;
      state.money = Math.round((state.money - pay) * 100) / 100;
      loan.paid = (Number.isFinite(loan.paid) ? loan.paid : 0) + pay;
      paid += pay;
    }
    if (loan.owed <= 0.005) state.loans.splice(i, 1);
  }
  return { paid: Math.round(paid * 100) / 100, overdue };
}

function contains(inst, x, y, z) {
  return x >= inst.x0 && x < inst.x0 + inst.W &&
    y >= inst.y0 && y < inst.y0 + inst.H &&
    z >= inst.z0 && z < inst.z0 + inst.L;
}

// Урон от ломания блоков игроком: снесли все блоки ≈ здоровье в 0.
export function damageAt(state, x, y, z) {
  for (let i = state.buildings.length - 1; i >= 0; i--) {
    const b = state.buildings[i];
    if (b.health > 0 && contains(b, x, y, z)) {
      // Без округления: иначе мелкий урон (большая постройка) тонет в round().
      b.health = Math.max(0, b.health - 120 / b.placedBlocks);
      return b;
    }
  }
  return null;
}

export function repairPrice(inst) {
  return Math.ceil((100 - inst.health) * inst.stats.buildCost * REPAIR_PRICE);
}

export function repair(state, id) {
  const b = state.buildings.find((v) => v.id === id);
  if (!b || b.health >= 100) return { ok: false, cost: 0 };
  const cost = repairPrice(b);
  if (!charge(state, cost)) return { ok: false, cost };
  b.health = 100;
  return { ok: true, cost };
}

// Снос здания: убирает из симуляции, возвращает половину цены постройки.
// Блоки в мире убирает вызывающий (у него есть доступ к плану/миру).
export function demolish(state, id) {
  const i = state.buildings.findIndex((v) => v.id === id);
  if (i < 0) return { ok: false, refund: 0 };
  const b = state.buildings[i];
  const refund = Math.floor(b.stats.buildCost * 0.5);
  state.buildings.splice(i, 1);
  state.money = Math.round((state.money + refund) * 100) / 100;
  return { ok: true, refund, name: b.name };
}

const clamp = (v, a, b2) => Math.min(b2, Math.max(a, v));
// Черновые постройки (active === false, режим построек) в симуляции не участвуют.
// Без дороги рядом эффективность падает (ROAD_PENALTY), кроме дорог и декора.
const isActive = (b) => b.active !== false;
const effOf = (b) => (!isActive(b) || !(b.health > 0)
  ? 0 : (b.health / 100) * (b.roadAccess === false ? ROAD_PENALTY : 1));

export function tick(state) {
  // 0. Доступ к дорогам: AABB здания (+ROAD_RADIUS по XZ) пересекает
  // AABB любой целой активной дороги. Считается каждый тик — дёшево.
  const roads = state.buildings.filter((b) => b.typeId === "road" && isActive(b) && b.health > 0);
  let roadless = 0;
  for (const b of state.buildings) {
    if (ROAD_FREE.has(b.typeId)) {
      b.roadAccess = true;
      continue;
    }
    const x0 = b.x0 - ROAD_RADIUS, x1 = b.x0 + b.W + ROAD_RADIUS;
    const z0 = b.z0 - ROAD_RADIUS, z1 = b.z0 + b.L + ROAD_RADIUS;
    b.roadAccess = roads.some((r) => r !== b && r.x0 < x1 && r.x0 + r.W > x0 && r.z0 < z1 && r.z0 + r.L > z0);
    if (!b.roadAccess && isActive(b) && b.health > 0) roadless++;
  }

  // 1. Жильё и рабочие места (с учётом здоровья).
  let housingCap = 0;
  let jobsTotal = 0;
  for (const b of state.buildings) {
    const e = effOf(b);
    housingCap += b.stats.housing * e;
    jobsTotal += b.stats.jobs * e;
  }
  housingCap = Math.floor(housingCap);
  jobsTotal = Math.floor(jobsTotal);

  // 2-3. Занятость и распределение работников.
  // staffing: хватает ли зданиям рук (для производства).
  // employmentRate: доля жителей с работой (для счастья).
  const pop = state.population;
  const employmentRatio = jobsTotal > 0 ? Math.min(1, pop / jobsTotal) : 1;
  const employmentRate = pop > 0 ? Math.min(1, jobsTotal / pop) : 1;
  for (const b of state.buildings) {
    b.workers = jobsTotal > 0 ? Math.round(b.stats.jobs * effOf(b) * employmentRatio) : 0;
  }
  const staffing = jobsTotal > 0 ? employmentRatio : 1;

  // 4-5. Производство и потребление еды/энергии.
  let foodProd = 0, energyProd = 0, energyCons = 0;
  for (const b of state.buildings) {
    const e = effOf(b) * staffing;
    foodProd += b.stats.foodProd * e;
    energyProd += b.stats.energyProd * e;
    energyCons += b.stats.energyCons * effOf(b);
  }
  const foodCons = pop * FOOD_PER_CAPITA;
  // Энергия тратится и на жителей: без этого запасы растут в потолок
  // и блэкаут в игре недостижим. Кап ≈ 5 дней потребления — копить
  // впрок бессмысленно, дефицит наступает быстро.
  energyCons += pop * ENERGY_PER_CAPITA;
  const energyCap = Math.max(400, Math.round(energyCons * 5));
  const foodNet = Math.round((foodProd - foodCons) * 10) / 10;
  const energyNet = Math.round((energyProd - energyCons) * 10) / 10;
  state.food = clamp(Math.round((state.food + foodProd - foodCons) * 10) / 10, 0, 99999);
  state.energy = clamp(Math.round((state.energy + energyProd - energyCons) * 10) / 10, 0, energyCap);
  const hunger = state.food <= 0 && foodCons > 0;
  // Блэкаут режет эффективность, но не в ноль (иначе смерть спиралью).
  const energyEff = state.energy > 0 || energyProd >= energyCons
    ? 1 : energyCons > 0 ? 0.35 + 0.65 * (energyProd / energyCons) : 1;

  // Вода: производство водокачек против потребления зданий и жителей.
  let waterProd = 0, waterCons = 0;
  for (const b of state.buildings) {
    waterProd += b.stats.waterProd * effOf(b) * staffing;
    waterCons += b.stats.waterCons * effOf(b);
  }
  waterCons += pop * WATER_PER_CAPITA;
  const waterCap = Math.max(300, Math.round(waterCons * 5));
  const waterNet = Math.round((waterProd - waterCons) * 10) / 10;
  state.water = clamp(Math.round((state.water + waterProd - waterCons) * 10) / 10, 0, waterCap);
  const waterShortage = state.water <= 0 && waterCons > 0;

  // Мусор: производство против мощности свалок; избыток копится городом.
  // Если мощностей хватает — город постепенно разгребает завалы.
  let wasteProd = 0, wasteCap = 0;
  for (const b of state.buildings) {
    wasteProd += b.stats.wasteProd * effOf(b);
    wasteCap += b.stats.wasteCap * effOf(b) * staffing;
  }
  if (wasteCap >= wasteProd) state.waste = state.waste * 0.9;
  else state.waste = state.waste + (wasteProd - wasteCap);
  state.waste = clamp(Math.round(state.waste * 10) / 10, 0, 500);
  const wastePenalty = Math.min(10, Math.max(0, state.waste - 50) / 20);

  // 6-7. Доход и расходы.
  let income = 0, upkeep = 0;
  const bizTax = Number.isFinite(state.bizTax) ? state.bizTax : TAX_PER_CAPITA;
  const indTax = Number.isFinite(state.indTax) ? state.indTax : TAX_PER_CAPITA;
  for (const b of state.buildings) {
    // Город собирает налог с дохода бизнеса/фабрик: базовая ставка 0.30
    // забирает весь вклад как раньше, выше — больше, 0 — ничего.
    const cat = TAX_CATEGORY[b.typeId];
    const taxMul = cat ? (cat === "biz" ? bizTax : indTax) / TAX_PER_CAPITA : 1;
    income += b.stats.income * effOf(b) * staffing * energyEff * taxMul;
    // Простаивающее/разрушенное здание стоит дешевле (консервация 40%).
    // Черновые не стоят ничего и не приносят ничего.
    if (isActive(b)) upkeep += b.stats.maintenance * (0.4 + 0.6 * effOf(b) * staffing);
  }
  // Базовый налог с жителей по ставке-слайдеру (по умолчанию TAX_PER_CAPITA).
  const taxRate = Number.isFinite(state.taxRate) ? state.taxRate : TAX_PER_CAPITA;
  income += pop * taxRate;
  // Содержание инфраструктуры на жителя: постоянный расход, растущий
  // с городом — иначе казна копится вечно без игрового напряжения.
  upkeep += pop * POP_UPKEEP;
  income = Math.round(income * 100) / 100;
  upkeep = Math.round(upkeep * 100) / 100;
  state.money = Math.round((state.money + income - upkeep) * 100) / 100;

  // Налоговое давление ( Cities: Skylines ): ставка выше порога роняет
  // здоровье предприятий — доход от них тает, на нуле здание закрыто
  // (банкротство); возвращается ремонтом после снижения ставки.
  let bankrupts = 0;
  for (const b of state.buildings) {
    const cat = TAX_CATEGORY[b.typeId];
    if (!cat) continue;
    const over = (cat === "biz" ? bizTax : indTax) - TAX_TOLERANCE[cat];
    if (over <= 0 || effOf(b) <= 0) continue;
    const before = b.health;
    b.health = Math.max(0, Math.round((b.health - over * TAX_STRESS) * 10) / 10);
    if (before > 0 && b.health <= 0) bankrupts++;
  }

  // Кредиты: автоплатёж после всех доходов/расходов дня.
  const { paid: loanPaid, overdue } = processLoans(state);

  // 8. Счастье = среднее пяти факторов + прямые бонусы − загрязнение.
  const housingScore = pop === 0 ? 100 : clamp((housingCap / Math.max(1, pop)) * 100, 0, 100);
  const foodScore = hunger ? 15 : state.food > pop * 2 ? 100 : 60;
  const employmentScore = jobsTotal === 0 ? (pop === 0 ? 100 : 25)
    : clamp(employmentRate * 110, 0, 100);
  let entCap = 0, safeBonus = 0, happyGlobal = 0;
  const amenities = [];
  for (const b of state.buildings) {
    const e = effOf(b);
    entCap += b.stats.entertainment * e;
    safeBonus += b.stats.safety * e;
    const t = TYPES[b.typeId];
    // Удобства с радиусом влияют только на дома рядом, остальные — на всех.
    if (t && t.radius > 0) {
      if (e > 0) amenities.push(b);
    } else {
      happyGlobal += b.stats.happiness * e;
    }
  }
  // Локальные бонусы домов: проверять расстояние до каждого жителя не нужно,
  // достаточно влияния удобств на дома (дёшево: дома × удобства раз в тик).
  let bonusSum = 0, houseCount = 0;
  for (const h of state.buildings) {
    if (h.stats.housing <= 0) {
      h.bonus = 0;
      continue;
    }
    const hx = h.x0 + h.W / 2, hz = h.z0 + h.L / 2;
    let bonus = 0;
    for (const a of amenities) {
      const t = TYPES[a.typeId];
      const dx = a.x0 + a.W / 2 - hx, dz = a.z0 + a.L / 2 - hz;
      if (dx * dx + dz * dz <= t.radius * t.radius) bonus += a.stats.happiness * effOf(a);
    }
    h.bonus = Math.round(Math.min(15, bonus) * 10) / 10;
    bonusSum += h.bonus;
    houseCount++;
  }
  const localAvg = houseCount > 0 ? bonusSum / houseCount : 0;
  let protSum = 0, protTotal = 0;
  for (const h of state.buildings) {
    if (h.stats.housing <= 0) {
      h.protection = 0;
      continue;
    }
    const hx = h.x0 + h.W / 2, hz = h.z0 + h.L / 2;
    let covered = false;
    for (const p of state.buildings) {
      if (p.typeId !== "police" || effOf(p) <= 0) continue;
      const dx = p.x0 + p.W / 2 - hx, dz = p.z0 + p.L / 2 - hz;
      if (dx * dx + dz * dz <= TYPES.police.radius * TYPES.police.radius) {
        covered = true;
        break;
      }
    }
    h.protection = covered ? 1 : 0;
    const w = h.stats.housing * effOf(h);
    protSum += covered ? w : 0;
    protTotal += w;
  }
  const unprotected = protTotal > 0 ? 1 - protSum / protTotal : 1;
  // Преступность: безработица, загрязнение и плотность населения создают
  // напряжение; полиция в радиусе гасит его — без участков множитель 1.0,
  // при полном покрытии жилья ×0.3. Раньше полиция на сам индекс не влияла
  // и участки были бесполезны (описание врало).
  const crimeBase = pop > 10
    ? clamp((1 - employmentRate) * 60 + state.pollution * 0.2 + Math.min(25, pop / 40), 0, 100)
    : 0;
  const crimeIdx = clamp(crimeBase * (0.3 + 0.7 * unprotected), 0, 100);
  const entertainmentScore = pop === 0 ? 100 : clamp((entCap * 15 / Math.max(1, pop)) * 100, 0, 100);
  const safetyScore = clamp(70 + safeBonus - state.pollution * 0.5 - crimeIdx * 0.5, 0, 100);
  // Налоги выше базовых давят на счастье, нулевые — радуют.
  const taxPenalty = (taxRate - TAX_PER_CAPITA) * 48;
  state.happiness = clamp(Math.round(
    (housingScore + foodScore + employmentScore + entertainmentScore + safetyScore) / 5 +
    clamp(happyGlobal * 0.5, -10, 10) + clamp(localAvg, 0, 10) -
    (waterShortage ? 15 : 0) - wastePenalty - (overdue ? 5 : 0) - taxPenalty
  ), 0, 100);

  // Пожары: 0.2% на здание в день без покрытия пожарной в радиусе (макс 2).
  // Бьют по здоровью через готовую систему урона/ремонта.
  const fires = [];
  for (const b of state.buildings) {
    // Сами пожарные не горят.
    if (fires.length >= 2 || effOf(b) <= 0 || b.typeId === "fire") continue;
    const bx = b.x0 + b.W / 2, bz = b.z0 + b.L / 2;
    let covered = false;
    for (const f of state.buildings) {
      if (f.typeId !== "fire" || effOf(f) <= 0 || f === b) continue;
      const dx = f.x0 + f.W / 2 - bx, dz = f.z0 + f.L / 2 - bz;
      if (dx * dx + dz * dz <= TYPES.fire.radius * TYPES.fire.radius) {
        covered = true;
        break;
      }
    }
    if (!covered && Math.random() < 0.002) {
      b.health = Math.max(0, Math.round((b.health - 25) * 10) / 10);
      fires.push({ id: b.id, name: b.name, health: b.health });
    }
  }

  // 9-10. Миграция, рождения и смерти.
  const freeHousing = housingCap - pop;
  const freeJobs = jobsTotal - Math.min(pop, jobsTotal);
  const attract = (state.happiness - 55) / 8 + (freeJobs > 0 ? 1.5 : 0) +
    (freeHousing > 0 ? 1 : -3) + (hunger ? -4 : 0) + (waterShortage ? -2 : 0);
  let migrants = clamp(Math.round(attract), -6, 8) + 0; // +0 убирает −0 в UI
  if (migrants > 0) migrants = Math.min(migrants, Math.max(0, Math.floor(freeHousing)));
  // Рождения только при свободном жилье: иначе население обгоняет
  // вместимость и перенаселение копится бесконечно.
  const births = freeHousing > 0 ? Math.floor(pop * 0.012) : 0;
  const deaths = Math.floor(pop * 0.008 + (hunger ? pop * 0.03 : 0));
  state.population = Math.max(0, pop + migrants + births - deaths);

  // Расселение жителей по домам пропорционально вместимости (для отображения).
  {
    let total = 0;
    for (const b of state.buildings) total += b.stats.housing * effOf(b);
    let assigned = 0;
    for (const b of state.buildings) {
      b.residents = total > 0
        ? Math.floor((state.population * b.stats.housing * effOf(b)) / total) : 0;
      assigned += b.residents;
    }
    let rest = state.population - assigned;
    if (total > 0 && rest > 0) {
      const order = state.buildings
        .filter((b) => b.stats.housing > 0 && effOf(b) > 0)
        .sort((x, y) => y.stats.housing * effOf(y) - x.stats.housing * effOf(x));
      for (let i = 0; rest > 0 && order.length > 0; i++) {
        order[i % order.length].residents++;
        rest--;
      }
    }
  }

  // 11. Загрязнение: выбросы − естественное рассеивание.
  let emission = 0;
  for (const b of state.buildings) emission += b.stats.pollution * effOf(b);
  state.pollution = clamp(Math.round((state.pollution * 0.97 + emission * 0.02) * 10) / 10, 0, 100);

  // Вехи: население достигло круглой цифры — разовый бонус в казну.
  // В last кладём id (имена — в словаре i18n).
  const milestonesHit = [];
  if (!Array.isArray(state.milestones)) state.milestones = [];
  for (const m of MILESTONES) {
    if (!state.milestones.includes(m.id) && state.population >= m.pop) {
      state.milestones.push(m.id);
      state.money = Math.round((state.money + m.bonus) * 100) / 100;
      milestonesHit.push(m.id);
    }
  }

  // 12. Новый день.
  state.day += 1;
  state.last = {
    income, upkeep,
    migrants, births, deaths,
    employmentRatio: Math.round(employmentRatio * 100) / 100,
    employmentRate: Math.round(employmentRate * 100) / 100,
    housingCap, jobsTotal, energyEff: Math.round(energyEff * 100) / 100, hunger,
    foodNet, energyNet, waterNet,
    waterShortage, waste: state.waste, crime: Math.round(crimeIdx * 10) / 10, fires,
    loanPaid, overdue, debt: Math.round(state.loans.reduce((a, l) => a + l.owed, 0) * 100) / 100,
    roadless, milestonesHit, taxRate, bankrupts,
  };
  return state.last;
}
