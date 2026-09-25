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

export class Guard {
  constructor(scene, world, waypoints, onCaught) {
    this.world = world;
    this.waypoints = waypoints.map((w) => ({ x: w.x, z: w.z }));
    this.wpIndex = 0;
    this.state = "PATROL";
    this.x = this.waypoints[0].x;
    this.z = this.waypoints[0].z;
    this.y = 1;
    this.waiter = 0;
    this.stuck = 0;
    this.lostSight = 0;
    this.alertT = 0;
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

  solid(x, yy, z) {
    const id = this.world.getBlock(x, yy, z);
    return id !== AIR && !!BLOCKS[id] && BLOCKS[id].solid;
  }

  blocked(x, z) {
    const h1 = Math.floor(this.y + 0.4);
    const h2 = Math.floor(this.y + 1.7);
    for (let yy = h1; yy <= h2; yy++) {
      if (this.solid(x, yy, z)) return true;
      if (this.solid(x + 0.7, yy, z)) return true;
      if (this.solid(x, yy, z + 0.7)) return true;
    }
    return false;
  }

  groundY(x, z) {
    for (let yy = Math.floor(this.y) + 6; yy >= 0; yy--) {
      if (this.solid(x, yy, z)) return yy + 1;
    }
    return this.y;
  }

  face(dx, dz) {
    if (dx !== 0 || dz !== 0) this.root.rotation.y = Math.atan2(dx, dz);
  }

  moveToward(tx, tz, dt) {
    const dx = tx - this.x;
    const dz = tz - this.z;
    const len = Math.hypot(dx, dz);
    if (len < 0.25) {
      this.stuck = 0;
      return true;
    }
    const step = Math.min(SPEEDS[this.state] * dt, len);
    const nx = this.x + (dx / len) * step;
    const nz = this.z + (dz / len) * step;
    const px = this.x;
    const pz = this.z;
    if (!this.blocked(nx, this.z)) this.x = nx;
    if (!this.blocked(this.x, nz)) this.z = nz;
    this.face(dx, dz);
    this.y += (this.groundY(this.x, this.z) - this.y) * Math.min(1, dt * 6);
    if (Math.abs(this.x - px) + Math.abs(this.z - pz) < 0.001) this.stuck += dt;
    else this.stuck = 0;
    if (this.stuck > 1.2) {
      this.stuck = 0;
      this.wpIndex = (this.wpIndex + 1) % this.waypoints.length;
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
      if (id !== AIR && !!BLOCKS[id] && BLOCKS[id].solid) return false;
    }
    return true;
  }

  checkNoise(events, now) {
    if (this.state !== "PATROL") return;
    for (const ev of events) {
      if (ev.acquired) continue;
      if (now - ev.time > 5) continue;
      if (ev.value < NOISE_THRESH) continue;
      if (Math.hypot(ev.x - this.x, ev.z - this.z) <= HEAR_RADIUS) {
        ev.acquired = true;
        this.heardEvent = ev;
        this.state = "INVESTIGATE";
        this.waiter = 0;
        return;
      }
    }
  }

  gotoPatrol() {
    this.state = "PATROL";
    this.heardEvent = null;
    this.waiter = 0;
    this.lostSight = 0;
  }

  update(dt, player, events, now) {
    this.root.position.set(this.x, this.y, this.z);
    this.mat.diffuseColor = BABYLON.Color3.FromHexString(STATE_COLORS[this.state]);

    switch (this.state) {
      case "PATROL": {
        if (this.waiter > 0) {
          this.waiter -= dt;
          break;
        }
        const wp = this.waypoints[this.wpIndex % this.waypoints.length];
        if (this.moveToward(wp.x, wp.z, dt)) {
          this.wpIndex = (this.wpIndex + 1) % this.waypoints.length;
          this.waiter = 2.2 + Math.random() * 2;
        }
        this.checkNoise(events, now);
        break;
      }

      case "INVESTIGATE": {
        if (!this.heardEvent && this.waiter <= 0) {
          this.gotoPatrol();
          break;
        }
        if (this.canSeePlayer(player)) {
          this.state = "ALERT";
          this.lostSight = 0;
          break;
        }
        if (this.heardEvent) {
          if (this.moveToward(this.heardEvent.x, this.heardEvent.z, dt)) {
            this.waiter = 2.5;
            this.heardEvent = null;
          }
        } else if (this.waiter > 0) {
          this.waiter -= dt;
          if (this.waiter <= 0) this.gotoPatrol();
        }
        break;
      }

      case "ALERT": {
        this.alertT = (this.alertT || 0) + dt;
        const dist = Math.hypot(player.x - this.x, player.z - this.z);
        if (dist <= 1.4 && Math.abs(player.y - this.y) < 3) {
          if (this.onCaught) this.onCaught(this);
          this.gotoPatrol();
          break;
        }
        if (dist > 42 || this.alertT > 12) {
          this.gotoPatrol();
          break;
        }
        this.moveToward(player.x, player.z, dt);
        if (this.canSeePlayer(player)) this.lostSight = 0;
        else this.lostSight += dt;
        if (this.lostSight > 5) this.gotoPatrol();
        break;
      }
    }
  }
}