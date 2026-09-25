import * as BABYLON from "@babylonjs/core";

export const AIR = 0;
export const WALL_CONCRETE = 1;
export const FLOOR_CONCRETE = 2;
export const RUST_METAL = 3;
export const DARK_METAL = 4;
export const BARS = 5;
export const DIRT = 6;
export const STONE = 7;
export const WOOD = 8;
export const BLACK_WOOL = 9;
export const BLUE_WOOL = 10;
export const RED_WOOL = 11;
export const YELLOW_WOOL = 12;
export const BOOKSHELF = 13;
export const CAULDRON = 14;
export const CHEST = 15;
export const ENDER_CHEST = 16;
export const COBWEB = 17;
export const CYAN_TERRACOTTA = 18;
export const GRASS_BLOCK = 19;
export const HOPPER = 20;
export const GLASS = 21;
export const GLASS_PANE = 22;
export const IRON_BLOCK = 23;
export const IRON_DOOR = 24;
export const NETHER_BRICK_FENCE = 25;
export const NETHER_BRICK = 26;
export const NETHER_BRICK_SLAB = 27;
export const OAK_BUTTON = 28;
export const OAK_FENCE = 29;
export const OAK_PRESSURE_PLATE = 30;
export const OAK_SIGN = 31;
export const OAK_STAIRS = 32;
export const OAK_TRAPDOOR = 33;
export const PISTON = 34;
export const QUARTZ_BLOCK = 35;
export const RED_BED = 36;
export const RED_TERRACOTTA = 37;
export const SANDSTONE = 38;
export const SMOOTH_STONE_SLAB = 39;
export const STONE_BRICKS = 40;
export const STONE_PRESSURE_PLATE = 41;
export const TORCH = 42;
export const REDSTONE_TORCH = 43;
export const TRIPWIRE_HOOK = 44;
export const WATER = 45;

const T = {
  concrete: { up: 0, side: 0, down: 0 },
  wall: { up: 1, side: 1, down: 1 },
  floor: { up: 2, side: 1, down: 1 },
  rust: { up: 3, side: 3, down: 3 },
  dark: { up: 4, side: 4, down: 4 },
  bars: { up: 5, side: 5, down: 5 },
  dirt: { up: 6, side: 6, down: 6 },
  stone: { up: 7, side: 7, down: 7 },
  wood: { up: 8, side: 8, down: 8 },
  blackWool: { up: 9, side: 9, down: 9 },
  blueWool: { up: 10, side: 10, down: 10 },
  redWool: { up: 11, side: 11, down: 11 },
  yellowWool: { up: 12, side: 12, down: 12 },
  bookshelf: { up: 13, side: 13, down: 13 },
  cauldron: { up: 14, side: 14, down: 14 },
  chest: { up: 15, side: 15, down: 15 },
  enderChest: { up: 16, side: 16, down: 16 },
  cobweb: { up: 17, side: 17, down: 17 },
  cyanTerracotta: { up: 18, side: 18, down: 18 },
  grass: { up: 19, side: 19, down: 6 },
  hopper: { up: 20, side: 20, down: 20 },
  glass: { up: 21, side: 21, down: 21 },
  glassPane: { up: 22, side: 22, down: 22 },
  ironBlock: { up: 23, side: 23, down: 23 },
  ironDoor: { up: 24, side: 24, down: 24 },
  netherFence: { up: 25, side: 25, down: 25 },
  netherBrick: { up: 26, side: 26, down: 26 },
  netherBrickSlab: { up: 27, side: 27, down: 27 },
  button: { up: 28, side: 28, down: 28 },
  oakFence: { up: 29, side: 29, down: 29 },
  oakPressurePlate: { up: 30, side: 30, down: 30 },
  sign: { up: 31, side: 31, down: 31 },
  oakStairs: { up: 32, side: 32, down: 32 },
  trapdoor: { up: 33, side: 33, down: 33 },
  piston: { up: 34, side: 34, down: 34 },
  quartz: { up: 35, side: 35, down: 35 },
  bed: { up: 36, side: 36, down: 36 },
  redTerracotta: { up: 37, side: 37, down: 37 },
  sandstone: { up: 38, side: 38, down: 38 },
  smoothSlab: { up: 39, side: 39, down: 39 },
  stoneBricks: { up: 40, side: 40, down: 40 },
  stonePressurePlate: { up: 41, side: 41, down: 41 },
  torch: { up: 42, side: 42, down: 42 },
  redstoneTorch: { up: 43, side: 43, down: 43 },
  tripwireHook: { up: 44, side: 44, down: 44 },
  water: { up: 45, side: 45, down: 45 },
};

const block = (name, options = {}) => {
  const result = {
    name,
    solid: true,
    bars: false,
    transparent: false,
    shape: "cube",
    tiles: T.concrete,
    hardness: 1,
    toolPower: 1,
    color: "#ffffff",
    ...options,
  };
  if (result.blocksSight == null) {
    result.blocksSight = result.solid && !result.transparent && !result.bars;
  }
  return result;
};

export const BLOCKS = [
  block("Воздух", { solid: false, hardness: 0 }),
  block("Бетон", { tiles: T.wall, hardness: 6, toolPower: 1.6, color: "#9aa0a6" }),
  block("Половая плитка", { tiles: T.floor, hardness: 5, toolPower: 1.6, color: "#bcb8ae" }),
  block("Ржавый металл", { tiles: T.rust, hardness: 7, toolPower: 2.1, color: "#6e3c21" }),
  block("Тёмный металл", { tiles: T.dark, hardness: 8, toolPower: 2.3, color: "#2e333c" }),
  block("Решётка", { bars: true, tiles: T.bars, hardness: 8, toolPower: 2.0, color: "#252a33" }),
  block("Земля", { tiles: T.dirt, hardness: 1, toolPower: 1.0, color: "#6b5034" }),
  block("Булыжник", { tiles: T.stone, hardness: 6, toolPower: 2.0, color: "#767a7f" }),
  block("Доски", { tiles: T.wood, hardness: 3, toolPower: 1.2, color: "#7a5833" }),
  block("Чёрная шерсть", { tiles: T.blackWool, hardness: 0.6, color: "#171719" }),
  block("Синяя шерсть", { tiles: T.blueWool, hardness: 0.6, color: "#315b9b" }),
  block("Красная шерсть", { tiles: T.redWool, hardness: 0.6, color: "#a32f32" }),
  block("Жёлтая шерсть", { tiles: T.yellowWool, hardness: 0.6, color: "#d5a928" }),
  block("Книжная полка", { tiles: T.bookshelf, hardness: 2, toolPower: 1.1, color: "#755033" }),
  block("Котёл", { tiles: T.cauldron, hardness: 4, toolPower: 1.8, color: "#3b3d42" }),
  block("Сундук", { tiles: T.chest, hardness: 2.5, toolPower: 1.2, color: "#8a5a2b" }),
  block("Эндер-сундук", { tiles: T.enderChest, hardness: 4, toolPower: 1.5, color: "#263d3a" }),
  block("Паутина", { solid: false, bars: true, tiles: T.cobweb, hardness: 0.5, color: "#d8dde0" }),
  block("Бирюзовая терракота", { tiles: T.cyanTerracotta, hardness: 1.4, toolPower: 1.1, color: "#575b5b" }),
  block("Травяной блок", { tiles: T.grass, hardness: 0.8, color: "#668744" }),
  block("Воронка", { tiles: T.hopper, hardness: 4, toolPower: 1.8, color: "#3b4048" }),
  block("Стекло", { transparent: true, tiles: T.glass, hardness: 0.5, color: "#b9e7ef" }),
  block("Стеклянная панель", { bars: true, transparent: true, tiles: T.glassPane, hardness: 0.5, color: "#b9e7ef" }),
  block("Железный блок", { tiles: T.ironBlock, hardness: 7, toolPower: 2.3, color: "#d5d8da" }),
  block("Железная дверь", { tiles: T.ironDoor, hardness: 7, toolPower: 2.1, color: "#aeb5ba" }),
  block("Кирпичный забор", { bars: true, transparent: true, tiles: T.netherFence, hardness: 4, toolPower: 1.5, color: "#382027" }),
  block("Адский кирпич", { tiles: T.netherBrick, hardness: 5, toolPower: 1.7, color: "#382027" }),
  block("Плита из адского кирпича", { tiles: T.netherBrickSlab, hardness: 5, toolPower: 1.7, color: "#382027" }),
  block("Дубовая кнопка", { solid: false, transparent: true, tiles: T.button, hardness: 0.3, color: "#9a713f" }),
  block("Дубовый забор", { bars: true, transparent: true, tiles: T.oakFence, hardness: 2, toolPower: 1.1, color: "#7a5833" }),
  block("Нажимная плита", { solid: false, transparent: true, tiles: T.oakPressurePlate, hardness: 0.4, color: "#9a713f" }),
  block("Табличка", { solid: false, transparent: true, shape: "sign", tiles: T.sign, hardness: 0.5, color: "#9a713f" }),
  block("Дубовые ступени", { tiles: T.oakStairs, hardness: 3, toolPower: 1.2, color: "#7a5833" }),
  block("Дубовой люк", { solid: false, transparent: true, tiles: T.trapdoor, hardness: 1, toolPower: 1.1, color: "#7a5833" }),
  block("Поршень", { tiles: T.piston, hardness: 4, toolPower: 1.7, color: "#777f88" }),
  block("Кварцевый блок", { tiles: T.quartz, hardness: 3, toolPower: 1.3, color: "#e8e4dc" }),
  block("Красная кровать", { solid: false, transparent: true, tiles: T.bed, hardness: 0.5, color: "#8f2025" }),
  block("Красная терракота", { tiles: T.redTerracotta, hardness: 1.4, toolPower: 1.1, color: "#963b32" }),
  block("Песчаник", { tiles: T.sandstone, hardness: 2.5, toolPower: 1.2, color: "#d8c78e" }),
  block("Гладкая каменная плита", { tiles: T.smoothSlab, hardness: 3, toolPower: 1.3, color: "#a0a3a3" }),
  block("Каменные кирпичи", { tiles: T.stoneBricks, hardness: 5, toolPower: 1.7, color: "#7b7e7c" }),
  block("Каменная нажимная плита", { solid: false, transparent: true, tiles: T.stonePressurePlate, hardness: 0.5, color: "#8d9090" }),
  block("Факел", { solid: false, transparent: true, shape: "torch", tiles: T.torch, hardness: 0.1, color: "#f5c65a", light: 8 }),
  block("Красный камень", { solid: false, transparent: true, shape: "torch", tiles: T.redstoneTorch, hardness: 0.1, color: "#d43c35", light: 5 }),
  block("Крюк натянутой проволоки", { solid: false, transparent: true, tiles: T.tripwireHook, hardness: 0.4, color: "#a7a9aa" }),
  block("Вода", { solid: false, transparent: true, tiles: T.water, hardness: 0, color: "#3f83c5" }),
];

const TILE = 64;
export const ATLAS_COLS = 4;
export const ATLAS_ROWS = Math.ceil(BLOCKS.length / ATLAS_COLS);
// Keep the physical texture dimensions in lockstep with the UV grid.  A
// 1024px square with 4x12 UVs would sample only the top-left quarter of
// every tile and makes the atlas effectively unreadable.
export const ATLAS_WIDTH = ATLAS_COLS * TILE;
export const ATLAS_HEIGHT = ATLAS_ROWS * TILE;

function noiseFill(ctx, ox, oy, base, amt, density = 1) {
  for (let i = 0; i < TILE * TILE * density; i++) {
    const x = ox + (Math.random() * TILE) | 0;
    const y = oy + (Math.random() * TILE) | 0;
    const v = amt * (Math.random() - 0.5);
    ctx.fillStyle = `rgb(${base[0] + v | 0},${base[1] + v | 0},${base[2] + v | 0})`;
    ctx.fillRect(x, y, 1, 1);
  }
}

function paintConcrete(ctx, ox, oy) {
  ctx.fillStyle = "#9a9a9a";
  ctx.fillRect(ox, oy, TILE, TILE);
  noiseFill(ctx, ox, oy, [154, 154, 154], 28);
  noiseFill(ctx, ox, oy, [120, 120, 120], 22, 0.2);
}

function paintWall(ctx, ox, oy) {
  ctx.fillStyle = "#8f8f93";
  ctx.fillRect(ox, oy, TILE, TILE);
  noiseFill(ctx, ox, oy, [143, 143, 147], 34);
  ctx.fillStyle = "rgba(0,0,0,0.16)";
  ctx.fillRect(ox + 8, oy, 2, TILE);
  ctx.fillRect(ox, oy + 20, TILE, 3);
  ctx.fillRect(ox + 40, oy + 46, TILE * 0.4, 3);
}

function paintFloor(ctx, ox, oy) {
  ctx.fillStyle = "#b9b5ab";
  ctx.fillRect(ox, oy, TILE, TILE);
  noiseFill(ctx, ox, oy, [185, 181, 170], 20);
  ctx.strokeStyle = "rgba(60,60,60,0.55)";
  ctx.lineWidth = 2;
  ctx.strokeRect(ox + 0.5, oy + 0.5, TILE - 1, TILE - 1);
  ctx.beginPath();
  ctx.moveTo(ox + TILE / 2, oy);
  ctx.lineTo(ox + TILE / 2, oy + TILE);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(ox, oy + TILE / 2);
  ctx.lineTo(ox + TILE, oy + TILE / 2);
  ctx.stroke();
}

function paintRust(ctx, ox, oy) {
  ctx.fillStyle = "#6e3c21";
  ctx.fillRect(ox, oy, TILE, TILE);
  noiseFill(ctx, ox, oy, [110, 60, 33], 45, 1.5);
  noiseFill(ctx, ox, oy, [70, 36, 19], 30, 0.5);
  ctx.fillStyle = "#8a4a28";
  for (let i = 0; i < 6; i++) {
    ctx.fillRect(ox + 8 + i * 10, oy + 8 + i * 3, 6, 6);
  }
}

function paintDark(ctx, ox, oy) {
  ctx.fillStyle = "#2e333c";
  ctx.fillRect(ox, oy, TILE, TILE);
  for (let i = 0; i < 44; i++) {
    const y = oy + (i * TILE) / 44 | 0;
    const light = Math.random() * 16 - 8;
    ctx.fillStyle = `rgb(${46 + light | 0},${51 + light | 0},${60 + light | 0})`;
    ctx.fillRect(ox, y, TILE, 1.5);
  }
  noiseFill(ctx, ox, oy, [40, 44, 52], 18, 0.6);
}

function paintBars(ctx, ox, oy) {
  ctx.clearRect(ox, oy, TILE, TILE);
  ctx.strokeStyle = "rgba(24,28,34,0.95)";
  ctx.lineWidth = 3;
  ctx.strokeRect(ox + 1.5, oy + 1.5, TILE - 3, TILE - 3);
  ctx.fillStyle = "rgba(28,32,40,0.95)";
  for (let i = 0; i < 6; i++) {
    const x = ox + 4 + i * 10;
    ctx.fillRect(x, oy + 6, 7, TILE - 12);
  }
  ctx.fillRect(ox + 4, oy + 2, TILE - 8, 6);
  ctx.fillRect(ox + 4, oy + TILE - 8, TILE - 8, 6);
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  for (let i = 0; i < 6; i++) {
    ctx.fillRect(ox + 4 + i * 10, oy + 6, 1.5, TILE - 12);
  }
}

function paintDirt(ctx, ox, oy) {
  ctx.fillStyle = "#6b5034";
  ctx.fillRect(ox, oy, TILE, TILE);
  noiseFill(ctx, ox, oy, [107, 82, 52], 34, 1.5);
  ctx.fillStyle = "rgba(40,28,16,0.8)";
  for (let i = 0; i < 14; i++) {
    ctx.fillRect(ox + (Math.random() * TILE) | 0, oy + (Math.random() * TILE) | 0, 3, 3);
  }
}

function paintStone(ctx, ox, oy) {
  ctx.fillStyle = "#767a7f";
  ctx.fillRect(ox, oy, TILE, TILE);
  noiseFill(ctx, ox, oy, [118, 122, 127], 30);
  ctx.strokeStyle = "rgba(30,33,38,0.7)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    const x = ox + (Math.random() * (TILE - 20)) | 0;
    const y = oy + (Math.random() * (TILE - 20)) | 0;
    ctx.strokeRect(x + 0.5, y + 0.5, 12 + Math.random() * 8, 10 + Math.random() * 8);
  }
}

function paintWood(ctx, ox, oy) {
  ctx.fillStyle = "#7a5833";
  ctx.fillRect(ox, oy, TILE, TILE);
  noiseFill(ctx, ox, oy, [122, 90, 52], 28, 1.2);
  ctx.fillStyle = "rgba(30,20,10,0.7)";
  for (let i = 1; i < 5; i++) {
    ctx.fillRect(ox + i * 12 - 1, oy, 2, TILE);
  }
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(ox, oy + i * 16 + 8, TILE, 2);
  }
}

function hexRgb(hex) {
  const value = Number.parseInt(hex.slice(1), 16);
  return [value >> 16, (value >> 8) & 255, value & 255];
}

function paintWool(ctx, ox, oy, hex) {
  const rgb = hexRgb(hex);
  ctx.fillStyle = hex;
  ctx.fillRect(ox, oy, TILE, TILE);
  noiseFill(ctx, ox, oy, rgb, 24, 1.2);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  for (let i = 0; i < 32; i++) {
    ctx.fillRect(ox + Math.random() * TILE, oy + Math.random() * TILE, 2, 1);
  }
}

function paintBookshelf(ctx, ox, oy) {
  ctx.fillStyle = "#654326";
  ctx.fillRect(ox, oy, TILE, TILE);
  for (let row = 0; row < 4; row++) {
    const shelfY = oy + row * 16;
    ctx.fillStyle = row % 2 ? "#704a29" : "#5b391f";
    ctx.fillRect(ox, shelfY, TILE, 14);
    const colors = ["#9d3d35", "#365f8b", "#b28a3c", "#47714a", "#6d477e"];
    for (let x = 2; x < TILE - 2;) {
      const width = 3 + Math.floor(Math.random() * 4);
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillRect(ox + x, shelfY + 2, width, 11);
      x += width + 1;
    }
    ctx.fillStyle = "#3e2515";
    ctx.fillRect(ox, shelfY + 14, TILE, 2);
  }
}

function paintCauldron(ctx, ox, oy) {
  ctx.fillStyle = "#3d4046";
  ctx.fillRect(ox, oy, TILE, TILE);
  noiseFill(ctx, ox, oy, [61, 64, 70], 24);
  ctx.strokeStyle = "#9da3a8";
  ctx.lineWidth = 4;
  ctx.strokeRect(ox + 5.5, oy + 5.5, TILE - 11, TILE - 11);
  ctx.fillStyle = "#12171c";
  ctx.beginPath();
  ctx.ellipse(ox + TILE / 2, oy + TILE / 2, 22, 17, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#70767c";
  ctx.lineWidth = 3;
  ctx.stroke();
}

function paintChest(ctx, ox, oy, ender = false) {
  const base = ender ? "#263b38" : "#845326";
  ctx.fillStyle = base;
  ctx.fillRect(ox, oy, TILE, TILE);
  noiseFill(ctx, ox, oy, ender ? [38, 59, 56] : [132, 83, 38], 22);
  ctx.strokeStyle = ender ? "#14211f" : "#3b2413";
  ctx.lineWidth = 5;
  ctx.strokeRect(ox + 3, oy + 3, TILE - 6, TILE - 6);
  ctx.fillStyle = ender ? "#14211f" : "#4d301a";
  ctx.fillRect(ox, oy + 27, TILE, 6);
  ctx.fillStyle = ender ? "#58c7a2" : "#d7ad4b";
  ctx.fillRect(ox + 27, oy + 23, 10, 14);
  ctx.fillStyle = ender ? "#b184ff" : "#72501f";
  ctx.fillRect(ox + 30, oy + 28, 4, 5);
}

function paintCobweb(ctx, ox, oy) {
  ctx.clearRect(ox, oy, TILE, TILE);
  ctx.strokeStyle = "rgba(235,240,242,0.9)";
  ctx.lineWidth = 1.5;
  for (let i = 0; i <= 4; i++) {
    const p = i * 16;
    ctx.beginPath();
    ctx.moveTo(ox + p, oy);
    ctx.lineTo(ox + p, oy + TILE);
    ctx.moveTo(ox, oy + p);
    ctx.lineTo(ox + TILE, oy + p);
    ctx.stroke();
  }
  ctx.lineWidth = 1;
  for (let i = -TILE; i < TILE * 2; i += 16) {
    ctx.beginPath();
    ctx.moveTo(ox + i, oy);
    ctx.lineTo(ox + i + TILE, oy + TILE);
    ctx.moveTo(ox + i, oy + TILE);
    ctx.lineTo(ox + i + TILE, oy);
    ctx.stroke();
  }
}

function paintTerracotta(ctx, ox, oy, hex) {
  const rgb = hexRgb(hex);
  ctx.fillStyle = hex;
  ctx.fillRect(ox, oy, TILE, TILE);
  noiseFill(ctx, ox, oy, rgb, 22, 1.1);
  ctx.strokeStyle = "rgba(35,25,22,0.45)";
  ctx.lineWidth = 2;
  ctx.strokeRect(ox + 1, oy + 1, TILE - 2, TILE - 2);
}

function paintGrass(ctx, ox, oy) {
  paintDirt(ctx, ox, oy);
  ctx.fillStyle = "#5f843f";
  ctx.fillRect(ox, oy, TILE, 16);
  noiseFill(ctx, ox, oy, [92, 128, 60], 30, 1.2);
  ctx.fillStyle = "#75964e";
  for (let i = 0; i < 12; i++) {
    ctx.fillRect(ox + Math.random() * TILE, oy + 12 + Math.random() * 8, 2, 4);
  }
}

function paintHopper(ctx, ox, oy) {
  ctx.fillStyle = "#3d434b";
  ctx.fillRect(ox, oy, TILE, TILE);
  ctx.fillStyle = "#22272d";
  ctx.beginPath();
  ctx.moveTo(ox + 8, oy + 8);
  ctx.lineTo(ox + 56, oy + 8);
  ctx.lineTo(ox + 42, oy + 30);
  ctx.lineTo(ox + 22, oy + 30);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#555d66";
  ctx.fillRect(ox + 8, oy + 8, 48, 8);
  ctx.fillStyle = "#171b20";
  ctx.fillRect(ox + 15, oy + 38, 34, 18);
  ctx.strokeStyle = "#727b84";
  ctx.lineWidth = 3;
  ctx.strokeRect(ox + 14.5, oy + 37.5, 36, 19);
}

function paintGlass(ctx, ox, oy, pane = false) {
  ctx.clearRect(ox, oy, TILE, TILE);
  ctx.fillStyle = pane ? "rgba(186,229,238,0.68)" : "rgba(172,220,232,0.58)";
  ctx.fillRect(ox, oy, TILE, TILE);
  ctx.strokeStyle = "rgba(232,252,255,0.9)";
  ctx.lineWidth = pane ? 5 : 2;
  if (pane) {
    ctx.strokeRect(ox + 3, oy, TILE - 6, TILE);
    ctx.fillStyle = "rgba(235,252,255,0.85)";
    ctx.fillRect(ox + 28, oy, 8, TILE);
  } else {
    ctx.strokeRect(ox + 1, oy + 1, TILE - 2, TILE - 2);
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillRect(ox + 8, oy + 5, 4, 24);
  }
}

function paintIronBlock(ctx, ox, oy) {
  ctx.fillStyle = "#d5d8da";
  ctx.fillRect(ox, oy, TILE, TILE);
  noiseFill(ctx, ox, oy, [213, 216, 218], 16);
  ctx.strokeStyle = "#a8adb0";
  ctx.lineWidth = 2;
  ctx.strokeRect(ox + 1, oy + 1, TILE - 2, TILE - 2);
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  for (let i = 0; i < 6; i++) ctx.fillRect(ox + 4, oy + 6 + i * 10, TILE - 8, 1);
}

function paintIronDoor(ctx, ox, oy) {
  paintIronBlock(ctx, ox, oy);
  ctx.strokeStyle = "#5d666c";
  ctx.lineWidth = 3;
  ctx.strokeRect(ox + 7.5, oy + 4.5, TILE - 15, TILE - 9);
  ctx.fillStyle = "rgba(45,53,59,0.35)";
  ctx.fillRect(ox + 15, oy + 10, 34, 18);
  ctx.fillStyle = "#e1b650";
  ctx.fillRect(ox + 43, oy + 30, 5, 5);
}

function paintFence(ctx, ox, oy, nether = false) {
  ctx.clearRect(ox, oy, TILE, TILE);
  const dark = nether ? "#2b171b" : "#4c321d";
  const light = nether ? "#583036" : "#8a6135";
  ctx.fillStyle = dark;
  ctx.fillRect(ox + 7, oy + 3, 9, TILE - 6);
  ctx.fillRect(ox + 48, oy + 3, 9, TILE - 6);
  ctx.fillRect(ox, oy + 13, TILE, 9);
  ctx.fillRect(ox, oy + 43, TILE, 9);
  ctx.fillStyle = light;
  ctx.fillRect(ox + 9, oy + 5, 2, TILE - 10);
  ctx.fillRect(ox + 50, oy + 5, 2, TILE - 10);
}

function paintNetherBrick(ctx, ox, oy, slab = false) {
  ctx.fillStyle = "#30191d";
  ctx.fillRect(ox, oy, TILE, TILE);
  ctx.fillStyle = slab ? "#4a282e" : "#432229";
  for (let row = 0; row < 4; row++) {
    const offset = row % 2 ? -16 : 0;
    for (let x = offset; x < TILE; x += 32) {
      ctx.fillRect(ox + x + 2, oy + row * 16 + 2, 28, 12);
    }
  }
  noiseFill(ctx, ox, oy, [70, 34, 40], 20, 0.7);
}

function paintButton(ctx, ox, oy) {
  ctx.clearRect(ox, oy, TILE, TILE);
  ctx.fillStyle = "#9a713f";
  ctx.beginPath();
  ctx.arc(ox + 32, oy + 32, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#4c321d";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "#d3aa6b";
  ctx.fillRect(ox + 27, oy + 25, 10, 10);
}

function paintPressurePlate(ctx, ox, oy, stone = false) {
  ctx.clearRect(ox, oy, TILE, TILE);
  ctx.fillStyle = stone ? "#8d9090" : "#9a713f";
  ctx.fillRect(ox + 5, oy + 24, 54, 16);
  ctx.fillStyle = stone ? "#b7b9b9" : "#c0955b";
  ctx.fillRect(ox + 9, oy + 27, 46, 5);
  ctx.strokeStyle = stone ? "#5f6363" : "#51371f";
  ctx.lineWidth = 2;
  ctx.strokeRect(ox + 5.5, oy + 24.5, 53, 15);
}

function paintSign(ctx, ox, oy) {
  ctx.clearRect(ox, oy, TILE, TILE);
  ctx.fillStyle = "#8a6135";
  ctx.fillRect(ox + 8, oy + 10, 48, 42);
  ctx.fillStyle = "#5b3c22";
  ctx.fillRect(ox + 12, oy + 14, 40, 34);
  ctx.fillStyle = "#d4b275";
  ctx.fillRect(ox + 15, oy + 20, 34, 2);
  ctx.fillRect(ox + 15, oy + 28, 28, 2);
  ctx.fillRect(ox + 15, oy + 36, 32, 2);
}

function paintStairs(ctx, ox, oy) {
  paintWood(ctx, ox, oy);
  ctx.fillStyle = "rgba(25,16,8,0.75)";
  ctx.fillRect(ox, oy + 31, TILE, 3);
  ctx.fillRect(ox, oy + 15, TILE, 3);
  ctx.fillStyle = "rgba(255,220,160,0.16)";
  ctx.fillRect(ox + 1, oy + 16, TILE - 2, 14);
  ctx.fillRect(ox + 1, oy + 32, TILE - 2, 14);
}

function paintTrapdoor(ctx, ox, oy) {
  ctx.clearRect(ox, oy, TILE, TILE);
  ctx.fillStyle = "#79552f";
  ctx.fillRect(ox + 5, oy + 8, 54, 48);
  ctx.fillStyle = "#3e2818";
  for (let i = 0; i < 4; i++) ctx.fillRect(ox + 8, oy + 12 + i * 12, 48, 3);
  ctx.strokeStyle = "#ad7e47";
  ctx.lineWidth = 3;
  ctx.strokeRect(ox + 6.5, oy + 9.5, 51, 45);
}

function paintPiston(ctx, ox, oy) {
  ctx.fillStyle = "#6f7780";
  ctx.fillRect(ox, oy, TILE, TILE);
  noiseFill(ctx, ox, oy, [111, 119, 128], 20);
  ctx.fillStyle = "#343a40";
  ctx.fillRect(ox, oy + 25, TILE, 39);
  ctx.fillStyle = "#a7adb2";
  ctx.fillRect(ox + 5, oy + 5, 54, 18);
  ctx.fillStyle = "#d0d3d5";
  ctx.fillRect(ox + 10, oy + 8, 44, 8);
}

function paintQuartz(ctx, ox, oy) {
  ctx.fillStyle = "#e8e4dc";
  ctx.fillRect(ox, oy, TILE, TILE);
  noiseFill(ctx, ox, oy, [232, 228, 220], 14, 0.8);
  ctx.strokeStyle = "rgba(125,121,114,0.38)";
  ctx.lineWidth = 1;
  ctx.strokeRect(ox + 0.5, oy + 0.5, TILE - 1, TILE - 1);
}

function paintBed(ctx, ox, oy) {
  ctx.clearRect(ox, oy, TILE, TILE);
  ctx.fillStyle = "#8f2025";
  ctx.fillRect(ox + 4, oy + 20, 56, 28);
  ctx.fillStyle = "#d9d7d2";
  ctx.fillRect(ox + 8, oy + 8, 48, 18);
  ctx.fillStyle = "#b92e34";
  ctx.fillRect(ox + 8, oy + 22, 48, 26);
  ctx.fillStyle = "#6f171b";
  ctx.fillRect(ox + 4, oy + 46, 56, 6);
}

function paintSandstone(ctx, ox, oy) {
  ctx.fillStyle = "#d8c78e";
  ctx.fillRect(ox, oy, TILE, TILE);
  noiseFill(ctx, ox, oy, [216, 199, 142], 20, 0.8);
  ctx.fillStyle = "rgba(119,101,61,0.35)";
  ctx.fillRect(ox, oy + 15, TILE, 3);
  ctx.fillRect(ox, oy + 47, TILE, 3);
  ctx.strokeStyle = "rgba(119,101,61,0.5)";
  ctx.lineWidth = 2;
  ctx.strokeRect(ox + 1, oy + 1, TILE - 2, TILE - 2);
}

function paintSmoothSlab(ctx, ox, oy) {
  ctx.fillStyle = "#a0a3a3";
  ctx.fillRect(ox, oy, TILE, TILE);
  noiseFill(ctx, ox, oy, [160, 163, 163], 12, 0.5);
  ctx.strokeStyle = "rgba(75,78,78,0.45)";
  ctx.lineWidth = 2;
  ctx.strokeRect(ox + 1, oy + 1, TILE - 2, TILE - 2);
}

function paintStoneBricks(ctx, ox, oy) {
  ctx.fillStyle = "#626664";
  ctx.fillRect(ox, oy, TILE, TILE);
  const colors = ["#7b7e7c", "#717573", "#858784"];
  for (let row = 0; row < 4; row++) {
    for (let col = -1; col < 3; col++) {
      const x = col * 32 + (row % 2 ? 16 : 0);
      ctx.fillStyle = colors[(row + col + 3) % colors.length];
      ctx.fillRect(ox + x + 2, oy + row * 16 + 2, 28, 12);
    }
  }
  noiseFill(ctx, ox, oy, [125, 128, 126], 22, 0.5);
}

function paintTorch(ctx, ox, oy, redstone = false) {
  ctx.clearRect(ox, oy, TILE, TILE);
  ctx.fillStyle = "#79552f";
  ctx.fillRect(ox + 28, oy + 27, 8, 28);
  ctx.fillStyle = redstone ? "#8f2424" : "#f5c65a";
  ctx.beginPath();
  ctx.ellipse(ox + 32, oy + 21, 9, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = redstone ? "#ef4b42" : "#fff1a8";
  ctx.beginPath();
  ctx.ellipse(ox + 32, oy + 20, 4, 7, 0, 0, Math.PI * 2);
  ctx.fill();
}

function paintTripwireHook(ctx, ox, oy) {
  ctx.clearRect(ox, oy, TILE, TILE);
  ctx.strokeStyle = "#a7a9aa";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(ox + 18, oy + 18);
  ctx.lineTo(ox + 42, oy + 30);
  ctx.lineTo(ox + 46, oy + 47);
  ctx.stroke();
  ctx.fillStyle = "#d5d7d8";
  ctx.fillRect(ox + 15, oy + 15, 8, 8);
}

function paintWater(ctx, ox, oy) {
  ctx.clearRect(ox, oy, TILE, TILE);
  ctx.fillStyle = "rgba(52,126,194,0.72)";
  ctx.fillRect(ox, oy, TILE, TILE);
  ctx.strokeStyle = "rgba(186,226,247,0.55)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(ox, oy + 8 + i * 16);
    ctx.bezierCurveTo(ox + 14, oy + 3 + i * 16, ox + 45, oy + 13 + i * 16, ox + TILE, oy + 8 + i * 16);
    ctx.stroke();
  }
}

export function createAtlas(scene) {
  const dt = new BABYLON.DynamicTexture(
    "blocksAtlas",
    { width: ATLAS_WIDTH, height: ATLAS_HEIGHT },
    scene,
    false,
    BABYLON.Texture.NEAREST_SAMPLINGMODE,
    undefined,
    false
  );
  const ctx = dt.getContext();
  ctx.clearRect(0, 0, ATLAS_WIDTH, ATLAS_HEIGHT);
  paintConcrete(ctx, 0, 0);
  paintWall(ctx, 64, 0);
  paintFloor(ctx, 128, 0);
  paintRust(ctx, 192, 0);
  paintDark(ctx, 0, 64);
  paintBars(ctx, 64, 64);
  paintDirt(ctx, 128, 64);
  paintStone(ctx, 192, 64);
  paintWood(ctx, 0, 128);
  paintWool(ctx, 64, 128, "#171719");
  paintWool(ctx, 128, 128, "#315b9b");
  paintWool(ctx, 192, 128, "#a32f32");
  paintWool(ctx, 0, 192, "#d5a928");
  paintBookshelf(ctx, 64, 192);
  paintCauldron(ctx, 128, 192);
  paintChest(ctx, 192, 192);
  paintChest(ctx, 0, 256, true);
  paintCobweb(ctx, 64, 256);
  paintTerracotta(ctx, 128, 256, "#575b5b");
  paintGrass(ctx, 192, 256);
  paintHopper(ctx, 0, 320);
  paintGlass(ctx, 64, 320);
  paintGlass(ctx, 128, 320, true);
  paintIronBlock(ctx, 192, 320);
  paintIronDoor(ctx, 0, 384);
  paintFence(ctx, 64, 384, true);
  paintNetherBrick(ctx, 128, 384);
  paintNetherBrick(ctx, 192, 384, true);
  paintButton(ctx, 0, 448);
  paintFence(ctx, 64, 448);
  paintPressurePlate(ctx, 128, 448);
  paintSign(ctx, 192, 448);
  paintStairs(ctx, 0, 512);
  paintTrapdoor(ctx, 64, 512);
  paintPiston(ctx, 128, 512);
  paintQuartz(ctx, 192, 512);
  paintBed(ctx, 0, 576);
  paintTerracotta(ctx, 64, 576, "#963b32");
  paintSandstone(ctx, 128, 576);
  paintSmoothSlab(ctx, 192, 576);
  paintStoneBricks(ctx, 0, 640);
  paintPressurePlate(ctx, 64, 640, true);
  paintTorch(ctx, 128, 640);
  paintTorch(ctx, 192, 640, true);
  paintTripwireHook(ctx, 0, 704);
  paintWater(ctx, 64, 704);
  dt.update(false);
  dt.hasAlpha = true;
  dt.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
  dt.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
  return dt;
}