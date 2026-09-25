import {
  AIR,
  WALL_CONCRETE,
  FLOOR_CONCRETE,
  RUST_METAL,
  DARK_METAL,
  BARS,
  DIRT,
  STONE,
  WOOD,
} from "./blocks.js";

function fill(world, x0, y0, z0, x1, y1, z1, id) {
  for (let x = x0; x <= x1; x++) {
    for (let y = y0; y <= y1; y++) {
      for (let z = z0; z <= z1; z++) {
        world.setBlock(x, y, z, id);
      }
    }
  }
}

function lamp(world, x, z) {
  fill(world, x - 1, 3, z, x + 1, 3, z, DARK_METAL);
  fill(world, x, 3, z - 1, x, 3, z + 1, DARK_METAL);
  fill(world, x, 1, z, x, 3, z, DARK_METAL);
  fill(world, x, 4, z, x, 4, z, FLOOR_CONCRETE);
}

function shell(world, x0, y0, z0, x1, y1, z1, wall, floorMat) {
  fill(world, x0, y0, z0, x1, y1, z1, wall);
  fill(world, x0 + 1, y0, z0 + 1, x1 - 1, y1 - 1, z1 - 1, AIR);
  if (floorMat !== wall) fill(world, x0, y0, z0, x1, y0, z1, floorMat);
}

export function buildPrison(world) {
  const R = 56;
  const W = 40;

  fill(world, -R, 0, -R, R, 0, R, FLOOR_CONCRETE);

  fill(world, -R, 1, -R, -R, 2, R, STONE);
  fill(world, R, 1, -R, R, 2, R, STONE);
  fill(world, -R + 1, 1, -R, R - 1, 2, -R, STONE);
  fill(world, -R + 1, 1, R, R - 1, 2, R, STONE);

  for (let z = -W; z <= W; z++) {
    fill(world, -W, 1, z, -W, 5, z, WALL_CONCRETE);
    fill(world, W, 1, z, W, 5, z, WALL_CONCRETE);
  }
  for (let x = -W + 1; x <= W - 1; x++) {
    fill(world, x, 1, -W, x, 5, -W, WALL_CONCRETE);
    fill(world, x, 1, W, x, 5, W, WALL_CONCRETE);
  }
  for (let z = -W; z <= W; z++) {
    if (z % 2 === 0) {
      world.setBlock(-W, 6, z, WALL_CONCRETE);
      world.setBlock(W, 6, z, WALL_CONCRETE);
    }
  }
  for (let x = -W; x <= W; x++) {
    if (x % 2 === 0) {
      world.setBlock(x, 6, -W, WALL_CONCRETE);
      world.setBlock(x, 6, W, WALL_CONCRETE);
    }
  }

  fill(world, -6, 1, -W, 6, 3, -W, AIR);
  for (let x = -6; x <= 6; x++) {
    for (let y = 1; y <= 3; y++) {
      world.setBlock(x, y, -W, BARS);
    }
    world.setBlock(x, 4, -W, WALL_CONCRETE);
    world.setBlock(x, 5, -W, WALL_CONCRETE);
  }

  const corners = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
  const lightPositions = [];
  for (const [sx, sz] of corners) {
    const tx = sx * W;
    const tz = sz * W;
    fill(world, tx, 1, tz, tx + 4, 9, tz + 4, WALL_CONCRETE);
    fill(world, tx, 10, tz, tx + 4, 10, tz + 4, DARK_METAL);
    const posts = [[tx, tz], [tx + 4, tz], [tx, tz + 4], [tx + 4, tz + 4]];
    for (const [px, pz] of posts) {
      world.setBlock(px, 11, pz, DARK_METAL);
      world.setBlock(px, 12, pz, DARK_METAL);
    }
    lightPositions.push({ pos: [tx + 2, 10.5, tz + 2] });
  }

  // ---- cell block (жилой корпус) ----
  const BX = -26;
  const BX2 = 26;
  const BZ = 20;
  const BZ2 = 32;
  fill(world, BX, 1, BZ, BX2, 7, BZ2, WALL_CONCRETE);
  fill(world, BX + 1, 1, BZ + 1, BX2 - 1, 6, BZ2 - 1, AIR);

  for (let x = -24; x <= 24; x += 4) {
    if (x >= -16 && x <= -6) continue;
    fill(world, x, 1, BZ, x + 1, 4, BZ, BARS);
  }
  for (let y = 1; y <= 3; y++) {
    fill(world, -13, y, BZ, -9, y, BZ, BARS);
  }

  const carveCellArea = (x0, x1) => {
    for (let x = x0; x <= x1; x++) {
      for (let y = 1; y <= 3; y++) {
        world.setBlock(x, y, 21, AIR);
        world.setBlock(x, y, 24, AIR);
        world.setBlock(x, y, 27, AIR);
        world.setBlock(x, y, 30, AIR);
      }
    }
  };

  for (let cx = -22; cx <= 23; cx += 3) {
    fill(world, cx, 1, 21, cx, 6, 23, WALL_CONCRETE);
    fill(world, cx, 1, 28, cx, 6, 30, WALL_CONCRETE);
  }
  for (let cx = -23; cx <= 23; cx += 3) {
    fill(world, cx + 1, 1, 24, cx + 2, 4, 24, BARS);
    fill(world, cx + 1, 1, 27, cx + 2, 4, 27, BARS);
  }

  carveCellArea(-14, -7);
  fill(world, -11, 1, 21, -10, 1, 30, FLOOR_CONCRETE);
  fill(world, -9, 1, 22, -8, 2, 23, WOOD);
  fill(world, -8, 1, 21, -7, 1, 21, WOOD);
  fill(world, -12, 1, 28, -12, 2, 29, WOOD);

  carveCellArea(7, 11);
  fill(world, 7, 1, 21, 11, 1, 30, RUST_METAL);
  fill(world, 8, 1, 22, 8, 2, 22, DARK_METAL);
  fill(world, 9, 1, 24, 9, 1, 24, DARK_METAL);
  fill(world, 10, 1, 25, 10, 1, 26, DARK_METAL);

  fill(world, -12, 1, 22, -12, 1, 23, AIR);
  fill(world, 8, 1, 29, 8, 1, 30, FLOOR_CONCRETE);

  // ---- west roof stairs + east roof stairs onto the cell block roof ----
  for (let i = 1; i <= 7; i++) {
    fill(world, -28, i, 23 + i, -27, i, 23 + i, DARK_METAL);
    fill(world, 27, i, 20 + i - 1, 27, i, 20 + i - 1, DARK_METAL);
  }
  fill(world, -28, 1, 22, -27, 1, 22, DARK_METAL);
  fill(world, 27, 1, 19, 27, 1, 19, DARK_METAL);
  fill(world, -28, 8, 30, -27, 8, 31, DARK_METAL);
  fill(world, 27, 8, 26, 27, 8, 27, DARK_METAL);

  fill(world, -4, 7, 30, -2, 9, 31, RUST_METAL);
  fill(world, 8, 7, 22, 9, 10, 23, DARK_METAL);
  fill(world, 14, 7, 29, 15, 9, 30, DARK_METAL);
  fill(world, 18, 7, 26, 20, 9, 28, WOOD);
  fill(world, -20, 7, 21, -20, 9, 21, DARK_METAL);

  // ---- north service strip (прачечная, электрощитовая, склад, вентиляция) ----
  shell(world, -36, 1, 34, -28, 3, 37, WALL_CONCRETE, FLOOR_CONCRETE);
  fill(world, -36, 1, 35, -36, 3, 36, AIR);
  fill(world, -33, 1, 35, -31, 1, 36, WOOD);

  shell(world, -22, 1, 34, -16, 3, 37, WALL_CONCRETE, FLOOR_CONCRETE);
  fill(world, -19, 1, 34, -18, 3, 34, AIR);
  fill(world, -21, 1, 36, -20, 3, 36, DARK_METAL);
  fill(world, -17, 1, 36, -17, 2, 36, RUST_METAL);

  shell(world, -6, 1, 34, 10, 6, 37, WALL_CONCRETE, FLOOR_CONCRETE);
  fill(world, 2, 1, 34, 3, 3, 34, AIR);
  fill(world, -4, 1, 35, -3, 2, 36, WOOD);
  fill(world, 6, 1, 35, 7, 2, 36, WOOD);
  fill(world, -1, 3, 36, 0, 3, 37, WOOD);
  fill(world, 8, 3, 35, 9, 3, 36, WOOD);

  fill(world, -11, 1, 33, -10, 4, 33, DARK_METAL);
  fill(world, -11, 5, 33, -10, 7, 33, RUST_METAL);
  fill(world, 22, 1, 33, 23, 4, 33, DARK_METAL);
  fill(world, 22, 5, 33, 23, 7, 33, RUST_METAL);

  // ---- west cluster (медблок, комната охраны, архив/администрация) ----
  shell(world, -36, 1, -26, -30, 4, -16, WALL_CONCRETE, FLOOR_CONCRETE);
  fill(world, -30, 1, -21, -30, 3, -20, AIR);
  fill(world, -35, 1, -24, -34, 2, -24, WOOD);
  fill(world, -33, 1, -17, -32, 1, -17, WOOD);

  shell(world, -36, 1, -12, -30, 4, -2, WALL_CONCRETE, FLOOR_CONCRETE);
  fill(world, -30, 1, -7, -30, 3, -6, AIR);
  fill(world, -35, 1, -10, -34, 1, -10, WOOD);
  fill(world, -32, 1, -3, -31, 1, -3, DARK_METAL);

  shell(world, -36, 1, 4, -30, 4, 14, WALL_CONCRETE, FLOOR_CONCRETE);
  fill(world, -30, 1, 9, -30, 3, 10, AIR);
  fill(world, -35, 1, 6, -35, 2, 13, WOOD);
  fill(world, -33, 1, 6, -33, 2, 13, WOOD);

  // ---- kitchen pavilion (кухня/столовая) ----
  shell(world, 3, 1, -15, 11, 4, -7, WALL_CONCRETE, FLOOR_CONCRETE);
  fill(world, 11, 1, -11, 11, 3, -10, AIR);
  fill(world, 5, 1, -14, 6, 1, -13, RUST_METAL);
  fill(world, 9, 1, -12, 10, 1, -12, WOOD);
  fill(world, 9, 1, -10, 9, 1, -10, WOOD);

  // ---- east workshops (металл, столярная, мусорный цех) ----
  shell(world, 30, 1, -28, 38, 4, -18, WALL_CONCRETE, RUST_METAL);
  fill(world, 30, 1, -23, 30, 3, -22, AIR);
  fill(world, 34, 1, -26, 35, 2, -25, DARK_METAL);
  fill(world, 36, 1, -19, 37, 1, -19, RUST_METAL);

  shell(world, 30, 1, -14, 38, 4, -4, WALL_CONCRETE, WOOD);
  fill(world, 30, 1, -9, 30, 3, -8, AIR);
  fill(world, 33, 1, -12, 34, 1, -11, WOOD);
  fill(world, 36, 1, -5, 37, 1, -5, WOOD);

  shell(world, 30, 1, 0, 38, 4, 10, WALL_CONCRETE, DIRT);
  fill(world, 30, 1, 5, 30, 3, 6, AIR);
  fill(world, 33, 1, 2, 33, 2, 3, STONE);
  fill(world, 36, 1, 8, 37, 1, 9, STONE);

  // ---- abandoned old wing OUTSIDE the north-east wall ----
  fill(world, 40, 1, -8, 40, 3, -6, AIR);
  for (let y = 1; y <= 2; y++) {
    world.setBlock(40, y, -8, BARS);
    world.setBlock(40, y, -6, BARS);
  }
  fill(world, 40, 3, -8, 40, 3, -6, AIR);

  shell(world, 42, 1, -8, 54, 6, 2, STONE, DIRT);
  fill(world, 44, 1, -8, 45, 3, -8, AIR);
  fill(world, 47, 1, -6, 48, 1, -5, RUST_METAL);
  fill(world, 52, 1, -2, 53, 2, -1, STONE);
  fill(world, 44, 1, 0, 44, 1, 1, WOOD);

  shell(world, 42, 1, 6, 54, 5, 14, STONE, DIRT);
  fill(world, 46, 1, 6, 47, 3, 6, AIR);
  fill(world, 43, 1, 8, 43, 2, 13, WOOD);
  fill(world, 49, 1, 8, 49, 2, 13, WOOD);
  fill(world, 48, 1, 12, 52, 4, 14, WALL_CONCRETE);
  fill(world, 49, 1, 11, 51, 3, 11, BARS);
  fill(world, 49, 1, 12, 51, 1, 13, RUST_METAL);
  fill(world, 48, 1, 12, 48, 3, 12, AIR);

  shell(world, 48, 1, 18, 54, 5, 26, STONE, DIRT);
  fill(world, 51, 1, 18, 51, 3, 18, RUST_METAL);

  fill(world, 46, 1, -12, 47, 2, -11, STONE);
  fill(world, 52, 1, -12, 53, 2, -11, STONE);
  fill(world, 50, 1, -12, 50, 3, -12, DARK_METAL);

  // ---- yard props ----
  fill(world, 12, 1, 6, 14, 2, 6, WOOD);
  fill(world, -15, 1, -10, -13, 2, -10, RUST_METAL);

  // ---- lamp posts ----
  lamp(world, 0, 0);
  lamp(world, 0, -14);
  lamp(world, 22, 0);
  lamp(world, -22, 0);
  lamp(world, 0, -30);
  lamp(world, -33, 0);
  lamp(world, 28, -2);

  lightPositions.push(
    { pos: [0, 4.5, 0] },
    { pos: [0, 4.5, -14] },
    { pos: [22, 4.5, 0] },
    { pos: [-22, 4.5, 0] },
    { pos: [0, 4.5, -30] },
    { pos: [-33, 4.5, 0] },
    { pos: [28, 4.5, -2] },
    { pos: [-33, 3.5, -21] },
    { pos: [-33, 3.5, 0] },
    { pos: [33, 3.5, -23] },
    { pos: [33, 3.5, -9] },
    { pos: [33, 3.5, 5] },
    { pos: [7, 3.5, -11] },
    { pos: [2, 4.5, 35] },
    { pos: [-20, 9.5, 21] },
    { pos: [0, 4.5, 3] }
  );

  return lightPositions;
}

export const SPAWN = { x: 0, y: 1, z: -24 };