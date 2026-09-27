// Сохранение/загрузка: город отдельно от блоков (по плану, этап 24).
// Чистые функции: мир здесь — любой объект { chunks, states, touched }.
import { TYPES } from "./buildingTypes.js";
import { newCityState } from "./city.js";

export const SAVE_VERSION = 1;

const isNum = (v) => typeof v === "number" && Number.isFinite(v);
const KEY_RE = /^-?\d+,-?\d+,-?\d+$/;

// Только тронутые чанки (постройки и ручные правки); автопол перегенерируется.
export function serializeWorld(w) {
  const chunks = {};
  for (const key of w.touched) {
    const c = w.chunks.get(key);
    if (!c) continue;
    const st = w.states.get(key);
    const cells = [];
    for (let i = 0; i < c.length; i++) {
      const id = c[i];
      if (id === 0) continue;
      const s = st ? st[i] : 0;
      if (s) cells.push([i, id, s]);
      else cells.push([i, id]);
    }
    if (cells.length > 0) chunks[key] = cells;
  }
  return chunks;
}

export function serializeCity(city) {
  return {
    money: city.money,
    population: city.population,
    food: city.food,
    energy: city.energy,
    happiness: city.happiness,
    pollution: city.pollution,
    day: city.day,
    nextId: city.nextId,
    last: city.last,
    buildings: city.buildings.map((b) => ({
      id: b.id,
      typeId: TYPES[b.typeId] ? b.typeId : "generic",
      name: String(b.name || ""),
      x0: b.x0, y0: b.y0, z0: b.z0,
      W: b.W, H: b.H, L: b.L,
      health: Math.min(100, Math.max(0, b.health)),
      placedBlocks: b.placedBlocks,
      active: b.active !== false,
    })),
  };
}

export function deserializeCity(data) {
  if (!data || typeof data !== "object") throw new Error("сейв: нет данных города");
  const st = newCityState();
  for (const k of ["money", "population", "food", "energy", "happiness", "pollution", "day", "nextId"]) {
    if (!isNum(data[k])) throw new Error("сейв: битое поле " + k);
  }
  Object.assign(st, {
    money: data.money, population: Math.max(0, Math.floor(data.population)),
    food: Math.max(0, data.food), energy: Math.max(0, data.energy),
    happiness: Math.min(100, Math.max(0, data.happiness)),
    pollution: Math.min(100, Math.max(0, data.pollution)),
    day: Math.max(0, Math.floor(data.day)),
    nextId: Math.max(1, Math.floor(data.nextId)),
    last: data.last && typeof data.last === "object" ? data.last : null,
  });
  if (!Array.isArray(data.buildings)) throw new Error("сейв: нет списка построек");
  st._buildings = data.buildings.map((b, i) => {
    for (const k of ["x0", "y0", "z0", "W", "H", "L", "health", "placedBlocks"]) {
      if (!isNum(b[k])) throw new Error(`сейв: постройка ${i}: битое поле ${k}`);
    }
    return {
      id: typeof b.id === "string" ? b.id : "b_" + String(i + 1).padStart(3, "0"),
      typeId: TYPES[b.typeId] ? b.typeId : "generic",
      name: String(b.name || "Постройка").slice(0, 80),
      x0: Math.floor(b.x0), y0: Math.floor(b.y0), z0: Math.floor(b.z0),
      W: Math.max(1, Math.floor(b.W)), H: Math.max(1, Math.floor(b.H)), L: Math.max(1, Math.floor(b.L)),
      health: Math.min(100, Math.max(0, b.health)),
      placedBlocks: Math.max(1, Math.floor(b.placedBlocks || 1)),
      active: b.active !== false,
    };
  });
  return st;
}

// Проверка сырого сейва целиком; возвращает { player, city, chunks }.
export function parseSave(raw) {
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    throw new Error("сейв: не JSON");
  }
  if (!data || data.v !== SAVE_VERSION) throw new Error("сейв: версия не поддерживается");
  if (!data.player || !isNum(data.player.x) || !isNum(data.player.y) || !isNum(data.player.z)) {
    throw new Error("сейв: нет позиции игрока");
  }
  if (!data.chunks || typeof data.chunks !== "object") throw new Error("сейв: нет блоков");
  const chunks = [];
  for (const [key, cells] of Object.entries(data.chunks)) {
    if (!KEY_RE.test(key)) throw new Error("сейв: битый ключ чанка");
    if (!Array.isArray(cells)) throw new Error("сейв: битый чанк " + key);
    for (const cell of cells) {
      if (!Array.isArray(cell) || (cell.length !== 2 && cell.length !== 3)) {
        throw new Error("сейв: битая клетка в " + key);
      }
      const [idx, id, s] = cell;
      if (!Number.isInteger(idx) || idx < 0 || idx >= 4096) throw new Error("сейв: битый индекс");
      if (!Number.isInteger(id) || id < 0 || id > 255) throw new Error("сейв: битый id блока");
      if (s !== undefined && (!Number.isInteger(s) || s < 0 || s > 255)) throw new Error("сейв: битое состояние");
    }
    chunks.push({ key, cells });
  }
  return { player: data.player, city: deserializeCity(data.city), chunks, savedAt: data.savedAt || 0 };
}
