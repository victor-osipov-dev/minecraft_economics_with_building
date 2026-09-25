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
};

export const BLOCKS = [
  { name: "Воздух", solid: false, bars: false, tiles: T.concrete, hardness: 0, toolPower: 1, color: "#ffffff" },
  { name: "Бетон", solid: true, bars: false, tiles: T.wall, hardness: 6, toolPower: 1.6, color: "#9aa0a6" },
  { name: "Половая плитка", solid: true, bars: false, tiles: T.floor, hardness: 5, toolPower: 1.6, color: "#bcb8ae" },
  { name: "Ржавый металл", solid: true, bars: false, tiles: T.rust, hardness: 7, toolPower: 2.1, color: "#6e3c21" },
  { name: "Тёмный металл", solid: true, bars: false, tiles: T.dark, hardness: 8, toolPower: 2.3, color: "#2e333c" },
  { name: "Решётка", solid: true, bars: true, tiles: T.bars, hardness: 8, toolPower: 2.0, color: "#252a33" },
  { name: "Земля", solid: true, bars: false, tiles: T.dirt, hardness: 1, toolPower: 1.0, color: "#6b5034" },
  { name: "Булыжник", solid: true, bars: false, tiles: T.stone, hardness: 6, toolPower: 2.0, color: "#767a7f" },
  { name: "Доски", solid: true, bars: false, tiles: T.wood, hardness: 3, toolPower: 1.2, color: "#7a5833" },
];

const TILE = 64;
const COLS = 4;
const ROWS = 3;

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

export function createAtlas(scene) {
  const dt = new BABYLON.DynamicTexture(
    "blocksAtlas",
    { width: 256, height: 256 },
    scene,
    false,
    BABYLON.Texture.NEAREST_SAMPLINGMODE,
    undefined,
    false
  );
  const ctx = dt.getContext();
  ctx.clearRect(0, 0, 256, 256);
  paintConcrete(ctx, 0, 0);
  paintWall(ctx, 64, 0);
  paintFloor(ctx, 128, 0);
  paintRust(ctx, 192, 0);
  paintDark(ctx, 0, 64);
  paintBars(ctx, 64, 64);
  paintDirt(ctx, 128, 64);
  paintStone(ctx, 192, 64);
  paintWood(ctx, 0, 128);
  dt.update(false);
  dt.hasAlpha = true;
  dt.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
  dt.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
  return dt;
}