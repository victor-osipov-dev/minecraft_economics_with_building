import * as BABYLON from "@babylonjs/core";
import { CustomMaterial } from "@babylonjs/materials/custom/customMaterial";
import {
  AIR,
  BLOCKS,
  DIRT,
  TORCH,
  REDSTONE_TORCH,
  OAK_SIGN,
  ATLAS_COLS,
  ATLAS_ROWS,
  ATLAS_WIDTH,
  createAtlas,
  TORCH_FLOOR,
  TORCH_PX,
  TORCH_NX,
  TORCH_PZ,
  TORCH_NZ,
  SIGN_STANDING,
  SIGN_PX,
  SIGN_NX,
  SIGN_PZ,
  SIGN_NZ,
  SLAB_BOTTOM,
  SLAB_TOP,
  SLAB_DOUBLE,
  RED_BED,
  TRIPWIRE_HOOK,
  STAIR_PX,
  STAIR_NX,
  STAIR_PZ,
  STAIR_NZ,
  STAIR_TOP_BIT,
  BUTTON_FLOOR,
  BUTTON_CEIL,
  TRAP_BOTTOM,
  TRAP_TOP,
} from "./blocks.js";
import { World, WORLD_H, CHUNK } from "./world.js";
import { HALF, HEIGHT, moveAxis, updateGrounded, clampPlayerToWorld } from "./physics.js";
import { parseSchematicFile, pasteSchematic, rotatePlan } from "./schematic.js";
import { TYPES, TIERS, resolveType, resolveTier, instStats } from "./city/buildingTypes.js";
import {
  newCityState, buildCostFor, addBuilding, charge,
  damageAt, repair, repairPrice, demolish, tick,
  MILESTONES, BANKRUPT_AT, TAX_PER_CAPITA, FOOD_PER_CAPITA, TAX_TOLERANCE,
} from "./city/city.js";
import {
  createResident, assignTarget, stepResidents, desiredAgents,
} from "./city/residents.js";
import {
  SAVE_VERSION, serializeWorld, serializeCity, parseSave, encodeChunks,
} from "./city/save.js";
import {
  MAX_LOANS, LOAN_MIN_DAYS, LOAN_MAX_DAYS, takeLoan, repayLoan,
  loanLimit, loanQuote, loanMinRate, loanPayoff,
} from "./city/city.js";
import { yg } from "./yg.js";
import { t, setLang, getLang, locale, typeName, tierName, mstoneName, blockName, blockNameSearch, tagName, tagNameSearch, schemeName, schemeNameRu, schemeNameSearch } from "./i18n.js";
import schemesIndex from "../schemes/index.json";

// Язык берём из SDK, когда он готов; до этого — по браузеру (см. yg.js).
setLang(yg.lang);
// Локализация статичного HTML: элементы с data-i18n* обновляются на язык.
function applyI18n() {
  document.title = t("pageTitle");
  for (const el of document.querySelectorAll("[data-i18n]")) {
    el.textContent = t(el.dataset.i18n);
  }
  for (const el of document.querySelectorAll("[data-i18n-title]")) {
    el.title = t(el.dataset.i18nTitle);
  }
  for (const el of document.querySelectorAll("[data-i18n-ph]")) {
    el.placeholder = t(el.dataset.i18nPh);
  }
  // Сброс кэшей динамических строк — перерисуются на новом языке сразу,
  // даже на паузе (кадровый цикл кэширует деньги/день/верхний хинт).
  lastMoneyBar = null;
  lastDayBar = -1;
  lastHint = null;
  setLabelsOn(labelsOn);
  setShowFrames(showFrames);
  renderTutorial();
  updateAuthUI();
  // Имена построек зависят от языка: перестраиваем метки рамок.
  for (const rec of buildings) {
    rec.labelBase = recordLabelBase(rec);
    refreshRecordLabel(rec);
  }
  // Имена блоков и названия типов зависят от языка — перерисовываем то, что видно.
  updateHotbar();
  renderPickChips();
  renderPicker();
  if (typeof syncLangButtons === "function") syncLangButtons();
  if (cityPanelEl.classList.contains("show")) renderCity();
  if (schemesPanelEl.classList.contains("show")) { buildSchemeList(); updateBuildBar(); }
  updateMoneyBar();
  updateHint(); // верхний контекстный хинт — сразу на новом языке
  updateGhostBar(); // полоса призрака и баннер черновиков (видны и на паузе)
  refreshSaveInfo(); // строка сейва в меню паузы
  renderMsgLog(); // стек событий слева снизу
  if (lastToast && msgEl.classList.contains("show")) msgEl.textContent = msgText(lastToast);
  coachHide(); // висящий пузырь на старом языке — прячем
}

// Яндекс: кнопка входа (с объяснением выгоды, п.1.2.1) и имя игрока.
function updateAuthUI() {
  const btn = document.getElementById("authBtn");
  const info = document.getElementById("authInfo");
  if (!btn || !info) return;
  if (yg.authorized) {
    btn.style.display = "none";
    info.textContent = t("ygHello", { name: yg.playerName || "…" });
  } else {
    btn.style.display = "";
    btn.textContent = t("ygLogin");
    info.textContent = t("ygLoginWhy");
  }
}

// ---------- engine / scene ----------
const canvas = document.getElementById("scene");
const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true });

const scene = new BABYLON.Scene(engine);
scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
// EXP2: туман уходит в fogColor на ~2.15/density блоках. Здесь граница зоны
// видимости — ~357 блоков, её держит FLAT_RADIUS в world.js (384 блока), иначе
// на краю сгенерированного пола были бы видны дыры до неба.
scene.fogDensity = 0.006;
scene.fogColor = new BABYLON.Color3(0.62, 0.65, 0.7);
scene.clearColor = new BABYLON.Color4(0.62, 0.65, 0.7, 1);

// ---------- lights ----------
const hemi = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0.15), scene);
hemi.intensity = 0.5;
hemi.groundColor = new BABYLON.Color3(0.28, 0.28, 0.32);

const sun = new BABYLON.DirectionalLight("sun", new BABYLON.Vector3(0.4, 0.7, 0.25), scene);
sun.position = new BABYLON.Vector3(160, 260, 100);
sun.intensity = 0.75;
sun.diffuse = new BABYLON.Color3(1, 0.96, 0.9);

// ---------- world ----------
// The reference is replaced only after a complete staged import has passed
// parsing, placement and spawn validation.  A failed import therefore
// leaves the currently playable world untouched.
let world = new World();
// Стартовая точка на плоской траве (тюрьмы по умолчанию больше нет).
let respawnPoint = { x: 0.5, y: 2, z: 0.5 };

// ---------- block materials ----------
const atlas = createAtlas(scene);
// Opaque-слой на CustomMaterial: merged-грани greedy-меша повторяют тайл
// fract()'ом внутри его границ вместо растяжки (см. tileInfo в world.js).
// Свет, туман и всё остальное — обычный StandardMaterial: инъекция стоит
// ровно в точке сэмплирования диффуза (CUSTOM_FRAGMENT_UPDATE_DIFFUSE).
const blockMat = new CustomMaterial("blockMat", scene);
blockMat.diffuseTexture = atlas;
blockMat.specularColor = new BABYLON.Color3(0.04, 0.04, 0.04);
blockMat.backFaceCulling = true;
blockMat.AddAttribute("tileInfo");
{
  // Константы атласа в GLSL-литералах (0.03 — INSET из world.js).
  const tileU = String(1 / ATLAS_COLS);
  const tileV = String(1 / ATLAS_ROWS);
  const insetU = String(0.03 / ATLAS_COLS);
  const insetV = String(0.03 / ATLAS_ROWS);
  blockMat.Vertex_Definitions("attribute vec4 tileInfo;\nvarying vec4 vTileInfo;");
  blockMat.Vertex_MainEnd("vTileInfo = tileInfo;");
  blockMat.Fragment_Definitions("varying vec4 vTileInfo;");
  blockMat.Fragment_Custom_Diffuse(`
#ifdef DIFFUSE
{
vec2 repOrigin = vTileInfo.xy;
vec2 repCount = vTileInfo.zw;
vec2 repSize = vec2(${tileU}, ${tileV});
vec2 repInset = vec2(${insetU}, ${insetV});
vec2 repInner = repSize - 2.0 * repInset;
vec2 local01 = (vDiffuseUV + uvOffset - (repOrigin + repInset)) / repInner;
vec2 wrappedUV = repOrigin + repInset + fract(local01 * repCount) * repInner;
baseColor = texture2D(diffuseSampler, wrappedUV);
baseColor.rgb *= vDiffuseInfos.y;
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
baseColor.rgb *= vColor.rgb;
#endif
}
#endif
`);
}

// Cut-out blocks (fences, panes, cobwebs and small decorations) use binary
// alpha testing.  Glass and water are kept in a distinct blended material so
// their partial alpha is not converted into a hard cutout.
const cutoutMat = new BABYLON.StandardMaterial("cutoutBlockMat", scene);
cutoutMat.diffuseTexture = atlas;
cutoutMat.useAlphaFromDiffuseTexture = true;
cutoutMat.transparencyMode = BABYLON.Material.MATERIAL_ALPHATEST;
cutoutMat.alphaCutOff = 0.5;
cutoutMat.specularColor = new BABYLON.Color3(0.04, 0.04, 0.04);
cutoutMat.backFaceCulling = false;

const alphaMat = new BABYLON.StandardMaterial("alphaBlockMat", scene);
alphaMat.diffuseTexture = atlas;
alphaMat.useAlphaFromDiffuseTexture = true;
alphaMat.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;
alphaMat.specularColor = new BABYLON.Color3(0.04, 0.04, 0.04);
alphaMat.backFaceCulling = false;
alphaMat.needDepthPrePass = false;
alphaMat.separateCullingPass = true;

// Torches share the atlas but need to glow: same alpha-tested cutout plus an
// emissive term from the same texture, so the flame is fullbright even in
// daylight while the stick only warms up slightly.
const torchMat = new BABYLON.StandardMaterial("torchMat", scene);
torchMat.diffuseTexture = atlas;
torchMat.useAlphaFromDiffuseTexture = true;
torchMat.transparencyMode = BABYLON.Material.MATERIAL_ALPHATEST;
torchMat.alphaCutOff = 0.5;
torchMat.specularColor = new BABYLON.Color3(0, 0, 0);
torchMat.emissiveTexture = atlas;
torchMat.emissiveColor = new BABYLON.Color3(1.0, 0.82, 0.55);
torchMat.backFaceCulling = false;

// ---------- message toast ----------
// C13: лог последних 5 сообщений (клик по записи повторяет тост).
// Храним ключ+переменные (значения могут быть {key,vars} для вложенного
// перевода) — стек и тост перерисовываются при смене языка.
const msgEl = document.getElementById("msg");
let msgTimer = null;
const msgLogEl = document.getElementById("msgLog");
const msgLog = [];
let lastToast = null;
function renderMsgVars(vars) {
  if (!vars) return vars;
  const out = {};
  for (const [k, v] of Object.entries(vars)) {
    out[k] = (v && typeof v === "object" && typeof v.key === "string")
      ? t(v.key, renderMsgVars(v.vars))
      : v;
  }
  return out;
}
const msgText = (it) => t(it.key, renderMsgVars(it.vars));
function showMsg(key, vars) {
  const item = { key, vars: vars || null };
  const text = msgText(item);
  lastToast = item;
  msgEl.textContent = text;
  msgEl.classList.add("show");
  if (msgTimer) clearTimeout(msgTimer);
  msgTimer = setTimeout(() => msgEl.classList.remove("show"), 3200);
  if (msgLog.length === 0 || msgText(msgLog[0]) !== text) {
    msgLog.unshift(item);
    if (msgLog.length > 5) msgLog.pop();
  }
  renderMsgLog();
}
function renderMsgLog() {
  msgLogEl.innerHTML = "";
  msgLog.forEach((it, i) => {
    const d = document.createElement("div");
    d.className = "logItem" + (i === 0 ? " fresh" : "");
    d.textContent = msgText(it);
    d.title = t("showAgain");
    d.addEventListener("click", () => showMsg(it.key, it.vars));
    msgLogEl.appendChild(d);
  });
}

// Своя модалка вместо системных alert/confirm: тёмный оверлей, карточка
// в стиле игры, крупные кнопки. Возвращает Promise<boolean>.
const modalEl = document.getElementById("modal");
const modalTextEl = document.getElementById("modalText");
const modalOkEl = document.getElementById("modalOk");
const modalCancelEl = document.getElementById("modalCancel");
let modalResolve = null;
const modalOpen = () => modalResolve !== null;
function modalDone(v) {
  if (!modalResolve) return;
  const r = modalResolve;
  modalResolve = null;
  modalEl.classList.remove("show");
  r(v);
}
function uiConfirm(text, opts = {}) {
  if (modalResolve) modalDone(false); // один диалог за раз
  modalTextEl.textContent = text;
  modalOkEl.textContent = opts.ok || t("modalOk");
  modalCancelEl.textContent = opts.cancel || t("modalCancel");
  if (document.pointerLockElement) {
    unlockForPanel = true;
    document.exitPointerLock();
  }
  modalEl.classList.add("show");
  return new Promise((resolve) => { modalResolve = resolve; });
}
modalEl.addEventListener("click", (e) => {
  if (e.target === modalEl) modalDone(false);
});
modalOkEl.addEventListener("click", () => modalDone(true));
modalCancelEl.addEventListener("click", () => modalDone(false));
window.addEventListener("keydown", (e) => {
  if (!modalOpen()) return;
  e.stopPropagation(); // горячие клавиши игры за модалкой не срабатывают
  if (e.code === "Escape") { e.preventDefault(); modalDone(false); }
  else if (e.code === "Enter" || e.code === "NumpadEnter") { e.preventDefault(); modalDone(true); }
}, true);

// ---------- настройки подсказок (пауза; действуют на каждый новый мир) ----------
const SETTINGS_KEY = "babylon-settings-v1";
const settings = { tutorial: true, tabHint: true, coach: true, lang: "auto" };
try {
  const s = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
  if (typeof s.tutorial === "boolean") settings.tutorial = s.tutorial;
  if (typeof s.tabHint === "boolean") settings.tabHint = s.tabHint;
  if (typeof s.coach === "boolean") settings.coach = s.coach;
  if (s.lang === "ru" || s.lang === "en" || s.lang === "auto") settings.lang = s.lang;
} catch (e) {}
function saveSettings() {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (e) {}
}
const setTutorialEl = document.getElementById("setTutorial");
const setTabHintEl = document.getElementById("setTabHint");
if (setTutorialEl) {
  setTutorialEl.checked = settings.tutorial;
  setTutorialEl.addEventListener("change", () => {
    settings.tutorial = setTutorialEl.checked;
    saveSettings();
    renderTutorial();
  });
}
if (setTabHintEl) {
  setTabHintEl.checked = settings.tabHint;
  setTabHintEl.addEventListener("change", () => {
    settings.tabHint = setTabHintEl.checked;
    saveSettings();
    updateTabHint();
  });
}
const setCoachEl = document.getElementById("setCoach");
if (setCoachEl) {
  setCoachEl.checked = settings.coach;
  setCoachEl.addEventListener("change", () => {
    settings.coach = setCoachEl.checked;
    saveSettings();
    if (!settings.coach) coachHide();
  });
}
// ---------- визуальные подсказки (coach marks) ----------
// Большой текст + пульсирующая обводка цели + прыгающая стрелка.
// Каждая подсказка показывается один раз за загрузку страницы
// (после перезагрузки — снова) и отключается чекбоксом в меню.
let coachSeen = new Set();
function coachMarkSeen(id) {
  coachSeen.add(id);
}
let coachTimer = null;
let coachArmedAt = 0;
function coachHide() {
  const layer = document.getElementById("coach");
  if (layer) layer.classList.remove("show", "aim");
  if (coachTimer) { clearTimeout(coachTimer); coachTimer = null; }
}
function coachShow({ text, target } = {}) {
  const layer = document.getElementById("coach");
  const bubble = document.getElementById("coachBubble");
  const ring = document.getElementById("coachRing");
  const arrow = document.getElementById("coachArrow");
  if (!layer || !bubble || !ring || !arrow) return false;
  bubble.textContent = text;
  const el = typeof target === "string" ? document.querySelector(target) : target;
  const r = el && el.getBoundingClientRect ? el.getBoundingClientRect() : null;
  const vw = window.innerWidth || 0, vh = window.innerHeight || 0;
  const vis = r && r.width > 4 && r.height > 4 && r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
  layer.classList.add("show");
  if (!vis) {
    // Цель не видна — большой текст по центру без стрелки и обводки.
    layer.classList.remove("aim");
    bubble.style.left = "50%";
    bubble.style.top = "38%";
    bubble.style.bottom = "auto";
    bubble.style.transform = "translate(-50%, -50%)";
  } else {
    layer.classList.add("aim");
    const pad = 8;
    ring.style.left = Math.max(4, r.left - pad) + "px";
    ring.style.top = Math.max(4, r.top - pad) + "px";
    ring.style.width = (r.width + pad * 2) + "px";
    ring.style.height = (r.height + pad * 2) + "px";
    const bw = Math.min(520, vw * 0.88);
    const cx = Math.min(Math.max(r.left + r.width / 2, bw / 2 + 12), vw - bw / 2 - 12);
    const below = r.top > vh * 0.42;
    bubble.style.transform = "translateX(-50%)";
    bubble.style.left = cx + "px";
    if (below) {
      // Пузырь над целью, стрелка вниз.
      bubble.style.top = "auto";
      bubble.style.bottom = Math.max(12, vh - r.top + pad + 44) + "px";
      arrow.textContent = "▼";
      arrow.className = "down";
      arrow.id = "coachArrow";
      arrow.style.left = cx + "px";
      arrow.style.top = (r.top - pad - 40) + "px";
    } else {
      // Пузырь под целью, стрелка вверх.
      bubble.style.bottom = "auto";
      bubble.style.top = (r.bottom + pad + 44) + "px";
      arrow.textContent = "▲";
      arrow.className = "up";
      arrow.id = "coachArrow";
      arrow.style.left = cx + "px";
      arrow.style.top = (r.bottom + pad + 8) + "px";
    }
  }
  coachArmedAt = Date.now();
  if (coachTimer) clearTimeout(coachTimer);
  coachTimer = setTimeout(coachHide, 9000);
  return true;
}
// Показать один раз: пропуск, если выключено в меню или уже видели.
// Если цель указана, но не видна — не показываем и не помечаем (попробуем позже).
function coachOnce(id, opts) {
  if (!settings.coach || coachSeen.has(id)) return false;
  if (opts && opts.target) {
    const el = typeof opts.target === "string" ? document.querySelector(opts.target) : opts.target;
    if (!el) return false; // цель ещё не в DOM — попробуем позже
    const r = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
    const vw = window.innerWidth || 0, vh = window.innerHeight || 0;
    const vis = r && r.width > 4 && r.height > 4 && r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
    if (!vis) return false;
  }
  if (!coachShow(opts)) return false;
  coachMarkSeen(id);
  return true;
}
window.addEventListener("pointerdown", () => {
  if (Date.now() - coachArmedAt > 500) coachHide();
}, true);
window.addEventListener("keydown", () => {
  if (Date.now() - coachArmedAt > 500) coachHide();
}, true);
// ---------- переключатель языка в паузе ----------
// "auto" — язык платформы/браузера (yg.lang), ru/en — принудительно. Выбор
// помнится в settings и переживает перезапуск, поэтому ручной выбор не
// затирается автоопределением при yg.init.
const langBtns = Array.from(document.querySelectorAll(".langrow .langbtn"));
function resolvedLang() {
  return settings.lang === "auto" ? (yg.lang === "en" ? "en" : "ru") : settings.lang;
}
function syncLangButtons() {
  const cur = getLang();
  for (const b of langBtns) b.classList.toggle("on", b.dataset.lang === cur);
}
if (settings.lang !== "auto") setLang(settings.lang);
for (const b of langBtns) {
  b.addEventListener("click", () => {
    settings.lang = b.dataset.lang;
    saveSettings();
    setLang(resolvedLang());
    syncLangButtons();
    applyI18n();
  });
}

// ---------- C11: обучение-чеклист (первые шаги, +$200 за шаг) ----------
// Прогресс поместный: новый мир — обучение заново (если включено в настройках).
const TUT_REWARD = 200;
const TUT_STEPS = [
  { id: "house" }, { id: "road" }, { id: "food" }, { id: "city" }, { id: "pop" },
];
const tutText = (id, vars) => {
  const s = t("tutSteps")[id] || id;
  if (typeof s !== "string") return s;
  let out = s;
  for (const [k, v] of Object.entries(vars || {})) out = out.split(`{${k}}`).join(String(v));
  return out;
};
let tutorialComplete = false;
let tutorialState = {};
function tutorialReset() {
  tutorialComplete = false;
  tutorialState = {};
  for (const s of TUT_STEPS) tutorialState[s.id] = false;
  renderTutorial();
}
function tutorialGain(id, silent) {
  if (tutorialComplete || tutorialState[id]) return;
  tutorialState[id] = true;
  if (!silent) {
    city.money = Math.round((city.money + TUT_REWARD) * 100) / 100;
  }
  const n = TUT_STEPS.filter((s) => tutorialState[s.id]).length;
  if (n >= TUT_STEPS.length) tutorialComplete = true;
  renderTutorial();
  if (!silent) {
    if (n >= TUT_STEPS.length) showMsg("tutDone");
    else showMsg("tutStep", { n, total: TUT_STEPS.length, reward: TUT_REWARD });
  }
}
// Проверка шагов по состоянию города; silent — для загрузки (без наград).
function checkTutorial(silent) {
  if (tutorialComplete || !settings.tutorial) return;
  const has = (types) => city.buildings.some((b) => b.active !== false && types.includes(b.typeId));
  if (has(["house", "apartment"])) tutorialGain("house", silent);
  if (has(["road"])) tutorialGain("road", silent);
  if (has(["farm", "fishery", "shop"])) tutorialGain("food", silent);
  if (city.population > 0) tutorialGain("pop", silent);
  renderTutorial();
}
function renderTutorial() {
  const el = document.getElementById("tutorial");
  if (tutorialComplete || !settings.tutorial || !mapReady) {
    el.classList.remove("show");
    return;
  }
  const n = TUT_STEPS.filter((s) => tutorialState[s.id]).length;
  el.innerHTML = `<h4>${t("tutTitle")} ${n}/${TUT_STEPS.length}</h4>` + TUT_STEPS.map((s) =>
    `<div class="${tutorialState[s.id] ? "done" : ""}">${tutorialState[s.id] ? "✓" : "·"} ${tutText(s.id, { tag: "#" + tagName(s.id) })}` +
    (tutorialState[s.id] ? "" : ` <span class="reward">+$${TUT_REWARD}</span>`) + `</div>`
  ).join("");
  el.classList.add("show");
}

// ---------- C12: контекстный хинт под HUD (по состоянию игры) ----------
const hudSubEl = document.getElementById("hudSub");
let lastHint = null;
function updateHint() {
  let hint = "";
  if (mapReady && !paused && !anyPanelOpen() && !previewPlan) {
    if (city.buildings.length === 0) hint = t("hintEmpty");
    else if (city.last && city.last.roadless > 0) hint = t("hintRoadless", { n: city.last.roadless });
    else if (city.population === 0) hint = t("hintNoPop");
  }
  if (hint !== lastHint) {
    lastHint = hint;
    hudSubEl.textContent = hint;
    hudSubEl.classList.toggle("show", hint !== "");
  }
}

// ---------- баланс казны в левом верхнем углу ----------
// Перерисовываем только при смене значения — кадровый цикл дёшев.
const moneyBarEl = document.getElementById("moneyBar");
const dayBarEl = document.getElementById("dayBar");
const speedBtnEl = document.getElementById("speedBtn");
let lastMoneyBar = null;
let lastDayBar = -1;
function updateMoneyBar() {
  const txt = fmtMoney(city.money);
  if (txt !== lastMoneyBar) {
    lastMoneyBar = txt;
    moneyBarEl.textContent = txt;
    moneyBarEl.classList.toggle("neg", city.money < 0);
  }
  if (city.day !== lastDayBar) {
    lastDayBar = city.day;
    dayBarEl.textContent = `${t("stDay")} ${city.day}`;
  }
}
// Скорость времени: день длится 5с / скорость. Кнопка у денег: 1× → 2× → 3×.
const SPEEDS = [1, 2, 3];
let gameSpeed = 1;
let dayTimer = null;
function armDayTimer() {
  if (dayTimer) clearInterval(dayTimer);
  dayTimer = setInterval(() => { if (mapReady && !paused) tickCity(); }, Math.round(5000 / gameSpeed));
}
if (speedBtnEl) speedBtnEl.addEventListener("click", () => {
  gameSpeed = SPEEDS[(SPEEDS.indexOf(gameSpeed) + 1) % SPEEDS.length];
  speedBtnEl.textContent = `${gameSpeed}×`;
  armDayTimer();
});

// ---------- импорт построек Minecraft (схематики) ----------
const loadBtnEl = document.getElementById("loadBtn");
const schemInputEl = document.getElementById("schemFile");
const dropOverlayEl = document.getElementById("dropOverlay");
let mapReady = false;

function placeSchematic(plan, cx, cz, floorY = 1, replaceWorld = false) {
  // Manual imports replace the complete world.  Build that replacement in a
  // detached World first; no live chunk, mesh or player state is touched
  // until every potentially failing operation below succeeds.
  // NPC скрыты: маршруты и спавн охраны не строим (см. src/npcs.js — пригодится).
  const targetWorld = replaceWorld ? new World() : world;
  const result = pasteSchematic(targetWorld, plan, cx, cz, floorY, {
    clear: !replaceWorld,
  });
  const spawn = findSafePlayerSpawn(result, plan, targetWorld);
  if (!spawn) {
    if (replaceWorld) targetWorld.clear();
    throw new Error(t("noSpawn"));
  }

  // Flush the detached meshes before swapping the world reference.  This
  // keeps a Babylon allocation/geometry failure from publishing a half-loaded
  // map.  The old world is still intact while this happens.
  try {
    targetWorld.flushMeshes(scene, blockMat, cutoutMat, alphaMat, torchMat);
  } catch (error) {
    if (replaceWorld) targetWorld.clear();
    throw error;
  }

  if (replaceWorld) {
    const oldWorld = world;
    world = targetWorld;
    oldWorld.clear();
    // Вместе с миром сносим и рамки: они привязаны к старым координатам.
    clearBuildings();
    // Свет факелов запечён в вершины мешей при flushMeshes выше — отдельные
    // источники света не нужны.
    resetMapTransientState();
  }

  respawnPoint = spawn;
  player.x = respawnPoint.x;
  player.y = respawnPoint.y;
  player.z = respawnPoint.z;
  player.vy = 0;
  player.grounded = false;
  return { ...result, spawn };
}

function importSchematicBytes(bytes, fileName) {
  if (!mapReady) {
    showMsg("worldWait");
    return;
  }
  try {
    const plan = parseSchematicFile(bytes);
    if (!plan || plan.blocks.length === 0) {
      showMsg("noBlocks");
      return;
    }
    const cx = Math.round(player.x);
    const cz = Math.round(player.z);
    const res = placeSchematic(plan, cx, cz, 1, true);
    // Импорт из файла начинает новый город: старая экономика сброшена,
    // привезённая постройка регистрируется бесплатно.
    city = newCityState();
    const rec = recordBuilding({
      name: fileName,
      file: fileName,
      x0: cx - Math.floor(plan.W / 2),
      y0: 1 - (plan.minY ?? 0),
      z0: cz - Math.floor(plan.L / 2),
      W: plan.W, H: plan.H, L: plan.L,
      rot: 0,
      placed: res.placed,
    });
    registerRecord(rec, resolveType({ file: fileName, name: fileName }));
    showMsg("schemePlaced", { name: fileName, format: plan.format, n: res.placed, dims: `${plan.W}×${plan.H}×${plan.L}` });
  } catch (err) {
    console.error(t("dbgSchemeLoad"), err);
    showMsg("schemeLoadErr", { err: err.message });
  }
}

function readSchematicFile(file) {
  if (!file) return;
  file.arrayBuffer()
    .then((buf) => importSchematicBytes(new Uint8Array(buf), file.name))
    .catch((error) => {
    console.error(t("dbgSchemeReadFile"), error);
    showMsg("schemeReadErr", { err: error.message || { key: "schemeUnknownErr" } });
    });
}

if (loadBtnEl) loadBtnEl.addEventListener("click", () => schemInputEl.click());

schemInputEl.addEventListener("change", () => {
  readSchematicFile(schemInputEl.files?.[0]);
  schemInputEl.value = "";
});

window.addEventListener("dragenter", (e) => { e.preventDefault(); dropOverlayEl.classList.add("show"); });
window.addEventListener("dragover", (e) => { e.preventDefault(); });
window.addEventListener("dragleave", (e) => { e.preventDefault(); dropOverlayEl.classList.remove("show"); });
window.addEventListener("drop", (e) => {
  e.preventDefault();
  dropOverlayEl.classList.remove("show");
  const f = e.dataTransfer?.files?.[0];
  readSchematicFile(f);
});

// ---------- NPC скрыты ----------
// Охранники, шум, маршруты и патруль отключены целиком (тюремного геймплея
// больше нет), но src/npcs.js оставлен как есть — пригодится позже.
// Здесь остаётся только поиск опорной поверхности для спавна и сам спавн.
function resetMapTransientState() {
  lastHit = null;
  mouseDown = { 0: false, 2: false };
}

function guardSurfaceY(x, z, targetWorld = world) {
  if (!Number.isFinite(x) || !Number.isFinite(z)) return null;
  // A guard needs the same vertical room as the player.  The old upper bound
  // could return y=63, putting a 1.8-block body above WORLD_H.
  for (let y = WORLD_H - 3; y >= 0; y--) {
    if (!targetWorld.isSolid(x, y, z)) continue;
    const surface = y + 1;
    if (surface + 1.8 > WORLD_H + 1e-6) continue;
    if (targetWorld.isSolid(x, surface, z) || targetWorld.isSolid(x, surface + 1, z)) continue;
    return surface;
  }
  return null;
}

function respawnPlayer() {
  player.x = respawnPoint.x;
  player.y = respawnPoint.y;
  player.z = respawnPoint.z;
  player.vy = 0;
  player.grounded = false;
  clampPlayerToWorld(player, WORLD_H);
}

// ---------- camera ----------
const camera = new BABYLON.FreeCamera("playerCam", BABYLON.Vector3.Zero(), scene);
camera.minZ = 0.1;
camera.maxZ = 900;
camera.fov = 0.85;
camera.rotationOrder = "YZX";
camera.inputs.clear();

// ---------- player ----------
const GRAVITY = 26;
const JUMP_SPEED = 9.3;
const WALK_SPEED = 6.5;
const SPRINT_SPEED = 10.5;
const BOOST_SPEED = 22;
const EYE = 1.7;
const REACH = 6;

// Горизонтальных границ нет вообще: мир бесконечный (пол догенерируется,
// чанки создаются по требованию). Вертикаль ограничена высотой мира.
// worldBounds остался только как зона спавна/патрулей, но не клетка.
function isInsideWorldBounds(x, y, z) {
  return Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z) &&
    Number.isSafeInteger(Math.floor(x)) && Number.isSafeInteger(Math.floor(z)) &&
    y >= 0 && y < WORLD_H;
}

function playerSpawnClear(x, y, z, targetWorld = world) {
  if (![x, y, z].every(Number.isFinite) || y < 0 || y + HEIGHT > WORLD_H + 1e-6) {
    return false;
  }
  const x0 = Math.floor(x - HALF);
  const x1 = Math.floor(x + HALF - 1e-6);
  const y0 = Math.floor(y + 1e-6);
  const y1 = Math.floor(y + HEIGHT - 1e-6);
  const z0 = Math.floor(z - HALF);
  const z1 = Math.floor(z + HALF - 1e-6);
  for (let yy = y0; yy <= y1; yy++) {
    for (let zz = z0; zz <= z1; zz++) {
      for (let xx = x0; xx <= x1; xx++) {
        if (targetWorld.isSolid(xx, yy, zz)) return false;
      }
    }
  }
  return true;
}

function findSafePlayerSpawn(result, plan, targetWorld = world) {
  // A one-voxel-wide map cannot contain the player's 0.6-block-wide body.
  // Reject it instead of returning a position that the physics bounds would
  // immediately clamp into a wall or outside the imported map.
  if (plan.W < 1 || plan.L < 1 || plan.W < 2 * HALF || plan.L < 2 * HALF) return null;
  const centerX = Math.floor(result.x0 + plan.W / 2);
  const centerZ = Math.floor(result.z0 + plan.L / 2);
  let best = null;
  let bestDistance = Infinity;

  const consider = (x, z) => {
    const y = guardSurfaceY(x, z, targetWorld);
    if (y == null || !playerSpawnClear(x + 0.5, y, z + 0.5, targetWorld)) return;
    const distance = (x - centerX) ** 2 + (z - centerZ) ** 2;
    if (distance < bestDistance || (distance === bestDistance && y > best.y)) {
      best = { x: x + 0.5, y, z: z + 0.5 };
      bestDistance = distance;
    }
  };

  consider(centerX, centerZ);
  for (let z = result.z0; z < result.z0 + plan.L; z++) {
    for (let x = result.x0; x < result.x0 + plan.W; x++) consider(x, z);
  }
  return best;
}

const player = { x: respawnPoint.x, y: respawnPoint.y, z: respawnPoint.z, vy: 0, grounded: false };
let camYaw = 0;
let camPitch = -0.06;

const keys = { w: false, a: false, s: false, d: false, shift: false, jump: false, boost: false };

window.addEventListener("keydown", (e) => {
  // Не реагируем на клавиши при вводе текста в поля формы.
  if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
  switch (e.code) {
    case "KeyW": keys.w = true; break;
    case "KeyA": keys.a = true; break;
    case "KeyS": keys.s = true; break;
    case "KeyD": keys.d = true; break;
    case "Space": keys.jump = true; break;
    case "ShiftLeft":
    case "ShiftRight": keys.shift = true; break;
    // X, а не Ctrl: Ctrl+W — системная комбинация Chrome «закрыть вкладку»,
    // её нельзя перехватить на уровне страницы.
    case "KeyX": keys.boost = !keys.boost; break;
  }
});
window.addEventListener("keyup", (e) => {
  switch (e.code) {
    case "KeyW": keys.w = false; break;
    case "KeyA": keys.a = false; break;
    case "KeyS": keys.s = false; break;
    case "KeyD": keys.d = false; break;
    case "Space": keys.jump = false; break;
    case "ShiftLeft":
    case "ShiftRight": keys.shift = false; break;
  }
});

// ---------- песочница: бесконечные блоки, выживания больше нет ----------
let mouseDown = { 0: false, 2: false };

// Слоты объявлены здесь (а не в секции ниже), т.к. updateHotbar()
// вызывается при инициализации модуля и читает эти флаги.
let flying = true; // в песочнице полёт включён сразу
let creativeSlots = new Array(9).fill(null);
let creativeSel = 0;
const hotbarEl = document.getElementById("hotbar");
const selBlockEl = document.getElementById("selBlock"); // может отсутствовать (верхний хинт убран)

function updateHotbar() {
  const marks = [];
  for (let i = 0; i < 9; i++) {
    const id = creativeSlots[i];
    const active = i === creativeSel ? ' active' : '';
    if (id == null) {
      marks.push(`<div class="hslot${active}"></div>`);
      continue;
    }
    const b = BLOCKS[id];
    const css = blockIconStyle(b);
    const icon = css
      ? `<span class="tx" style="${css}"></span>`
      : `<span class="sw" style="background:${b.color}"></span>`;
    marks.push(
      `<div class="hslot${active}">${icon}` +
      `<span class="cnt">∞</span><span class="nm">${blockName(id)}</span></div>`
    );
  }
  hotbarEl.innerHTML = marks.join("");
  const name = creativeSlots[creativeSel] != null ? blockName(creativeSlots[creativeSel]) : "—";
  if (selBlockEl && selBlockEl.textContent !== name) selBlockEl.textContent = name;
}

window.addEventListener("keydown", (e) => {
  if (isTyping(e)) return;
  const n = Number(e.code.replace("Digit", ""));
  if (n >= 1 && n <= 9) {
    creativeSel = n - 1;
    updateHotbar();
  }
});

// Ввод в полях поиска: сочетания клавиш не работают (кроме Esc).
function isTyping(e) {
  const el = e.target;
  return !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA");
}
updateHotbar();

// ---------- песочница: призрак и постановка схем ----------
let previewPlan = null; // { plan, name, rot, rotated }
let previewAnchor = null;
let ghostOff = { x: 0, y: 0, z: 0 }; // B6: ручной сдвиг призрака от точки прицела
let anchorBase = null; // B7: точка прицела; при фиксации замирает
let ghostFixed = false; // B7: первый ЛКМ зафиксировал позицию, второй ставит
let ghostLines = null;
let ghostFill = null;
let lastSpaceTap = 0;
const planCache = new Map();
const FLY_SPEED = 22;
// Все постройки из папки schemes (видны и ставятся в креативе).
// URL-карта строится из index.json, а не из import.meta.glob(...eager):
// glob давал отдельный модуль-запрос на каждый файл и каждое превью
// (~2400 запросов при старте) и ронял прокси/дев-сервер при росте библиотеки.
const schemeUrlByFile = {};
const schemeThumbByFile = {};
for (const it of schemesIndex.items) {
  schemeUrlByFile[it.file] = `schemes/${it.file}`;
  if (it.thumb) schemeThumbByFile[it.file.replace(/\.(schem|schematic|nbt)$/i, "")] = `schemes/${it.thumb}`;
}

const viewBtn = document.getElementById("viewBtn");
const framesBtn = document.getElementById("framesBtn");
const blocksBtn = document.getElementById("blocksBtn");
const pickerEl = document.getElementById("picker");
const pickGridEl = document.getElementById("pickGrid");
const schemesPanelEl = document.getElementById("schemesPanel");
const schemeListEl = document.getElementById("schemeList");
const labelsEl = document.getElementById("labels");

// ---------- режимы: песочница (стройка) и просмотр (рамки + инфо) ----------
let labelsOn = true;
let showFrames = true;

// V — просто подписи над рамками, отдельного режима нет: строить можно всегда.
function setLabelsOn(on) {
  labelsOn = on;
  viewBtn.textContent = on ? t("labelsOn") : t("labelsOff");
  viewBtn.classList.toggle("active", on);
}

function setShowFrames(on) {
  showFrames = on;
  framesBtn.textContent = on ? t("framesOn") : t("framesOff");
  framesBtn.classList.toggle("active", on);
  applyBuildingVisibility();
}

// ---------- реестр поставленных построек ----------
let nextBuildingId = 1;
const buildings = []; // { id, name, file, x0,y0,z0, W,H,L, rot, placed, at, lines, fill, label, css }
// Разные цвета рамок, чтобы постройки различались с первого взгляда.
const FRAME_COLORS = [
  { c3: [1, 0.35, 0.3], css: "#ff5952" },
  { c3: [0.35, 1, 0.45], css: "#59ff73" },
  { c3: [0.35, 0.65, 1], css: "#59a6ff" },
  { c3: [1, 0.85, 0.3], css: "#ffd94d" },
  { c3: [0.85, 0.45, 1], css: "#d973ff" },
  { c3: [0.35, 1, 0.9], css: "#59ffe6" },
  { c3: [1, 0.55, 0.25], css: "#ff8c40" },
  { c3: [1, 0.45, 0.75], css: "#ff73bf" },
];

function recordBuilding({ name, file, x0, y0, z0, W, H, L, rot, placed }) {
  const id = nextBuildingId++;
  const col = FRAME_COLORS[(id - 1) % FRAME_COLORS.length];
  const v = (x, y, z) => new BABYLON.Vector3(x, y, z);
  const corners = [v(0, 0, 0), v(W, 0, 0), v(W, 0, L), v(0, 0, L), v(0, H, 0), v(W, H, 0), v(W, H, L), v(0, H, L)];
  const edges = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
  const lines = BABYLON.MeshBuilder.CreateLineSystem(`bldLines${id}`, {
    lines: edges.map(([a, b]) => [corners[a], corners[b]]),
  }, scene);
  lines.color = new BABYLON.Color3(...col.c3);
  lines.position.set(x0, y0, z0);
  lines.isPickable = false;
  const fill = BABYLON.MeshBuilder.CreateBox(`bldFill${id}`, { width: W, height: H, depth: L }, scene);
  const fm = new BABYLON.StandardMaterial(`bldMat${id}`, scene);
  fm.diffuseColor = new BABYLON.Color3(...col.c3);
  fm.emissiveColor = new BABYLON.Color3(col.c3[0] * 0.25, col.c3[1] * 0.25, col.c3[2] * 0.25);
  fm.alpha = 0.05;
  fm.backFaceCulling = false;
  fm.disableLighting = true;
  fill.material = fm;
  fill.position.set(x0 + W / 2, y0 + H / 2, z0 + L / 2);
  fill.isPickable = false;
  const label = document.createElement("div");
  label.className = "blabel";
  label.style.borderColor = col.css;
  label.innerHTML = recordLabelBase({ file, name, W, H, L, x0, y0, z0, rot, placed, css: col.css });
  label.style.display = "none";
  labelsEl.appendChild(label);
  const b = { id, name, file: file || "", x0, y0, z0, W, H, L, rot, placed, at: Date.now(), lines, fill, label, css: col.css };
  buildings.push(b);
  applyBuildingVisibility();
  return b;
}

function applyBuildingVisibility() {
  // Рамки — кнопкой "Рамки", подписи — клавишей V, независимо друг от друга.
  for (const b of buildings) {
    b.lines.isVisible = showFrames;
    b.fill.isVisible = showFrames;
  }
}

function clearBuildings() {
  for (const b of buildings) {
    b.lines.dispose();
    b.fill.dispose();
    b.label.remove();
  }
  buildings.length = 0;
}

// ---------- город: экономика поверх построек ----------
let city = newCityState();
if (typeof window !== "undefined") window.CITY = { get state() { return city; } };

const cityPanelEl = document.getElementById("cityPanel");
const cityStatsEl = document.getElementById("cityStats");
const cityBuildingsEl = document.getElementById("cityBuildings");
// Фильтры и сортировка построек города (состояние живёт между тиками).
let cityBldType = "all";
let cityBldTag = "all";
let cityBldSort = "name";
// Теги инстанса — из библиотечной схемы по файлу (свои файлы без тегов).
function instTags(inst) {
  if (!inst || !inst.file) return [];
  const meta = schemeMetaFor(inst.file);
  return meta && Array.isArray(meta.tags) ? meta.tags : [];
}
const cityBldSortEl = document.getElementById("cityBldSort");
if (cityBldSortEl) {
  cityBldSortEl.addEventListener("change", () => {
    cityBldSort = cityBldSortEl.value;
    renderCity();
  });
}

function schemeMetaFor(file) {
  return allSchemeItems.find((i) => i.file === file) || null;
}
// Отображаемое имя постройки на текущем языке: для библиотечных схем —
// schemeName(meta) (пересчитывается при смене языка), иначе stored name,
// иначе имя типа. Хранимые name — лишь fallback (файлы вне каталога, сейвы).
function bldName(b) {
  if (!b) return "";
  const meta = b.file ? schemeMetaFor(b.file) : null;
  if (meta) return schemeName(meta);
  return b.name || (b.typeId ? typeName(b.typeId) : "");
}
// Базовая часть метки рамки (без строки города): имя + размеры + координаты.
function recordLabelBase(d) {
  return `<b style="color:${d.css}">▮ ${bldName(d)}</b><br>` +
    `${d.W}×${d.H}×${d.L} · ${t("tileBlocks")}: ${d.placed}<br>` +
    `x:${d.x0} y:${d.y0} z:${d.z0}` + (d.rot ? ` · ↻${d.rot * 90}°` : "");
}
// Имя активного призрака на текущем языке (пересчёт при смене языка).
function previewDispName() {
  if (!previewPlan) return "";
  const meta = selectedSchemeFile ? schemeMetaFor(selectedSchemeFile) : null;
  if (meta) return schemeName(meta);
  return previewPlan.name || "";
}

function schemeBuildCost(item, dims) {
  const typeId = resolveType(item || {});
  const W = Number(dims.W), H = Number(dims.H), L = Number(dims.L);
  if (!Number.isFinite(W) || !Number.isFinite(H) || !Number.isFinite(L)) return null;
  const tier = resolveTier(item || {}, { W, H, L });
  return { typeId, tier, cost: buildCostFor(typeId, { W, H, L }, tier) };
}

// Привязка рамки к симуляции + строка города в метку рамки.
function registerRecord(rec, typeId, tier) {
  const inst = addBuilding(city, {
    typeId,
    name: rec.name,
    dims: { W: rec.W, H: rec.H, L: rec.L },
    pos: { x0: rec.x0, y0: rec.y0, z0: rec.z0 },
    placedBlocks: rec.placed,
    file: rec.file,
    rot: rec.rot,
    tier,
  });
  rec.cityId = inst.id;
  rec.labelBase = rec.label.innerHTML;
  refreshRecordLabel(rec);
  return inst;
}

function cityInstFor(rec) {
  if (!rec.cityId) return null;
  return city.buildings.find((b) => b.id === rec.cityId) || null;
}

function refreshRecordLabel(rec) {
  if (rec.labelBase == null) rec.labelBase = rec.label.innerHTML;
  const inst = cityInstFor(rec);
  if (!inst) {
    rec.label.innerHTML = rec.labelBase;
    return;
  }
  const tn = typeName(inst.typeId);
  const hp = Math.round(inst.health);
  const parts = [`${t("cond")} ${hp}%`];
  if (inst.active === false) parts.push(t("draft"));
  if (inst.tier > 1) parts.push(`${TIERS[inst.tier].icon} ${tierName(inst.tier)}`);
  if (inst.roadAccess === false && inst.active !== false) parts.push(t("noRoad"));
  if (inst.stats.housing > 0) parts.push(`${t("residentsOf")} ${inst.residents || 0}/${inst.stats.housing}`);
  if (inst.stats.jobs > 0) parts.push(`${t("workersOf")} ${inst.workers}/${inst.stats.jobs}`);
  rec.label.innerHTML = rec.labelBase +
    `<br><span style="color:${rec.css}">[${tn}] ` +
    parts.join(" · ") + `</span>`;
}

function findRecordAt(x, y, z) {
  for (let i = buildings.length - 1; i >= 0; i--) {
    const b = buildings[i];
    if (x >= b.x0 && x < b.x0 + b.W && y >= b.y0 && y < b.y0 + b.H && z >= b.z0 && z < b.z0 + b.L) {
      return b;
    }
  }
  return null;
}

// A2: закреплённая панель переживает захват курсора как виджет только для чтения.
let cityPinned = false;
function pinCityPanel() {
  if (!cityPanelEl.classList.contains("show")) return;
  cityPinned = true;
  cityPanelEl.classList.add("pinned");
}
function unpinCityPanel() {
  cityPinned = false;
  cityPanelEl.classList.remove("pinned");
}

function fmtMoney(v) {
  const r = Math.round(v * 100) / 100;
  return (r < 0 ? "−$" : "$") + Math.abs(r).toLocaleString(locale());
}
function fmtNum(v) {
  return Number(v).toLocaleString(locale());
}

// Бонус казне за досмотр rewarded video (необязательный, п.4.5).
const YG_REWARD = 1500;

// Дельта ресурса за день для статистики: "+X/день" / "−X/день".
function netDelta(v) {
  if (!Number.isFinite(v)) return "";
  return ` <span class="cdim">(${v > 0 ? "+" : ""}${v} ${t("perDay")})</span>`;
}

// Уровень показателя «много это или нет»: мало (зелёный) / много (жёлтый)
// / критично (красный). Пороги — где показатель начинает вредить городу.
function lvlBadge(v, warn, crit) {
  const n = Number.isFinite(v) ? v : 0;
  const lvl = n >= crit ? 2 : n >= warn ? 1 : 0;
  const cls = ["lvlOk", "lvlWarn", "lvlBad"][lvl];
  return ` <span class="${cls}">${t(["indLow", "indHigh", "indCrit"][lvl])}</span>`;
}

// Строка слайдера одного из трёх налогов: ставка + пометка (выше порога
// допустимости — «идут банкротства»).
function taxRow(label, id, rate, opts = {}) {
  const { tol = Infinity, suffix = "", lowKey = "taxLow", highKey = "taxHigh" } = opts;
  const bad = rate > tol;
  const note = bad ? t("taxFail")
    : rate > TAX_PER_CAPITA ? t(highKey)
    : rate < TAX_PER_CAPITA ? t(lowKey) : t("taxBase");
  return [t(label),
    `<input type="range" id="${id}" min="0" max="1" step="0.05" value="${rate}" style="width:130px;vertical-align:middle"> ` +
    `<b>$${rate.toFixed(2)}${suffix}</b> <span class="${bad ? "lvlBad" : "cdim"}">${note}</span>`];
}

// Черновик кредитной формы — живёт между перерисовками панели (тик в 5 с).
// Ставка не редактируется: она считается из срока (loanQuote).
const loanDraft = { amount: null, days: 30 };
// Готовые варианты: клик = кредит сразу, без ввода. Суммы-заготовки
// лимитируются по city, кнопка гаснет, если вариант не влезает.
const LOAN_PRESETS = [
  { amount: 500, days: 30 },
  { amount: 1500, days: 60 },
  { amount: 5000, days: 100 },
  { amount: 15000, days: 180 },
];
function loanDraftSync() {
  const d = Math.min(LOAN_MAX_DAYS, Math.max(LOAN_MIN_DAYS, Math.round(Number(loanDraft.days)) || 30));
  const limit = loanLimit(city);
  let a = Number.isFinite(loanDraft.amount) ? loanDraft.amount : Math.min(5000, limit);
  a = Math.min(limit, Math.max(100, Math.round(a / 100) * 100));
  loanDraft.amount = a;
  loanDraft.days = d;
}
// Живой пересчёт подсказки, пока игрок печатает (панель не перерисовываем).
function updateLoanQuote() {
  const box = document.getElementById("loanQuote");
  if (!box) return;
  const d = Math.max(1, Math.round(Number(loanDraft.days)) || 1);
  const a = Number.isFinite(loanDraft.amount) ? Math.max(0, loanDraft.amount) : 0;
  const q = loanQuote(a, d);
  box.innerHTML =
    `${t("loanQuote", { total: fmtMoney(q.owed), rate: q.rate })}<br>` +
    t("loanGraceHint", { days: d, daily: fmtMoney(q.daily) });
  const amtEl = document.getElementById("loanAmount");
  if (amtEl) amtEl.max = loanLimit(city);
}

function renderCity() {
  // Пока игрок печатает в кредитных полях — панель не перестраиваем.
  const ae = document.activeElement;
  if (ae && (ae.id === "loanAmount" || ae.id === "loanDays")) return;
  document.getElementById("cityDay").textContent = `${t("stDay")} ${city.day}`;
  const last = city.last;
  const workers = city.buildings.reduce((a, b) => a + b.workers, 0);
  const jobsCap = last ? last.jobsTotal : city.buildings.reduce((a, b) => a + b.stats.jobs, 0);
  const taxRate = Number.isFinite(city.taxRate) ? city.taxRate : TAX_PER_CAPITA;
  const bizTax = Number.isFinite(city.bizTax) ? city.bizTax : TAX_PER_CAPITA;
  const indTax = Number.isFinite(city.indTax) ? city.indTax : TAX_PER_CAPITA;
  const nextMs = MILESTONES.find((m) => !(city.milestones || []).includes(m.id));
  const moneyNote = city.money < 0 ? ` <span class="cdim">${t("bankruptAt", { sum: fmtNum(Math.abs(BANKRUPT_AT)) })}</span>` : "";
  const rows = [
    [t("stMoney"), `${fmtMoney(city.money)} <span class="cdim">(${(last && last.income >= 0 ? "+" : "") + (last ? last.income : 0)} / −${last ? last.upkeep : 0} ${t("perDay")})</span>${moneyNote}`],
    [t("stDay"), `${city.day}`],
    [t("stPop"), `${city.population} <span class="cdim">(${last && last.migrants >= 0 ? "+" : ""}${last ? last.migrants : 0}${t("perDay")})</span>`],
    [t("stHappy"), `${city.happiness}%`],
    taxRow("stTax", "taxRange", taxRate, { suffix: t("perResident") }),
    taxRow("stTaxBiz", "bizTaxRange", bizTax, { tol: TAX_TOLERANCE.biz, lowKey: "taxDown", highKey: "taxUp" }),
    taxRow("stTaxInd", "indTaxRange", indTax, { tol: TAX_TOLERANCE.ind, lowKey: "taxDown", highKey: "taxUp" }),
    [t("stGoal"), nextMs ? `${mstoneName(nextMs.id)} <span class="cdim">${t("bonus")}${fmtNum(nextMs.bonus)}</span>` : t("goalDone")],
    [t("stHousing"), `${city.population} / ${last ? last.housingCap : 0}`],
    [t("stJobs"), `${workers} / ${jobsCap}`],
    [t("stFood"), `${city.food}${netDelta(last && last.foodNet)}`],
    [t("stEnergy"), `${city.energy}${netDelta(last && last.energyNet)}${last && last.energyEff < 1 ? t("noEnergy") : ""}`],
    [t("stWater"), `${city.water}${netDelta(last && last.waterNet)}${city.last && city.last.waterShortage ? t("noWater") : ""}`],
    [t("stWaste"), `${Math.round(city.waste)}${lvlBadge(city.waste, 50, 200)}`],
    [t("stCrime"), `${city.last ? city.last.crime : 0}${lvlBadge(city.last ? city.last.crime : 0, 30, 60)}`],
    [t("stPollution"), `${city.pollution}${lvlBadge(city.pollution, 40, 70)}`],
    [t("stRoadless"), `${last ? last.roadless : 0} <span class="cdim">${t("workHalf")}</span>`],
    [t("stAgents"), `${residents.length} <button data-residents="">${showResidents ? t("hide") : t("show")}</button>`],
  ];
  cityStatsEl.innerHTML = rows.map(([k, v]) =>
    `<div class="crow"><span>${k}</span><b>${v}</b></div>`).join("");
  renderLoans();

function renderLoans() {
  const el = document.getElementById("cityLoans");
  if (!el) return;
  loanDraftSync();
  const debt = city.loans.reduce((a, l) => a + l.owed, 0);
  const { amount, days } = loanDraft;
  const q = loanQuote(amount, days);
  const limit = loanLimit(city);
  const full = city.loans.length >= MAX_LOANS;
  let html = `<div class="crow"><span>${t("debt")}</span><b>${fmtMoney(debt)}</b></div>` +
    `<div class="cbloan">
      <div class="clrow">
        <label>${t("loanAmountLbl")}<input type="number" id="loanAmount" min="100" max="${limit}" step="100" value="${amount}"></label>
        <label>${t("loanDaysLbl")}<input type="number" id="loanDays" min="${LOAN_MIN_DAYS}" max="${LOAN_MAX_DAYS}" step="1" value="${days}"></label>
      </div>
      <div class="cbtake">${LOAN_PRESETS.map((p) =>
        `<button data-loan-preset="${p.amount},${p.days}"${full || p.amount > limit ? " disabled" : ""} title="${t("loanPresetTitle")}">` +
        `${fmtMoney(p.amount)} · ${p.days} ${t("daysShort")} · ${loanMinRate(p.days)}%</button>`).join("")}</div>
      <div class="clquote" id="loanQuote">${t("loanQuote", { total: fmtMoney(q.owed), rate: q.rate })}<br>${t("loanGraceHint", { days, daily: fmtMoney(q.daily) })}</div>
      <button data-loan-take=""${full ? " disabled" : ""}>${t("loanTake")}</button>
    </div>`;
  city.loans.forEach((l, i) => {
    const phase = l.graceLeft > 0
      ? ` · ${t("loanGraceLeft", { n: l.graceLeft })}`
      : ` · ${l.daysLeft} ${t("daysShort")}${l.daysLeft > 0 ? ` · ${fmtMoney(l.owed / l.daysLeft)}${t("perDay")}` : ""}`;
    const cost = loanPayoff(l);
    html += `<div class="cbsub"><span>${fmtMoney(l.owed)} ${t("leftOwed")}${phase}</span>` +
      `<button data-loan-repay="${i}"${city.money >= cost ? "" : " disabled"}>${t("repay")}</button></div>`;
  });
  // Rewarded video: необязательный бонус в казну (п.4.5), прогресс не блокирует.
  // Без SDK ролика не будет — кнопку не показываем, чтобы не дразнить.
  if (yg.ok) html += `<div class="cbtake"><button data-rewarded="" title="${t("ygRewardTitle", { sum: fmtMoney(YG_REWARD) })}">${t("ygReward", { sum: fmtMoney(YG_REWARD) })}</button></div>`;
  el.innerHTML = html;
  if (city.loans.length > 0) coachOnce("repay", { text: t("loanHint"), target: "#cityLoans [data-loan-repay]" });
}
  if (city.buildings.length === 0) {
    document.getElementById("cityBldTypes").innerHTML = "";
    document.getElementById("cityBldTags").innerHTML = "";
    cityBuildingsEl.innerHTML = `<div class="chint">${t("noBuildings")}</div>`;
    return;
  }
  // Фильтры по типам и тегам, встречающимся в городе (повторный клик — сброс).
  const typeCounts = {};
  for (const b of city.buildings) typeCounts[b.typeId] = (typeCounts[b.typeId] || 0) + 1;
  const tagCounts = {};
  for (const b of city.buildings) for (const tag of instTags(b)) tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  if (cityBldType !== "all" && !typeCounts[cityBldType]) cityBldType = "all";
  if (cityBldTag !== "all" && !tagCounts[cityBldTag]) cityBldTag = "all";
  const chip = (label, active, attr) =>
    `<span class="chip${active ? " active" : ""}" ${attr}>${label}</span>`;
  document.getElementById("cityBldTypes").innerHTML =
    chip(`${t("all")} (${city.buildings.length})`, cityBldType === "all", `data-cbtype="all"`) +
    Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).map(([typeId, n]) =>
      chip(`${typeName(typeId)} (${n})`, cityBldType === typeId, `data-cbtype="${typeId}"`)).join("");
  document.getElementById("cityBldTags").innerHTML =
    Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).map(([tag, n]) =>
      chip(`#${tagName(tag)} (${n})`, cityBldTag === tag, `data-cbtag="${tag}"`)).join("");
  const sorters = {
    name: (a, b) => bldName(a).localeCompare(bldName(b), locale()),
    health: (a, b) => a.health - b.health,
    cost: (a, b) => b.stats.buildCost - a.stats.buildCost,
    housing: (a, b) => (b.stats.housing || 0) - (a.stats.housing || 0),
  };
  const list = city.buildings
    .filter((b) => (cityBldType === "all" || b.typeId === cityBldType) &&
      (cityBldTag === "all" || instTags(b).includes(cityBldTag)))
    .sort(sorters[cityBldSort] || sorters.name);
  cityBuildingsEl.innerHTML = "";
  if (list.length === 0) {
    cityBuildingsEl.innerHTML = `<div class="chint">${t("noFilterHit")}</div>`;
    return;
  }
  for (const inst of list) {
    const cost = repairPrice(inst);
    const can = inst.health < 100 && city.money >= cost;
    const refund = Math.floor(inst.stats.buildCost * 0.5);
    const row = document.createElement("div");
    row.className = "cbld";
    const hp = Math.round(inst.health);
    const parts = [`${t("cond")} ${hp}%`];
    if (inst.active === false) parts.push(t("draft"));
    if (inst.tier > 1) parts.push(`${TIERS[inst.tier].icon} ${tierName(inst.tier)}`);
    if (inst.roadAccess === false && inst.active !== false) parts.push(t("noRoad"));
    if (inst.stats.housing > 0) parts.push(`${t("residentsOf")} ${inst.residents || 0}/${inst.stats.housing}`);
    if (inst.stats.jobs > 0) parts.push(`${t("workersOf")} ${inst.workers}/${inst.stats.jobs}`);
    row.innerHTML =
      `<div class="cbhead"><b>${bldName(inst)}</b><span class="cdim">${typeName(inst.typeId)}${inst.tier > 1 ? ` · ${TIERS[inst.tier].icon} ${tierName(inst.tier)}` : ""}</span></div>` +
      `<div class="cbar"><div class="cfill" style="width:${hp}%;${hp < 35 ? "background:#ff5952;" : hp < 70 ? "background:#ffd54d;" : ""}"></div></div>` +
      `<div class="cbsub"><span>${parts.join(" · ")}</span>` +
      `<button data-repair="${inst.id}"${can ? "" : " disabled"}>${t("repair")} ${inst.health >= 100 ? "" : fmtMoney(cost)}</button>` +
      `<button data-demolish="${inst.id}" title="${t("demolishTitle", { sum: fmtMoney(refund) })}">${t("demolish")} +${fmtMoney(refund)}</button></div>`;
    cityBuildingsEl.appendChild(row);
  }
}

// Поля кредитной формы: обновляем черновик и подсказку без перерисовки
// (иначе тик в 5 с сбрасывает ввод и фокус).
function loanFieldBounds(id) {
  return id === "loanAmount"
    ? { min: 100, max: loanLimit(city), step: 100 }
    : { min: LOAN_MIN_DAYS, max: LOAN_MAX_DAYS, step: 1 };
}
// Возвращает введённое в допустимые границы сразу, а не по ближайшему тику:
// renderCity пропускает перерисовку, пока поле в фокусе, иначе нормализация
// из renderLoans доезжала бы через 5 с.
// Пока печатают (live), нижнюю границу не трогаем: иначе «30» дней или
// «1500» не набрать — промежуточные «3» и «15» тут же прыгали бы на
// минимум. Верхняя жёсткая сразу: лишняя цифра её только увеличит.
function loanClampField(el, live) {
  const raw = el.value;
  const b = loanFieldBounds(el.id);
  if (raw === "") {
    // Поле очистили вручную: на commit возвращаем последнее допустимое.
    if (!live) {
      loanDraftSync();
      el.value = String(el.id === "loanAmount" ? loanDraft.amount : loanDraft.days);
    }
    return;
  }
  const v = Number(raw);
  if (!Number.isFinite(v)) return;
  let n;
  if (v > b.max) {
    n = b.max;
    el.value = String(n);
  } else if (live) {
    n = v;
  } else {
    n = Math.min(b.max, Math.max(b.min, Math.round(v / b.step) * b.step));
    if (String(n) !== raw) el.value = String(n);
  }
  if (el.id === "loanAmount") loanDraft.amount = n;
  else loanDraft.days = n;
  updateLoanQuote();
}
cityPanelEl.addEventListener("input", (e) => {
  const id = e.target && e.target.id;
  if (id !== "loanAmount" && id !== "loanDays") return;
  loanClampField(e.target, true);
});
// Полная нормализация (нижняя граница + шаг) — по Enter, blur или «Взять».
cityPanelEl.addEventListener("change", (e) => {
  const id = e.target && e.target.id;
  if (id !== "loanAmount" && id !== "loanDays") return;
  loanClampField(e.target, false);
});
cityPanelEl.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  const id = e.target && e.target.id;
  if (id !== "loanAmount" && id !== "loanDays") return;
  e.preventDefault();
  loanClampField(e.target, false);
  e.target.blur();
});

cityPanelEl.addEventListener("click", async (e) => {
  const tog = e.target.closest("[data-residents]");
  if (tog) {
    showResidents = !showResidents;
    syncResidents();
    renderCity();
    showMsg(showResidents ? "residentsShown" : "residentsHidden");
    return;
  }
  // Фильтры построек: повторный клик по активному сбрасывает.
  const cbt = e.target.closest("[data-cbtype]");
  if (cbt) {
    const v = cbt.dataset.cbtype;
    cityBldType = cityBldType === v ? "all" : v;
    renderCity();
    return;
  }
  const cbg = e.target.closest("[data-cbtag]");
  if (cbg) {
    const v = cbg.dataset.cbtag;
    cityBldTag = cityBldTag === v ? "all" : v;
    renderCity();
    return;
  }
  const pre = e.target.closest("[data-loan-preset]");
  if (pre && !pre.disabled) {
    const [amount, days] = pre.dataset.loanPreset.split(",").map(Number);
    const res = takeLoan(city, { amount, days });
    if (res.ok) showMsg("loanTaken", { owed: Math.round(res.owed), money: fmtMoney(city.money) });
    else showMsg("loanDenied", { reason: { key: res.reason } });
    if (res.ok) { loanDraft.amount = amount; loanDraft.days = days; }
    if (res.ok) coachOnce("loan", { text: t("coachLoan", { n: days }), target: "#moneyBar" });
    refreshTileFunds();
    renderCity();
    return;
  }
  const take = e.target.closest("[data-loan-take]");
  if (take && !take.disabled) {
    loanDraftSync();
    const res = takeLoan(city, { amount: loanDraft.amount, days: loanDraft.days });
    if (res.ok) showMsg("loanTaken", { owed: Math.round(res.owed), money: fmtMoney(city.money) });
    else showMsg("loanDenied", { reason: { key: res.reason } });
    if (res.ok) loanDraft.amount = null; // новая сумма под новый лимит
    if (res.ok) coachOnce("loan", { text: t("coachLoan", { n: loanDraft.days }), target: "#moneyBar" });
    refreshTileFunds();
    renderCity();
    return;
  }
  const pay = e.target.closest("[data-loan-repay]");
  if (pay && !pay.disabled) {
    const res = repayLoan(city, Number(pay.dataset.loanRepay));
    if (res.ok) showMsg("repaidEarly", { cost: fmtMoney(res.cost) });
    else showMsg("noMoney");
    renderCity();
    return;
  }
  // Бонус за просмотр rewarded video (только досмотр засчитывает награду).
  const rw = e.target.closest("[data-rewarded]");
  if (rw && !rw.disabled) {
    rw.disabled = true; // повторный клик во время ролика — игнор
    const earned = await yg.rewarded();
    if (earned) {
      city.money = Math.round((city.money + YG_REWARD) * 100) / 100;
      showMsg("ygRewarded", { sum: fmtMoney(YG_REWARD) });
    } else {
      showMsg("ygNoAdv");
    }
    refreshTileFunds();
    renderCity();
    return;
  }
  const btn = e.target.closest("[data-repair]");
  if (btn && !btn.disabled) {
    const res = repair(city, btn.dataset.repair);
    if (res.ok) {
      const rec = buildings.find((b) => b.cityId === btn.dataset.repair);
      let restored = 0;
      if (rec) {
        restored = await restoreBuildingBlocks(rec);
        refreshRecordLabel(rec);
      }
      showMsg("repaired", {
        cost: fmtMoney(res.cost),
        tail: restored > 0 ? { key: "repairedBlocks", vars: { n: restored } } : "",
      });
    } else {
      showMsg("noMoneyRepair");
    }
    renderCity();
    return;
  }
  const dml = e.target.closest("[data-demolish]");
  if (dml) {
    await demolishBuilding(dml.dataset.demolish);
    return;
  }
});

// Слайдеры налогов (событие change — срабатывает при отпускании, перерисовка не мешает).
cityPanelEl.addEventListener("change", (e) => {
  const id = e.target && e.target.id;
  if (id !== "taxRange" && id !== "bizTaxRange" && id !== "indTaxRange") return;
  const v = Math.min(1, Math.max(0, Number(e.target.value)));
  const rate = Math.round(v * 100) / 100;
  if (id === "taxRange") city.taxRate = rate;
  else if (id === "bizTaxRange") city.bizTax = rate;
  else city.indTax = rate;
  const key = id === "taxRange" ? "taxSet" : id === "bizTaxRange" ? "taxSetBiz" : "taxSetInd";
  showMsg(key, { rate: rate.toFixed(2) });
  renderCity();
});

// План схемы из библиотеки (кеш или fetch), повёрнутый как при постройке.
// Для своих файлов (file === "") возвращает null — там плана нет.
async function getRotatedPlan(file, rot) {
  if (!file || !schemeUrlByFile[file]) return null;
  try {
    const url = schemeUrlByFile[file];
    let plan = planCache.get(url);
    if (!plan) {
      const response = await fetch(url);
      if (!response.ok) return null;
      plan = parseSchematicFile(new Uint8Array(await response.arrayBuffer()));
      if (!plan.blocks.length) return null;
      planCache.set(url, plan);
    }
    return rotatePlan(plan, rot || 0);
  } catch (err) {
    console.error(t("dbgPlanOp"), err);
    return null;
  }
}

// Ремонт чинит и воксели: добираем из плана клетки, где сейчас воздух.
// Правки игрока не трогаем (перезаписываем только AIR).
async function restoreBuildingBlocks(rec) {
  const r = await getRotatedPlan(rec.file, rec.rot);
  if (!r) return 0;
  let n = 0;
  for (const [x, y, z, id] of r.blocks) {
    const wx = rec.x0 + x, wy = rec.y0 + y, wz = rec.z0 + z;
    if (world.getBlock(wx, wy, wz) === AIR && world.setBlock(wx, wy, wz, id)) n++;
  }
  if (n > 0) world.flushMeshes(scene, blockMat, cutoutMat, alphaMat, torchMat);
  return n;
}

// Снос здания: клетки плана убираем (совпавшие с планом — правки игрока целы),
// запись и рамку удаляем. Активное — возврат 50%, черновик — 100%.
async function demolishBuilding(id) {
  const inst = city.buildings.find((b) => b.id === id);
  if (!inst) return;
  const isDraft = inst.active === false;
  const refund = isDraft ? inst.stats.buildCost : Math.floor(inst.stats.buildCost * 0.5);
  if (!(await uiConfirm(t("demolishAsk", { name: bldName(inst), sum: fmtMoney(refund) })))) return;
  const rec = buildings.find((b) => b.cityId === id);
  let cleared = 0;
  if (rec) {
    const r = await getRotatedPlan(rec.file, rec.rot);
    if (r) {
      for (const [x, y, z, bId] of r.blocks) {
        const wx = rec.x0 + x, wy = rec.y0 + y, wz = rec.z0 + z;
        if (world.getBlock(wx, wy, wz) === bId && world.setBlock(wx, wy, wz, AIR)) cleared++;
      }
    }
  }
  const ci = city.buildings.findIndex((b) => b.id === id);
  if (ci < 0) return;
  const name = bldName(inst);
  if (isDraft) {
    city.buildings.splice(ci, 1);
    city.money = Math.round((city.money + refund) * 100) / 100;
  } else {
    const res = demolish(city, id);
    if (!res.ok) return;
  }
  if (rec) {
    const ri = buildings.indexOf(rec);
    if (ri >= 0) buildings.splice(ri, 1);
    rec.lines.dispose();
    rec.fill.dispose();
    rec.label.remove();
  }
  applyBuildingVisibility();
  world.flushMeshes(scene, blockMat, cutoutMat, alphaMat, torchMat);
  refreshTileFunds();
  syncResidents();
  if (cityPanelEl.classList.contains("show")) renderCity();
  showMsg("demolished", { name, n: cleared, sum: fmtMoney(refund) });
}

const pauseMenuEl = document.getElementById("pauseMenu");
document.getElementById("resumeBtn").addEventListener("click", resumeGame);
document.getElementById("saveBtn").addEventListener("click", () => saveGame());
// Прогресс терялся: автосейва не было, а сейв падал с quota-ошибкой (лечится
// сжатием чанков в save.js). Теперь мир сохраняем тихо: по таймеру, при
// уходе вкладки в фон и перед выгрузкой — тост показываем только вручную.
setInterval(() => { if (mapReady) saveGame({ silent: true }); }, 120_000);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden" && mapReady) saveGame({ silent: true });
});
window.addEventListener("beforeunload", () => {
  if (mapReady) saveGame({ silent: true });
});
document.getElementById("loadSaveBtn").addEventListener("click", loadGame);
document.getElementById("newGameBtn").addEventListener("click", async () => {
  if (!(await uiConfirm(t("newGameAsk")))) return;
  // Рестарт — логическая пауза: сначала полноэкранная реклама, потом мир.
  yg.playStop();
  yg.fullscreenAdv().then(() => {
    if (mapReady) resetGame();
  });
});

// Новая игра: чистый плоский мир, стартовый город, игрок на спавне.
function resetGame() {
  world.clear();
  clearBuildings();
  nextBuildingId = 1;
  city = newCityState();
  respawnPoint = { x: 0.5, y: 2, z: 0.5 };
  player.x = respawnPoint.x;
  player.y = respawnPoint.y;
  player.z = respawnPoint.z;
  player.vy = 0;
  player.grounded = false;
  world.ensureFlatAround(player.x, player.z);
  world.flushMeshes(scene, blockMat, cutoutMat, alphaMat, torchMat);
  resetMapTransientState();
  mapReady = true;
  camera.position.set(player.x, player.y + EYE, player.z);
  syncResidents();
  tutorialReset();
  tabPressedWorld = false; // новый мир — подсказки заново
  checkTutorial();
  closePanels();
  setPaused(false);
  refreshTileFunds();
  showMsg("newGame"); // Новая игра: пустой мир и $10 000
}

// ---------- сохранение/загрузка (этап 24): город отдельно от блоков ----------
const SAVE_KEY = "babylon-city-save-v1";

function refreshSaveInfo() {
  const el = document.getElementById("saveInfo");
  if (!el) return;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      el.textContent = t("noSaves");
      return;
    }
    el.textContent = t("saveAt", { date: new Date(JSON.parse(raw).savedAt || 0).toLocaleString(locale()) });
  } catch (e) {
    el.textContent = t("saveBroken");
  }
}

async function saveGame({ silent = false } = {}) {
  try {
    const data = {
      v: SAVE_VERSION,
      savedAt: Date.now(),
      player: { x: player.x, y: player.y, z: player.z },
      city: serializeCity(city),
      // Чанки сжимаем: без этого JSON переполнял квоту localStorage и сейв
      // падал с QuotaExceededError (прогресс терялся).
      chunks: encodeChunks(serializeWorld(world)),
    };
    const json = JSON.stringify(data);
    localStorage.setItem(SAVE_KEY, json);
    // Облако (только у авторизованных): три яруса по размеру.
    // setData (200 КБ по документации) с запасом 180 КБ — меряем БАЙТЫ:
    // full (мир целиком) → city (всё важное без вокселей чанков) →
    // profile (только экономика). Жертвуем вокселями в последнюю очередь,
    // список построек сохраняем всегда, пока влезает.
    const CLOUD_MAX = 180 * 1024;
    const bytes = new TextEncoder().encode(json).length;
    const cloudSettings = {
      lang: settings.lang, tutorial: settings.tutorial,
      tabHint: settings.tabHint, coach: settings.coach,
    };
    let cloud = false;
    if (yg.authorized) {
      let payload;
      if (bytes < CLOUD_MAX) {
        payload = { v: 1, kind: "full", save: data, settings: cloudSettings };
      } else {
        const cityOnly = buildCloudCity();
        payload = new TextEncoder().encode(JSON.stringify(cityOnly)).length < CLOUD_MAX
          ? { v: 1, kind: "city", city: cityOnly, settings: cloudSettings }
          : { v: 1, kind: "profile", profile: cloudProfile(), settings: cloudSettings };
      }
      cloud = await yg.cloudSave({ citysave: payload });
    }
    // Автосейвы молчат; ошибку показываем всегда.
    if (!silent) {
      if (cloud) showMsg("savedCloud", { day: city.day, n: city.buildings.length, kb: (bytes / 1024).toFixed(0) });
      else showMsg("saved", { day: city.day, n: city.buildings.length, kb: (bytes / 1024).toFixed(0) });
    }
  } catch (e) {
    console.error(e);
    showMsg("saveFail", { err: e.message || e });
  }
  refreshSaveInfo();
}

// Компактный профиль для облака (кросс-девайс), когда мир не влезает в лимит.
// Только экономика/день/население: воксели и список построек в 200 КБ не
// влезают и не восстанавливаются — город продолжает жить с нуля застройки.
function cloudProfile() {
  return {
    money: city.money, population: city.population,
    food: city.food, energy: city.energy,
    water: city.water || 0, waste: city.waste || 0,
    happiness: city.happiness, pollution: city.pollution,
    day: city.day, taxRate: city.taxRate, bizTax: city.bizTax, indTax: city.indTax,
    milestones: city.milestones || [],
    best: ygBestPop,
  };
}

// Средний ярус облака: всё важное, кроме вокселей чанков (терраин и ручные
// блоки вне построек теряются). Постройки восстанавливаются полностью:
// рамки/метки/экономика — сразу, воксели — докачкой схем из библиотеки.
// Формат записей построек — как в полном сейве (см. serializeCity).
function buildCloudCity() {
  return {
    money: city.money, population: city.population,
    food: city.food, energy: city.energy,
    water: city.water || 0, waste: city.waste || 0,
    happiness: city.happiness, pollution: city.pollution,
    day: city.day, nextId: city.nextId,
    taxRate: city.taxRate, bizTax: city.bizTax, indTax: city.indTax,
    milestones: city.milestones || [],
    best: ygBestPop,
    loans: (city.loans || []).map((l) => ({
      owed: l.owed, total: l.total, daysLeft: l.daysLeft,
      principal: l.principal, days: l.days, graceLeft: l.graceLeft, paid: l.paid,
    })),
    player: { x: player.x, y: player.y, z: player.z },
    buildings: city.buildings.map((b) => ({
      id: b.id,
      typeId: TYPES[b.typeId] ? b.typeId : "generic",
      name: String(b.name || ""),
      file: typeof b.file === "string" ? b.file.slice(0, 200) : "",
      rot: Number.isFinite(b.rot) ? b.rot : 0,
      tier: b.tier === 3 ? 3 : b.tier === 2 ? 2 : 1,
      x0: b.x0, y0: b.y0, z0: b.z0,
      W: b.W, H: b.H, L: b.L,
      health: Math.min(100, Math.max(0, b.health)),
      placedBlocks: b.placedBlocks,
      active: b.active !== false,
    })),
  };
}

// Настройки из облачного сейва (при явной загрузке): язык, тумблеры.
function applyCloudSettings(s) {
  if (!s || typeof s !== "object") return;
  if (s.lang === "ru" || s.lang === "en" || s.lang === "auto") settings.lang = s.lang;
  for (const k of ["tutorial", "tabHint", "coach"]) {
    if (typeof s[k] === "boolean") settings[k] = s[k];
  }
  saveSettings();
  if (setTutorialEl) setTutorialEl.checked = settings.tutorial;
  if (setTabHintEl) setTabHintEl.checked = settings.tabHint;
  if (setCoachEl) setCoachEl.checked = settings.coach;
  setLang(resolvedLang());
  syncLangButtons();
}

// Рекорд населения: локально всегда, в лидерборд — авторизованным.
let ygBestPop = 0;
try { ygBestPop = Math.max(0, Math.floor(Number(localStorage.getItem("babylon-best-pop")) || 0)); } catch (e) {}
function notePopulation() {
  if (city.population > ygBestPop) {
    ygBestPop = city.population;
    try { localStorage.setItem("babylon-best-pop", String(ygBestPop)); } catch (e) {}
    yg.submitPopulation(ygBestPop);
  }
}

// Профиль из облака: свежая местность + экономика/день/население.
// Воксели построек в облако не влезают — город продолжает жить с нуля застройки.
function applyCloudProfile(p) {
  try {
    world.clear();
    clearBuildings();
    nextBuildingId = 1;
    city = newCityState();
    const num = (v, d) => (Number.isFinite(v) ? v : d);
    Object.assign(city, {
      money: num(p.money, city.money), population: Math.max(0, Math.floor(num(p.population, 0))),
      food: num(p.food, city.food), energy: num(p.energy, city.energy),
      water: num(p.water, 0), waste: num(p.waste, 0),
      happiness: num(p.happiness, city.happiness), pollution: num(p.pollution, 0),
      day: Math.max(0, Math.floor(num(p.day, 0))),
      taxRate: num(p.taxRate, city.taxRate),
      bizTax: num(p.bizTax, city.bizTax),
      indTax: num(p.indTax, city.indTax),
      milestones: Array.isArray(p.milestones) ? p.milestones : [],
    });
    if (Number.isFinite(p.best) && p.best > ygBestPop) {
      ygBestPop = Math.floor(p.best);
      try { localStorage.setItem("babylon-best-pop", String(ygBestPop)); } catch (e) {}
    }
    resetMapTransientState();
    mapReady = true;
    world.ensureFlatAround(player.x, player.z);
    world.flushMeshes(scene, blockMat, cutoutMat, alphaMat, torchMat);
    syncResidents();
    tutorialReset();
    checkTutorial(true);
    closePanels();
    setPaused(false);
    showMsg("loaded", { day: city.day, n: 0 });
  } catch (e) {
    console.error(e);
    showMsg("loadFail", { err: e.message || e });
  }
  refreshSaveInfo();
}

// Загрузка яруса "city": экономика + кредиты + игрок + список построек.
// Воксели построек докачиваются из библиотеки и вставляются как при стройке;
// чанки терраина и ручные блоки вне построек не восстанавливаются.
// Своих файлов (импорт) в библиотеке нет — для них остаётся рамка без вокселей.
async function applyCloudCity(p) {
  try {
    world.clear();
    clearBuildings();
    nextBuildingId = 1;
    city = newCityState();
    const num = (v, d) => (Number.isFinite(v) ? v : d);
    const loans = Array.isArray(p.loans) ? p.loans
      .filter((l) => l && Number.isFinite(l.owed) && l.owed > 0).slice(0, 10)
      .map((l) => ({
        owed: l.owed,
        total: Number.isFinite(l.total) && l.total > 0 ? l.total : l.owed,
        daysLeft: Number.isFinite(l.daysLeft) ? Math.max(0, Math.floor(l.daysLeft)) : 0,
        principal: Number.isFinite(l.principal) ? Math.max(0, l.principal) : 0,
        days: Number.isFinite(l.days) && l.days > 0 ? Math.floor(l.days) : null,
        graceLeft: Number.isFinite(l.graceLeft) ? Math.max(0, Math.floor(l.graceLeft)) : 0,
        paid: Number.isFinite(l.paid) ? Math.max(0, l.paid) : 0,
      })) : [];
    Object.assign(city, {
      money: num(p.money, city.money),
      population: Math.max(0, Math.floor(num(p.population, 0))),
      food: num(p.food, city.food), energy: num(p.energy, city.energy),
      water: num(p.water, 0), waste: num(p.waste, 0),
      happiness: Math.min(100, Math.max(0, num(p.happiness, city.happiness))),
      pollution: num(p.pollution, 0),
      day: Math.max(0, Math.floor(num(p.day, 0))),
      nextId: Math.max(1, Math.floor(num(p.nextId, 1))),
      taxRate: num(p.taxRate, city.taxRate),
      bizTax: num(p.bizTax, city.bizTax),
      indTax: num(p.indTax, city.indTax),
      milestones: Array.isArray(p.milestones) ? p.milestones.filter((m) => typeof m === "string") : [],
      loans,
    });
    if (Number.isFinite(p.best) && p.best > ygBestPop) {
      ygBestPop = Math.floor(p.best);
      try { localStorage.setItem("babylon-best-pop", String(ygBestPop)); } catch (e) {}
    }
    const pp = (p && p.player) || {};
    const px = num(pp.x, 0.5), py = num(pp.y, 2), pz = num(pp.z, 0.5);
    respawnPoint = { x: px, y: py, z: pz };
    player.x = px; player.y = py; player.z = pz;
    player.vy = 0; player.grounded = false;
    world.ensureFlatAround(px, pz);
    world.flushMeshes(scene, blockMat, cutoutMat, alphaMat, torchMat);
    const list = Array.isArray(p.buildings) ? p.buildings : [];
    const planCacheLocal = new Map();
    for (const sb of list) {
      if (!sb || typeof sb !== "object") continue;
      const W = Math.max(1, Math.floor(num(sb.W, 0)));
      const H = Math.max(1, Math.floor(num(sb.H, 0)));
      const L = Math.max(1, Math.floor(num(sb.L, 0)));
      if (!(W > 0 && H > 0 && L > 0)) continue;
      if (![sb.x0, sb.y0, sb.z0].every(Number.isFinite)) continue;
      const rec = recordBuilding({
        name: typeof sb.name === "string" ? sb.name.slice(0, 80) : "",
        file: typeof sb.file === "string" ? sb.file.slice(0, 200) : "",
        x0: Math.floor(sb.x0), y0: Math.floor(sb.y0), z0: Math.floor(sb.z0),
        W, H, L,
        rot: [0, 1, 2, 3].includes(sb.rot) ? sb.rot : 0,
        placed: Math.max(1, Math.floor(num(sb.placedBlocks, 1))),
      });
      const inst = registerRecord(rec,
        (typeof sb.typeId === "string" && TYPES[sb.typeId]) ? sb.typeId : "generic",
        sb.tier === 3 ? 3 : sb.tier === 2 ? 2 : 1);
      if (Number.isFinite(sb.id)) inst.id = sb.id;
      inst.health = Math.min(100, Math.max(0, num(sb.health, 100)));
      inst.active = sb.active !== false;
      rec.cityId = inst.id;
      if (rec.file) {
        const ck = rec.file + "|" + rec.rot;
        let r = planCacheLocal.has(ck) ? planCacheLocal.get(ck)
          : await getRotatedPlan(rec.file, rec.rot).catch(() => null);
        planCacheLocal.set(ck, r);
        if (r) {
          const minY = r.minY ?? 0;
          const res = pasteSchematic(world, r,
            rec.x0 + Math.floor(r.W / 2), rec.z0 + Math.floor(r.L / 2), rec.y0 + minY,
            { clear: false });
          if (res && Number.isFinite(res.placed)) {
            rec.placed = res.placed;
            rec.labelBase = recordLabelBase(rec);
          }
        }
      }
      refreshRecordLabel(rec);
    }
    if (city.buildings.length > 0) {
      city.nextId = Math.max(city.nextId,
        ...city.buildings.map((b) => (Number.isFinite(b.id) ? b.id + 1 : 1)));
    }
    resetMapTransientState();
    mapReady = true;
    world.flushMeshes(scene, blockMat, cutoutMat, alphaMat, torchMat);
    camera.position.set(player.x, player.y + EYE, player.z);
    syncResidents();
    tutorialReset();
    checkTutorial(true);
    closePanels();
    setPaused(false);
  } catch (e) {
    console.error(e);
    showMsg("loadFail", { err: e.message || e });
    throw e;
  }
  refreshSaveInfo();
}

async function loadGame() {
  let parsed;
  let cloudSettings = null;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      // Локально пусто — пробуем облако (гость: сразу "нет сохранений").
      const cloud = await yg.cloudload(["citysave"]);
      if (cloud && cloud.citysave) {
        const payload = cloud.citysave;
        if (payload.kind === "full" && payload.save) {
          parsed = parseSave(JSON.stringify(payload.save));
          cloudSettings = payload.settings || null;
        } else if (payload.kind === "city" && payload.city) {
          await applyCloudCity(payload.city);
          applyCloudSettings(payload.settings);
          applyI18n();
          refreshSaveInfo();
          showMsg("loaded", { day: city.day, n: city.buildings.length });
          return;
        } else if (payload.kind === "profile" && payload.profile) {
          applyCloudProfile(payload.profile);
          applyCloudSettings(payload.settings);
          applyI18n();
          return;
        }
      }
      if (!parsed) {
        showMsg("noSavesLoad");
        return;
      }
    } else {
      parsed = parseSave(raw);
    }
  } catch (e) {
    showMsg("loadErr", { err: e.message || e });
    return;
  }
  try {
    world.clear();
    clearBuildings();
    nextBuildingId = 1;
    city = newCityState();
    Object.assign(city, {
      money: parsed.city.money, population: parsed.city.population,
      food: parsed.city.food, energy: parsed.city.energy,
      water: parsed.city.water || 0, waste: parsed.city.waste || 0,
      happiness: parsed.city.happiness, pollution: parsed.city.pollution,
      day: parsed.city.day, nextId: 1, last: parsed.city.last,
      loans: Array.isArray(parsed.city.loans) ? parsed.city.loans : [],
      taxRate: Number.isFinite(parsed.city.taxRate) ? parsed.city.taxRate : TAX_PER_CAPITA,
      bizTax: Number.isFinite(parsed.city.bizTax) ? parsed.city.bizTax : TAX_PER_CAPITA,
      indTax: Number.isFinite(parsed.city.indTax) ? parsed.city.indTax : TAX_PER_CAPITA,
      milestones: Array.isArray(parsed.city.milestones) ? parsed.city.milestones : [],
    });
    for (const { key, cells } of parsed.chunks) {
      const [cx, cy, cz] = key.split(",").map(Number);
      for (const cell of cells) {
        const idx = cell[0], id = cell[1], s = cell[2] || 0;
        world.setBlock(
          cx * 16 + (idx % 16),
          cy * 16 + Math.floor(idx / 256),
          cz * 16 + (Math.floor(idx / 16) % 16),
          id, s
        );
      }
    }
    respawnPoint = { x: parsed.player.x, y: parsed.player.y, z: parsed.player.z };
    player.x = respawnPoint.x;
    player.y = respawnPoint.y;
    player.z = respawnPoint.z;
    player.vy = 0;
    player.grounded = false;
    world.ensureFlatAround(player.x, player.z);
    world.flushMeshes(scene, blockMat, cutoutMat, alphaMat, torchMat);
    for (const sb of parsed.city._buildings) {
      const rec = recordBuilding({
        name: sb.name, file: sb.file || "",
        x0: sb.x0, y0: sb.y0, z0: sb.z0, W: sb.W, H: sb.H, L: sb.L,
        rot: sb.rot || 0, placed: sb.placedBlocks,
      });
      const inst = registerRecord(rec, sb.typeId, sb.tier);
      inst.id = sb.id;
      inst.health = sb.health;
      inst.active = sb.active !== false;
      rec.cityId = sb.id;
      refreshRecordLabel(rec);
    }
    city.nextId = parsed.city.nextId;
    // До первого тика (≤5 с) панель показывала «Работы 0/…» — проставляем
    // работников из сохранённого отчёта, чтобы цифры были осмысленными.
    const er = parsed.city.last && Number.isFinite(parsed.city.last.employmentRatio)
      ? parsed.city.last.employmentRatio : 1;
    for (const b of city.buildings) {
      b.workers = b.stats.jobs > 0 ? Math.round(b.stats.jobs * (b.health / 100) * er) : 0;
    }
    resetMapTransientState();
    mapReady = true;
    camera.position.set(player.x, player.y + EYE, player.z);
    syncResidents();
    tutorialReset();
    checkTutorial(true); // загрузка: шаги отмечаем молча, без наград
    closePanels();
    applyCloudSettings(cloudSettings);
    applyI18n();
    showMsg("loaded", { day: city.day, n: city.buildings.length });
  } catch (e) {
    console.error(e);
    showMsg("loadFail", { err: e.message || e });
  }
  refreshSaveInfo();
}

// Живое обновление серости плиток без перестройки списка (скролл не прыгает).
function refreshTileFunds() {
  if (!schemesPanelEl.classList.contains("show")) return;
  for (const tile of schemeListEl.querySelectorAll(".tile")) {
    const cost = Number(tile.dataset.cost);
    tile.classList.toggle("poor", tile.dataset.cost !== "" && cost > city.money);
  }
}

function tickCity() {
  if (yg.advOpen) return; // реклама на экране: процесс стоит (п.4.7)
  tick(city);
  notePopulation();
  for (const rec of buildings) refreshRecordLabel(rec);
  syncResidents();
  refreshTileFunds();
  checkTutorial();
  if (city.last) {
    if (city.last.milestonesHit) {
      for (const mid of city.last.milestonesHit) {
        const def = MILESTONES.find((x) => x.id === mid);
        showMsg("milestone", { name: mstoneName(mid), sum: fmtMoney(def ? def.bonus : 0) });
        yg.submitPopulation(city.population);
      }
    }
    if (city.last.fires) {
      for (const f of city.last.fires) {
        showMsg("fire", { name: f.name, hp: Math.round(f.health) });
        const rec = buildings.find((b) => b.cityId === f.id);
        if (rec) refreshRecordLabel(rec);
      }
    }
  }
  // Банкротство: казна ниже лимита — пауза с шансом спастись кредитом.
  // Перед паузой — полноэкранная реклама (логическая пауза, game over).
  if (city.money < BANKRUPT_AT && !city.bankrupt) {
    city.bankrupt = true;
    const c = city;
    yg.playStop();
    yg.fullscreenAdv().then(() => {
      if (city === c && city.bankrupt && mapReady) {
        setPaused(true);
        showMsg("bankrupt", { money: fmtMoney(city.money) });
      }
    });
  } else if (city.money >= BANKRUPT_AT) {
    city.bankrupt = false;
  }
  if (cityPanelEl.classList.contains("show")) renderCity();
  cityWarnings();
}
armDayTimer(); // день тикает каждые 5с / скорость (кнопка 1× у денег)

// Тосты о кризисах ресурсов: не чаще раза в несколько игровых дней,
// иначе сообщение заедает остальные тосты.
const warnLastDay = {};
function cityWarnings() {
  const l = city.last;
  if (!l) return;
  const say = (key, msgKey, vars, every) => {
    if (city.day - (warnLastDay[key] ?? -Infinity) < every) return false;
    warnLastDay[key] = city.day;
    showMsg(msgKey, vars);
    return true;
  };
  if (l.hunger) { say("hunger", "warnHunger", null, 5); return; }
  if (Number.isFinite(l.foodNet) && l.foodNet < 0 && city.population > 0) {
    const days = Math.floor(city.food / Math.max(1, city.population * FOOD_PER_CAPITA));
    if (days <= 20 && say("food", "warnFoodLow", { days }, 10)) return;
  }
  if (l.bankrupts > 0 && say("bankrupt", "warnBankrupt", { n: l.bankrupts }, 10)) return;
  if (city.energy <= 0 && say("energy", "warnNoEnergy", null, 10)) return;
  if (city.water <= 0) say("water", "warnNoWater", null, 10);
}

// ---------- визуальные жители: кружочки, не источник истины ----------
let residents = [];
let resInstances = [];
let resBase = null;
let showResidents = true;
let residentPoolsCache = { home: [], work: [], shop: [], park: [] };

function residentPools() {
  const pools = { home: [], work: [], shop: [], park: [] };
  for (const b of city.buildings) {
    if (b.health <= 0) continue;
    const p = { x: b.x0 + b.W / 2, y: b.y0 + 0.9, z: b.z0 + b.L / 2 };
    if (b.stats.housing > 0) pools.home.push(p);
    if (b.stats.jobs > 0) pools.work.push(p);
    if (b.stats.foodProd > 0 || b.typeId === "shop") pools.shop.push(p);
    if (b.typeId === "park" || b.typeId === "entertainment") pools.park.push(p);
  }
  return pools;
}

function ensureResidentMeshes(n) {
  if (!resBase) {
    resBase = BABYLON.MeshBuilder.CreateSphere("resident", { diameter: 0.45 }, scene);
    const m = new BABYLON.StandardMaterial("residentMat", scene);
    m.diffuseColor = new BABYLON.Color3(1, 0.85, 0.3);
    m.emissiveColor = new BABYLON.Color3(0.9, 0.7, 0.2);
    m.disableLighting = true;
    resBase.material = m;
    resBase.position.set(0, -100, 0);
    resBase.freezeWorldMatrix();
    resBase.isPickable = false;
    resBase.alwaysSelectAsActiveMesh = true;
  }
  while (resInstances.length < n) {
    const inst = resBase.createInstance("res" + resInstances.length);
    inst.isPickable = false;
    inst.alwaysSelectAsActiveMesh = true;
    resInstances.push(inst);
  }
  for (let i = 0; i < resInstances.length; i++) {
    resInstances[i].isVisible = showResidents && i < n;
  }
}

function syncResidents() {
  const want = showResidents ? desiredAgents(city.population) : 0;
  residentPoolsCache = residentPools();
  while (residents.length < want) {
    const h = residentPoolsCache.home.length > 0
      ? residentPoolsCache.home[residents.length % residentPoolsCache.home.length]
      : { x: player.x, y: player.y + 1, z: player.z };
    const a = createResident("r" + residents.length, h.x, h.y, h.z);
    assignTarget(a, residentPoolsCache);
    residents.push(a);
  }
  if (residents.length > want) residents.length = want;
  ensureResidentMeshes(residents.length);
}

function stepResidentMeshes(dt) {
  if (residents.length === 0) return;
  stepResidents(residents, residentPoolsCache, dt);
  for (let i = 0; i < residents.length; i++) {
    resInstances[i].position.set(residents[i].x, residents[i].y, residents[i].z);
  }
}

// Проекция инфо-меток над постройками (только в просмотре).
// Project умножает на размеры переданного viewport, а camera.viewport
// нормализован (0..1) — поэтому проецируем в пиксельный viewport.
const projV = new BABYLON.Vector3();
const pixelViewport = new BABYLON.Viewport(0, 0, 1, 1);
function updateBuildingLabels() {
  if (!labelsOn || !mapReady) {
    if (!labelsOn) for (const b of buildings) b.label.style.display = "none";
    return;
  }
  const w = engine.getRenderWidth();
  const h = engine.getRenderHeight();
  pixelViewport.width = w;
  pixelViewport.height = h;
  for (const b of buildings) {
    projV.set(b.x0 + b.W / 2, b.y0 + b.H + 0.8, b.z0 + b.L / 2);
    const p = BABYLON.Vector3.Project(projV, BABYLON.Matrix.Identity(), scene.getTransformMatrix(), pixelViewport);
    if (p.z > 1 || p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
      b.label.style.display = "none";
      continue;
    }
    b.label.style.display = "block";
    b.label.style.left = `${(p.x / w) * 100}%`;
    b.label.style.top = `${(p.y / h) * 100}%`;
  }
}

function closePanels() {
  pickerEl.classList.remove("show");
  schemesPanelEl.classList.remove("show", "dock-left");
  cityPanelEl.classList.remove("show", "dock-right");
  pauseMenuEl.classList.remove("show");
  commandMenuOpen = false;
  unpinCityPanel();
}

// Tab-меню: две панели одновременно — постройки слева, город справа.
let commandMenuOpen = false;
function openCommandMenu() {
  closePanels();
  setPaused(false);
  schemesPanelEl.classList.add("show", "dock-left");
  cityPanelEl.classList.add("show", "dock-right");
  commandMenuOpen = true;
  buildSchemeList();
  schemeListEl.scrollTop = schemeListScroll;
  updateBuildBar();
  renderCity();
  coachOnce("schemes", { text: t("coachSchemes"), target: "#schemeList" });
  tutorialGain("city"); // шаг «Открой панель города» — панель даёт TAB
  if (document.pointerLockElement) {
    unlockForPanel = true;
    document.exitPointerLock();
  }
}
function closeCommandMenu() {
  closePanels(); // снимает show, dock и флаг
}

// Пауза: останавливает физику, жителей и тик города, показывает меню.
// Esc в захвате отдаёт браузер (выход из lock) — меню открываем по факту
// потери захвата, если её не заказывали панели (флаг unlockForPanel).
let paused = false;
let unlockForPanel = false;

function setPaused(on) {
  paused = on;
  if (on) closePanels(); // пауза тоже ни с кем не делит экран
  pauseMenuEl.classList.toggle("show", on);
  if (on) refreshSaveInfo();
  if (on) {
    yg.playStop();
    updateAuthUI();
  } else {
    yg.playStart();
  }
  if (on && document.pointerLockElement) document.exitPointerLock();
  // Кадровый цикл на паузе стоит (if (paused) return), поэтому синкаем
  // оверлеи вручную — иначе хинты замирают на старом языке/видимости.
  updateHint();
  updateTabHint();
  updateMoneyBar();
  lockHintEl.classList.remove("show");
}

function resumeGame() {
  setPaused(false);
  const req = canvas.requestPointerLock?.();
  // Chrome запрещает захват сразу после выхода по Esc (~1.2 с): ловим отказ.
  if (req && req.catch) req.catch(() => showMsg("waitResume"));
}

function togglePicker() {
  // Панели взаимоисключающие: открываем одну — остальные и пауза закрыты.
  const willShow = !pickerEl.classList.contains("show");
  closePanels();
  setPaused(false);
  if (!willShow) return;
  pickerEl.classList.add("show");
  pickSearchEl.value = "";
  pickFilter.q = "";
  renderPicker();
  if (document.pointerLockElement) {
    unlockForPanel = true;
    document.exitPointerLock();
  }
}

function toggleSchemes() {
  const willShow = !schemesPanelEl.classList.contains("show");
  closePanels();
  setPaused(false);
  if (!willShow) {
    // B5: закрыли панель с активным призраком — сразу к строительству.
    if (previewPlan) {
      const req = canvas.requestPointerLock?.();
      if (req && req.catch) req.catch(() => {});
    }
    return;
  }
  schemesPanelEl.classList.add("show");
  buildSchemeList();
  schemeListEl.scrollTop = schemeListScroll;
  updateBuildBar();
  coachOnce("schemes", { text: t("coachSchemes"), target: "#schemeList" });
  if (document.pointerLockElement) {
    unlockForPanel = true;
    document.exitPointerLock();
  }
}

const pickSearchEl = document.getElementById("pickSearch");
// Иконки блоков — настоящие тайлы из атласа (side-текстура), а не заливка.
let atlasUrl = null;
function blockIconStyle(b) {
  if (!atlasUrl) {
    try {
      atlasUrl = atlas.getContext().canvas.toDataURL();
    } catch (err) {
      atlasUrl = "";
    }
  }
  const tile = b.tiles ? b.tiles.side : null;
  if (!atlasUrl || tile == null) return null;
  const px = 34; // размер иконки в меню
  const scale = px / (ATLAS_WIDTH / ATLAS_COLS);
  const col = tile % ATLAS_COLS;
  const row = Math.floor(tile / ATLAS_COLS);
  return (
    `background-image:url(${atlasUrl});` +
    `background-size:${ATLAS_COLS * px}px auto;` +
    `background-position:-${col * px}px -${row * px}px;` +
    `background-repeat:no-repeat;`
  );
}

const BLOCK_CAT_ORDER = ["build", "nature", "decor", "parts", "mech"];
const catLabel = (c) => (t("blockCats") && t("blockCats")[c]) || c;
const pickFilter = { q: "", cat: "all" };
const pickCatsEl = document.getElementById("pickCats");

function renderPickChips() {
  pickCatsEl.innerHTML = "";
  const total = BLOCKS.filter((b) => b).length - 1;
  const cats = ["all", ...BLOCK_CAT_ORDER.filter((c) =>
    BLOCKS.some((b, id) => id !== AIR && b && b.cat === c))];
  for (const c of cats) {
    const n = c === "all" ? total
      : BLOCKS.filter((b, id) => id !== AIR && b && b.cat === c).length;
    const chip = document.createElement("span");
    chip.className = "chip cat" + (pickFilter.cat === c ? " active" : "");
    chip.textContent = (c === "all" ? t("all") : catLabel(c)) + ` (${n})`;
    chip.addEventListener("click", () => {
      pickFilter.cat = c;
      renderPicker();
    });
    pickCatsEl.appendChild(chip);
  }
}

function renderPicker() {
  renderPickChips();
  const q = pickFilter.q;
  pickGridEl.innerHTML = "";
  BLOCKS.forEach((b, id) => {
    if (id === AIR) return;
    if (pickFilter.cat !== "all" && b.cat !== pickFilter.cat) return;
    if (q && !blockNameSearch(id).toLowerCase().includes(q)) return;
    const d = document.createElement("div");
    d.className = "pick";
    d.title = blockName(id);
    const icon = document.createElement("span");
    const css = blockIconStyle(b);
    if (css) {
      icon.className = "tx";
      icon.style.cssText = css;
    } else {
      icon.className = "sw";
      icon.style.background = b.color;
    }
    const nm = document.createElement("span");
    nm.className = "nm";
    nm.textContent = blockName(id);
    d.append(icon, nm);
    d.addEventListener("click", () => {
      creativeSlots[creativeSel] = id;
      updateHotbar();
    });
    pickGridEl.appendChild(d);
  });
}

function buildPicker() {
  renderPicker();
}
pickSearchEl.addEventListener("input", () => {
  pickFilter.q = (pickSearchEl.value || "").trim().toLowerCase();
  renderPicker();
});

// Фильтр по экономике: что даёт постройка городу (имена — из словаря).
const ECO_IDS = ["housing", "food", "water", "energy", "waste", "jobs", "happy", "safety"];
const ECO_TYPES = {
  housing: ["house", "apartment"],
  food: ["farm", "fishery", "shop"],
  water: ["waterplant"],
  energy: ["powerplant"],
  waste: ["landfill"],
  jobs: ["factory", "farm", "fishery", "shop", "office", "powerplant", "waterplant", "school", "hospital", "service", "entertainment", "police", "fire", "landfill"],
  happy: ["park", "entertainment", "school", "hospital", "service"],
  safety: ["police", "fire", "hospital"],
};
const ECO_DEFS = ECO_IDS.map((id) => ({ id, get name() { return t("eco")[id]; }, types: ECO_TYPES[id] }));
const ECO_OF_TYPE = {};
for (const e of ECO_DEFS) for (const tid of e.types) (ECO_OF_TYPE[tid] = ECO_OF_TYPE[tid] || []).push(e.id);

const indexFiles = new Set(schemesIndex.items.map((i) => i.file));
const extraSchemeItems = Object.keys(schemeUrlByFile)
  .filter((f) => !indexFiles.has(f) && /\.(schem|schematic|nbt)$/i.test(f))
  .map((f) => ({ file: f, name: f, category: "new", w: "?", h: "?", l: "?", blocks: "?", tags: [] }));
const allSchemeItems = [...schemesIndex.items, ...extraSchemeItems];
for (const it of allSchemeItems) {
  it._eco = ECO_OF_TYPE[resolveType(it)] || [];
}
const schemeFilter = { q: "", eco: "all", tags: new Set(), list: "all", sort: "default" };
let selectedSchemeFile = null;
// ---------- B9: избранное и недавние постройки (localStorage) ----------
const FAV_KEY = "babylon-scheme-fav-v1";
const RECENT_KEY = "babylon-scheme-recent-v1";
let schemeFavs = new Set();
let schemeRecent = [];
try {
  const f = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
  if (Array.isArray(f)) schemeFavs = new Set(f.filter((x) => typeof x === "string"));
  const r = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  if (Array.isArray(r)) schemeRecent = r.filter((x) => typeof x === "string").slice(0, 10);
} catch (e) { /* приватный режим — без персистентности */ }
function saveFavRecent() {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify([...schemeFavs]));
    localStorage.setItem(RECENT_KEY, JSON.stringify(schemeRecent));
  } catch (e) {}
}
function pushRecent(file) {
  if (!file) return;
  schemeRecent = [file, ...schemeRecent.filter((f) => f !== file)].slice(0, 10);
  saveFavRecent();
}
const schemeSearchEl = document.getElementById("schemeSearch");
const schemeEcoEl = document.getElementById("schemeEco");
const schemeTagsEl = document.getElementById("schemeTags");
const schemeCountEl = document.getElementById("schemeCount");

function schemeMatches(item) {
  if (schemeFilter.list === "fav" && !schemeFavs.has(item.file)) return false;
  if (schemeFilter.list === "recent" && !schemeRecent.includes(item.file)) return false;
  if (schemeFilter.eco !== "all" && !(item._eco || []).includes(schemeFilter.eco)) return false;
  for (const tag of schemeFilter.tags) {
    if (!item.tags.includes(tag)) return false;
  }
  const q = schemeFilter.q.trim().toLowerCase().replace(/^#+/, "");
  if (q && !(schemeNameSearch(item).toLowerCase().includes(q) ||
    item.tags.some((tg) => tg.includes(q) || tagNameSearch(tg).toLowerCase().includes(q)))) return false;
  return true;
}

function buildSchemeChips() {
  schemeEcoEl.innerHTML = "";
  const presentEco = new Set();
  for (const i of allSchemeItems) for (const e of i._eco || []) presentEco.add(e);
  const ecos = [{ id: "all", name: t("all") },
    ...ECO_DEFS.filter((e) => presentEco.has(e.id))];
  for (const e of ecos) {
    const n = e.id === "all" ? allSchemeItems.length
      : allSchemeItems.filter((i) => (i._eco || []).includes(e.id)).length;
    const chip = document.createElement("span");
    chip.className = "chip" + (schemeFilter.eco === e.id ? " active" : "");
    chip.textContent = e.name + ` (${n})`;
    chip.addEventListener("click", () => {
      schemeFilter.eco = e.id;
      buildSchemeChips();
      renderSchemeTiles();
    });
    schemeEcoEl.appendChild(chip);
  }
  schemeTagsEl.innerHTML = "";
  for (const tag of schemesIndex.tags) {
    const chip = document.createElement("span");
    chip.className = "chip" + (schemeFilter.tags.has(tag) ? " active" : "");
    chip.textContent = "#" + tagName(tag);
    chip.title = "#" + tag;
    chip.addEventListener("click", () => {
      if (schemeFilter.tags.has(tag)) schemeFilter.tags.delete(tag);
      else schemeFilter.tags.add(tag);
      buildSchemeChips();
      renderSchemeTiles();
    });
    schemeTagsEl.appendChild(chip);
  }
}

// ---------- виртуальный список построек ----------
// В DOM только видимое окно + overscan: 1160 тяжёлых плиток целиком не влезают.
// Пикер блоков (46 штук без картинок) виртуализации не требует.
const TILE_GAP = 8;
const TILE_MIN_W = 176;
const TILE_OVERSCAN_ROWS = 3;
let schemeShown = [];
let tileLayout = { cols: 1, tileW: 150, rowH: 260 };
const schemeSpacerEl = document.createElement("div");
schemeSpacerEl.id = "schemeSpacer";

function contentWidth() {
  const cs = getComputedStyle(schemeListEl);
  return Math.max(50, schemeListEl.clientWidth -
    parseFloat(cs.paddingLeft || 0) - parseFloat(cs.paddingRight || 0));
}

function layoutTiles() {
  // clientWidth включает паддинги — вычитаем, иначе плитки шире контента
  const w = contentWidth();
  const cols = Math.max(1, Math.floor((w + TILE_GAP) / (TILE_MIN_W + TILE_GAP)));
  const tileW = (w - (cols - 1) * TILE_GAP) / cols;
  // медиабокс aspect 232/176 + текстовый блок (~90px); точную высоту калибруем замером
  tileLayout = { cols, tileW, rowH: tileW * (176 / 232) + 72, w };
}

// Окно видимых плиток; rAF-троттлинг — скролл не душит рендер.
let tileWindowQueued = false;
function scheduleTileWindow() {
  if (tileWindowQueued) return;
  tileWindowQueued = true;
  requestAnimationFrame(() => {
    tileWindowQueued = false;
    if (schemesPanelEl.classList.contains("show")) renderTileWindow();
  });
}

function renderTileWindow(corrected) {
  const { cols, tileW, rowH } = tileLayout;
  const total = schemeShown.length;
  const rows = Math.ceil(total / cols);
  const step = rowH + TILE_GAP;
  schemeSpacerEl.style.height = (rows > 0 ? rows * rowH + (rows - 1) * TILE_GAP : 0) + "px";
  const st = schemeListEl.scrollTop;
  const vh = schemeListEl.clientHeight || 400;
  const r0 = Math.max(0, Math.floor(st / step) - TILE_OVERSCAN_ROWS);
  const r1 = Math.min(rows - 1, Math.ceil((st + vh) / step) + TILE_OVERSCAN_ROWS);
  schemeSpacerEl.innerHTML = "";
  for (let r = r0; r1 >= 0 && r <= r1; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      if (i >= total) break;
      const tile = createTile(schemeShown[i]);
      tile.style.width = tileW + "px";
      tile.style.left = (c * (tileW + TILE_GAP)) + "px";
      tile.style.top = (r * step) + "px";
      schemeSpacerEl.appendChild(tile);
    }
  }
  // Калибровка геометрии по факту:
  // 1) скроллбар отъел ширину после наполнения — перераскладка (один проход);
  // 2) высота строки по реальной плитке (шрифты/зум).
  if (!corrected) {
    if (Math.abs(contentWidth() - (tileLayout.w || 0)) > 1) {
      layoutTiles();
      renderTileWindow(true);
      return;
    }
    const first = schemeSpacerEl.querySelector(".tile");
    if (first) {
      const h = first.offsetHeight;
      if (h > 0 && Math.abs(h - tileLayout.rowH) > 2) {
        tileLayout.rowH = h;
        renderTileWindow(true);
      }
    }
  }
}

function renderSchemeTiles() {
  schemeShown = allSchemeItems.filter(schemeMatches);
  // Сортировка витрины (цены/жильё кэшируются — данные статичны).
  if (schemeFilter.sort !== "default") {
    const by = {
      cheap: (a, b) => (schemeQuoteCached(a)?.cost ?? Infinity) - (schemeQuoteCached(b)?.cost ?? Infinity),
      exp: (a, b) => (schemeQuoteCached(b)?.cost ?? -1) - (schemeQuoteCached(a)?.cost ?? -1),
      big: (a, b) => schemeBlocksNum(b) - schemeBlocksNum(a),
housing: (a, b) => (schemeQuoteCached(b)?.housing || 0) - (schemeQuoteCached(a)?.housing || 0),
      name: (a, b) => schemeName(a).localeCompare(schemeName(b), locale()),
    };
    const cmp = by[schemeFilter.sort] || null;
    if (cmp) schemeShown = [...schemeShown].sort(cmp);
  }
  schemeCountEl.textContent = t("ofCount", { a: schemeShown.length, b: allSchemeItems.length });
  schemeListEl.innerHTML = "";
  schemeListEl.appendChild(schemeSpacerEl);
  layoutTiles();
  renderTileWindow();
  schemeListScroll = schemeListEl.scrollTop;
}

// Кэш витринных чисел схемы (цена/жильё): статичны, считаем один раз.
const schemeQuoteCache = new Map();
function schemeQuoteCached(item) {
  let q = schemeQuoteCache.get(item.file);
  if (q === undefined) {
    q = null;
    const W = Number(item.w), H = Number(item.h), L = Number(item.l);
    if (Number.isFinite(W) && Number.isFinite(H) && Number.isFinite(L)) {
      const qq = schemeBuildCost(item, { W, H, L });
      if (qq) {
        const s = instStats(qq.typeId, { W, H, L }, qq.tier);
        q = { cost: qq.cost, housing: s.housing || 0 };
      }
    }
    schemeQuoteCache.set(item.file, q);
  }
  return q;
}
const schemeBlocksNum = (item) => {
  const b = Number(item.blocks);
  return Number.isFinite(b) ? b : -1;
};

// Одна плитка списка (создаётся только для видимого окна).
function createTile(item) {
    const tile = document.createElement("div");
    tile.className = "tile" + (selectedSchemeFile === item.file ? " selected" : "");
    // B9: звезда избранного (клик не выбирает схему).
    const fav = document.createElement("button");
    const isFav = schemeFavs.has(item.file);
    fav.className = "fav" + (isFav ? " on" : "");
    fav.textContent = isFav ? "★" : "☆";
    fav.title = t("toFav");
    fav.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (schemeFavs.has(item.file)) schemeFavs.delete(item.file);
      else schemeFavs.add(item.file);
      saveFavRecent();
      const on = schemeFavs.has(item.file);
      fav.classList.toggle("on", on);
      fav.textContent = on ? "★" : "☆";
      buildSchemeLists();
      if (schemeFilter.list === "fav") renderSchemeTiles();
    });
    tile.appendChild(fav);
    const base = item.file.replace(/\.(schem|schematic|nbt)$/i, "");
    const dispName = schemeName(item);
    if (schemeThumbByFile[base]) {
      // Видимое окно маленькое — грузим сразу, очередь не нужна.
      const img = document.createElement("img");
      img.alt = dispName;
      img.loading = "lazy";
      img.src = schemeThumbByFile[base];
      tile.appendChild(img);
    } else {
      // Заглушка той же высоты: все плитки uniform, сетка не пляшет.
      const ph = document.createElement("div");
      ph.className = "tileph";
      tile.appendChild(ph);
    }
    const nm = document.createElement("div");
    nm.className = "tn";
    nm.textContent = dispName;
    nm.title = getLang() === "en" ? schemeNameRu(item) : item.name;
    const dim = document.createElement("div");
    dim.className = "td";
    dim.textContent = `${item.w}×${item.h}×${item.l} · ${item.blocks}`;
    // Вместо тегов — цена и важные числа: тип, жильё, работы, еда, доход.
    const q = schemeBuildCost(item, { W: item.w, H: item.h, L: item.l });
    const info = document.createElement("div");
    info.className = "tt";
    if (q) {
      const tierMark = q.tier > 1 ? `${TIERS[q.tier].icon} ${tierName(q.tier)}` : null;
      const parts = [`$${q.cost}`, typeName(q.typeId)];
      if (tierMark) parts.push(tierMark);
      const W = Number(item.w), H = Number(item.h), L = Number(item.l);
      if (Number.isFinite(W) && Number.isFinite(H) && Number.isFinite(L)) {
        const s = instStats(q.typeId, { W, H, L }, q.tier);
        if (s.housing > 0) parts.push(`${t("tileHousing")} ${s.housing}`);
        if (s.jobs > 0) parts.push(`${t("tileJobs")} ${s.jobs}`);
        if (s.foodProd > 0) parts.push(`${t("tileFood")}${s.foodProd}`);
        if (s.energyProd > 0) parts.push(`${t("tileEnergy")}${s.energyProd}`);
        if (s.waterProd > 0) parts.push(`${t("tileWater")}${s.waterProd}`);
        if (s.wasteCap > 0) parts.push(`${t("tileWaste")}${s.wasteCap}`);
        if (s.income > 0) parts.push(`${t("tileIncome")}${s.income}`);
      }
      info.textContent = parts.join(" · ");
      tile.title = `${dispName} · ${item.w}×${item.h}×${item.l} · ${t("tileBlocks")}: ${item.blocks} · ` + parts.join(" · ");
    } else {
      tile.title = `${dispName} · ${item.w}×${item.h}×${item.l} · ${t("tileBlocks")}: ${item.blocks}`;
    }
    tile.append(nm, dim, info);
    tile.dataset.file = item.file;
    // Недоступные по деньгам — серые; подсветка живая (см. refreshTileFunds).
    tile.dataset.cost = q ? String(q.cost) : "";
    if (q && q.cost > city.money) tile.classList.add("poor");
    tile.addEventListener("click", () => {
      const url = schemeUrlByFile[item.file];
      if (!url) {
        showMsg("noFile");
        return;
      }
      const live = schemeBuildCost(item, { W: item.w, H: item.h, L: item.l });
      if (live && live.cost > city.money) {
        showMsg("needMoney", { need: fmtMoney(live.cost), have: fmtMoney(city.money) });
        return;
      }
      selectedSchemeFile = item.file;
      // B5: подсветка без полной перестройки — скролл и превью целы.
      for (const t2 of schemeSpacerEl.children) {
        t2.classList.toggle("selected", t2.dataset.file === item.file);
      }
      selectScheme(url, dispName);
    });
    return tile;
}

function buildSchemeList() {
  buildSchemeLists();
  buildSchemeChips();
  renderSchemeTiles();
}

// B9: вкладки Всё / Избранное / Недавние (со счётчиками).
const schemeListsEl = document.getElementById("schemeLists");
const LIST_DEFS = [
  { id: "all", get name() { return t("lists").all; } },
  { id: "fav", get name() { return t("lists").fav; } },
  { id: "recent", get name() { return t("lists").recent; } },
];
function listCount(id) {
  if (id === "fav") return allSchemeItems.filter((i) => schemeFavs.has(i.file)).length;
  if (id === "recent") return allSchemeItems.filter((i) => schemeRecent.includes(i.file)).length;
  return allSchemeItems.length;
}
function buildSchemeLists() {
  schemeListsEl.innerHTML = "";
  for (const l of LIST_DEFS) {
    const chip = document.createElement("span");
    chip.className = "chip" + (schemeFilter.list === l.id ? " active" : "");
    chip.textContent = `${l.name} (${listCount(l.id)})`;
    chip.addEventListener("click", () => {
      schemeFilter.list = l.id;
      buildSchemeLists();
      renderSchemeTiles();
    });
    schemeListsEl.appendChild(chip);
  }
}
// Скролл списка переживает перерисовки и закрытия панели.
let schemeListScroll = 0;
schemeListEl.addEventListener("scroll", () => {
  schemeListScroll = schemeListEl.scrollTop;
  scheduleTileWindow(); // виртуализация: подкатить видимое окно
});
// Ширина панели влияет на сетку (доки Tab-меню, ресайз окна).
window.addEventListener("resize", () => {
  if (!schemesPanelEl.classList.contains("show")) return;
  layoutTiles();
  renderTileWindow();
});

schemeSearchEl.addEventListener("input", () => {
  schemeFilter.q = schemeSearchEl.value;
  renderSchemeTiles();
});
const schemeSortEl = document.getElementById("schemeSort");
if (schemeSortEl) {
  schemeSortEl.addEventListener("change", () => {
    schemeFilter.sort = schemeSortEl.value;
    renderSchemeTiles();
  });
}

async function selectScheme(url, name) {
  showMsg("reading");
  try {
    let plan = planCache.get(url);
    if (!plan) {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const bytes = new Uint8Array(await response.arrayBuffer());
      plan = parseSchematicFile(bytes);
      planCache.set(url, plan);
    }
    if (!plan.blocks.length) {
      showMsg("noBlocks");
      return;
    }
    previewPlan = { plan, name, rot: 0, rotated: plan };
    ghostOff = { x: 0, y: 0, z: 0 };
    anchorBase = null;
    ghostFixed = false;
    rebuildGhost();
    // B5: панель остаётся открытой — варианты сравниваются без потери скролла.
    updateBuildBar();
    updateGhostBar();
    if (selectedSchemeFile) {
      pushRecent(selectedSchemeFile);
      buildSchemeLists();
      if (schemeFilter.list === "recent") renderSchemeTiles();
    }
    showMsg("selectedHint", { name: previewDispName(), dims: `${plan.W}×${plan.H}×${plan.L}` });
  } catch (err) {
    console.error(t("dbgSchemeRead"), err);
    showMsg("schemeErr", { err: err.message });
  }
}

// B5: полоса выбранной схемы — уйти к строительству, не теряя место в списке.
const schemeBuildBarEl = document.getElementById("schemeBuildBar");
function updateBuildBar() {
  if (!previewPlan) {
    schemeBuildBarEl.classList.remove("show");
    schemeBuildBarEl.innerHTML = "";
    return;
  }
  const r = previewPlan.rotated;
  const item = schemeMetaFor(selectedSchemeFile);
  const q = schemeBuildCost(item, { W: r.W, H: r.H, L: r.L });
  schemeBuildBarEl.innerHTML = "";
  const info = document.createElement("span");
  info.innerHTML = `<b>${previewDispName()}</b> · ${r.W}×${r.H}×${r.L}` +
    (q ? ` · ${fmtMoney(q.cost)}${q.tier > 1 ? ` · ${TIERS[q.tier].icon} ${tierName(q.tier)}` : ""}` : "");
  const go = document.createElement("button");
  go.textContent = t("toBuild");
  go.addEventListener("click", closeSchemesToBuild);
  schemeBuildBarEl.appendChild(info);
  schemeBuildBarEl.appendChild(go);
  schemeBuildBarEl.classList.add("show");
}
// Закрыть всё меню и сразу захватить курсор для стройки.
function closeSchemesToBuild() {
  closeCommandMenu();
  if (previewPlan) {
    coachOnce("build", { text: t("coachBuild"), target: "#ghostBar" });
    const req = canvas.requestPointerLock?.();
    if (req && req.catch) req.catch(() => showMsg("clickToLock"));
  }
}

function clearGhost() {
  if (ghostLines) {
    ghostLines.dispose();
    ghostLines = null;
  }
  if (ghostFill) {
    ghostFill.dispose();
    ghostFill = null;
  }
}

function rebuildGhost() {
  clearGhost();
  if (!previewPlan) return;
  const { W, H, L } = previewPlan.rotated;
  const v = (x, y, z) => new BABYLON.Vector3(x, y, z);
  const corners = [v(0, 0, 0), v(W, 0, 0), v(W, 0, L), v(0, 0, L), v(0, H, 0), v(W, H, 0), v(W, H, L), v(0, H, L)];
  const edges = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
  ghostLines = BABYLON.MeshBuilder.CreateLineSystem("schemeGhost", {
    lines: edges.map(([a, b]) => [corners[a], corners[b]]),
  }, scene);
  ghostLines.color = new BABYLON.Color3(0.35, 1, 0.45);
  ghostFill = BABYLON.MeshBuilder.CreateBox("schemeGhostFill", { width: W, height: H, depth: L }, scene);
  const gm = new BABYLON.StandardMaterial("ghostMat", scene);
  gm.diffuseColor = new BABYLON.Color3(0.3, 1, 0.4);
  gm.alpha = 0.08;
  gm.backFaceCulling = false;
  ghostFill.material = gm;
  ghostLines.isVisible = false;
  ghostFill.isVisible = false;
}

// B10: стек постановок в режиме построек — ПКМ отменяет вглубь по одной.
let placedStack = [];

function cancelPreview() {
  if (previewPlan) activatePending();
  previewPlan = null;
  previewAnchor = null;
  ghostOff = { x: 0, y: 0, z: 0 };
  ghostFixed = false;
  placedStack = [];
  clearGhost();
  updateBuildBar();
  updateGhostBar();
}

// Выход из режима построек: черновые здания оживают и входят в статистику.
function activatePending() {
  let n = 0;
  for (const b of city.buildings) {
    if (b.active === false) {
      b.active = true;
      n++;
    }
  }
  placedStack = [];
  for (const rec of buildings) refreshRecordLabel(rec);
  if (cityPanelEl.classList.contains("show")) renderCity();
  if (n > 0) showMsg("activated", { n });
}

// ПКМ в режиме построек: снести последнюю постановку целиком, вернуть деньги.
// Убираем только клетки, совпадающие с планом, — правки игрока не трогаем.
// Стек: отменяет вглубь по одной, в ghostBar видна глубина.
function undoLastPlaced() {
  if (!previewPlan) return;
  // B7: сначала снимаем фиксацию призрака, а не сносим постройку.
  if (ghostFixed) {
    ghostFixed = false;
    updateGhostBar();
    showMsg("unpinned");
    return;
  }
  const u = placedStack.pop();
  if (!u) {
    showMsg("nothingUndo");
    return;
  }
  let cleared = 0;
  for (const [x, y, z, id] of u.cells) {
    if (world.getBlock(x, y, z) === id && world.setBlock(x, y, z, AIR)) cleared++;
  }
  world.flushMeshes(scene, blockMat, cutoutMat, alphaMat, torchMat);
  const ri = buildings.findIndex((b) => b === u.rec);
  if (ri >= 0) buildings.splice(ri, 1);
  u.rec.lines.dispose();
  u.rec.fill.dispose();
  u.rec.label.remove();
  const ci = city.buildings.findIndex((b) => b.id === u.instId);
  if (ci >= 0) city.buildings.splice(ci, 1);
  if (u.cost > 0) city.money = Math.round((city.money + u.cost) * 100) / 100;
  applyBuildingVisibility();
  refreshTileFunds();
  updateGhostBar();
  if (cityPanelEl.classList.contains("show")) renderCity();
  const left = placedStack.length;
  showMsg("undone", {
    name: bldName(u.rec), n: cleared, sum: fmtMoney(u.cost),
    tail: left > 0 ? { key: "undoneLeft", vars: { left } } : "",
  });
}

// B8: выравнивание площадки под фундамент (клавиша F).
// Освобождаем объём здания, под ним добираем землю до 4 блоков вглубь.
const LEVEL_PRICE = 1; // $ за срезанный/досыпанный блок
function footprintBox() {
  if (!previewPlan || !previewAnchor) return null;
  const r = previewPlan.rotated;
  const minY = r.minY ?? previewPlan.plan.minY ?? 0;
  return {
    x0: previewAnchor.x - Math.floor(r.W / 2),
    y0: previewAnchor.y - minY,
    z0: previewAnchor.z - Math.floor(r.L / 2),
    W: r.W, H: r.H, L: r.L,
  };
}
// Превью: сколько блоков тронет выравнивание (0 — уже ровно).
function levelPreview() {
  const b = footprintBox();
  if (!b) return null;
  // Гигантов не считаем каждый кадр-клавишу — дорого; их ровняют вручную.
  if (b.W * b.L > 60000 || b.W * b.H * b.L > 500000) return { cut: 0, fill: 0, cells: 0, cost: 0, tooBig: true };
  let cut = 0, fill = 0;
  for (let x = b.x0; x < b.x0 + b.W; x++) {
    for (let z = b.z0; z < b.z0 + b.L; z++) {
      for (let y = b.y0; y < b.y0 + b.H; y++) {
        if (world.getBlock(x, y, z) !== AIR) cut++;
      }
      for (let d = 1; d <= 4; d++) {
        if (world.getBlock(x, b.y0 - d, z) === AIR) fill++;
        else break;
      }
    }
  }
  const cells = cut + fill;
  return { cut, fill, cells, cost: cells * LEVEL_PRICE };
}
function levelGround() {
  const b = footprintBox();
  const lv = levelPreview();
  if (!b || !lv) return;
  if (lv.tooBig) {
    showMsg("areaTooBig");
    return;
  }
  if (lv.cells === 0) {
    showMsg("areaFlat");
    return;
  }
  if (city.money < lv.cost) {
    showMsg("noMoneyLevel", { need: fmtMoney(lv.cost), have: fmtMoney(city.money) });
    return;
  }
  for (let x = b.x0; x < b.x0 + b.W; x++) {
    for (let z = b.z0; z < b.z0 + b.L; z++) {
      for (let y = b.y0; y < b.y0 + b.H; y++) {
        if (world.getBlock(x, y, z) !== AIR) world.setBlock(x, y, z, AIR);
      }
      for (let d = 1; d <= 4; d++) {
        if (world.getBlock(x, b.y0 - d, z) === AIR) world.setBlock(x, b.y0 - d, z, DIRT);
        else break;
      }
    }
  }
  charge(city, lv.cost);
  world.flushMeshes(scene, blockMat, cutoutMat, alphaMat, torchMat);
  refreshTileFunds();
  updateGhostBar();
  showMsg("leveled", { cut: lv.cut, fill: lv.fill, cost: fmtMoney(lv.cost) });
}

// B6: полоса призрака — цена и управление видны в мире, а не в hints.
const ghostBarEl = document.getElementById("ghostBar");
function updateGhostBar() {
  updateDraftBar(); // баннер черновиков гаснет и без призрака (Q/кнопка)
  if (!previewPlan) {
    ghostBarEl.classList.remove("show");
    return;
  }
  const r = previewPlan.rotated;
  const item = schemeMetaFor(selectedSchemeFile);
  const q = schemeBuildCost(item, { W: r.W, H: r.H, L: r.L });
  const lvl = levelPreview();
  const n = placedStack.length;
  ghostBarEl.innerHTML =
    `<b>${previewDispName()}</b> · ${r.W}×${r.H}×${r.L}` +
    (q ? ` · ${fmtMoney(q.cost)}${q.tier > 1 ? ` · ${TIERS[q.tier].icon} ${tierName(q.tier)}` : ""}` : "") +
    (n > 0 ? ` · ${t("placedCount", { n })}` : "") +
    (lvl && lvl.cells > 0 ? ` · <b>${t("levelBtn", { cost: fmtMoney(lvl.cost) })}</b>` : "") +
    (ghostFixed ? `<br>${t("ghostFixed")}` : `<br>${t("ghostFree2")}`);
  ghostBarEl.classList.add("show");
  updateDraftBar();
}

// Баннер черновиков: поставлены, но город их не видит — нужен Q.
// Висит всегда, пока есть черновики; кнопка работает при свободном курсоре,
// в захвате — клавиша Q.
const draftBarEl = document.getElementById("draftBar");
function updateDraftBar() {
  const n = city.buildings.filter((b) => b.active === false).length;
  if (!previewPlan || n === 0) {
    draftBarEl.classList.remove("show");
    draftBarEl.innerHTML = "";
    return;
  }
  draftBarEl.innerHTML = "";
  const info = document.createElement("span");
  info.innerHTML = t("drafts", { n });
  const go = document.createElement("button");
  go.textContent = t("applyQ");
  go.addEventListener("click", exitBuildMode);
  draftBarEl.appendChild(info);
  draftBarEl.appendChild(go);
  draftBarEl.classList.add("show");
}

// Выход из режима построек: черновики оживают и входят в статистику.
function exitBuildMode() {
  if (!previewPlan) return;
  const n = city.buildings.filter((b) => b.active === false).length;
  cancelPreview();
  if (n === 0) showMsg("buildModeOff");
}

function rotatePreview() {
  if (!previewPlan) return;
  previewPlan.rot = (previewPlan.rot + 1) % 4;
  previewPlan.rotated = rotatePlan(previewPlan.plan, previewPlan.rot);
  rebuildGhost();
  updateBuildBar();
  updateGhostBar();
  const r = previewPlan.rotated;
  showMsg("rotated", { name: previewDispName(), deg: previewPlan.rot * 90, dims: `${r.W}×${r.H}×${r.L}` });
}

function placePreview() {
  if (!previewAnchor) {
    showMsg("aimBlock");
    return;
  }
  try {
    const r = previewPlan.rotated;
    const minY = r.minY ?? previewPlan.plan.minY ?? 0;
    // Город: стройка стоит денег — проверяем ДО вставки блоков.
    const item = schemeMetaFor(selectedSchemeFile);
    const quote = schemeBuildCost(item, r);
    const typeId = quote ? quote.typeId : "generic";
    if (quote && city.money < quote.cost) {
      showMsg("needMoneyCity", { need: fmtMoney(quote.cost), have: fmtMoney(city.money) });
      return;
    }
    const res = pasteSchematic(world, r, previewAnchor.x, previewAnchor.z, previewAnchor.y, { clear: false });
    if (quote) charge(city, quote.cost);
    world.flushMeshes(scene, blockMat, cutoutMat, alphaMat, torchMat);
    // Рамка = фактические границы вставки (pasteSchematic центрирует так же).
    const rec = recordBuilding({
      name: previewPlan.name,
      file: selectedSchemeFile,
      x0: previewAnchor.x - Math.floor(r.W / 2),
      y0: previewAnchor.y - minY,
      z0: previewAnchor.z - Math.floor(r.L / 2),
      W: r.W, H: r.H, L: r.L,
      rot: previewPlan.rot,
      placed: res.placed,
    });
    const inst = registerRecord(rec, typeId, quote ? quote.tier : 1);
    // Черновая постройка: деньги списаны, но в статистику войдёт при выходе
    // из режима (Q). До тех пор её можно отменить ПКМ целиком.
    inst.active = false;
    refreshRecordLabel(rec);
    const ax0 = previewAnchor.x - Math.floor(r.W / 2);
    const az0 = previewAnchor.z - Math.floor(r.L / 2);
    const ay0 = previewAnchor.y - minY;
    placedStack.push({
      rec, instId: inst.id, cost: quote ? quote.cost : 0, name: previewPlan.name,
      cells: r.blocks.map(([x, y, z, id]) => [ax0 + x, ay0 + y, az0 + z, id]),
    });
    ghostFixed = false; // после постановки призрак снова следует за прицелом
    refreshTileFunds();
    updateGhostBar();
    checkTutorial();
    showMsg("placed", { n: res.placed, type: typeName(typeId), cost: fmtMoney(quote ? quote.cost : 0) });
  } catch (err) {
    console.error(t("dbgSchemePlace"), err);
    showMsg("placeErr", { err: err.message });
  }
}

viewBtn.addEventListener("click", () => setLabelsOn(!labelsOn));
framesBtn.addEventListener("click", () => setShowFrames(!showFrames));
blocksBtn.addEventListener("click", togglePicker);
buildPicker();

window.addEventListener("keydown", (e) => {
  // Tab — меню-командир: постройки слева + город справа.
  // В полях ввода Tab работает как обычно (навигация по фокусу).
  if (e.code === "Tab") {
    if (isTyping(e)) return;
    e.preventDefault();
    // TAB нажат — крупную подсказку в этом мире больше не показываем.
    if (!tabPressedWorld) {
      tabPressedWorld = true;
      updateTabHint();
    }
    if (document.pointerLockElement) {
      unlockForPanel = true;
      document.exitPointerLock();
      openCommandMenu();
    } else if (commandMenuOpen) {
      closeCommandMenu();
      resumeGame();
    } else {
      openCommandMenu();
    }
    return;
  }
  if (isTyping(e) && e.code !== "Escape") return;
  // B6: стрелки и PgUp/PgDn двигают призрак по сетке (шаг 1 блок).
  // Пока открыта панель построек — стрелки скроллят список, призрак не трогаем.
  if (previewPlan && !schemesPanelEl.classList.contains("show")) {
    const fx = rayDir.x, fz = rayDir.z;
    const fl = Math.hypot(fx, fz) || 1;
    const Fx = fx / fl, Fz = fz / fl;
    const Rx = -Fz, Rz = Fx;
    let moved = true;
    if (e.code === "ArrowUp") { ghostOff.x += Math.round(Fx); ghostOff.z += Math.round(Fz); }
    else if (e.code === "ArrowDown") { ghostOff.x -= Math.round(Fx); ghostOff.z -= Math.round(Fz); }
    else if (e.code === "ArrowLeft") { ghostOff.x -= Math.round(Rx); ghostOff.z -= Math.round(Rz); }
    else if (e.code === "ArrowRight") { ghostOff.x += Math.round(Rx); ghostOff.z += Math.round(Rz); }
    else if (e.code === "PageUp") ghostOff.y += 1;
    else if (e.code === "PageDown") ghostOff.y -= 1;
    else moved = false;
    if (moved) {
      e.preventDefault();
      updateGhostBar(); // цена выравнивания зависит от позиции
      return;
    }
  }
  // B8: F — выровнять площадку под призраком.
  if (e.code === "KeyF" && !e.repeat && previewPlan && !schemesPanelEl.classList.contains("show")) {
    levelGround();
    return;
  }
  if (e.code === "KeyV" && !e.repeat) {
    setLabelsOn(!labelsOn);
    return;
  }
  if (e.code === "KeyG" && !e.repeat) {
    setShowFrames(!showFrames);
    return;
  }
  if (e.code === "KeyQ" && !e.repeat) {
    // Выход из режима построек (в захвате Esc занят браузером).
    exitBuildMode();
    return;
  }
  if (e.code === "KeyP" && !e.repeat) {
    if (isTyping(e)) return;
    if (document.pointerLockElement) document.exitPointerLock();
    else if (paused) resumeGame();
    else setPaused(true);
    return;
  }
  if (e.code === "KeyE") {
    togglePicker();
  } else if (e.code === "KeyT" && schemesPanelEl.classList.contains("show")) {
    // Панели открывает только TAB; T здесь — закрыть их и уйти к строительству.
    toggleSchemes();
  } else if (e.code === "KeyR") {
    rotatePreview();
  } else if (e.code === "Escape" && !document.pointerLockElement) {
    if (paused) {
      resumeGame();
      return;
    }
    closePanels();
    if (previewPlan) {
      const n = city.buildings.filter((b) => b.active === false).length;
      cancelPreview();
      if (n === 0) showMsg("previewOff");
    }
  } else if (e.code === "Space" && !e.repeat) {
    const now = performance.now();
    if (now - lastSpaceTap < 300) {
      flying = !flying;
      player.vy = 0;
      showMsg(flying ? "flyOn" : "flyOff");
    }
    lastSpaceTap = now;
  }
});

// ---------- pointer lock / mouse ----------
canvas.addEventListener("pointerdown", (e) => {
  if (!document.pointerLockElement) {
    const req = canvas.requestPointerLock?.();
    if (req && req.catch) req.catch(() => {});
    return;
  }
  // Режим построек: ЛКМ — зафиксировать/поставить, ПКМ — открепить/отменить.
  if (previewPlan) {
    if (e.button === 0) {
      // B7: первый клик фиксирует позицию, второй ставит — мимо не кликнуть.
      if (!ghostFixed && previewAnchor) {
        ghostFixed = true;
        updateGhostBar();
        showMsg("fixedPos");
      } else {
        placePreview();
      }
    } else if (e.button === 2) undoLastPlaced();
    return;
  }
  if (e.button === 0) {
    lmbDownAt = performance.now();
    lmbFresh = true;
  }
  mouseDown[e.button] = true;
  if (e.button === 2) handlePlace();
});
window.addEventListener("pointerup", (e) => {
  mouseDown[e.button] = false;
  if (e.button === 0) lmbFresh = false;
});
document.addEventListener("pointerlockchange", () => {
  mouseDown = { 0: false, 2: false };
  lmbFresh = false;
  if (document.pointerLockElement === canvas) {
    // Курсор захвачен — вернулись в игру: паузу снимаем.
    // A2: планшетом остаётся только панель, открытая через C;
    // Tab-меню закрывается полностью, без виджета.
    const keepCity = cityPanelEl.classList.contains("show") && !commandMenuOpen;
    closePanels();
    paused = false;
    yg.playStart();
    if (keepCity) {
      cityPanelEl.classList.add("show");
      renderCity();
      pinCityPanel();
    }
  } else if (unlockForPanel) {
    // Выход из захвата заказали панели (E/T/C) — меню паузы не показываем.
    unlockForPanel = false;
    unpinCityPanel(); // панель снова интерактивная
  } else if (mapReady) {
    // Захват потерян сам (Esc, Alt+Tab) — это пауза.
    setPaused(true);
  }
});
document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("visibilitychange", () => {
  // Уход на другую вкладку останавливает процесс (разметка геймплея).
  // Возвращает игрок вручную (Continue/клик) — так надёжнее автовозврата.
  if (document.hidden && mapReady) setPaused(true);
});
// ---------- A1: индикатор захвата курсора ----------
// Прицел виден только в захвате; без захвата, паузы и панелей —
// подсказка «кликните по миру». Вызывается каждый кадр, дёшево.
const crosshairEl = document.getElementById("crosshair");
const lockHintEl = document.getElementById("lockHint");
const tabHintEl = document.getElementById("tabHint");
// Крупный TAB-хинт: поместный — новый мир показывает заново (если включено).
let tabPressedWorld = false;
function updateTabHint() {
  const show = mapReady && settings.tabHint && !tabPressedWorld && !paused && !anyPanelOpen();
  tabHintEl.classList.toggle("show", show);
}
let lastLocked = null;
function anyPanelOpen() {
  return pickerEl.classList.contains("show") || schemesPanelEl.classList.contains("show") ||
    cityPanelEl.classList.contains("show") || pauseMenuEl.classList.contains("show");
}
function syncLockUI() {
  const locked = document.pointerLockElement === canvas;
  if (locked !== lastLocked) {
    lastLocked = locked;
    crosshairEl.classList.toggle("free", !locked);
    // Потеря захвата без панелей и паузы (редкий случай — обычно это пауза):
    // подсказываем, что делать дальше.
    if (!locked && !paused && !anyPanelOpen() && mapReady) {
      showMsg("ghostFree");
    }
  }
  lockHintEl.classList.toggle("show", !locked && !paused && !anyPanelOpen() && mapReady && tabPressedWorld);
}
document.addEventListener("mousemove", (e) => {
  if (document.pointerLockElement !== canvas) return;
  const sens = 0.0021;
  camYaw += e.movementX * sens;
  camPitch += e.movementY * sens;
  camPitch = Math.max(-1.45, Math.min(1.45, camPitch));
});
// B6: колесо в захвате меняет высоту призрака (вне захвата — обычный скролл).
window.addEventListener("wheel", (e) => {
  if (!previewPlan || document.pointerLockElement !== canvas) return;
  if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
  e.preventDefault();
  ghostOff.y += e.deltaY < 0 ? 1 : -1;
  updateGhostBar();
}, { passive: false });

// ---------- targeting marker ----------
const outlineMat = new BABYLON.StandardMaterial("outlineMat", scene);
outlineMat.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
outlineMat.wireframe = true;
outlineMat.diffuseColor = new BABYLON.Color3(1, 0.5, 0.2);
const outline = BABYLON.MeshBuilder.CreateBox("targetOutline", { size: 1.02 }, scene);
outline.material = outlineMat;
outline.isVisible = false;

let lastHit = null;
// Один клик — один блок: свежее нажатие ломает сразу один, дальше при
// зажатой кнопке быстрое ломание включается после паузы 250 мс.
let lmbDownAt = 0;
let lmbFresh = false;

function breakOne(hit) {
  if (world.getBlock(hit.x, hit.y, hit.z) !== AIR) {
    world.setBlock(hit.x, hit.y, hit.z, AIR);
    world.flushMeshes(scene, blockMat, cutoutMat, alphaMat, torchMat);
    // Урон городу: сломанный блок бьёт по здоровью своей постройки.
    const rec = findRecordAt(hit.x, hit.y, hit.z);
    if (rec && rec.cityId) {
      const inst = damageAt(city, hit.x, hit.y, hit.z);
      if (inst) {
        refreshRecordLabel(rec);
        if (inst.health <= 0) {
          showMsg("destroyed", { name: bldName(inst) });
        }
      }
    }
  }
}

// ---------- interactions ----------
// Направление взгляда по горизонтали (1..4 как facing): для ориентации
// блоков без привязки к грани (ступени, изголовье кровати, крюк сверху).
function lookFacing() {
  if (Math.abs(rayDir.x) > Math.abs(rayDir.z)) return rayDir.x > 0 ? 1 : 2;
  return rayDir.z > 0 ? 3 : 4;
}

// Состояние для установки неполного блока по грани, в которую кликнули:
// факел/табличка/крюк крепятся к ней, плита кладётся вверх/вниз.
function placeData(id, hit) {
  const def = BLOCKS[id];
  if (!def) return 0;
  if (def.shape === "slab") return hit.ny === -1 ? SLAB_TOP : SLAB_BOTTOM;
  if (def.shape === "stairs") {
    // Подъём — к игроку: смотришь на восток, ступень поднимается на запад.
    const look = lookFacing();
    return look === 1 ? STAIR_NX : look === 2 ? STAIR_PX : look === 3 ? STAIR_NZ : STAIR_PZ;
  }
  if (def.shape === "button") {
    if (hit.ny === 1) return BUTTON_FLOOR;
    if (hit.ny === -1) return BUTTON_CEIL;
    if (hit.nx === 1) return 1;
    if (hit.nx === -1) return 2;
    if (hit.nz === 1) return 3;
    if (hit.nz === -1) return 4;
    return BUTTON_FLOOR;
  }
  if (def.shape === "trapdoor") {
    return hit.ny === -1 ? TRAP_TOP : TRAP_BOTTOM;
  }
  if (id === TORCH || id === REDSTONE_TORCH || id === TRIPWIRE_HOOK) {
    if (hit.nx === 1) return TORCH_PX;
    if (hit.nx === -1) return TORCH_NX;
    if (hit.nz === 1) return TORCH_PZ;
    if (hit.nz === -1) return TORCH_NZ;
    if (id === TRIPWIRE_HOOK) return lookFacing();
    return TORCH_FLOOR;
  }
  if (id === OAK_SIGN) {
    if (hit.nx === 1) return SIGN_PX;
    if (hit.nx === -1) return SIGN_NX;
    if (hit.nz === 1) return SIGN_PZ;
    if (hit.nz === -1) return SIGN_NZ;
    return SIGN_STANDING;
  }
  return 0;
}

function handlePlace() {
  const hit = lastHit;
  if (!hit) return;
  const id = creativeSlots[creativeSel];
  if (id == null) {
    showMsg("pickBlock");
    return;
  }
  const entry = { id, count: Infinity };
  const def = BLOCKS[entry.id];
  // Дабл-слэб как в майнкрафте: клик по верхней грани нижней плиты той же
  // породы собирает её в полный блок вместо установки нового.
  if (def && def.shape === "slab" && hit.ny === 1 &&
      world.getBlock(hit.x, hit.y, hit.z) === entry.id &&
      world.getState(hit.x, hit.y, hit.z) === SLAB_BOTTOM) {
    if (!world.setState(hit.x, hit.y, hit.z, SLAB_DOUBLE)) return;
    world.flushMeshes(scene, blockMat, cutoutMat, alphaMat, torchMat);
    updateHotbar();
    return;
  }
  // Переворот ступенек как в майнкрафте (у нас без шифта): клик по верхней
  // грани обычной ступеньки делает её перевёрнутой (half=top) и наоборот —
  // так делают угол между потолком и стеной.
  if (def && def.shape === "stairs") {
    const st = world.getState(hit.x, hit.y, hit.z);
    const flip = hit.ny === 1 && !(st & STAIR_TOP_BIT) ? st | STAIR_TOP_BIT :
      hit.ny === -1 && (st & STAIR_TOP_BIT) ? st - STAIR_TOP_BIT : 0;
    if (flip && world.getBlock(hit.x, hit.y, hit.z) === entry.id) {
      if (!world.setState(hit.x, hit.y, hit.z, flip)) return;
      world.flushMeshes(scene, blockMat, cutoutMat, alphaMat, torchMat);
      updateHotbar();
      return;
    }
  }
  const px = hit.x + hit.nx;
  const py = hit.y + hit.ny;
  const pz = hit.z + hit.nz;
  if (!isInsideWorldBounds(px, py, pz)) return;
  if (world.getBlock(px, py, pz) !== AIR) return;
  if (boxIntersectsPlayer(px, py, pz)) return;
  // Кровать как в майнкрафте занимает две клетки: ножка + изголовье дальше
  // от игрока. Предмет один — тратится один.
  if (entry.id === RED_BED) {
    const look = lookFacing();
    const hx = px + (look === 1 ? 1 : look === 2 ? -1 : 0);
    const hz = pz + (look === 3 ? 1 : look === 4 ? -1 : 0);
    if (!isInsideWorldBounds(hx, py, hz)) return;
    if (world.getBlock(hx, py, hz) !== AIR) return;
    if (boxIntersectsPlayer(hx, py, hz)) return;
    if (!world.setBlock(px, py, pz, entry.id, 0)) return;
    if (!world.setBlock(hx, py, hz, entry.id, 0)) {
      world.setBlock(px, py, pz, AIR);
      return;
    }
    world.flushMeshes(scene, blockMat, cutoutMat, alphaMat, torchMat);
    updateHotbar();
    return;
  }
  if (!world.setBlock(px, py, pz, entry.id, placeData(entry.id, hit))) return;
  // Поставленный факел засветится сам: setBlock пометил чанк грязным,
  // flushMeshes ниже перестроит меш уже с запечённым светом.
  world.flushMeshes(scene, blockMat, cutoutMat, alphaMat, torchMat);
  updateHotbar();
}

function boxIntersectsPlayer(x, y, z) {
  if (x + 1 <= player.x - HALF || x >= player.x + HALF) return false;
  if (z + 1 <= player.z - HALF || z >= player.z + HALF) return false;
  if (y + 1 <= player.y || y >= player.y + HEIGHT) return false;
  return true;
}

// ---------- voxel raycast (DDA) ----------
function raycast(ox, oy, oz, dx, dy, dz, maxD) {
  if (![ox, oy, oz, dx, dy, dz, maxD].every(Number.isFinite)) return null;
  let x = Math.floor(ox);
  let y = Math.floor(oy);
  let z = Math.floor(oz);
  const stepX = dx > 0 ? 1 : -1;
  const stepY = dy > 0 ? 1 : -1;
  const stepZ = dz > 0 ? 1 : -1;
  const tDX = dx !== 0 ? Math.abs(1 / dx) : Infinity;
  const tDY = dy !== 0 ? Math.abs(1 / dy) : Infinity;
  const tDZ = dz !== 0 ? Math.abs(1 / dz) : Infinity;
  let tX = dx !== 0 ? Math.abs((dx > 0 ? x + 1 - ox : ox - x)) * tDX : Infinity;
  let tY = dy !== 0 ? Math.abs((dy > 0 ? y + 1 - oy : oy - y)) * tDY : Infinity;
  let tZ = dz !== 0 ? Math.abs((dz > 0 ? z + 1 - oz : oz - z)) * tDZ : Infinity;
  let nx = 0;
  let ny = 0;
  let nz = 0;

  for (let i = 0; i < 512; i++) {
    if (Math.min(tX, tY, tZ) > maxD) return null;
    if (!isInsideWorldBounds(x, y, z)) return null;
    const id = world.getBlock(x, y, z);
    if (id !== AIR) return { x, y, z, nx, ny, nz, id };
    if (tX < tY && tX < tZ) {
      x += stepX; tX += tDX; nx = -stepX; ny = 0; nz = 0;
    } else if (tY < tZ) {
      y += stepY; tY += tDY; nx = 0; ny = -stepY; nz = 0;
    } else {
      z += stepZ; tZ += tDZ; nx = 0; ny = 0; nz = -stepZ;
    }
  }
  return null;
}

// ---------- physics (см. src/physics.js) ----------

// ---------- render loop ----------
const fwd = new BABYLON.Vector3();
const rgt = new BABYLON.Vector3();
const rayDir = new BABYLON.Vector3();
let genTimer = 0;
let lastKeptCx = NaN;
let lastKeptCz = NaN;

scene.registerBeforeRender(() => {
  // Physics waits until the starting world is committed.
  if (!mapReady) return;
  if (paused) return; // пауза: мир замер, рендер идёт
  const dt = Math.min(engine.getDeltaTime() / 1000, 0.05);
  // Полёт быстрее земли, а X в полёту даёт ×2 к полётной скорости.
  const speed = flying
    ? (keys.boost ? BOOST_SPEED * 2 : FLY_SPEED)
    : keys.boost ? BOOST_SPEED
    : keys.shift ? SPRINT_SPEED
    : WALK_SPEED;

  // Бесконечный плоский пол: догенерируем чанки травы вокруг игрока.
  genTimer += dt;
  if (genTimer >= 0.3) {
    genTimer = 0;
    world.ensureFlatAround(player.x, player.z);
  }
  // Автопол, до которого игрок уже не дойдёт, выкидываем из памяти. Дергаем
  // только при переходе через границу чанка: радиус пола заметно меньше
  // радиуса хранения, поэтому между переходами выкидывать всё равно нечего.
  const pccx = Math.floor(player.x / CHUNK);
  const pccz = Math.floor(player.z / CHUNK);
  if (pccx !== lastKeptCx || pccz !== lastKeptCz) {
    lastKeptCx = pccx;
    lastKeptCz = pccz;
    world.pruneAuto(player.x, player.z);
  }
  // Свежие чанки (пол, правки) превращаем в меши по несколько за кадр,
  // иначе сгенерированный пол виден только после ломания блока. Пол
  // генерируется кольцами от игрока, поэтому сначала мешается то, что видно.
  world.flushMeshes(scene, blockMat, cutoutMat, alphaMat, torchMat, 8);

  camera.rotation.set(camPitch, camYaw, 0);

  camera.getDirectionToRef(new BABYLON.Vector3(0, 0, 1), fwd);
  camera.getDirectionToRef(BABYLON.Vector3.RightReadOnly, rgt);
  fwd.y = 0;
  rgt.y = 0;
  fwd.normalize();
  rgt.normalize();

  let mx = 0;
  let mz = 0;
  if (keys.w) { mx += fwd.x; mz += fwd.z; }
  if (keys.s) { mx -= fwd.x; mz -= fwd.z; }
  if (keys.d) { mx += rgt.x; mz += rgt.z; }
  if (keys.a) { mx -= rgt.x; mz -= rgt.z; }
  const mlen = Math.hypot(mx, mz);
  if (mlen > 0) {
    mx /= mlen;
    mz /= mlen;
  }

  // Подшаги мельче бокса игрока (0.6): moveAxis проверяет только точку
  // назначения, поэтому на 44 бл/с при низком FPS можно проскочить стену.
  const stepDist = speed * dt;
  const substeps = Math.max(1, Math.ceil(stepDist / 0.5));
  const stepX = mx * stepDist / substeps, stepZ = mz * stepDist / substeps;
  for (let i = 0; i < substeps; i++) {
    player.x = moveAxis(player, world, "x", stepX);
    player.z = moveAxis(player, world, "z", stepZ);
  }

  if (flying) {
    // Полёт: гравитации нет, Space вверх, Shift вниз, столкновения остаются.
    let vy = 0;
    if (keys.jump) vy += FLY_SPEED;
    if (keys.shift) vy -= FLY_SPEED;
    player.y = moveAxis(player, world, "y", vy * dt);
    player.vy = 0;
    player.grounded = false;
  } else {
    updateGrounded(player, world);
    if (player.grounded && keys.jump) {
      player.vy = JUMP_SPEED;
      player.grounded = false;
    }
    player.vy -= GRAVITY * dt;
    const prevY = player.y;
    player.y = moveAxis(player, world, "y", player.vy * dt);
    if (player.vy > 0 && player.y < prevY) player.vy = 0;
    updateGrounded(player, world);
    if (player.grounded && player.vy <= 0) player.vy = 0;
  }

  // Ниже мира — респаун; вертикаль жёстко ограничена высотой мира.
  if (player.y < -20) respawnPlayer();
  clampPlayerToWorld(player, WORLD_H);

  camera.position.set(player.x, player.y + EYE, player.z);

  // ---- targeting ----
  camera.getDirectionToRef(new BABYLON.Vector3(0, 0, 1), rayDir);
  const locked = document.pointerLockElement === canvas;
  lastHit = raycast(camera.position.x, camera.position.y, camera.position.z, rayDir.x, rayDir.y, rayDir.z, REACH);

  outline.isVisible = false;
  if (locked && lastHit) {
    outline.position.set(lastHit.x + 0.5, lastHit.y + 0.5, lastHit.z + 0.5);
    outline.isVisible = true;
  }

  // ---- ghost preview for schemes (long reach) ----
  if (previewPlan && ghostLines && ghostFill) {
    // B7: зафиксированный призрак за прицелом не следует (стрелки работают).
    if (!ghostFixed) {
      const far = raycast(camera.position.x, camera.position.y, camera.position.z, rayDir.x, rayDir.y, rayDir.z, 120);
      anchorBase = far ? { x: far.x + far.nx, y: far.y + far.ny, z: far.z + far.nz } : null;
    }
    if (anchorBase) {
      // B6: якорь = точка прицела + ручной сдвиг (стрелки/колесо).
      previewAnchor = {
        x: anchorBase.x + ghostOff.x,
        y: anchorBase.y + ghostOff.y,
        z: anchorBase.z + ghostOff.z,
      };
      const r = previewPlan.rotated;
      const x0 = previewAnchor.x - Math.floor(r.W / 2);
      const z0 = previewAnchor.z - Math.floor(r.L / 2);
      ghostLines.position.set(x0, previewAnchor.y, z0);
      ghostFill.position.set(x0 + r.W / 2, previewAnchor.y + r.H / 2, z0 + r.L / 2);
      ghostLines.isVisible = true;
      ghostFill.isVisible = true;
    } else {
      previewAnchor = null;
      ghostLines.isVisible = false;
      ghostFill.isVisible = false;
    }
  }

  // ---- breaking (LMB): один клик — один блок, зажатие — очередь ----
  // При активном предпросмотре схемы ЛКМ ставит её, а не ломает.
  // В просмотре ломание отключено.
  if (locked && lastHit && mouseDown[0] && !previewPlan) {
    if (lmbFresh) {
      lmbFresh = false;
      breakOne(lastHit);
    } else if (performance.now() - lmbDownAt > 250) {
      breakOne(lastHit);
    }
  }

  // ---- метки построек в просмотре ----
  updateBuildingLabels();
  // ---- A1: прицел/подсказка захвата, C12: контекстный хинт ----
  syncLockUI();
  updateHint();
  updateTabHint();
  updateMoneyBar();

  // ---- визуальные жители ----
  stepResidentMeshes(dt);
});

// ---------- стартовый мир: пустая плоская местность ----------
// Вокруг спавна догенерируется трава, игрок начинает на ней и строит сам
// (блоки — E, панели — TAB; V — просмотр рамок построек).
function initFlatWorld() {
  world.ensureFlatAround(0, 0);
  world.flushMeshes(scene, blockMat, cutoutMat, alphaMat, torchMat);
  respawnPoint = { x: 0.5, y: 2, z: 0.5 };
  player.x = respawnPoint.x;
  player.y = respawnPoint.y;
  player.z = respawnPoint.z;
  player.vy = 0;
  player.grounded = false;
  resetMapTransientState();
  mapReady = true;
  camera.position.set(player.x, player.y + EYE, player.z);
  // Стартовый мир: пустая плоская местность.
  showMsg("sandboxHint");
}

engine.runRenderLoop(() => scene.render());
initFlatWorld();
window.addEventListener("resize", () => engine.resize());

// ---------- Яндекс Игры: платформа ----------
// Гость играет без ограничений; вне платформы всё тихо отключено.
document.getElementById("authBtn").addEventListener("click", async () => {
  const ok = await yg.auth();
  updateAuthUI();
  if (ok) {
    // Вход успешен: подтягиваем облачный прогресс в фоне (не мешаем играть).
    try {
      const cloud = await yg.cloudload(["citysave"]);
      if (cloud && cloud.citysave && cloud.citysave.kind === "profile" && cloud.citysave.profile) {
        const p = cloud.citysave.profile;
        if (Number.isFinite(p.best) && p.best > ygBestPop) {
          ygBestPop = Math.floor(p.best);
          try { localStorage.setItem("babylon-best-pop", String(ygBestPop)); } catch (e) {}
        }
      }
    } catch (e) {}
    showMsg("ygHello", { name: yg.playerName || "…" });
  }
});
document.getElementById("mobileGo").addEventListener("click", () => {
  document.getElementById("mobileNote").classList.remove("show");
});
yg.onPause = () => {
  if (mapReady) setPaused(true);
};
yg.onResume = () => {
  // Возобновляет игрок вручную: у нас нет автопаузы по resume,
  // чтобы не ломать логику разметки (см. yg.js).
};
yg.init().then((ok) => {
  if (!ok) return;
  // Автоязык платформы (п.2.14): заявлены ru+en. Ручной выбор в паузе
  // (settings.lang) выше — приоритетнее, иначе он затирался бы здесь.
  if (settings.lang === "auto" && getLang() !== yg.lang) {
    setLang(yg.lang);
    applyI18n();
  }
  updateAuthUI();
  // Мобайл/планшет: игра десктопная (pointer lock) — честно предупреждаем.
  if (yg.device === "mobile" || yg.device === "tablet") {
    document.getElementById("mobileNote").classList.add("show");
  }
  // Мир уже готов (initFlatWorld выше): платформе можно играть.
  if (mapReady) yg.gameReady();
});

// Статичный HTML переводим сразу при старте. Без этого русские подписи в
// index.html (data-i18n) оставались бы на месте, пока язык не отличался бы от
// языка по умолчанию: applyI18n вызывался только из yg.init и только при смене
// языка. Здесь — в конце модуля, когда все let-объявления выше уже инициализированы.
applyI18n();