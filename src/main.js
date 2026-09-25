import * as BABYLON from "@babylonjs/core";
import { AIR, BLOCKS, createAtlas } from "./blocks.js";
import { World, WORLD_H } from "./world.js";
import { buildPrison, SPAWN } from "./prison.js";
import { Guard } from "./npcs.js";
import { parseSchematicFile, pasteSchematic } from "./schematic.js";

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
const world = new World();
const lights = buildPrison(world);
for (const l of lights) {
  const p = new BABYLON.PointLight(`lamp_${l.pos.join("_")}`, new BABYLON.Vector3(l.pos[0], l.pos[1], l.pos[2]), scene);
  p.diffuse = new BABYLON.Color3(1, 0.78, 0.55);
  p.intensity = 2.4;
  p.range = 16;
}

// ---------- block material ----------
const atlas = createAtlas(scene);
const blockMat = new BABYLON.StandardMaterial("blockMat", scene);
blockMat.diffuseTexture = atlas;
blockMat.useAlphaFromDiffuseTexture = true;
blockMat.transparencyMode = BABYLON.Material.MATERIAL_ALPHATEST;
blockMat.alphaCutOff = 0.5;
blockMat.specularColor = new BABYLON.Color3(0.04, 0.04, 0.04);
blockMat.backFaceCulling = false;

world.markAll();
world.flushMeshes(scene, blockMat);

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

function importSchematicBytes(bytes, fileName) {
  try {
    const plan = parseSchematicFile(bytes);
    if (!plan || plan.blocks.length === 0) {
      showMsg("В схеме нет распознанных блоков");
      return;
    }
    const res = pasteSchematic(world, plan, Math.round(player.x), Math.round(player.z), 1);
    player.x = res.x0 + plan.W / 2;
    player.z = res.z0 + plan.L / 2;
    player.y = res.topY + 2;
    player.vy = 0;
    breaking = null;
    world.flushMeshes(scene, blockMat);
    showMsg(`Схема «${fileName}» (${plan.format}) · поставлено ${res.placed} блоков · ${plan.W}×${plan.H}×${plan.L}`);
  } catch (err) {
    showMsg(`Ошибка загрузки схемы: ${err.message}`);
  }
}

loadBtnEl.addEventListener("click", () => schemInputEl.click());

schemInputEl.addEventListener("change", () => {
  const f = schemInputEl.files?.[0];
  if (f) f.arrayBuffer().then((buf) => importSchematicBytes(new Uint8Array(buf), f.name));
  schemInputEl.value = "";
});

window.addEventListener("dragenter", (e) => { e.preventDefault(); dropOverlayEl.classList.add("show"); });
window.addEventListener("dragover", (e) => { e.preventDefault(); });
window.addEventListener("dragleave", (e) => { e.preventDefault(); dropOverlayEl.classList.remove("show"); });
window.addEventListener("drop", (e) => {
  e.preventDefault();
  dropOverlayEl.classList.remove("show");
  const f = e.dataTransfer?.files?.[0];
  if (f) f.arrayBuffer().then((buf) => importSchematicBytes(new Uint8Array(buf), f.name));
});

// ---------- guards (Фаза 3: патруль / шум / погоня) ----------
let noiseEvents = [];
let noiseTime = 0;
function emitNoise(x, y, z, value) {
  noiseEvents.push({ x, y, z, value, time: noiseTime, acquired: false });
}
const guards = [
  new Guard(
    scene,
    world,
    [{ x: -24, z: -4 }, { x: 24, z: -4 }, { x: 24, z: -26 }, { x: -24, z: -26 }],
    () => playerCaught()
  ),
  new Guard(
    scene,
    world,
    [{ x: -16, z: 2 }, { x: 16, z: 2 }, { x: 16, z: -18 }, { x: -16, z: -18 }],
    () => playerCaught()
  ),
  new Guard(
    scene,
    world,
    [{ x: -29, z: -2 }, { x: -29, z: 16 }, { x: -29, z: -8 }],
    () => playerCaught()
  ),
];

function respawnPlayer() {
  player.x = SPAWN.x;
  player.y = SPAWN.y;
  player.z = SPAWN.z;
  player.vy = 0;
  breaking = null;
}
function playerCaught() {
  respawnPlayer();
  showMsg("Охранник вернул вас в камеру!");
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
const HALF = 0.3;
const HEIGHT = 1.8;
const EYE = 1.7;
const REACH = 6;

const player = { x: SPAWN.x, y: SPAWN.y, z: SPAWN.z, vy: 0, grounded: false };
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

// ---------- inventory / tools ----------
const inventory = new Map(); // blockId -> { id, count } (order = добыча)
const BREAK_BASE = 0.9;
const HAND_DRAIN = 16;   // % рук в секунду при ломании голыми руками
const HAND_REGEN = 7;    // % рук в секунду восстановления
const NOISE_DECAY = 0.05;
const MAX_HANDS = 100;
let activeToolId = null; // выбранный предмет (id блока) -> инструмент; null = руки
let handHP = MAX_HANDS;
let noiseLevel = 0;
let breaking = null;     // { key, x, y, z, dur, progress }
let mouseDown = { 0: false, 2: false };

function getEntries() {
  return [...inventory.values()].filter((e) => e.count > 0);
}
function activeEntry() {
  if (activeToolId == null) return null;
  const e = inventory.get(activeToolId);
  if (!e || e.count <= 0) return null;
  return e;
}
function breakTime(targetId, toolId) {
  const target = BLOCKS[targetId];
  const tool = toolId != null ? BLOCKS[toolId] : null;
  const power = tool ? tool.toolPower : 1;
  return Math.max(0.4, (target.hardness / power) * BREAK_BASE + 0.35);
}

const hotbarEl = document.getElementById("hotbar");
const handsFillEl = document.getElementById("handsFill");
const noiseFillEl = document.getElementById("noiseFill");
const handsWarnEl = document.getElementById("handsWarn");
const breakWrapEl = document.getElementById("breakWrap");
const breakBarEl = document.getElementById("breakBar");
const selBlockEl = document.getElementById("selBlock");

function updateHotbar() {
  const entries = getEntries();
  if (activeToolId != null && !inventory.get(activeToolId)) activeToolId = null;
  const selId = activeToolId != null && inventory.get(activeToolId)?.count > 0 ? activeToolId : null;
  const marks = [];
  const N = Math.max(9, entries.length);
  for (let i = 0; i < N; i++) {
    const e = entries[i];
    if (!e) {
      marks.push('<div class="hslot"></div>');
      continue;
    }
    const b = BLOCKS[e.id];
    const active = e.id === selId ? ' active' : '';
    marks.push(
      `<div class="hslot${active}"><span class="sw" style="background:${b.color}"></span>` +
      `<span class="cnt">${e.count}</span><span class="nm">${b.name}</span></div>`
    );
  }
  hotbarEl.innerHTML = marks.join("");
  const name = activeToolId != null && selId != null ? BLOCKS[activeToolId].name : "руки";
  if (selBlockEl.textContent !== name) selBlockEl.textContent = name;
}

function updateBars() {
  const hp = Math.max(0, handHP) / MAX_HANDS;
  handsFillEl.style.width = `${Math.round(hp * 100)}%`;
  handsFillEl.style.background = `hsl(${Math.round(120 * hp)}, 75%, 45%)`;
  const no = Math.min(1, Math.max(0, noiseLevel));
  noiseFillEl.style.width = `${Math.round(no * 100)}%`;
  noiseFillEl.style.background = `hsl(${Math.round(120 * (1 - no))}, 80%, 45%)`;
  handsWarnEl.textContent = handHP <= 0 ? " руки устали" : "";
}

function updateBreakBar() {
  if (breaking) {
    breakWrapEl.style.visibility = "visible";
    breakBarEl.style.width = `${Math.round(breaking.progress * 100)}%`;
  } else {
    breakWrapEl.style.visibility = "hidden";
  }
}

window.addEventListener("keydown", (e) => {
  const n = Number(e.code.replace("Digit", ""));
  if (n >= 1 && n <= 9) {
    const entries = getEntries();
    if (entries.length > 0 && n <= entries.length) activeToolId = entries[n - 1].id;
    updateHotbar();
  }
});
updateHotbar();

// ---------- pointer lock / mouse ----------
canvas.addEventListener("pointerdown", (e) => {
  if (!document.pointerLockElement) {
    const req = canvas.requestPointerLock?.();
    if (req && req.catch) req.catch(() => {});
    return;
  }
  mouseDown[e.button] = true;
  if (e.button === 2) handlePlace();
});
window.addEventListener("pointerup", (e) => {
  mouseDown[e.button] = false;
  breaking = null;
});
document.addEventListener("pointerlockchange", () => {
  mouseDown = { 0: false, 2: false };
  breaking = null;
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

// ---------- interactions ----------
function handlePlace() {
  const hit = lastHit;
  if (!hit) return;
  const entry = activeEntry();
  if (!entry) return;
  const px = hit.x + hit.nx;
  const py = hit.y + hit.ny;
  const pz = hit.z + hit.nz;
  if (py < 0 || py >= WORLD_H) return;
  if (world.getBlock(px, py, pz) !== AIR) return;
  if (boxIntersectsPlayer(px, py, pz)) return;
  world.setBlock(px, py, pz, entry.id);
  world.flushMeshes(scene, blockMat);
  entry.count--;
  emitNoise(px, py, pz, 20);
  noiseLevel = Math.min(1, noiseLevel + 0.22);
  updateHotbar();
}

function doBreak(x, y, z, toolId) {
  const id = world.getBlock(x, y, z);
  if (id === AIR) return;
  world.setBlock(x, y, z, AIR);
  world.flushMeshes(scene, blockMat);
  let entry = inventory.get(id);
  if (!entry) {
    entry = { id, count: 0 };
    inventory.set(id, entry);
  }
  entry.count++;
  const evValue = toolId == null ? 10 + BLOCKS[id].hardness * 8 : 25 + BLOCKS[id].hardness * 12;
  emitNoise(x, y, z, evValue);
  noiseLevel = Math.min(1, noiseLevel + 0.1 + BLOCKS[id].hardness * 0.035);
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

// ---------- physics ----------
function candidateBox(axis, c) {
  const box = {
    x0: player.x - HALF,
    x1: player.x + HALF,
    y0: player.y,
    y1: player.y + HEIGHT,
    z0: player.z - HALF,
    z1: player.z + HALF,
  };
  if (axis === "x") { box.x0 = c - HALF; box.x1 = c + HALF; }
  if (axis === "y") { box.y0 = c; box.y1 = c + HEIGHT; }
  if (axis === "z") { box.z0 = c - HALF; box.z1 = c + HALF; }
  return box;
}

function moveAxis(axis, delta) {
  if (delta === 0) return player[axis];
  const sign = Math.sign(delta);
  let c = player[axis] + delta;
  const box = candidateBox(axis, c);
  const x0 = Math.floor(box.x0);
  const x1 = Math.floor(box.x1 - 1e-6);
  const y0 = Math.floor(box.y0);
  const y1 = Math.floor(box.y1 - 1e-6);
  const z0 = Math.floor(box.z0);
  const z1 = Math.floor(box.z1 - 1e-6);
  if (axis === "y" && sign < 0) {
    for (let yy = y1; yy >= y0; yy--) {
      for (let zz = z0; zz <= z1; zz++) {
        for (let xx = x0; xx <= x1; xx++) {
          if (!world.isSolid(xx, yy, zz)) continue;
          return yy + 1 + 1e-3;
        }
      }
    }
    return c;
  }
  for (let yy = y0; yy <= y1; yy++) {
    for (let zz = z0; zz <= z1; zz++) {
      for (let xx = x0; xx <= x1; xx++) {
        if (!world.isSolid(xx, yy, zz)) continue;
        if (axis === "y") {
          c = sign > 0 ? yy - HEIGHT - 1e-3 : yy + 1 + 1e-3;
          return c;
        } else {
          const v = axis === "x" ? xx : zz;
          c = sign > 0 ? v - HALF - 1e-3 : v + 1 + HALF + 1e-3;
          return c;
        }
      }
    }
  }
  return c;
}

function updateGrounded() {
  if (world.isSolid(Math.floor(player.x), Math.floor(player.y - 0.05), Math.floor(player.z))) {
    player.grounded = true;
  } else {
    player.grounded = false;
  }
}

// ---------- render loop ----------
const fwd = new BABYLON.Vector3();
const rgt = new BABYLON.Vector3();
const rayDir = new BABYLON.Vector3();

scene.registerBeforeRender(() => {
  const dt = Math.min(engine.getDeltaTime() / 1000, 0.05);
  const speed = keys.shift ? SPRINT_SPEED : WALK_SPEED;

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

  player.x = moveAxis("x", mx * speed * dt);
  player.z = moveAxis("z", mz * speed * dt);

  updateGrounded();
  if (player.grounded && keys.jump) {
    player.vy = JUMP_SPEED;
    player.grounded = false;
  }
  player.vy -= GRAVITY * dt;
  const prevY = player.y;
  player.y = moveAxis("y", player.vy * dt);
  if (player.vy > 0 && player.y < prevY) player.vy = 0;
  updateGrounded();
  if (player.grounded && player.vy <= 0) player.vy = 0;

  // clamp to the world region / respawn in the void
  const limit = 57;
  if (Math.abs(player.x) > limit) player.x = Math.sign(player.x) * limit;
  if (Math.abs(player.z) > limit) player.z = Math.sign(player.z) * limit;
  if (player.y < -20) respawnPlayer();

  camera.position.set(player.x, player.y + EYE, player.z);

  // ---- guards ----
  noiseTime += dt;
  while (noiseEvents.length > 0 && noiseTime - noiseEvents[0].time > 5) noiseEvents.shift();
  for (const g of guards) g.update(dt, player, noiseEvents, noiseTime);

  // ---- targeting ---- 
  camera.getDirectionToRef(new BABYLON.Vector3(0, 0, 1), rayDir);
  const locked = document.pointerLockElement === canvas;
  lastHit = raycast(camera.position.x, camera.position.y, camera.position.z, rayDir.x, rayDir.y, rayDir.z, REACH);

  outline.isVisible = false;
  if (locked && lastHit) {
    outline.position.set(lastHit.x + 0.5, lastHit.y + 0.5, lastHit.z + 0.5);
    outline.isVisible = true;
  }

  // ---- breaking (hold LMB) ----
  const toolId = activeEntry()?.id ?? null;
  const canBreak = lastHit && mouseDown[0] && (toolId != null || handHP > 0);
  if (canBreak) {
    let dur = breakTime(lastHit.id, toolId);
    if (toolId == null) {
      if (handHP < 40) dur *= 2.4;
      else if (handHP < 70) dur *= 1.5;
    }
    const key = `${lastHit.x},${lastHit.y},${lastHit.z}`;
    if (!breaking || breaking.key !== key) {
      breaking = { key, x: lastHit.x, y: lastHit.y, z: lastHit.z, dur, progress: 0 };
    }
    breaking.progress += dt / dur;
    noiseLevel = Math.min(1, noiseLevel + dt * 0.06);
    if (toolId == null) {
      handHP = Math.max(0, handHP - dt * HAND_DRAIN);
      if (handHP <= 0) {
        handHP = 0;
        breaking = null;
      }
    }
    if (breaking && breaking.progress >= 1) {
      doBreak(breaking.x, breaking.y, breaking.z, toolId);
      breaking = null;
    }
  } else {
    breaking = null;
  }

  // ---- hands recovery / noise decay ----
  const draining = toolId == null && mouseDown[0] && lastHit != null;
  if (!draining) handHP = Math.min(MAX_HANDS, handHP + dt * HAND_REGEN);
  noiseLevel = Math.max(0, noiseLevel - dt * NOISE_DECAY);

  updateBars();
  updateBreakBar();
});

engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());