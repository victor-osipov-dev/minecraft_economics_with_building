import * as BABYLON from "@babylonjs/core";
import { CustomMaterial } from "@babylonjs/materials/custom/customMaterial";
import {
  AIR,
  BLOCKS,
  TORCH,
  REDSTONE_TORCH,
  OAK_SIGN,
  ATLAS_COLS,
  ATLAS_ROWS,
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
const msgEl = document.getElementById("msg");
let msgTimer = null;
function showMsg(text) {
  msgEl.textContent = text;
  msgEl.classList.add("show");
  if (msgTimer) clearTimeout(msgTimer);
  msgTimer = setTimeout(() => msgEl.classList.remove("show"), 3200);
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
    recordBuilding({
      name: fileName,
      file: fileName,
      x0: cx - Math.floor(plan.W / 2),
      y0: 1 - (plan.minY ?? 0),
      z0: cz - Math.floor(plan.L / 2),
      W: plan.W, H: plan.H, L: plan.L,
      rot: 0,
      placed: res.placed,
    });
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
    marks.push(
      `<div class="hslot${active}"><span class="sw" style="background:${b.color}"></span>` +
      `<span class="cnt">∞</span><span class="nm">${b.name}</span></div>`
    );
  }
  hotbarEl.innerHTML = marks.join("");
  const name = creativeSlots[creativeSel] != null ? BLOCKS[creativeSlots[creativeSel]].name : "—";
  if (selBlockEl.textContent !== name) selBlockEl.textContent = name;
}

window.addEventListener("keydown", (e) => {
  const n = Number(e.code.replace("Digit", ""));
  if (n >= 1 && n <= 9) {
    creativeSel = n - 1;
    updateHotbar();
  }
});
updateHotbar();

// ---------- песочница: призрак и постановка схем ----------
let previewPlan = null; // { plan, name, rot, rotated }
let previewAnchor = null;
let ghostLines = null;
let ghostFill = null;
let lastSpaceTap = 0;
const planCache = new Map();
const FLY_SPEED = 11;
// Все постройки из папки schemes (видны и ставятся в креативе).
const schemeFiles = import.meta.glob(
  ["../schemes/*.schem", "../schemes/*.schematic", "../schemes/*.nbt"],
  { query: "?url", import: "default", eager: true }
);
const schemeThumbUrls = import.meta.glob("../schemes/thumbs/*.png", { query: "?url", import: "default", eager: true });
const schemeUrlByFile = {};
for (const [p, url] of Object.entries(schemeFiles)) {
  schemeUrlByFile[p.split("/").pop()] = url;
}
const schemeThumbByFile = {};
for (const [p, url] of Object.entries(schemeThumbUrls)) {
  schemeThumbByFile[p.split("/").pop().replace(/\.png$/i, "")] = url;
}

const viewBtn = document.getElementById("viewBtn");
const framesBtn = document.getElementById("framesBtn");
const blocksBtn = document.getElementById("blocksBtn");
const schemesBtn = document.getElementById("schemesBtn");
const pickerEl = document.getElementById("picker");
const pickGridEl = document.getElementById("pickGrid");
const schemesPanelEl = document.getElementById("schemesPanel");
const schemeListEl = document.getElementById("schemeList");
const labelsEl = document.getElementById("labels");

// ---------- режимы: песочница (стройка) и просмотр (рамки + инфо) ----------
let viewMode = false;
let showFrames = true;

function setViewMode(on) {
  viewMode = on;
  document.body.classList.toggle("view", on);
  viewBtn.textContent = on ? "Стройка (V)" : "Просмотр (V)";
  viewBtn.classList.toggle("active", on);
  if (on) {
    cancelPreview();
    closePanels();
  }
  applyBuildingVisibility();
  hudEl.innerHTML = on
    ? "Просмотр &middot; рамки построек с информацией &middot; V — вернуться к стройке"
    : defaultHud;
  showMsg(on ? "Просмотр: рамки и информация о постройках" : "Песочница: стройте что угодно");
}

function setShowFrames(on) {
  showFrames = on;
  framesBtn.textContent = on ? "Рамки: вкл" : "Рамки: выкл";
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
  // Рамки живут сами по себе (кнопка "Рамки"), от режима просмотра не зависят.
  // Метки с информацией — только в просмотре.
  for (const b of buildings) {
    b.lines.isVisible = showFrames;
    b.fill.isVisible = showFrames;
    if (!viewMode) b.label.style.display = "none";
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

// Проекция инфо-меток над постройками (только в просмотре).
// Project умножает на размеры переданного viewport, а camera.viewport
// нормализован (0..1) — поэтому проецируем в пиксельный viewport.
const projV = new BABYLON.Vector3();
const pixelViewport = new BABYLON.Viewport(0, 0, 1, 1);
function updateBuildingLabels() {
  if (!viewMode || !mapReady) {
    if (!viewMode) for (const b of buildings) b.label.style.display = "none";
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
  schemesPanelEl.classList.remove("show");
}

function togglePicker() {
  if (viewMode) setViewMode(false);
  schemesPanelEl.classList.remove("show");
  pickerEl.classList.toggle("show");
  if (pickerEl.classList.contains("show") && document.pointerLockElement) {
    document.exitPointerLock();
  }
}

function toggleSchemes() {
  if (viewMode) setViewMode(false);
  pickerEl.classList.remove("show");
  schemesPanelEl.classList.toggle("show");
  if (schemesPanelEl.classList.contains("show")) {
    buildSchemeList();
    if (document.pointerLockElement) document.exitPointerLock();
  }
}

function buildPicker() {
  pickGridEl.innerHTML = "";
  BLOCKS.forEach((b, id) => {
    if (id === AIR) return;
    const d = document.createElement("div");
    d.className = "pick";
    d.title = b.name;
    const sw = document.createElement("span");
    sw.className = "sw";
    sw.style.background = b.color;
    const nm = document.createElement("span");
    nm.textContent = b.name;
    d.append(sw, nm);
    d.addEventListener("click", () => {
      creativeSlots[creativeSel] = id;
      updateHotbar();
    });
    pickGridEl.appendChild(d);
  });
}

const CAT_LABELS = {
  residential: "Жилые",
  towers: "Башни",
  commercial: "Коммерция",
  public: "Общество",
  transport: "Транспорт",
  roads: "Дороги",
  intersections: "Перекрёстки",
  bridges: "Мосты",
  parks: "Парки",
  industrial: "Промзона",
  waterfront: "Набережная",
  decor: "Декор",
  vehicles: "Техника",
  new: "Новые",
};
const CAT_ORDER = ["residential", "towers", "commercial", "public", "transport", "roads", "intersections", "bridges", "parks", "industrial", "waterfront", "decor", "vehicles", "new"];
const indexFiles = new Set(schemesIndex.items.map((i) => i.file));
const extraSchemeItems = Object.keys(schemeUrlByFile)
  .filter((f) => !indexFiles.has(f) && /\.(schem|schematic|nbt)$/i.test(f))
  .map((f) => ({ file: f, name: f, category: "new", w: "?", h: "?", l: "?", blocks: "?", tags: [] }));
const allSchemeItems = [...schemesIndex.items, ...extraSchemeItems];
const schemeFilter = { q: "", cat: "all", tags: new Set() };
let selectedSchemeFile = null;
const schemeSearchEl = document.getElementById("schemeSearch");
const schemeCatsEl = document.getElementById("schemeCats");
const schemeTagsEl = document.getElementById("schemeTags");
const schemeCountEl = document.getElementById("schemeCount");

function schemeMatches(item) {
  if (schemeFilter.cat !== "all" && item.category !== schemeFilter.cat) return false;
  for (const t of schemeFilter.tags) {
    if (!item.tags.includes(t)) return false;
  }
  const q = schemeFilter.q.trim().toLowerCase().replace(/^#+/, "");
  if (q && !(item.name.toLowerCase().includes(q) || item.tags.some((t) => t.includes(q)))) return false;
  return true;
}

function buildSchemeChips() {
  schemeCatsEl.innerHTML = "";
  const present = new Set(allSchemeItems.map((i) => i.category));
  const cats = ["all", ...CAT_ORDER.filter((c) => present.has(c))];
  for (const c of cats) {
    const n = c === "all" ? allSchemeItems.length : allSchemeItems.filter((i) => i.category === c).length;
    const chip = document.createElement("span");
    chip.className = "chip cat" + (schemeFilter.cat === c ? " active" : "");
    chip.textContent = (c === "all" ? "Все" : CAT_LABELS[c] || c) + ` (${n})`;
    chip.addEventListener("click", () => {
      schemeFilter.cat = c;
      buildSchemeChips();
      renderSchemeTiles();
    });
    schemeCatsEl.appendChild(chip);
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

function renderSchemeTiles() {
  schemeListEl.innerHTML = "";
  const shown = allSchemeItems.filter(schemeMatches);
  schemeCountEl.textContent = `· ${shown.length} из ${allSchemeItems.length}`;
  for (const item of shown) {
    const tile = document.createElement("div");
    tile.className = "tile" + (selectedSchemeFile === item.file ? " selected" : "");
    const base = item.file.replace(/\.(schem|schematic|nbt)$/i, "");
    if (schemeThumbByFile[base]) {
      const img = document.createElement("img");
      img.loading = "lazy";
      img.alt = item.name;
      img.src = schemeThumbByFile[base];
      tile.appendChild(img);
    }
    const nm = document.createElement("div");
    nm.className = "tn";
    nm.textContent = item.name;
    nm.title = item.name;
    const dim = document.createElement("div");
    dim.className = "td";
    dim.textContent = `${item.w}×${item.h}×${item.l} · ${item.blocks}`;
    const tags = document.createElement("div");
    tags.className = "tt";
    tags.textContent = item.tags.slice(0, 3).map((t) => "#" + t).join(" ");
    tile.append(nm, dim, tags);
    tile.title = `${item.name} · ${item.w}×${item.h}×${item.l} · блоков: ${item.blocks}`;
    tile.addEventListener("click", () => {
      const url = schemeUrlByFile[item.file];
      if (!url) {
        showMsg("Файл не найден в сборке");
        return;
      }
      selectedSchemeFile = item.file;
      selectScheme(url, item.name);
      renderSchemeTiles();
    });
    schemeListEl.appendChild(tile);
  }
}

function buildSchemeList() {
  buildSchemeChips();
  renderSchemeTiles();
}

schemeSearchEl.addEventListener("input", () => {
  schemeFilter.q = schemeSearchEl.value;
  renderSchemeTiles();
});

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
    closePanels();
    rebuildGhost();
    showMsg(`${name}: ${plan.W}×${plan.H}×${plan.L} · R — поворот · ЛКМ — поставить · Esc — отмена`);
  } catch (err) {
    console.error("Не удалось прочитать схему", err);
    showMsg(`Ошибка схемы: ${err.message}`);
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

function cancelPreview() {
  previewPlan = null;
  previewAnchor = null;
  clearGhost();
}

function rotatePreview() {
  if (!previewPlan) return;
  previewPlan.rot = (previewPlan.rot + 1) % 4;
  previewPlan.rotated = rotatePlan(previewPlan.plan, previewPlan.rot);
  rebuildGhost();
  const r = previewPlan.rotated;
  showMsg(`${previewPlan.name}: поворот ${previewPlan.rot * 90}° · ${r.W}×${r.H}×${r.L} · ЛКМ — поставить`);
}

function placePreview() {
  if (!previewAnchor) {
    showMsg("Наведи прицел на блок");
    return;
  }
  try {
    const r = previewPlan.rotated;
    const minY = r.minY ?? previewPlan.plan.minY ?? 0;
    const res = pasteSchematic(world, r, previewAnchor.x, previewAnchor.z, previewAnchor.y, { clear: false });
    world.flushMeshes(scene, blockMat, cutoutMat, alphaMat, torchMat);
    // Рамка = фактические границы вставки (pasteSchematic центрирует так же).
    recordBuilding({
      name: previewPlan.name,
      file: selectedSchemeFile,
      x0: previewAnchor.x - Math.floor(r.W / 2),
      y0: previewAnchor.y - minY,
      z0: previewAnchor.z - Math.floor(r.L / 2),
      W: r.W, H: r.H, L: r.L,
      rot: previewPlan.rot,
      placed: res.placed,
    });
    showMsg(`Поставлено ${res.placed} блоков · рамка — в просмотре (V)`);
  } catch (err) {
    console.error("Не удалось поставить схему", err);
    showMsg(`Ошибка: ${err.message}`);
  }
}

viewBtn.addEventListener("click", () => setViewMode(!viewMode));
framesBtn.addEventListener("click", () => setShowFrames(!showFrames));
blocksBtn.addEventListener("click", togglePicker);
schemesBtn.addEventListener("click", toggleSchemes);
buildPicker();

window.addEventListener("keydown", (e) => {
  if (e.code === "Tab") {
    e.preventDefault();
    setViewMode(!viewMode);
    return;
  }
  if (e.code === "KeyV" && !e.repeat) {
    setViewMode(!viewMode);
    return;
  }
  if (viewMode) return;
  if (e.code === "KeyE") {
    togglePicker();
  } else if (e.code === "KeyT") {
    toggleSchemes();
  } else if (e.code === "KeyR") {
    rotatePreview();
  } else if (e.code === "Escape" && !document.pointerLockElement) {
    closePanels();
    if (previewPlan) {
      cancelPreview();
      showMsg("Предпросмотр отменён");
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
  if (viewMode) return; // в просмотре стройка отключена
  if (previewPlan) {
    if (e.button === 0) placePreview();
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
});
document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("mousemove", (e) => {
  if (document.pointerLockElement !== canvas) return;
  const sens = 0.0021;
  camYaw += e.movementX * sens;
  camPitch += e.movementY * sens;
  camPitch = Math.max(-1.45, Math.min(1.45, camPitch));
});

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
  if (!viewMode && previewPlan && ghostLines && ghostFill) {
    const far = raycast(camera.position.x, camera.position.y, camera.position.z, rayDir.x, rayDir.y, rayDir.z, 120);
    if (far) {
      previewAnchor = { x: far.x + far.nx, y: far.y + far.ny, z: far.z + far.nz };
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
  if (!viewMode && locked && lastHit && mouseDown[0] && !previewPlan) {
    if (lmbFresh) {
      lmbFresh = false;
      breakOne(lastHit);
    } else if (performance.now() - lmbDownAt > 250) {
      breakOne(lastHit);
    }
  }

  // ---- метки построек в просмотре ----
  updateBuildingLabels();
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