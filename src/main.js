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
  BUTTON_FLOOR,
  BUTTON_CEIL,
  TRAP_BOTTOM,
  TRAP_TOP,
} from "./blocks.js";
import { World, WORLD_H } from "./world.js";
import { HALF, HEIGHT, moveAxis, updateGrounded, clampPlayerToWorld } from "./physics.js";
import { parseSchematicFile, pasteSchematic, rotatePlan } from "./schematic.js";
import { TYPES, TIERS, resolveType, resolveTier, instStats } from "./city/buildingTypes.js";
import {
  newCityState, buildCostFor, addBuilding, charge,
  damageAt, repair, repairPrice, demolish, tick,
  MILESTONES, BANKRUPT_AT, TAX_PER_CAPITA,
} from "./city/city.js";
import {
  createResident, assignTarget, stepResidents, desiredAgents,
} from "./city/residents.js";
import {
  SAVE_VERSION, serializeWorld, serializeCity, parseSave,
} from "./city/save.js";
import { LOAN_OPTIONS, takeLoan, repayLoan } from "./city/city.js";
import schemesIndex from "../schemes/index.json";

// ---------- engine / scene ----------
const canvas = document.getElementById("scene");
const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true });

const scene = new BABYLON.Scene(engine);
scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
scene.fogDensity = 0.0085;
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
const msgEl = document.getElementById("msg");
let msgTimer = null;
const msgLogEl = document.getElementById("msgLog");
const msgLog = [];
function showMsg(text) {
  msgEl.textContent = text;
  msgEl.classList.add("show");
  if (msgTimer) clearTimeout(msgTimer);
  msgTimer = setTimeout(() => msgEl.classList.remove("show"), 3200);
  if (msgLog[0] !== text) {
    msgLog.unshift(text);
    if (msgLog.length > 5) msgLog.pop();
  }
  renderMsgLog();
}
function renderMsgLog() {
  msgLogEl.innerHTML = "";
  msgLog.forEach((t, i) => {
    const d = document.createElement("div");
    d.className = "logItem" + (i === 0 ? " fresh" : "");
    d.textContent = t;
    d.title = "Показать снова";
    d.addEventListener("click", () => showMsg(t));
    msgLogEl.appendChild(d);
  });
}

// ---------- C11: обучение-чеклист (первые шаги, +$200 за шаг) ----------
const TUT_KEY = "babylon-tutorial-done-v1";
const TUT_REWARD = 200;
const TUT_STEPS = [
  { id: "house", text: "Поставь жильё (T → Жильё)" },
  { id: "road", text: "Подведи дорогу (T → поиск #road)" },
  { id: "food", text: "Добавь еду (T → Еда)" },
  { id: "city", text: "Открой панель города (C)" },
  { id: "pop", text: "Дождись первого жителя" },
];
let tutorialDone = false;
let tutorialState = {};
try { tutorialDone = localStorage.getItem(TUT_KEY) === "1"; } catch (e) {}
function tutorialReset() {
  tutorialState = {};
  for (const s of TUT_STEPS) tutorialState[s.id] = false;
  renderTutorial();
}
function tutorialGain(id, silent) {
  if (tutorialDone || tutorialState[id]) return;
  tutorialState[id] = true;
  if (!silent) {
    city.money = Math.round((city.money + TUT_REWARD) * 100) / 100;
  }
  const n = TUT_STEPS.filter((s) => tutorialState[s.id]).length;
  if (n >= TUT_STEPS.length) {
    tutorialDone = true;
    try { localStorage.setItem(TUT_KEY, "1"); } catch (e) {}
  }
  renderTutorial();
  if (!silent) {
    showMsg(n >= TUT_STEPS.length
      ? "Обучение пройдено! Город твой 🏙️"
      : `Шаг выполнен (${n}/${TUT_STEPS.length}) +$${TUT_REWARD}`);
  }
}
// Проверка шагов по состоянию города; silent — для загрузки (без наград).
function checkTutorial(silent) {
  if (tutorialDone) return;
  const has = (types) => city.buildings.some((b) => b.active !== false && types.includes(b.typeId));
  if (has(["house", "apartment"])) tutorialGain("house", silent);
  if (has(["road"])) tutorialGain("road", silent);
  if (has(["farm", "fishery", "shop"])) tutorialGain("food", silent);
  if (city.population > 0) tutorialGain("pop", silent);
  renderTutorial();
}
function renderTutorial() {
  const el = document.getElementById("tutorial");
  if (tutorialDone || !mapReady) {
    el.classList.remove("show");
    return;
  }
  const n = TUT_STEPS.filter((s) => tutorialState[s.id]).length;
  el.innerHTML = `<h4>Первые шаги ${n}/${TUT_STEPS.length}</h4>` + TUT_STEPS.map((s) =>
    `<div class="${tutorialState[s.id] ? "done" : ""}">${tutorialState[s.id] ? "✓" : "·"} ${s.text}` +
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
    if (city.buildings.length === 0) hint = "T — выбрать постройку · E — блоки · ЛКМ — ломать";
    else if (city.last && city.last.roadless > 0) hint = `Зданий без дороги: ${city.last.roadless} — подведи дорогу (T)`;
    else if (city.population === 0) hint = "Жители приедут сами — нужны жильё, еда и счастье";
  }
  if (hint !== lastHint) {
    lastHint = hint;
    hudSubEl.textContent = hint;
    hudSubEl.classList.toggle("show", hint !== "");
  }
}

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
    throw new Error("в схеме нет безопасной поддерживаемой точки появления");
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
    showMsg("Дождитесь готовности мира");
    return;
  }
  try {
    const plan = parseSchematicFile(bytes);
    if (!plan || plan.blocks.length === 0) {
      showMsg("В схеме нет распознанных блоков");
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
    showMsg(`Схема «${fileName}» (${plan.format}) · поставлено ${res.placed} блоков · ${plan.W}×${plan.H}×${plan.L}`);
  } catch (err) {
    console.error("Не удалось загрузить схему", err);
    showMsg(`Ошибка загрузки схемы: ${err.message}`);
  }
}

function readSchematicFile(file) {
  if (!file) return;
  file.arrayBuffer()
    .then((buf) => importSchematicBytes(new Uint8Array(buf), file.name))
    .catch((error) => {
      console.error("Не удалось прочитать файл схемы", error);
      showMsg(`Ошибка чтения схемы: ${error.message || "неизвестная ошибка"}`);
    });
}

loadBtnEl.addEventListener("click", () => schemInputEl.click());

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

const keys = { w: false, a: false, s: false, d: false, shift: false, jump: false };

window.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "KeyW": keys.w = true; break;
    case "KeyA": keys.a = true; break;
    case "KeyS": keys.s = true; break;
    case "KeyD": keys.d = true; break;
    case "Space": keys.jump = true; break;
    case "ShiftLeft":
    case "ShiftRight": keys.shift = true; break;
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
const hudEl = document.getElementById("hud");
const defaultHud = hudEl.innerHTML;
const hotbarEl = document.getElementById("hotbar");
const selBlockEl = document.getElementById("selBlock");

function updateHotbar() {
  const marks = [];
  for (let i = 0; i < 9; i++) {
    const id = creativeSlots[i];
    if (id == null) {
      marks.push('<div class="hslot"></div>');
      continue;
    }
    const b = BLOCKS[id];
    const active = i === creativeSel ? ' active' : '';
    const css = blockIconStyle(b);
    const icon = css
      ? `<span class="tx" style="${css}"></span>`
      : `<span class="sw" style="background:${b.color}"></span>`;
    marks.push(
      `<div class="hslot${active}">${icon}` +
      `<span class="cnt">∞</span><span class="nm">${b.name}</span></div>`
    );
  }
  hotbarEl.innerHTML = marks.join("");
  const name = creativeSlots[creativeSel] != null ? BLOCKS[creativeSlots[creativeSel]].name : "—";
  if (selBlockEl.textContent !== name) selBlockEl.textContent = name;
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
  const t = e.target;
  return !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA");
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
const FLY_SPEED = 11;
// Все постройки из папки schemes (видны и ставятся в креативе).
// URL-карта строится из index.json, а не из import.meta.glob(...eager):
// glob давал отдельный модуль-запрос на каждый файл и каждое превью
// (~2400 запросов при старте) и ронял прокси/дев-сервер при росте библиотеки.
const schemeUrlByFile = {};
const schemeThumbByFile = {};
for (const it of schemesIndex.items) {
  schemeUrlByFile[it.file] = `/schemes/${it.file}`;
  if (it.thumb) schemeThumbByFile[it.file.replace(/\.(schem|schematic|nbt)$/i, "")] = `/schemes/${it.thumb}`;
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
  viewBtn.textContent = on ? "Подписи: вкл (V)" : "Подписи: выкл (V)";
  viewBtn.classList.toggle("active", on);
}

function setShowFrames(on) {
  showFrames = on;
  framesBtn.textContent = on ? "Рамки: вкл (G)" : "Рамки: выкл (G)";
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
  label.innerHTML =
    `<b style="color:${col.css}">▮ ${name}</b><br>` +
    `${W}×${H}×${L} · блоков: ${placed}<br>` +
    `x:${x0} y:${y0} z:${z0}` + (rot ? ` · ↻${rot * 90}°` : "");
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
  const t = TYPES[inst.typeId];
  const hp = Math.round(inst.health);
  const parts = [`состояние ${hp}%`];
  if (inst.active === false) parts.push("черновик");
  if (inst.tier > 1) parts.push(`${TIERS[inst.tier].icon} ${TIERS[inst.tier].name}`);
  if (inst.roadAccess === false && inst.active !== false) parts.push("без дороги!");
  if (inst.stats.housing > 0) parts.push(`жители ${inst.residents || 0}/${inst.stats.housing}`);
  if (inst.stats.jobs > 0) parts.push(`работники ${inst.workers}/${inst.stats.jobs}`);
  rec.label.innerHTML = rec.labelBase +
    `<br><span style="color:${rec.css}">[${t ? t.name : inst.typeId}] ` +
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

function toggleCity() {
  // A2: планшет — повторное C сворачивает панель (в т.ч. закреплённую).
  if (cityPanelEl.classList.contains("show")) {
    closePanels();
    return;
  }
  closePanels();
  setPaused(false);
  cityPanelEl.classList.add("show");
  renderCity();
  tutorialGain("city");
  if (document.pointerLockElement) {
    unlockForPanel = true;
    document.exitPointerLock();
  }
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
  return (r < 0 ? "−$" : "$") + Math.abs(r).toLocaleString("ru-RU");
}

function renderCity() {
  document.getElementById("cityDay").textContent = `· день ${city.day}`;
  const last = city.last;
  const workers = city.buildings.reduce((a, b) => a + b.workers, 0);
  const jobsCap = last ? last.jobsTotal : city.buildings.reduce((a, b) => a + b.stats.jobs, 0);
  const taxRate = Number.isFinite(city.taxRate) ? city.taxRate : TAX_PER_CAPITA;
  const nextMs = MILESTONES.find((m) => !(city.milestones || []).includes(m.id));
  const moneyNote = city.money < 0 ? ` <span class="cdim">банкротство при −$${Math.abs(BANKRUPT_AT).toLocaleString("ru-RU")}!</span>` : "";
  const rows = [
    ["Деньги", `${fmtMoney(city.money)} <span class="cdim">(${(last && last.income >= 0 ? "+" : "") + (last ? last.income : 0)} / −${last ? last.upkeep : 0} в день)</span>${moneyNote}`],
    ["День", `${city.day}`],
    ["Жители", `${city.population} <span class="cdim">(${last && last.migrants >= 0 ? "+" : ""}${last ? last.migrants : 0}/день)</span>`],
    ["Счастье", `${city.happiness}%`],
    ["Налоги", `<input type="range" id="taxRange" min="0" max="1" step="0.05" value="${taxRate}" style="width:130px;vertical-align:middle"> <b>$${taxRate.toFixed(2)}/жит</b> <span class="cdim">${taxRate > TAX_PER_CAPITA ? "давят на счастье" : taxRate < TAX_PER_CAPITA ? "радуют горожан" : "базовая ставка"}</span>`],
    ["Цель", nextMs ? `${nextMs.name} <span class="cdim">бонус $${nextMs.bonus.toLocaleString("ru-RU")}</span>` : "все вехи достигнуты!"],
    ["Жильё", `${city.population} / ${last ? last.housingCap : 0}`],
    ["Работы", `${workers} / ${jobsCap}`],
    ["Еда", `${city.food}`],
    ["Энергия", `${city.energy}`],
    ["Вода", `${city.water}${city.last && city.last.waterShortage ? " — нет воды!" : ""}`],
    ["Мусор", `${Math.round(city.waste)}`],
    ["Преступность", `${city.last ? city.last.crime : 0}`],
    ["Загрязнение", `${city.pollution}`],
    ["Без дорог", `${last ? last.roadless : 0} <span class="cdim">работают вполсилы</span>`],
    ["Жители на карте", `${residents.length} <button data-residents="">${showResidents ? "скрыть" : "показать"}</button>`],
  ];
  cityStatsEl.innerHTML = rows.map(([k, v]) =>
    `<div class="crow"><span>${k}</span><b>${v}</b></div>`).join("");
  renderLoans();

function renderLoans() {
  const el = document.getElementById("cityLoans");
  if (!el) return;
  const debt = city.loans.reduce((a, l) => a + l.owed, 0);
  let html = `<div class="crow"><span>Долг</span><b>${fmtMoney(debt)}</b></div><div class="cbtake">` +
    LOAN_OPTIONS.map((o) =>
      `<button data-loan-take="${o.id}"${city.loans.length >= 3 ? " disabled" : ""}>` +
      `$${o.amount.toLocaleString("ru-RU")} / ${o.days} дн / ${Math.round(o.rate * 100)}%</button>`
    ).join("") + `</div>`;
  city.loans.forEach((l, i) => {
    html += `<div class="cbsub"><span>$${Math.round(l.owed)} осталось · ${l.daysLeft} дн</span>` +
      `<button data-loan-repay="${i}"${city.money >= l.owed ? "" : " disabled"}>Погасить</button></div>`;
  });
  el.innerHTML = html;
}
  if (city.buildings.length === 0) {
    document.getElementById("cityBldTypes").innerHTML = "";
    document.getElementById("cityBldTags").innerHTML = "";
    cityBuildingsEl.innerHTML = `<div class="chint">Построек пока нет — поставьте схему (T). Каждая постройка стоит денег.</div>`;
    return;
  }
  // Фильтры по типам и тегам, встречающимся в городе (повторный клик — сброс).
  const typeCounts = {};
  for (const b of city.buildings) typeCounts[b.typeId] = (typeCounts[b.typeId] || 0) + 1;
  const tagCounts = {};
  for (const b of city.buildings) for (const t of instTags(b)) tagCounts[t] = (tagCounts[t] || 0) + 1;
  if (cityBldType !== "all" && !typeCounts[cityBldType]) cityBldType = "all";
  if (cityBldTag !== "all" && !tagCounts[cityBldTag]) cityBldTag = "all";
  const chip = (label, active, attr) =>
    `<span class="chip${active ? " active" : ""}" ${attr}>${label}</span>`;
  document.getElementById("cityBldTypes").innerHTML =
    chip(`Всё (${city.buildings.length})`, cityBldType === "all", `data-cbtype="all"`) +
    Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).map(([t, n]) =>
      chip(`${TYPES[t] ? TYPES[t].name : t} (${n})`, cityBldType === t, `data-cbtype="${t}"`)).join("");
  document.getElementById("cityBldTags").innerHTML =
    Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).map(([t, n]) =>
      chip(`#${t} (${n})`, cityBldTag === t, `data-cbtag="${t}"`)).join("");
  const sorters = {
    name: (a, b) => String(a.name).localeCompare(String(b.name), "ru"),
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
    cityBuildingsEl.innerHTML = `<div class="chint">Под фильтр ничего не попало — кликните по активному фильтру, чтобы сбросить.</div>`;
    return;
  }
  for (const inst of list) {
    const t = TYPES[inst.typeId];
    const cost = repairPrice(inst);
    const can = inst.health < 100 && city.money >= cost;
    const refund = Math.floor(inst.stats.buildCost * 0.5);
    const row = document.createElement("div");
    row.className = "cbld";
    const hp = Math.round(inst.health);
    const parts = [`состояние ${hp}%`];
    if (inst.active === false) parts.push("черновик");
    if (inst.tier > 1) parts.push(`${TIERS[inst.tier].icon} ${TIERS[inst.tier].name}`);
    if (inst.roadAccess === false && inst.active !== false) parts.push("без дороги!");
    if (inst.stats.housing > 0) parts.push(`жители ${inst.residents || 0}/${inst.stats.housing}`);
    if (inst.stats.jobs > 0) parts.push(`работники ${inst.workers}/${inst.stats.jobs}`);
    row.innerHTML =
      `<div class="cbhead"><b>${inst.name}</b><span class="cdim">${t ? t.name : inst.typeId}</span></div>` +
      `<div class="cbar"><div class="cfill" style="width:${hp}%;${hp < 35 ? "background:#ff5952;" : hp < 70 ? "background:#ffd54d;" : ""}"></div></div>` +
      `<div class="cbsub"><span>${parts.join(" · ")}</span>` +
      `<button data-repair="${inst.id}"${can ? "" : " disabled"}>Ремонт ${inst.health >= 100 ? "" : fmtMoney(cost)}</button>` +
      `<button data-demolish="${inst.id}" title="Снести, вернуть ${fmtMoney(refund)}">Снос +${fmtMoney(refund)}</button></div>`;
    cityBuildingsEl.appendChild(row);
  }
}

cityPanelEl.addEventListener("click", async (e) => {
  const tog = e.target.closest("[data-residents]");
  if (tog) {
    showResidents = !showResidents;
    syncResidents();
    renderCity();
    showMsg(showResidents ? "Жители: показаны" : "Жители: скрыты");
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
  const take = e.target.closest("[data-loan-take]");
  if (take && !take.disabled) {
    const res = takeLoan(city, Number(take.dataset.loanTake));
    showMsg(res.ok
      ? `Кредит: +$${res.owed} к возврату (${fmtMoney(city.money)} на руках)`
      : `Кредит: ${res.reason}`);
    refreshTileFunds();
    renderCity();
    return;
  }
  const pay = e.target.closest("[data-loan-repay]");
  if (pay && !pay.disabled) {
    const res = repayLoan(city, Number(pay.dataset.loanRepay));
    showMsg(res.ok ? `Погашено досрочно за ${fmtMoney(res.cost)}` : "Не хватает денег");
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
      showMsg(`Отремонтировано за ${fmtMoney(res.cost)}` +
        (restored > 0 ? ` · блоков восстановлено: ${restored}` : ""));
    } else {
      showMsg("Не хватает денег на ремонт");
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

// Слайдер налогов (событие change — срабатывает при отпускании, перерисовка не мешает).
cityPanelEl.addEventListener("change", (e) => {
  if (e.target && e.target.id === "taxRange") {
    const v = Math.min(1, Math.max(0, Number(e.target.value)));
    city.taxRate = Math.round(v * 100) / 100;
    showMsg(`Налоги: $${city.taxRate.toFixed(2)} с жителя в день`);
    renderCity();
  }
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
    console.error("План для операции", err);
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
  if (!window.confirm(`Снести «${inst.name}»? Возврат ${fmtMoney(refund)}.`)) return;
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
  const name = inst.name;
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
  showMsg(`Снесено: «${name}» · убрано ${cleared} блоков · возврат ${fmtMoney(refund)}`);
}

const pauseMenuEl = document.getElementById("pauseMenu");
document.getElementById("resumeBtn").addEventListener("click", resumeGame);
document.getElementById("saveBtn").addEventListener("click", saveGame);
document.getElementById("loadSaveBtn").addEventListener("click", loadGame);
document.getElementById("newGameBtn").addEventListener("click", () => {
  if (!window.confirm("Начать заново? Мир, постройки и город будут стёрты.")) return;
  resetGame();
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
  checkTutorial();
  closePanels();
  setPaused(false);
  refreshTileFunds();
  showMsg("Новая игра: пустой мир и $10 000");
}

// ---------- сохранение/загрузка (этап 24): город отдельно от блоков ----------
const SAVE_KEY = "babylon-city-save-v1";

function refreshSaveInfo() {
  const el = document.getElementById("saveInfo");
  if (!el) return;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      el.textContent = "Сохранений пока нет";
      return;
    }
    el.textContent = "Сохранение: " + new Date(JSON.parse(raw).savedAt || 0).toLocaleString("ru-RU");
  } catch (e) {
    el.textContent = "Сохранение битое";
  }
}

function saveGame() {
  try {
    const data = {
      v: SAVE_VERSION,
      savedAt: Date.now(),
      player: { x: player.x, y: player.y, z: player.z },
      city: serializeCity(city),
      chunks: serializeWorld(world),
    };
    const json = JSON.stringify(data);
    localStorage.setItem(SAVE_KEY, json);
    showMsg(`Сохранено: день ${city.day}, построек ${city.buildings.length}, ${(json.length / 1024).toFixed(0)} КБ`);
  } catch (e) {
    console.error(e);
    showMsg("Не сохранилось (переполнено?): " + (e.message || e));
  }
  refreshSaveInfo();
}

function loadGame() {
  let parsed;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      showMsg("Сохранений нет");
      return;
    }
    parsed = parseSave(raw);
  } catch (e) {
    showMsg("Загрузка: " + (e.message || e));
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
    resetMapTransientState();
    mapReady = true;
    camera.position.set(player.x, player.y + EYE, player.z);
    syncResidents();
    tutorialReset();
    checkTutorial(true); // загрузка: шаги отмечаем молча, без наград
    closePanels();
    showMsg(`Загружено: день ${city.day}, построек ${city.buildings.length}`);
  } catch (e) {
    console.error(e);
    showMsg("Загрузка не удалась: " + (e.message || e));
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
  tick(city);
  for (const rec of buildings) refreshRecordLabel(rec);
  syncResidents();
  refreshTileFunds();
  checkTutorial();
  if (city.last) {
    if (city.last.milestonesHit) {
      for (const m of city.last.milestonesHit) {
        const def = MILESTONES.find((x) => x.name === m);
        showMsg(`Веха: ${m}! Бонус ${fmtMoney(def ? def.bonus : 0)} в казну`);
      }
    }
    if (city.last.fires) {
      for (const f of city.last.fires) {
        showMsg(`Пожар: «${f.name}» горит! Состояние ${Math.round(f.health)}% — чините (C)`);
        const rec = buildings.find((b) => b.cityId === f.id);
        if (rec) refreshRecordLabel(rec);
      }
    }
  }
  // Банкротство: казна ниже лимита — пауза с шансом спастись кредитом.
  if (city.money < BANKRUPT_AT && !city.bankrupt) {
    city.bankrupt = true;
    setPaused(true);
    showMsg(`Банкротство! Казна ${fmtMoney(city.money)}. Возьмите кредит (C) или начните заново (P → Начать заново)`);
  } else if (city.money >= BANKRUPT_AT) {
    city.bankrupt = false;
  }
  if (cityPanelEl.classList.contains("show")) renderCity();
}
setInterval(() => { if (mapReady && !paused) tickCity(); }, 5000);

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
  if (on && document.pointerLockElement) document.exitPointerLock();
}

function resumeGame() {
  setPaused(false);
  const req = canvas.requestPointerLock?.();
  // Chrome запрещает захват сразу после выхода по Esc (~1.2 с): ловим отказ.
  if (req && req.catch) req.catch(() => showMsg("Подождите секунду и нажмите «Продолжить» ещё раз"));
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

const BLOCK_CAT_LABELS = {
  build: "Стройка",
  nature: "Природа",
  decor: "Декор",
  parts: "Частичные",
  mech: "Механизмы",
};
const BLOCK_CAT_ORDER = ["build", "nature", "decor", "parts", "mech"];
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
    chip.textContent = (c === "all" ? "Все" : BLOCK_CAT_LABELS[c] || c) + ` (${n})`;
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
    if (q && !(b.name || "").toLowerCase().includes(q)) return;
    const d = document.createElement("div");
    d.className = "pick";
    d.title = b.name;
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
    nm.textContent = b.name;
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

// Фильтр по экономике: что даёт постройка городу.
const ECO_DEFS = [
  { id: "housing", name: "Жильё", types: ["house", "apartment"] },
  { id: "food", name: "Еда", types: ["farm", "fishery", "shop"] },
  { id: "water", name: "Вода", types: ["waterplant"] },
  { id: "energy", name: "Электричество", types: ["powerplant"] },
  { id: "waste", name: "Мусор", types: ["landfill"] },
  { id: "jobs", name: "Работа", types: ["factory", "farm", "fishery", "shop", "office", "powerplant", "waterplant", "school", "hospital", "service", "entertainment", "police", "fire", "landfill"] },
  { id: "happy", name: "Счастье", types: ["park", "entertainment", "school", "hospital", "service"] },
  { id: "safety", name: "Защита", types: ["police", "fire", "hospital"] },
];
const ECO_OF_TYPE = {};
for (const e of ECO_DEFS) for (const t of e.types) (ECO_OF_TYPE[t] = ECO_OF_TYPE[t] || []).push(e.id);

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
  for (const t of schemeFilter.tags) {
    if (!item.tags.includes(t)) return false;
  }
  const q = schemeFilter.q.trim().toLowerCase().replace(/^#+/, "");
  if (q && !(item.name.toLowerCase().includes(q) || item.tags.some((t) => t.includes(q)))) return false;
  return true;
}

function buildSchemeChips() {
  schemeEcoEl.innerHTML = "";
  const presentEco = new Set();
  for (const i of allSchemeItems) for (const e of i._eco || []) presentEco.add(e);
  const ecos = [{ id: "all", name: "Всё" },
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
  for (const t of schemesIndex.tags) {
    const chip = document.createElement("span");
    chip.className = "chip" + (schemeFilter.tags.has(t) ? " active" : "");
    chip.textContent = "#" + t;
    chip.addEventListener("click", () => {
      if (schemeFilter.tags.has(t)) schemeFilter.tags.delete(t);
      else schemeFilter.tags.add(t);
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
const TILE_MIN_W = 148;
const TILE_OVERSCAN_ROWS = 3;
let schemeShown = [];
let tileLayout = { cols: 1, tileW: 150, rowH: 260 };
const schemeSpacerEl = document.createElement("div");
schemeSpacerEl.id = "schemeSpacer";

function layoutTiles() {
  // clientWidth включает паддинги — вычитаем, иначе плитки шире контента
  const cs = getComputedStyle(schemeListEl);
  const w = Math.max(50, schemeListEl.clientWidth -
    parseFloat(cs.paddingLeft || 0) - parseFloat(cs.paddingRight || 0));
  const cols = Math.max(1, Math.floor((w + TILE_GAP) / (TILE_MIN_W + TILE_GAP)));
  const tileW = (w - (cols - 1) * TILE_GAP) / cols;
  // медиабокс aspect 232/176 + текстовый блок (~72px); точную высоту калибруем замером
  tileLayout = { cols, tileW, rowH: tileW * (176 / 232) + 72 };
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
  // Калибровка высоты по реальной плитке (шрифты/зум могут отличаться от оценки).
  if (!corrected) {
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
      name: (a, b) => String(a.name).localeCompare(String(b.name), "ru"),
    };
    const cmp = by[schemeFilter.sort] || null;
    if (cmp) schemeShown = [...schemeShown].sort(cmp);
  }
  schemeCountEl.textContent = `· ${schemeShown.length} из ${allSchemeItems.length}`;
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
    fav.title = "В избранное";
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
    if (schemeThumbByFile[base]) {
      // Видимое окно маленькое — грузим сразу, очередь не нужна.
      const img = document.createElement("img");
      img.alt = item.name;
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
    nm.textContent = item.name;
    nm.title = item.name;
    const dim = document.createElement("div");
    dim.className = "td";
    dim.textContent = `${item.w}×${item.h}×${item.l} · ${item.blocks}`;
    // Вместо тегов — цена и важные числа: тип, жильё, работы, еда, доход.
    const q = schemeBuildCost(item, { W: item.w, H: item.h, L: item.l });
    const t = q ? TYPES[q.typeId] : null;
    const info = document.createElement("div");
    info.className = "tt";
    if (t && q) {
      const tierMark = q.tier > 1 ? `${TIERS[q.tier].icon} ${TIERS[q.tier].name}` : null;
      const parts = [`$${q.cost}`, t.name];
      if (tierMark) parts.push(tierMark);
      const W = Number(item.w), H = Number(item.h), L = Number(item.l);
      if (Number.isFinite(W) && Number.isFinite(H) && Number.isFinite(L)) {
        const s = instStats(q.typeId, { W, H, L }, q.tier);
        if (s.housing > 0) parts.push(`жильё ${s.housing}`);
        if (s.jobs > 0) parts.push(`работы ${s.jobs}`);
        if (s.foodProd > 0) parts.push(`еда +${s.foodProd}`);
        if (s.energyProd > 0) parts.push(`энергия +${s.energyProd}`);
        if (s.waterProd > 0) parts.push(`вода +${s.waterProd}`);
        if (s.wasteCap > 0) parts.push(`мусор −${s.wasteCap}`);
        if (s.income > 0) parts.push(`доход $${s.income}`);
      }
      info.textContent = parts.join(" · ");
      tile.title = `${item.name} · ${item.w}×${item.h}×${item.l} · блоков: ${item.blocks} · ` + parts.join(" · ");
    } else {
      tile.title = `${item.name} · ${item.w}×${item.h}×${item.l} · блоков: ${item.blocks}`;
    }
    tile.append(nm, dim, info);
    tile.dataset.file = item.file;
    // Недоступные по деньгам — серые; подсветка живая (см. refreshTileFunds).
    tile.dataset.cost = q ? String(q.cost) : "";
    if (q && q.cost > city.money) tile.classList.add("poor");
    tile.addEventListener("click", () => {
      const url = schemeUrlByFile[item.file];
      if (!url) {
        showMsg("Файл не найден в сборке");
        return;
      }
      const live = schemeBuildCost(item, { W: item.w, H: item.h, L: item.l });
      if (live && live.cost > city.money) {
        showMsg(`Не хватает денег: нужно ${fmtMoney(live.cost)}, есть ${fmtMoney(city.money)}`);
        return;
      }
      selectedSchemeFile = item.file;
      // B5: подсветка без полной перестройки — скролл и превью целы.
      for (const t2 of schemeSpacerEl.children) {
        t2.classList.toggle("selected", t2.dataset.file === item.file);
      }
      selectScheme(url, item.name);
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
  { id: "all", name: "Всё" },
  { id: "fav", name: "⭐ Избранное" },
  { id: "recent", name: "🕘 Недавние" },
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
  showMsg("Читаю схему...");
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
      showMsg("В схеме нет распознанных блоков");
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
    showMsg(`${name}: ${plan.W}×${plan.H}×${plan.L} · T — к строительству · R — поворот · ЛКМ — поставить · ПКМ — отмена · Q — выйти`);
  } catch (err) {
    console.error("Не удалось прочитать схему", err);
    showMsg(`Ошибка схемы: ${err.message}`);
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
  info.innerHTML = `<b>${previewPlan.name}</b> · ${r.W}×${r.H}×${r.L}` +
    (q ? ` · ${fmtMoney(q.cost)}${q.tier > 1 ? ` · ${TIERS[q.tier].icon} ${TIERS[q.tier].name}` : ""}` : "");
  const go = document.createElement("button");
  go.textContent = "К строительству (T)";
  go.addEventListener("click", closeSchemesToBuild);
  schemeBuildBarEl.appendChild(info);
  schemeBuildBarEl.appendChild(go);
  schemeBuildBarEl.classList.add("show");
}
// Закрыть всё меню и сразу захватить курсор для стройки.
function closeSchemesToBuild() {
  closeCommandMenu();
  if (previewPlan) {
    const req = canvas.requestPointerLock?.();
    if (req && req.catch) req.catch(() => showMsg("Кликните по миру, чтобы захватить курсор"));
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
  if (n > 0) showMsg(`Постройки активированы: ${n} (уже влияют на город)`);
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
    showMsg("Позиция откреплена — призрак снова следует за прицелом");
    return;
  }
  const u = placedStack.pop();
  if (!u) {
    showMsg("Нечего отменять (Q — выйти из режима построек)");
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
  showMsg(`Отменено: «${u.name}» · убрано ${cleared} блоков · возврат ${fmtMoney(u.cost)}` +
    (left > 0 ? ` · осталось построек: ${left}` : ""));
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
    showMsg("Слишком большая площадь — ровняйте вручную");
    return;
  }
  if (lv.cells === 0) {
    showMsg("Площадка ровная — выравнивать нечего");
    return;
  }
  if (city.money < lv.cost) {
    showMsg(`Не хватает денег на выравнивание: нужно ${fmtMoney(lv.cost)}, есть ${fmtMoney(city.money)}`);
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
  showMsg(`Выровнено: срезано ${lv.cut}, досыпано ${lv.fill} · −${fmtMoney(lv.cost)}`);
}

// B6: полоса призрака — цена и управление видны в мире, а не в hints.
const ghostBarEl = document.getElementById("ghostBar");
function updateGhostBar() {
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
    `<b>${previewPlan.name}</b> · ${r.W}×${r.H}×${r.L}` +
    (q ? ` · ${fmtMoney(q.cost)}${q.tier > 1 ? ` · ${TIERS[q.tier].icon} ${TIERS[q.tier].name}` : ""}` : "") +
    (n > 0 ? ` · поставлено: ${n}` : "") +
    (lvl && lvl.cells > 0 ? ` · <b>F — выровнять (~${fmtMoney(lvl.cost)})</b>` : "") +
    (ghostFixed
      ? `<br>позиция зафиксирована · ЛКМ — поставить · ПКМ — открепить · Q — выйти`
      : `<br>←→↑↓ — двигать · PgUp/PgDn или колесо — высота · R — поворот · ЛКМ — зафиксировать · ПКМ — отмена · Q — выйти`);
  ghostBarEl.classList.add("show");
}

function rotatePreview() {
  if (!previewPlan) return;
  previewPlan.rot = (previewPlan.rot + 1) % 4;
  previewPlan.rotated = rotatePlan(previewPlan.plan, previewPlan.rot);
  rebuildGhost();
  updateBuildBar();
  updateGhostBar();
  const r = previewPlan.rotated;
  showMsg(`${previewPlan.name}: поворот ${previewPlan.rot * 90}° · ${r.W}×${r.H}×${r.L} · ЛКМ — поставить · ПКМ — отмена · Q — выйти`);
}

function placePreview() {
  if (!previewAnchor) {
    showMsg("Наведи прицел на блок");
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
      showMsg(`Не хватает денег: нужно ${fmtMoney(quote.cost)}, есть ${fmtMoney(city.money)} (город — C)`);
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
    const t = TYPES[typeId];
    refreshTileFunds();
    updateGhostBar();
    checkTutorial();
    showMsg(`Поставлено ${res.placed} блоков · ${t ? t.name : typeId} · −${fmtMoney(quote ? quote.cost : 0)} · черновик (ПКМ — отмена, Q — выйти)`);
  } catch (err) {
    console.error("Не удалось поставить схему", err);
    showMsg(`Ошибка: ${err.message}`);
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
    // TAB нажат — крупную подсказку больше не показываем.
    if (!tabEverPressed) {
      tabEverPressed = true;
      try { localStorage.setItem("babylon-tab-hint-v1", "1"); } catch (err) {}
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
    if (previewPlan) {
      const n = city.buildings.filter((b) => b.active === false).length;
      cancelPreview();
      if (n === 0) showMsg("Режим построек выключен");
    }
    return;
  }
  if (e.code === "KeyC" && !e.repeat) {
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
    toggleCity();
    return;
  }
  if (e.code === "KeyP" && !e.repeat) {
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
    if (document.pointerLockElement) document.exitPointerLock();
    else if (paused) resumeGame();
    else setPaused(true);
    return;
  }
  if (e.code === "KeyE") {
    togglePicker();
  } else if (e.code === "KeyT") {
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
      if (n === 0) showMsg("Предпросмотр отменён");
    }
  } else if (e.code === "Space" && !e.repeat) {
    const now = performance.now();
    if (now - lastSpaceTap < 300) {
      flying = !flying;
      player.vy = 0;
      showMsg(flying ? "Полёт: вкл (Space вверх, Shift вниз)" : "Полёт: выкл");
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
        showMsg("Позиция зафиксирована: стрелки — подвинуть · ЛКМ — поставить · ПКМ — открепить");
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
    // A2: панель города остаётся планшетом-виджетом, остальные закрываем.
    const keepCity = cityPanelEl.classList.contains("show");
    closePanels();
    paused = false;
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
// ---------- A1: индикатор захвата курсора ----------
// Прицел виден только в захвате; без захвата, паузы и панелей —
// подсказка «кликните по миру». Вызывается каждый кадр, дёшево.
const crosshairEl = document.getElementById("crosshair");
const lockHintEl = document.getElementById("lockHint");
const tabHintEl = document.getElementById("tabHint");
// Крупный TAB-хинт: показываем, пока игрок ни разу не открыл меню.
// Закрыл меню, так и не нажав? Появится снова сам (условие то же).
let tabEverPressed = false;
try { tabEverPressed = localStorage.getItem("babylon-tab-hint-v1") === "1"; } catch (e) {}
function updateTabHint() {
  const show = mapReady && !tabEverPressed && !paused && !anyPanelOpen();
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
      showMsg("Курсор свободен — кликните по миру, чтобы играть");
    }
  }
  lockHintEl.classList.toggle("show", !locked && !paused && !anyPanelOpen() && mapReady && tabEverPressed);
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
          showMsg(`«${inst.name}» разрушено! Ремонт — в панели города (C)`);
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
    // Спуск — к игроку (ступени поднимаются от него).
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
    showMsg("Выбери блок: нажми E");
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

scene.registerBeforeRender(() => {
  // Physics waits until the starting world is committed.
  if (!mapReady) return;
  if (paused) return; // пауза: мир замер, рендер идёт
  const dt = Math.min(engine.getDeltaTime() / 1000, 0.05);
  const speed = flying ? FLY_SPEED : keys.shift ? SPRINT_SPEED : WALK_SPEED;

  // Бесконечный плоский пол: догенерируем чанки травы вокруг игрока.
  genTimer += dt;
  if (genTimer >= 0.3) {
    genTimer = 0;
    world.ensureFlatAround(player.x, player.z);
  }
  // Свежие чанки (пол, правки) превращаем в меши по несколько за кадр,
  // иначе сгенерированный пол виден только после ломания блока.
  world.flushMeshes(scene, blockMat, cutoutMat, alphaMat, torchMat, 3);

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

  player.x = moveAxis(player, world, "x", mx * speed * dt);
  player.z = moveAxis(player, world, "z", mz * speed * dt);

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

  // ---- визуальные жители ----
  stepResidentMeshes(dt);
});

// ---------- стартовый мир: пустая плоская местность ----------
// Вокруг спавна догенерируется трава, игрок начинает на ней и строит сам
// (блоки — E, постройки — T; V — просмотр рамок построек).
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
  showMsg("Песочница: E — блоки, T — постройки, V — просмотр");
}

engine.runRenderLoop(() => scene.render());
initFlatWorld();
window.addEventListener("resize", () => engine.resize());