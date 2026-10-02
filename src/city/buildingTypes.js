// Типы зданий города (BuildingType) и привязка схем к типам.
//
// Тип описывает ЭКОНОМИКУ здания, размеры схемы — МАСШТАБ.
// Конкретные числа инстанса считает instStats(): база типа × масштаб
// от габаритов схемы. Все дневные цифры — за 1 тик симуляции (1 день).
export const TYPES = {
  house: {
    name: "Дом", desc: "Жильё для горожан",
    buildCost: 500, maintenance: 3,
    housing: 8, jobs: 0,
    foodProd: 0, energyProd: 0, energyCons: 2,
    waterProd: 0, waterCons: 3,
    wasteProd: 1, wasteCap: 0,
    income: 0, happiness: 1, entertainment: 0, safety: 0, pollution: 0,
  },
  apartment: {
    name: "Многоквартирный дом", desc: "Много жилья на малом пятне",
    buildCost: 1500, maintenance: 9,
    housing: 30, jobs: 0,
    foodProd: 0, energyProd: 0, energyCons: 6,
    waterProd: 0, waterCons: 8,
    wasteProd: 3, wasteCap: 0,
    income: 0, happiness: 1, entertainment: 0, safety: 0, pollution: 0,
  },
  shop: {
    name: "Магазин", desc: "Рабочие места, доход и немного еды",
    buildCost: 800, maintenance: 6,
    housing: 0, jobs: 4,
    foodProd: 6, energyProd: 0, energyCons: 3,
    waterProd: 0, waterCons: 2,
    wasteProd: 2, wasteCap: 0,
    income: 24, happiness: 1, entertainment: 1, safety: 0, pollution: 0,
  },
  office: {
    name: "Офис", desc: "Много рабочих мест, стабильный доход",
    buildCost: 1200, maintenance: 9,
    housing: 0, jobs: 8,
    foodProd: 0, energyProd: 0, energyCons: 4,
    waterProd: 0, waterCons: 3,
    wasteProd: 2, wasteCap: 0,
    income: 34, happiness: 0, entertainment: 0, safety: 0, pollution: 0,
  },
  factory: {
    name: "Фабрика", desc: "Высокий доход, загрязнение, жрёт энергию",
    buildCost: 2000, maintenance: 16,
    housing: 0, jobs: 15,
    foodProd: 0, energyProd: 0, energyCons: 12,
    waterProd: 0, waterCons: 8,
    wasteProd: 4, wasteCap: 0,
    income: 72, happiness: -1, entertainment: 0, safety: 0, pollution: 2,
  },
  fishery: {
    name: "Рыбное хозяйство", desc: "Еда для города",
    buildCost: 600, maintenance: 5,
    housing: 0, jobs: 3,
    foodProd: 20, energyProd: 0, energyCons: 2,
    waterProd: 0, waterCons: 4,
    wasteProd: 1, wasteCap: 0,
    income: 10, happiness: 0, entertainment: 0, safety: 0, pollution: 0,
  },
  farm: {
    name: "Ферма", desc: "Много еды",
    buildCost: 600, maintenance: 5,
    housing: 0, jobs: 3,
    foodProd: 25, energyProd: 0, energyCons: 1,
    waterProd: 0, waterCons: 6,
    wasteProd: 1, wasteCap: 0,
    income: 8, happiness: 0, entertainment: 0, safety: 0, pollution: 0,
  },
  powerplant: {
    name: "Электростанция", desc: "Энергия для города",
    buildCost: 1500, maintenance: 12,
    housing: 0, jobs: 4,
    foodProd: 0, energyProd: 80, energyCons: 0,
    waterProd: 0, waterCons: 0,
    wasteProd: 1, wasteCap: 0,
    income: 0, happiness: -1, entertainment: 0, safety: 0, pollution: 1,
  },
  park: {
    name: "Парк", desc: "Счастье рядом (пока глобально)",
    buildCost: 300, maintenance: 1,
    housing: 0, jobs: 0,
    foodProd: 0, energyProd: 0, energyCons: 0,
    income: 0, happiness: 4, entertainment: 2, safety: 0, pollution: 0,
    radius: 30,
  },
  school: {
    name: "Школа", desc: "Счастье и рабочие места",
    buildCost: 800, maintenance: 6,
    housing: 0, jobs: 6,
    foodProd: 0, energyProd: 0, energyCons: 3,
    waterProd: 0, waterCons: 2,
    wasteProd: 1, wasteCap: 0,
    income: 0, happiness: 3, entertainment: 1, safety: 0, pollution: 0,
    radius: 20,
  },
  hospital: {
    name: "Больница", desc: "Здоровье и безопасность города",
    buildCost: 1100, maintenance: 9,
    housing: 0, jobs: 7,
    foodProd: 0, energyProd: 0, energyCons: 4,
    waterProd: 0, waterCons: 4,
    wasteProd: 2, wasteCap: 0,
    income: 0, happiness: 3, entertainment: 0, safety: 3, pollution: 0,
    radius: 20,
  },
  service: {
    name: "Общественное здание", desc: "Культура и услуги",
    buildCost: 600, maintenance: 5,
    housing: 0, jobs: 3,
    foodProd: 0, energyProd: 0, energyCons: 2,
    waterProd: 0, waterCons: 1,
    wasteProd: 1, wasteCap: 0,
    income: 5, happiness: 2, entertainment: 1, safety: 0, pollution: 0,
    radius: 15,
  },
  entertainment: {
    name: "Развлечения", desc: "Стадион, бассейн — досуг горожан",
    buildCost: 900, maintenance: 6,
    housing: 0, jobs: 5,
    foodProd: 0, energyProd: 0, energyCons: 3,
    waterProd: 0, waterCons: 2,
    wasteProd: 2, wasteCap: 0,
    income: 10, happiness: 2, entertainment: 4, safety: 0, pollution: 0,
    radius: 25,
  },
  waterplant: {
    name: "Водокачка", desc: "Вода для города",
    buildCost: 900, maintenance: 8,
    housing: 0, jobs: 3,
    foodProd: 0, energyProd: 0, energyCons: 4,
    waterProd: 40, waterCons: 0,
    wasteProd: 0, wasteCap: 0,
    income: 0, happiness: 0, entertainment: 0, safety: 0, pollution: 0,
  },
  landfill: {
    name: "Свалка", desc: "Перерабатывает мусор, но грязная и неприятная",
    buildCost: 500, maintenance: 6,
    housing: 0, jobs: 3,
    foodProd: 0, energyProd: 0, energyCons: 1,
    waterProd: 0, waterCons: 0,
    wasteProd: 0, wasteCap: 60,
    income: 0, happiness: -1, entertainment: 0, safety: 0, pollution: 2,
  },
  police: {
    name: "Полиция", desc: "Снижает преступность в радиусе 25",
    buildCost: 1000, maintenance: 8,
    housing: 0, jobs: 6,
    foodProd: 0, energyProd: 0, energyCons: 3,
    waterProd: 0, waterCons: 1,
    wasteProd: 1, wasteCap: 0,
    income: 0, happiness: 0, entertainment: 0, safety: 0, pollution: 0,
    radius: 25,
  },
  fire: {
    name: "Пожарная", desc: "Не даёт зданиям гореть в радиусе 25",
    buildCost: 900, maintenance: 8,
    housing: 0, jobs: 6,
    foodProd: 0, energyProd: 0, energyCons: 3,
    waterProd: 0, waterCons: 2,
    wasteProd: 1, wasteCap: 0,
    income: 0, happiness: 1, entertainment: 0, safety: 1, pollution: 0,
    radius: 25,
  },
  road: {
    name: "Инфраструктура", desc: "Дороги и транспорт: связывают город",
    buildCost: 150, maintenance: 1,
    housing: 0, jobs: 0,
    foodProd: 0, energyProd: 0, energyCons: 0,
    income: 0, happiness: 1, entertainment: 0, safety: 0, pollution: 0,
  },
  decor: {
    name: "Декор", desc: "Украшение: чуть счастья",
    buildCost: 50, maintenance: 0,
    housing: 0, jobs: 0,
    foodProd: 0, energyProd: 0, energyCons: 0,
    income: 0, happiness: 1, entertainment: 0, safety: 0, pollution: 0,
  },
  generic: {
    name: "Постройка", desc: "Без специализации",
    buildCost: 200, maintenance: 2,
    housing: 0, jobs: 0,
    foodProd: 0, energyProd: 0, energyCons: 0,
    income: 0, happiness: 1, entertainment: 0, safety: 0, pollution: 0,
  },
};

// Масштаб от габаритов схемы: крупные постройки дают больше.
// Объём нормируем на дом 10×6×10 (=600).
export function scaleFor(dims) {
  const v = Math.max(1, (dims.W || 1) * (dims.H || 1) * (dims.L || 1));
  const s = 0.5 + v / 600;
  return Math.min(8, Math.max(0.5, s));
}

// Конкретные числа инстанса: ёмкости — линейно от объёма, деньги —
// сублинейно (корень), иначе гигантская фабрика ломает баланс.
// Тир умножает цену/содержание (cost) и отдачу (stats): элита дороже,
// но и даёт больше. Без тира — обычная постройка.
export function instStats(typeId, dims, tier = 1) {
  const t = TYPES[typeId] || TYPES.generic;
  const tm = TIERS[tier] || TIERS[1];
  const s = scaleFor(dims);
  const ms = Math.sqrt(s);
  const vi = (x) => Math.max(0, Math.floor(x * s * tm.stats));
  const upk = (x) => Math.round(x * ms * tm.cost * 10) / 10;
  const earn = (x) => Math.round(x * ms * tm.stats * 10) / 10;
  return {
    buildCost: Math.max(10, Math.round(t.buildCost * ms * tm.cost)),
    maintenance: Math.max(0, upk(t.maintenance)),
    housing: vi(t.housing),
    jobs: vi(t.jobs),
    foodProd: Math.round(t.foodProd * ms * tm.stats * 10) / 10,
    energyProd: Math.round(t.energyProd * s * tm.stats * 10) / 10,
    energyCons: Math.round(t.energyCons * s * tm.stats * 10) / 10,
    waterProd: Math.round((t.waterProd || 0) * s * tm.stats * 10) / 10,
    waterCons: Math.round((t.waterCons || 0) * s * tm.stats * 10) / 10,
    wasteProd: Math.round((t.wasteProd || 0) * s * tm.stats * 10) / 10,
    wasteCap: Math.round((t.wasteCap || 0) * s * tm.stats * 10) / 10,
    income: earn(t.income),
    happiness: Math.round(t.happiness * tm.stats),
    entertainment: Math.round(t.entertainment * s * tm.stats * 10) / 10,
    safety: Math.round(t.safety * tm.stats * 10) / 10,
    pollution: Math.round(t.pollution * s * tm.stats * 10) / 10,
  };
}

const POWER_RE = /(power|solar|wind|nuclear|reactor|turbine|generator|transmission|substation|pylon)/i;
const FARM_RE = /(farm|greenhouse|field|crop|mill\b|ranch|plantation)/i;
const WATER_RE = /(water\s*plant|pump(\s*station|\s*house)?|waterworks|reservoir|pumping)/i;
const LANDFILL_RE = /(landfill|garbage|waste|rubbish|\bdump\b|recycl|incinerator)/i;
const POLICE_RE = /(police|precinct|sheriff|constabulary)/i;
const FIRE_RE = /(fire\s*station|firehouse|fire\s*dept|fire\s*department)/i;

// Теги проверяем в приоритетном порядке (первое совпадение побеждает).
const TAG_MAP = [
  ["powerplant", null], // только по имени, см. ниже
  ["hospital", "hospital"],
  ["school", "school"],
  ["apartment", "apartment"],
  ["tower", "apartment"],
  ["hotel", "apartment"],
  ["house", "house"],
  ["shop", "shop"],
  ["office", "office"],
  ["bank", "office"],
  ["park", "park"],
  ["fountain", "park"],
  ["church", "service"],
  ["museum", "service"],
  ["library", "service"],
  ["stadium", "entertainment"],
  ["pool", "entertainment"],
  ["station", "service"],
  ["parking", "road"],
  ["road", "road"],
  ["bridge", "road"],
];

const CATEGORY_FALLBACK = {
  residential: "house",
  towers: "apartment",
  commercial: "shop",
  industrial: "factory",
  public: "service",
  parks: "park",
  waterfront: "fishery",
  transport: "road",
  roads: "road",
  intersections: "road",
  bridges: "road",
  decor: "decor",
  vehicles: "decor",
};

// Тиры построек: обычные доступны сразу, элита и легенды — дороже,
// но и отдача выше. Без элиты игра проходится: это ускорение, не ворота.
export const TIERS = {
  1: { name: "Обычная", icon: "", cost: 1, stats: 1 },
  2: { name: "Элита", icon: "💎", cost: 2.2, stats: 1.7 },
  3: { name: "Легенда", icon: "👑", cost: 4.5, stats: 2.6 },
};
const ELITE_RE = /(luxury|deluxe|grand|premium|royal|mansion|villa|hotel|manor|estate|penthouse|plaza|resort|majestic|superior|prestige|chateau)/i;
const LANDMARK_RE = /(mega|ultimate|skyscraper|palace|monument|empire|casino|cathedral|coloss)/i;

// Тир по престижу имени; без престижных слов — по объёму:
// large (120k+) — элита, huge (500k+) — легенда.
export function resolveTier(meta = {}, dims = {}) {
  const name = `${meta.file || ""} ${meta.name || ""}`;
  if (LANDMARK_RE.test(name)) return 3;
  if (ELITE_RE.test(name)) return 2;
  const v = Math.max(1, (Number(dims.W) || 1) * (Number(dims.H) || 1) * (Number(dims.L) || 1));
  if (v >= 500000) return 3;
  if (v >= 120000) return 2;
  return 1;
}

// meta: { file, name, category, tags[] } (теги/категория могут отсутствовать).
export function resolveType(meta = {}) {
  const name = `${meta.file || ""} ${meta.name || ""}`;
  if (POWER_RE.test(name)) return "powerplant";
  if (FARM_RE.test(name)) return "farm";
  if (WATER_RE.test(name)) return "waterplant";
  if (LANDFILL_RE.test(name)) return "landfill";
  if (POLICE_RE.test(name)) return "police";
  if (FIRE_RE.test(name)) return "fire";
  const tags = meta.tags || [];
  // Тег water (без фонтана/бассейна/парка рядом) — водокачка, а не декор.
  if (tags.includes("water") &&
      !tags.includes("fountain") && !tags.includes("pool") && !tags.includes("park")) {
    return "waterplant";
  }
  for (const [tag, typeId] of TAG_MAP) {
    if (typeId && tags.includes(tag)) return typeId;
  }
  if (meta.category && CATEGORY_FALLBACK[meta.category]) {
    return CATEGORY_FALLBACK[meta.category];
  }
  return "generic";
}
