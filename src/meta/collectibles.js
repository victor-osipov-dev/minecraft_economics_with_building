// Коллекционные постройки — награды за достижения.
// Это НЕ схемы с диска: планы собираются из блоков прямо в коде и подаются
// в pasteSchematic так же, как распаршенный .schem (см. selectScheme/placePreview).
// Все они имеют тип "collectible" с нулевой экономикой: сами по себе ничего не дают.
import {
  GOLD_BLOCK, PINK_WOOL, DARK_METAL, RUST_METAL, STONE_BRICKS, WATER,
  DIRT, GLASS, TORCH, CHEST, IRON_BLOCK, RED_WOOL, BLACK_WOOL,
  QUARTZ_BLOCK, WOOD, SMOOTH_STONE_SLAB, OAK_SIGN, BARS,
} from "../blocks.js";

const B = {
  gold: GOLD_BLOCK, pink: PINK_WOOL, dark: DARK_METAL, rust: RUST_METAL,
  stone: STONE_BRICKS, water: WATER, dirt: DIRT, glass: GLASS,
  torch: TORCH, chest: CHEST, iron: IRON_BLOCK, red: RED_WOOL,
  black: BLACK_WOOL, quartz: QUARTZ_BLOCK, wood: WOOD,
  slab: SMOOTH_STONE_SLAB, sign: OAK_SIGN, bars: BARS,
};

function draft(W, H, L) {
  const blocks = [];
  // pasteSchematic запрещает повтор координат: последняя запись побеждает.
  const seen = new Map();
  const put = (x, y, z, id, data = 0) => {
    if (x < 0 || y < 0 || z < 0 || x >= W || y >= H || z >= L) return;
    const key = `${x},${y},${z}`;
    const at = seen.get(key);
    const block = [x, y, z, id, data];
    if (at === undefined) {
      seen.set(key, blocks.length);
      blocks.push(block);
    } else {
      blocks[at] = block; // заменить, а не дублировать (стекло поверх решётки и т.п.)
    }
  };
  const fill = (x, y, z, w, h, d, id, data = 0) => {
    for (let a = 0; a < w; a++) for (let b = 0; b < h; b++) for (let c = 0; c < d; c++) put(x + a, y + b, z + c, id, data);
  };
  const ring = (y, id) => {
    for (let x = 0; x < W; x++) { put(x, y, 0, id); put(x, y, L - 1, id); }
    for (let z = 0; z < L; z++) { put(0, y, z, id); put(W - 1, y, z, id); }
  };
  return { W, H, L, blocks, put, fill, ring };
}

// 🎰 Казино: снаружи золотой фасад, внутри — однорукий бандит.
// Экономики не даёт совсем; interacts через C или кнопку в панели города.
function casino() {
  const d = draft(13, 9, 11);
  d.fill(0, 0, 0, 13, 1, 11, B.dark);
  for (let y = 1; y <= 6; y++) {
    d.ring(y, y === 6 ? B.gold : B.dark);
  }
  // витрины
  for (const x of [2, 6, 10]) {
    d.put(x, 3, 0, B.glass); d.put(x, 4, 0, B.glass);
    d.put(x, 3, 10, B.glass); d.put(x, 4, 10, B.glass);
  }
  // вывеска и золотой карниз
  d.fill(0, 7, 0, 13, 1, 11, B.gold);
  d.fill(0, 8, 0, 13, 1, 11, B.red);
  d.fill(3, 8, 0, 7, 1, 1, B.gold);
  // accessory: однорукий бандит в центре зала
  d.fill(5, 1, 4, 3, 3, 3, B.gold);
  d.fill(6, 2, 6, 1, 1, 1, B.black);
  d.put(6, 1, 6, B.chest);
  d.fill(5, 4, 4, 3, 1, 3, B.gold);
  d.put(6, 5, 5, B.torch);
  // факелы у входа
  d.put(1, 2, 1, B.torch); d.put(11, 2, 1, B.torch);
  return d;
}

// 🏛 Мэрия: абсолютно всё из золотых блоков. Буквально.
function townhall() {
  const d = draft(13, 12, 11);
  d.fill(0, 0, 0, 13, 1, 11, B.gold);
  // колонны и стены
  d.ring(1, B.gold);
  for (let y = 2; y <= 7; y++) {
    for (const x of [0, 3, 6, 9, 12]) { d.put(x, y, 0, B.gold); d.put(x, y, 10, B.gold); }
    for (const z of [0, 3, 7, 10]) { d.put(0, y, z, B.gold); d.put(12, y, z, B.gold); }
  }
  d.fill(0, 8, 0, 13, 1, 11, B.gold);
  // ступенчатая крыша
  for (let i = 0; i < 3; i++) d.fill(1 + i, 9 + i, 1 + i, 11 - i * 2, 1, 9 - i * 2, B.gold);
  // лестница и «флагшток»
  d.fill(5, 0, 11 - 1, 3, 1, 1, B.gold);
  d.fill(6, 9, 4, 1, 3, 1, B.gold);
  return d;
}

// 🩷 Памятник из розовой шерсти.
function pinkMonument() {
  const d = draft(7, 10, 7);
  d.fill(1, 0, 1, 5, 1, 5, B.pink);
  d.fill(2, 1, 2, 3, 6, 3, B.pink);
  d.fill(2, 7, 2, 3, 1, 3, B.pink);
  d.fill(2, 8, 2, 3, 1, 3, B.pink);
  d.fill(2, 9, 2, 2, 1, 2, B.pink);
  return d;
}

// 🚽 Золотой унитаз (унитаз — единственная честная роскошь).
function goldToilet() {
  const d = draft(7, 8, 7);
  d.fill(0, 0, 0, 7, 1, 7, B.gold);
  // бачок
  d.fill(2, 4, 5, 3, 3, 2, B.gold);
  d.fill(3, 7, 5, 1, 1, 1, B.gold);
  // чаша
  d.fill(2, 2, 2, 3, 2, 3, B.gold);
  d.fill(3, 3, 3, 1, 1, 1, B.water);
  // сиденье из кварца
  d.fill(1, 4, 1, 5, 1, 5, B.quartz);
  d.fill(2, 4, 2, 3, 1, 3, B.gold);
  return d;
}

// 👑 Трон из золотых блоков с бархатной подушкой.
function goldThrone() {
  const d = draft(7, 9, 7);
  d.fill(0, 0, 0, 7, 1, 7, B.gold);
  d.fill(2, 1, 2, 3, 2, 3, B.gold);
  // подушка
  d.fill(2, 3, 2, 3, 1, 2, B.red);
  // спинка
  d.fill(2, 3, 4, 3, 5, 2, B.gold);
  d.fill(3, 8, 4, 1, 1, 1, B.gold);
  // подлокотники
  d.fill(1, 3, 1, 1, 2, 4, B.gold);
  d.fill(5, 3, 1, 1, 2, 4, B.gold);
  return d;
}

// 🕳 Грязная лужа: награда за 10 зданий без дороги.
function puddle() {
  const d = draft(9, 2, 9);
  d.fill(0, 0, 0, 9, 1, 9, B.dirt);
  d.fill(1, 0, 1, 7, 1, 7, B.water);
  d.put(4, 1, 4, B.sign, 0);
  d.put(2, 0, 2, B.slab); d.put(6, 0, 6, B.slab);
  return d;
}

// 🔥 Шашлык на костре: сгорел — почини — получи.
function barbecue() {
  const d = draft(7, 6, 7);
  d.fill(0, 0, 0, 7, 1, 7, B.stone);
  for (const x of [1, 5]) for (const z of [1, 5]) d.fill(x, 1, z, 1, 2, 1, B.rust);
  d.fill(1, 3, 1, 5, 1, 5, B.iron);
  d.fill(2, 4, 2, 3, 1, 3, B.red);
  d.put(3, 5, 3, B.torch);
  d.fill(6, 0, 2, 1, 3, 3, B.wood);
  return d;
}

// 🐷 Свинья-копилка: розовая шерсть и золотая монетка сверху.
function piggy() {
  const d = draft(9, 8, 11);
  d.fill(2, 1, 1, 5, 3, 7, B.pink);      // туловище
  d.fill(2, 2, 8, 5, 3, 2, B.pink);      // голова
  d.fill(2, 5, 8, 1, 2, 1, B.pink);      // уши
  d.fill(6, 5, 8, 1, 2, 1, B.pink);
  for (const x of [2, 6]) for (const z of [2, 6]) d.fill(x, 0, z, 1, 1, 1, B.pink);
  d.fill(3, 3, 10, 3, 1, 1, B.dark);     // пятачок
  d.put(3, 4, 10, B.black); d.put(5, 4, 10, B.black); // глаза
  d.fill(4, 4, 3, 1, 1, 1, B.gold);      // монетка / прорезь
  d.fill(4, 5, 3, 1, 1, 1, B.gold);
  d.put(3, 3, 0, B.pink); d.put(4, 2, 0, B.pink); // хвостик
  return d;
}

// 🏭 Дымящая труба: за загрязнение 50+.
function smokestack() {
  const d = draft(7, 14, 7);
  d.fill(0, 0, 0, 7, 1, 7, B.dark);
  d.fill(2, 1, 2, 3, 9, 3, B.dark);
  d.fill(1, 10, 1, 5, 1, 5, B.gold);
  d.fill(2, 11, 2, 3, 1, 3, B.rust);
  d.put(3, 12, 3, B.black); d.put(4, 12, 3, B.black);
  d.put(3, 13, 3, B.black); d.put(4, 13, 4, B.black);
  d.put(3, 11, 3, B.torch);
  return d;
}

// 🏦 Банк «Три кредита»: за три одновременно открытых займа.
// Сейф, решётки и три золотые монеты на крыше — наша гордость, наш долг.
function loanBank() {
  const d = draft(11, 9, 9);
  d.fill(0, 0, 0, 11, 1, 9, B.dark);
  for (let y = 1; y <= 6; y++) d.ring(y, y === 6 ? B.gold : B.dark);
  // колонны и витрина
  for (const x of [0, 5, 10]) for (let y = 1; y <= 5; y++) { d.put(x, y, 0, B.gold); d.put(x, y, 8, B.gold); }
  for (const x of [2, 4, 6, 8]) { d.put(x, 3, 0, B.glass); d.put(x, 4, 0, B.glass); }
  // вход и решётки по бокам
  d.fill(4, 1, 0, 3, 3, 1, B.bars);
  d.put(5, 1, 0, B.glass); d.put(5, 2, 0, B.glass);
  // сейф в зале
  d.fill(4, 1, 4, 3, 2, 3, B.iron);
  d.put(5, 2, 6, B.chest);
  // крыша и ТРИ монеты
  d.fill(0, 7, 0, 11, 1, 9, B.gold);
  d.fill(0, 8, 0, 11, 1, 9, B.dark);
  for (const x of [3, 5, 7]) d.put(x, 8, 4, B.gold);
  return d;
}

const def = (id, achievement, icon, name, desc, build) => {
  const plan = build();
  return {
    id, achievement, icon, name, desc,
    file: `collectible:${id}`,
    W: plan.W, H: plan.H, L: plan.L,
    blocks: plan.blocks.length,
    _build: build,
  };
};

export const COLLECTIBLES = [
  def("casino", "tutorial", "🎰",
    { ru: "Казино", en: "Casino" },
    { ru: "Ничего не даёт. Но можно проиграть казну за 5 секунд.", en: "Gives nothing. But you can lose the treasury in 5 seconds." }, casino),
  def("townhall", "all_types", "🏛",
    { ru: "Золотая мэрия", en: "Golden Town Hall" },
    { ru: "Полностью из золотых блоков. Бюджет не трогает.", en: "Made entirely of gold blocks. Doesn't touch the budget." }, townhall),
  def("pink_memorial", "negative", "🩷",
    { ru: "Хуй из розовой шерсти", en: "Pink Wool Monument" },
    { ru: "Памятник финансовой дыре. Розовый. Пушистый.", en: "A monument to the financial hole. Pink. Fluffy." }, pinkMonument),
  def("gold_toilet", "bankrupt", "🚽",
    { ru: "Золотой унитаз", en: "Golden Toilet" },
    { ru: "Банкротство — это когда даже унитаз дороже казны.", en: "Bankruptcy is when even the toilet costs more than the treasury." }, goldToilet),
  def("gold_throne", "tax_tyrant", "👑",
    { ru: "Золотой трон", en: "Golden Throne" },
    { ru: "Для тех, кто налоги выкрутил на максимум.", en: "For those who cranked all taxes to the max." }, goldThrone),
  def("puddle", "roadless", "🕳",
    { ru: "Грязная лужа", en: "Muddy Puddle" },
    { ru: "Лучший друг бездорожья.", en: "Best friend of a roadless city." }, puddle),
  def("barbecue", "fireman", "🔥",
    { ru: "Шашлык на костре", en: "Campfire BBQ" },
    { ru: "Тот самый шашлык, который горел по незнанию.", en: "The very BBQ that burned by accident." }, barbecue),
  def("piggy", "collector", "🐷",
    { ru: "Свинья-копилка", en: "Piggy Bank" },
    { ru: "Хранит 50 различных схем и ни одного доллара.", en: "Stores 50 unique builds and not a single dollar." }, piggy),
  def("smokestack", "smog", "🏭",
    { ru: "Дымящая труба", en: "Smokestack" },
    { ru: "Дышит загрязнением 50+.", en: "Breathes 50+ pollution." }, smokestack),
  def("loan_bank", "debtor", "🏦",
    { ru: "Банк «Три кредита»", en: "Three Loans Bank" },
    { ru: "Свой банк с тремя займами. Сейф, решётки и три монеты на крыше.", en: "Your own bank with three loans. A vault, bars and three coins on the roof." }, loanBank),
];

export const COLLECTIBLE_BY_ID = new Map(COLLECTIBLES.map((c) => [c.id, c]));
export const COLLECTIBLE_BY_FILE = new Map(COLLECTIBLES.map((c) => [c.file, c]));
export const CASINO_FILE = COLLECTIBLE_BY_ID.get("casino").file;
export const COLLECTIBLE_URL_PREFIX = "collectible:";

// План в формате parseSchematicFile — его сразу можно скармливать pasteSchematic.
export function makeCollectiblePlan(id) {
  const c = COLLECTIBLE_BY_ID.get(id);
  if (!c) throw new Error(`unknown collectible: ${id}`);
  const p = c._build();
  return {
    format: "collectible",
    W: p.W, H: p.H, L: p.L,
    blocks: p.blocks,
    minY: 0,
    maxY: p.H - 1,
    simplifiedBlocks: [], unsupportedBlocks: [], ignoredBlocks: [],
    simplifiedCount: 0, unsupportedCount: 0, ignoredCount: 0,
  };
}
