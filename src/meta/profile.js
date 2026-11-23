// Мета-профиль: достижения и коллекционные постройки живут ВНЕ города.
// Не зависит от Babylon и от симуляции — как city.js, тестируется в Node.
// Новая игра НЕ сбрасывает профиль: коллекция и ачивки Permanent.
const META_KEY = "babylon-meta-v1";
const VERSION = 1;

const defaults = () => ({
  v: VERSION,
  achievements: {}, // id -> timestamp
  collectibles: {}, // id -> timestamp
  stats: {
    typesBuilt: [],   // typeId зданий, которые игрок строил
    schemes: [],      // уникальные file схем, которые игрок ставил
    firesRepaired: 0, // починено зданий после пожара
    taxTyrantDays: 0, // дней с тремя налогами на максимуме
  },
});

export const profile = defaults();

export function loadProfile() {
  try {
    const raw = JSON.parse(localStorage.getItem(META_KEY) || "null");
    if (raw && raw.v === VERSION) {
      for (const k of ["achievements", "collectibles"]) {
        if (raw[k] && typeof raw[k] === "object") profile[k] = { ...raw[k] };
      }
      if (raw.stats && typeof raw.stats === "object") {
        for (const k of Object.keys(profile.stats)) {
          const v = raw.stats[k];
          if (Array.isArray(profile.stats[k])) {
            if (Array.isArray(v)) profile.stats[k] = v.filter((x) => typeof x === "string");
          } else if (Number.isFinite(v)) {
            profile.stats[k] = Math.max(0, Math.floor(v));
          }
        }
      }
    }
  } catch (e) { /* приватный режим — просто играем без персистентности */ }
  return profile;
}

export function saveProfile() {
  try {
    localStorage.setItem(META_KEY, JSON.stringify(profile));
  } catch (e) {}
}

export function hasAchievement(id) { return !!profile.achievements[id]; }
export function hasCollectible(id) { return !!profile.collectibles[id]; }

function touch(list, value) {
  if (typeof value !== "string" || !value || list.includes(value)) return false;
  list.push(value);
  return true;
}
export function markType(typeId) { return touch(profile.stats.typesBuilt, typeId); }
export function markScheme(file) { return touch(profile.stats.schemes, file); }
export function noteFireRepaired() { profile.stats.firesRepaired++; }
export function noteTaxDay(allMax) {
  profile.stats.taxTyrantDays = allMax ? profile.stats.taxTyrantDays + 1 : 0;
}

export function grantCollectible(id, now = Date.now()) {
  if (!id || profile.collectibles[id]) return false;
  profile.collectibles[id] = now;
  return true;
}

// Копия для облачного сейва (не ссылка на живой профиль).
export function cloudMeta() {
  return {
    v: VERSION,
    achievements: { ...profile.achievements },
    collectibles: { ...profile.collectibles },
    stats: {
      typesBuilt: [...profile.stats.typesBuilt],
      schemes: [...profile.stats.schemes],
      firesRepaired: profile.stats.firesRepaired,
      taxTyrantDays: profile.stats.taxTyrantDays,
    },
  };
}

// Слияние с облаком: объединение множеств и максимум счётчиков.
// Никогда не откатывает локальный прогресс при смене устройства.
export function mergeProfile(remote) {
  if (!remote || remote.v !== VERSION) return false;
  let changed = false;
  for (const k of ["achievements", "collectibles"]) {
    for (const [id, ts] of Object.entries(remote[k] || {})) {
      const t = Number(ts) || Date.now();
      if (!profile[k][id] || t > profile[k][id]) { profile[k][id] = t; changed = true; }
    }
  }
  const rs = remote.stats || {};
  for (const k of ["typesBuilt", "schemes"]) {
    if (Array.isArray(rs[k])) for (const v of rs[k]) if (touch(profile.stats[k], v)) changed = true;
  }
  for (const k of ["firesRepaired", "taxTyrantDays"]) {
    if (Number.isFinite(rs[k]) && rs[k] > profile.stats[k]) { profile.stats[k] = rs[k]; changed = true; }
  }
  if (changed) saveProfile();
  return changed;
}
