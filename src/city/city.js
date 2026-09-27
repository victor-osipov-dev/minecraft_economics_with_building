// City Simulation: CityState + центральный SimulationTick.
// Чистая логика без зависимости от Babylon — тестируется в node.
// 1 тик = 1 игровой день.
import { TYPES, instStats } from "./buildingTypes.js";

export const FOOD_PER_CAPITA = 0.5; // еды на жителя в день
export const TAX_PER_CAPITA = 0.3; // базовый налог с жителя в день
const REPAIR_PRICE = 0.01; // доля buildCost за 1% здоровья (полный ремонт = цена постройки)
const START_MONEY = 10000;
const START_FOOD = 800;
const START_ENERGY = 400;

const START_WATER = 300;

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
    nextId: 1,
    last: null,
  };
}

export function buildCostFor(typeId, dims) {
  return instStats(typeId, dims).buildCost;
}

// Мост «схема → симуляция». Возвращает инстанс (деньги списывает вызывающий).
export function addBuilding(state, { typeId, name, dims, pos, placedBlocks }) {
  const stats = instStats(typeId, dims);
  const inst = {
    id: "b_" + String(state.nextId++).padStart(3, "0"),
    typeId,
    name: name || TYPES[typeId].name,
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

const clamp = (v, a, b2) => Math.min(b2, Math.max(a, v));
// Черновые постройки (active === false, режим построек) в симуляции не участвуют.
const isActive = (b) => b.active !== false;
const effOf = (b) => (!isActive(b) || !(b.health > 0) ? 0 : b.health / 100);

export function tick(state) {
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
  state.food = clamp(Math.round((state.food + foodProd - foodCons) * 10) / 10, 0, 99999);
  state.energy = clamp(Math.round((state.energy + energyProd - energyCons) * 10) / 10, 0, 99999);
  const hunger = state.food <= 0 && foodCons > 0;
  // Блэкаут режет эффективность, но не в ноль (иначе смерть спиралью).
  const energyEff = state.energy > 0 || energyProd >= energyCons
    ? 1 : energyCons > 0 ? 0.35 + 0.65 * (energyProd / energyCons) : 1;

  // Вода: производство водокачек против потребления зданий.
  let waterProd = 0, waterCons = 0;
  for (const b of state.buildings) {
    waterProd += b.stats.waterProd * effOf(b) * staffing;
    waterCons += b.stats.waterCons * effOf(b);
  }
  state.water = clamp(Math.round((state.water + waterProd - waterCons) * 10) / 10, 0, 99999);
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
  for (const b of state.buildings) {
    income += b.stats.income * effOf(b) * staffing * energyEff;
    // Простаивающее/разрушенное здание стоит дешевле (консервация 40%).
    // Черновые не стоят ничего и не приносят ничего.
    if (isActive(b)) upkeep += b.stats.maintenance * (0.4 + 0.6 * effOf(b) * staffing);
  }
  // Базовый налог с жителей (без мэрии — плоская ставка; слайдер позже).
  income += pop * TAX_PER_CAPITA;
  income = Math.round(income * 100) / 100;
  upkeep = Math.round(upkeep * 100) / 100;
  state.money = Math.round((state.money + income - upkeep) * 100) / 100;

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
  // Преступность растёт от безработицы; полиция в радиусе защищает дома.
  const crimeIdx = pop > 10 ? clamp((1 - employmentRate) * 60 + state.pollution * 0.2, 0, 100) : 0;
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
  const entertainmentScore = pop === 0 ? 100 : clamp((entCap * 15 / Math.max(1, pop)) * 100, 0, 100);
  const safetyScore = clamp(70 + safeBonus - state.pollution * 0.5 - crimeIdx * unprotected * 0.5, 0, 100);
  state.happiness = clamp(Math.round(
    (housingScore + foodScore + employmentScore + entertainmentScore + safetyScore) / 5 +
    clamp(happyGlobal * 0.5, -10, 10) + clamp(localAvg, 0, 10) -
    (waterShortage ? 15 : 0) - wastePenalty
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
  let migrants = clamp(Math.round(attract), -6, 8);
  if (migrants > 0) migrants = Math.min(migrants, Math.max(0, Math.floor(freeHousing)));
  const births = Math.floor(pop * 0.012);
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

  // 12. Новый день.
  state.day += 1;
  state.last = {
    income, upkeep,
    migrants, births, deaths,
    employmentRatio: Math.round(employmentRatio * 100) / 100,
    employmentRate: Math.round(employmentRate * 100) / 100,
    housingCap, jobsTotal, energyEff: Math.round(energyEff * 100) / 100, hunger,
    waterShortage, waste: state.waste, crime: Math.round(crimeIdx * 10) / 10, fires,
  };
  return state.last;
}
