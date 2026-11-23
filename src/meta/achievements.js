// Достижения и выдача коллекционных построек. Чистая логика, без Babylon.
// Все названия/описания живут в i18n (achNames.*, achDesc.*), здесь — only id.
import { TYPES } from "../city/buildingTypes.js";
import { BANKRUPT_AT } from "../city/city.js";
import {
  profile, hasAchievement, grantCollectible, saveProfile,
} from "./profile.js";
import { COLLECTIBLE_BY_ID } from "./collectibles.js";

export const ACHIEVEMENTS = [
  { id: "tutorial", reward: "casino" },
  { id: "all_types", reward: "townhall" },
  { id: "negative", reward: "pink_memorial" },
  { id: "bankrupt", reward: "gold_toilet" },
  { id: "tax_tyrant", reward: "gold_throne" },
  { id: "roadless", reward: "puddle" },
  { id: "fireman", reward: "barbecue" },
  { id: "collector", reward: "piggy" },
  { id: "smog", reward: "smokestack" },
  { id: "debtor", reward: "loan_bank" },
];
export const ACH_BY_ID = new Map(ACHIEVEMENTS.map((a) => [a.id, a]));

// «Все типы» = все специализированные типы зданий (без generic и коллекционных).
export const REQUIRED_TYPES = Object.keys(TYPES).filter((t) => t !== "generic" && t !== "collectible");

// Выдать достижение. Возвращает def, если оно только что открыто, иначе null.
export function unlockAchievement(id, now = Date.now()) {
  const def = ACH_BY_ID.get(id);
  if (!def || hasAchievement(id)) return null;
  profile.achievements[id] = now;
  grantCollectible(def.reward, now);
  saveProfile();
  return def;
}

// Проверка всех CONDITION-ачивок по текущему состоянию города.
// Вызывается после тика, после постройки и после ремонта/налогов.
export function checkAchievements(city) {
  const found = [];
  const tryUnlock = (id) => {
    const a = unlockAchievement(id);
    if (a) found.push(a);
  };
  const s = profile.stats;
  if (REQUIRED_TYPES.every((tid) => s.typesBuilt.includes(tid))) tryUnlock("all_types");
  if (city.money < 0) tryUnlock("negative");
  if (city.bankrupt || city.money < BANKRUPT_AT) tryUnlock("bankrupt");
  if (s.taxTyrantDays >= 3) tryUnlock("tax_tyrant");
  if ((city.last && city.last.roadless) >= 10) tryUnlock("roadless");
  if (s.firesRepaired >= 1) tryUnlock("fireman");
  if (s.schemes.length >= 50) tryUnlock("collector");
  if (city.pollution >= 50) tryUnlock("smog");
  if (Array.isArray(city.loans) && city.loans.length >= 3) tryUnlock("debtor");
  return found;
}

// Имя награды в текущем языке (для тоста и панели).
export function rewardName(def) {
  const c = def && COLLECTIBLE_BY_ID.get(def.reward);
  return c ? c.name : { ru: "?", en: "?" };
}
