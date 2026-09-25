// Физика игрока отдельным модулем (без Babylon/DOM), чтобы гонять тестами.
// player: {x, y, z, vy, grounded}, world: World из world.js.

export const HALF = 0.3;
export const HEIGHT = 1.8;
const EPS = 1e-3;
const STEP_MAX = 0.6001;

export function candidateBox(player, axis, c) {
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

export function moveAxis(player, world, axis, delta) {
  if (delta === 0) return player[axis];
  const sign = Math.sign(delta);
  let c = player[axis] + delta;
  const box = candidateBox(player, axis, c);
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
          // Садимся на реальный верх блока: 0.5 у нижней плиты, иначе целый.
          const top = world.solidTop(xx, yy, zz);
          // ...но только когда долетели: верх плиты на полблока ниже клетки,
          // иначе в конце падения — резкий дроп до полублока.
          if (top != null && box.y0 > top + EPS) continue;
          return (top ?? yy + 1) + EPS;
        }
      }
    }
    return c;
  }
  for (let yy = y0; yy <= y1; yy++) {
    for (let zz = z0; zz <= z1; zz++) {
      for (let xx = x0; xx <= x1; xx++) {
        if (!world.isSolid(xx, yy, zz)) continue;
        const top = world.solidTop(xx, yy, zz);
        // Поверхность под ногами (стоим на плите) — не препятствие.
        if (axis !== "y" && top != null && top <= box.y0 + EPS) continue;
        if (axis !== "y" && (player.grounded || player.vy <= 0.01)) {
          // Auto-step как в майнкрафте: зашагиваем на препятствие до 0.6,
          // если наверху свободно. При успехе сразу выходим: бокс ниже
          // устарел (y уже поднят), продолжать скан по нему нельзя.
          const surface = top ?? yy + 1;
          const step = surface - player.y;
          if (step > 0 && step <= STEP_MAX && canStandAt(player, world, axis, c, surface)) {
            player.y = surface + EPS;
            player.vy = Math.max(0, player.vy);
            player.grounded = true;
            return c;
          }
        }
        if (axis === "y") {
          // Пол под ногами при прыжке — не потолок: иначе прыжок с плиты
          // телепортировал игрока вниз (ноги стоят внутри клетки плиты).
          if (top != null && top <= player.y + EPS) continue;
          // Удар головой — только когда достали: низ верхней плиты на
          // полблока выше клетки, иначе ранний стоп-рывок вверх.
          const bot = world.solidBottom(xx, yy, zz);
          if (bot != null && box.y1 < bot - EPS) continue;
          c = (bot ?? yy) - HEIGHT - EPS;
          return c;
        } else {
          const v = axis === "x" ? xx : zz;
          c = sign > 0 ? v - HALF - EPS : v + 1 + HALF + EPS;
          return c;
        }
      }
    }
  }
  return c;
}

// Свободен ли бокс от твёрдых частей блоков (с учётом половин плит).
export function isBoxFree(world, x0, x1, y0, y1, z0, z1) {
  const cx0 = Math.floor(x0);
  const cx1 = Math.floor(x1 - 1e-6);
  const cy0 = Math.floor(y0);
  const cy1 = Math.floor(y1 - 1e-6);
  const cz0 = Math.floor(z0);
  const cz1 = Math.floor(z1 - 1e-6);
  for (let yy = cy0; yy <= cy1; yy++) {
    for (let zz = cz0; zz <= cz1; zz++) {
      for (let xx = cx0; xx <= cx1; xx++) {
        const top = world.solidTop(xx, yy, zz);
        if (top == null) continue;
        if (top <= y0 + EPS) continue;
        const bot = world.solidBottom(xx, yy, zz);
        if (bot != null && bot >= y1 - EPS) continue;
        return false;
      }
    }
  }
  return true;
}

export function updateGrounded(player, world) {
  // Стоим, если ступни в пределах ступеньки над верхом опоры. Проверять
  // просто "клетка снизу твёрдая" нельзя: над нижней плитой grounded
  // срабатывал бы на полблока раньше и гасил скорость ещё в полёте.
  const top = world.solidTop(
    Math.floor(player.x),
    Math.floor(player.y - 0.05),
    Math.floor(player.z)
  );
  if (top == null) {
    player.grounded = false;
    return;
  }
  const above = player.y - top;
  player.grounded = above <= 0.06 && above >= -0.5;
}

export function canStandAt(player, world, axis, c, surface) {
  const y0 = surface + EPS;
  const y1 = y0 + HEIGHT;
  let x0, x1, z0, z1;
  if (axis === "x") {
    x0 = c - HALF;
    x1 = c + HALF;
    z0 = player.z - HALF;
    z1 = player.z + HALF;
  } else {
    z0 = c - HALF;
    z1 = c + HALF;
    x0 = player.x - HALF;
    x1 = player.x + HALF;
  }
  return isBoxFree(world, x0, x1, y0, y1, z0, z1);
}
