import * as BABYLON from "@babylonjs/core";
import { AIR, BLOCKS } from "./blocks.js";

// План §8 / §17: охранник с состояниями PATROL / INVESTIGATE / ALERT.
export const NOISE_THRESH = 40; // порог слышимости
export const HEAR_RADIUS = 18;  // радиус слышимости
export const SIGHT_RANGE = 14;  // дистанция зрения

const STATE_COLORS = {
  PATROL: "#3d5a80",
  INVESTIGATE: "#e0a33c",
  ALERT: "#c24038",
};
const SPEEDS = { PATROL: 2.3, INVESTIGATE: 3.3, ALERT: 4.5 };
const ALERT_LIMIT = 12;
const LOST_SIGHT_LIMIT = 5;
const GUARD_BODY_HEIGHT = 1.7;

export class Guard {
  constructor(scene, world, waypoints, onCaught, startY = 1) {
    this.world = world;
    this.waypoints = (Array.isArray(waypoints) ? waypoints : []).map((w) => ({
      x: w.x,
      z: w.z,
      // Keep the route's vertical value.  A caller that supplies a Y-aware
      // route must not silently get the constructor fallback for every node.
      y: Number.isFinite(w.y) ? w.y : (Number.isFinite(startY) ? startY : 1),
    }));
    this.wpIndex = 0;
    this.state = "PATROL";
    const first = this.waypoints[0];
    this.x = first ? first.x : 0;
    this.z = first ? first.z : 0;
    this.y = first && Number.isFinite(first.y) ? first.y : (Number.isFinite(startY) ? startY : 1);
    this.waiter = 0;
    this.stuck = 0;
    this.lostSight = 0;
    this.alertT = 0;
    this.seenEvents = new Set();
    this.heardEvent = null;
    this.onCaught = onCaught;

    this.root = new BABYLON.TransformNode(`guard_${Math.random().toString(36).slice(2, 7)}`, scene);
    const body = BABYLON.MeshBuilder.CreateBox("gBody", { width: 0.8, height: 1.4, depth: 0.45 }, scene);
    const head = BABYLON.MeshBuilder.CreateBox("gHead", { width: 0.5, height: 0.4, depth: 0.5 }, scene);
    this.mat = new BABYLON.StandardMaterial("gMat", scene);
    this.mat.diffuseColor = new BABYLON.Color3(0.24, 0.35, 0.5);
    body.material = this.mat;
    head.material = this.mat;
    body.parent = this.root;
    head.parent = this.root;
    body.position.y = 0.95;
    head.position.y = 1.75;
  }

  dispose() {
    // При ручном импорте карта может меняться несколько раз. Удаляем
    // визуальные узлы старых охранников, иначе они продолжают жить в
    // сцене и дублируют себя после каждой загрузки схемы.
    this.root?.dispose(false, true);
  }

  solid(x, yy, z) {
    const id = this.world.getBlock(x, yy, z);
    return id !== AIR && !!BLOCKS[id] && BLOCKS[id].solid;
  }

  bodyClear(x, y, z) {
    if (![x, y, z].every(Number.isFinite)) return false;
    const h1 = Math.floor(y + 0.05);
    const h2 = Math.floor(y + GUARD_BODY_HEIGHT - 1e-6);
    const xs = [x - 0.35, x + 0.35];
    const zs = [z - 0.35, z + 0.35];
    for (let yy = h1; yy <= h2; yy++) {
      for (const xx of xs) {
        for (const zz of zs) {
          if (this.solid(xx, yy, zz)) return false;
        }
      }
    }
    return true;
  }

  blocked(x, z, targetY = this.y) {
    return !this.bodyClear(x, targetY, z);
  }

  groundY(x, z, targetY = this.y) {
    // Ищем опору под ногами, а не над головой.  Это не даёт потолку
    // «поднять» Guard на своём верхнем уровне.
    const reference = Number.isFinite(targetY) ? targetY : this.y;
    const start = Math.min(63, Math.floor(Math.max(this.y, reference) + 0.45));
    for (let yy = start; yy >= 0; yy--) {
      if (!this.solid(x, yy, z)) continue;
      const surface = yy + 1;
      if (surface > reference + 0.75) continue;
      if (this.bodyClear(x, surface, z)) return surface;
    }
    return this.y;
  }

  face(dx, dz) {
    if (dx !== 0 || dz !== 0) this.root.rotation.y = Math.atan2(dx, dz);
  }

  moveToward(tx, tz, dt, targetY = this.y) {
    if (![tx, tz, dt].every(Number.isFinite) || this.waypoints.length === 0) return false;
    const safeDt = Math.max(0, Math.min(0.25, dt));
    const verticalTarget = Number.isFinite(targetY) ? targetY : this.y;
    const dx = tx - this.x;
    const dz = tz - this.z;
    const len = Math.hypot(dx, dz);
    if (len < 0.25) {
      this.stuck = 0;
      this.y += (this.groundY(this.x, this.z, verticalTarget) - this.y) * Math.min(1, safeDt * 6);
      return true;
    }
    const speed = SPEEDS[this.state] || SPEEDS.PATROL;
    const step = Math.min(speed * safeDt, len);
    const nx = this.x + (dx / len) * step;
    const nz = this.z + (dz / len) * step;
    const px = this.x;
    const pz = this.z;
    if (!this.blocked(nx, this.z, verticalTarget)) this.x = nx;
    if (!this.blocked(this.x, nz, verticalTarget)) this.z = nz;
    this.face(dx, dz);
    this.y += (this.groundY(this.x, this.z, verticalTarget) - this.y) * Math.min(1, safeDt * 6);
    if (Math.abs(this.x - px) + Math.abs(this.z - pz) < 0.001) this.stuck += safeDt;
    else this.stuck = 0;
    if (this.stuck > 1.2) {
      this.stuck = 0;
      // Смена индекса маршрута имеет смысл только для патруля.  В
      // INVESTIGATE/ALERT она иначе сбрасывает цель на посторонний waypoint.
      if (this.state === "PATROL") {
        this.wpIndex = (this.wpIndex + 1) % this.waypoints.length;
      }
      return false;
    }
    return false;
  }

  canSeePlayer(player) {
    const ex = this.x;
    const ey = this.y + 1.5;
    const ez = this.z;
    const tx = player.x;
    const ty = Math.max(player.y, 0.4) + 1.5;
    const tz = player.z;
    const d = Math.hypot(tx - ex, tz - ez);
    if (d > SIGHT_RANGE) return false;
    const steps = Math.ceil(d / 0.4);
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const px = ex + (tx - ex) * t;
      const py = ey + (ty - ey) * t;
      const pz = ez + (tz - ez) * t;
      const id = this.world.getBlock(px, py, pz);
      if (id !== AIR && !!BLOCKS[id] && BLOCKS[id].blocksSight) return false;
    }
    return true;
  }

  checkNoise(events, now) {
    if (this.state !== "PATROL") return;
    for (const ev of events) {
      if (this.seenEvents.has(ev)) continue;
      if (now - ev.time > 5) continue;
      if (ev.value < NOISE_THRESH) continue;
      if (Math.hypot(ev.x - this.x, ev.z - this.z) <= HEAR_RADIUS) {
        if (this.seenEvents.size >= 256) {
          const oldest = this.seenEvents.values().next().value;
          this.seenEvents.delete(oldest);
        }
        this.seenEvents.add(ev);
        this.heardEvent = ev;
        this.state = "INVESTIGATE";
        this.waiter = 0;
        this.alertT = 0;
        return;
      }
    }
  }

  gotoPatrol() {
    this.state = "PATROL";
    this.heardEvent = null;
    this.waiter = 0;
    this.stuck = 0;
    this.lostSight = 0;
    this.alertT = 0;
  }

  update(dt, player, events, now) {
    const safeDt = Number.isFinite(dt) ? Math.max(0, Math.min(0.25, dt)) : 0;
    this.root.position.set(this.x, this.y, this.z);
    this.mat.diffuseColor = BABYLON.Color3.FromHexString(STATE_COLORS[this.state]);
    if (this.waypoints.length === 0) return;

    switch (this.state) {
      case "PATROL": {
        this.checkNoise(events || [], now || 0);
        if (this.state !== "PATROL") break;
        if (this.waiter > 0) {
          this.waiter = Math.max(0, this.waiter - safeDt);
          break;
        }
        const wp = this.waypoints[this.wpIndex % this.waypoints.length];
        if (this.moveToward(wp.x, wp.z, safeDt, wp.y)) {
          this.wpIndex = (this.wpIndex + 1) % this.waypoints.length;
          this.waiter = 2.2 + Math.random() * 2;
        }
        break;
      }

      case "INVESTIGATE": {
        if (!this.heardEvent && this.waiter <= 0) {
          this.gotoPatrol();
          break;
        }
        if (this.canSeePlayer(player)) {
          this.state = "ALERT";
          this.alertT = 0;
          this.lostSight = 0;
          break;
        }
        if (this.heardEvent) {
          if (this.moveToward(this.heardEvent.x, this.heardEvent.z, safeDt, this.heardEvent.y)) {
            this.waiter = 2.5;
            this.heardEvent = null;
          }
        } else if (this.waiter > 0) {
          this.waiter = Math.max(0, this.waiter - safeDt);
          if (this.waiter <= 0) this.gotoPatrol();
        }
        break;
      }

      case "ALERT": {
        this.alertT = Math.min(ALERT_LIMIT, (this.alertT || 0) + safeDt);
        const dist = Math.hypot(player.x - this.x, player.z - this.z);
        if (dist <= 1.4 && Math.abs(player.y - this.y) < 3) {
          if (this.onCaught) this.onCaught(this);
          this.gotoPatrol();
          break;
        }
        if (dist > 42 || this.alertT >= ALERT_LIMIT) {
          this.gotoPatrol();
          break;
        }
        this.moveToward(player.x, player.z, safeDt, player.y);
        if (this.canSeePlayer(player)) this.lostSight = 0;
        else this.lostSight = Math.min(LOST_SIGHT_LIMIT, this.lostSight + safeDt);
        if (this.lostSight >= LOST_SIGHT_LIMIT) this.gotoPatrol();
        break;
      }
    }
  }
}