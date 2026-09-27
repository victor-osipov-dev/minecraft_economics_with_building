// Типы зданий города (BuildingType) и привязка схем к типам.
//
// Тип описывает ЭКОНОМИКУ здания, размеры схемы — МАСШТАБ.
// Конкретные числа инстанса считает instStats(): база типа × масштаб
// от габаритов схемы. Все дневные цифры — за 1 тик симуляции (1 день).
export const TYPES = {
  house: {
    name: "Дом", desc: "Жильё для горожан",
    buildCost: 500, maintenance: 2,
    housing: 8, jobs: 0,
    foodProd: 0, energyProd: 0, energyCons: 2,
    income: 0, happiness: 1, entertainment: 0, safety: 0, pollution: 0,
  },
  apartment: {
    name: "Многоквартирный дом", desc: "Много жилья на малом пятне",
    buildCost: 1500, maintenance: 6,
    housing: 30, jobs: 0,
    foodProd: 0, energyProd: 0, energyCons: 6,
    income: 0, happiness: 1, entertainment: 0, safety: 0, pollution: 0,
  },
  shop: {
    name: "Магазин", desc: "Рабочие места, доход и немного еды",
    buildCost: 800, maintenance: 4,
    housing: 0, jobs: 6,
    foodProd: 4, energyProd: 0, energyCons: 3,
    income: 30, happiness: 1, entertainment: 1, safety: 0, pollution: 0,
  },
  office: {
    name: "Офис", desc: "Много рабочих мест, стабильный доход",
    buildCost: 1200, maintenance: 5,
    housing: 0, jobs: 12,
    foodProd: 0, energyProd: 0, energyCons: 4,
    income: 45, happiness: 0, entertainment: 0, safety: 0, pollution: 0,
  },
  factory: {
    name: "Фабрика", desc: "Высокий доход, загрязнение, жрёт энергию",
    buildCost: 2000, maintenance: 10,
    housing: 0, jobs: 20,
    foodProd: 0, energyProd: 0, energyCons: 12,
    income: 90, happiness: -1, entertainment: 0, safety: 0, pollution: 3,
  },
  fishery: {
    name: "Рыбное хозяйство", desc: "Еда для города",
    buildCost: 700, maintenance: 3,
    housing: 0, jobs: 4,
    foodProd: 20, energyProd: 0, energyCons: 2,
    income: 10, happiness: 0, entertainment: 0, safety: 0, pollution: 0,
  },
  farm: {
    name: "Ферма", desc: "Много еды",
    buildCost: 600, maintenance: 3,
    housing: 0, jobs: 4,
    foodProd: 25, energyProd: 0, energyCons: 1,
    income: 8, happiness: 0, entertainment: 0, safety: 0, pollution: 0,
  },
  powerplant: {
    name: "Электростанция", desc: "Энергия для города",
    buildCost: 1500, maintenance: 8,
    housing: 0, jobs: 6,
    foodProd: 0, energyProd: 40, energyCons: 0,
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
    buildCost: 1000, maintenance: 5,
    housing: 0, jobs: 8,
    foodProd: 0, energyProd: 0, energyCons: 3,
    income: 0, happiness: 3, entertainment: 1, safety: 0, pollution: 0,
    radius: 20,
  },
  hospital: {
    name: "Больница", desc: "Здоровье и безопасность города",
    buildCost: 1400, maintenance: 7,
    housing: 0, jobs: 10,
    foodProd: 0, energyProd: 0, energyCons: 4,
    income: 0, happiness: 3, entertainment: 0, safety: 3, pollution: 0,
    radius: 20,
  },
  service: {
    name: "Общественное здание", desc: "Культура и услуги",
    buildCost: 600, maintenance: 3,
    housing: 0, jobs: 4,
    foodProd: 0, energyProd: 0, energyCons: 2,
    income: 5, happiness: 2, entertainment: 1, safety: 0, pollution: 0,
    radius: 15,
  },
  entertainment: {
    name: "Развлечения", desc: "Стадион, бассейн — досуг горожан",
    buildCost: 900, maintenance: 4,
    housing: 0, jobs: 6,
    foodProd: 0, energyProd: 0, energyCons: 3,
    income: 10, happiness: 2, entertainment: 4, safety: 0, pollution: 0,
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
    buildCost: 200, maintenance: 1,
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
export function instStats(typeId, dims) {
  const t = TYPES[typeId] || TYPES.generic;
  const s = scaleFor(dims);
  const ms = Math.sqrt(s);
  const vi = (x) => Math.max(0, Math.floor(x * s));
  const money = (x) => Math.round(x * ms * 10) / 10;
  return {
    buildCost: Math.max(10, Math.round(t.buildCost * ms)),
    maintenance: Math.max(0, money(t.maintenance)),
    housing: vi(t.housing),
    jobs: vi(t.jobs),
    foodProd: Math.round(t.foodProd * s * 10) / 10,
    energyProd: Math.round(t.energyProd * s * 10) / 10,
    energyCons: Math.round(t.energyCons * s * 10) / 10,
    income: money(t.income),
    happiness: t.happiness,
    entertainment: Math.round(t.entertainment * s * 10) / 10,
    safety: t.safety,
    pollution: Math.round(t.pollution * s * 10) / 10,
  };
}

const POWER_RE = /(power|solar|wind|nuclear|reactor|turbine|generator|transmission|substation|pylon)/i;
const FARM_RE = /(farm|greenhouse|field|crop|mill\b|ranch|plantation)/i;

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

// meta: { file, name, category, tags[] } (теги/категория могут отсутствовать).
export function resolveType(meta = {}) {
  const name = `${meta.file || ""} ${meta.name || ""}`;
  if (POWER_RE.test(name)) return "powerplant";
  if (FARM_RE.test(name)) return "farm";
  const tags = meta.tags || [];
  for (const [tag, typeId] of TAG_MAP) {
    if (typeId && tags.includes(tag)) return typeId;
  }
  if (meta.category && CATEGORY_FALLBACK[meta.category]) {
    return CATEGORY_FALLBACK[meta.category];
  }
  return "generic";
}
