// Визуальные жители: ЧИСТАЯ логика без Babylon (тестируется в node).
// Жители НЕ источник истины: симуляция говорит число, эта система
// показывает N условных агентов независимо от реального населения.
export const MAX_AGENTS = 120;
export const AGENT_SPEED = 3; // блоков в секунду

// target pools: { home: [{x,y,z}], work: [...], shop: [...], park: [...] }
export function createResident(id, x, y, z) {
  return { id, x, y, z, tx: x, ty: y, tz: z, wait: 0, kind: "home" };
}

function pick(arr, rnd) {
  return arr[Math.floor(rnd() * arr.length)];
}

// Выбор новой цели по долям плана: 65% дом, 20% работа, 10% магазин, 5% парк.
// Пустые пулы пропускаются (их доля уходит дому).
export function pickTarget(pools, rnd = Math.random) {
  const r = rnd();
  if (r < 0.20 && pools.work.length > 0) return { p: pick(pools.work, rnd), kind: "work" };
  if (r < 0.30 && pools.shop.length > 0) return { p: pick(pools.shop, rnd), kind: "shop" };
  if (r < 0.35 && pools.park.length > 0) return { p: pick(pools.park, rnd), kind: "park" };
  if (pools.home.length > 0) return { p: pick(pools.home, rnd), kind: "home" };
  const any = [...pools.work, ...pools.shop, ...pools.park];
  if (any.length > 0) return { p: pick(any, rnd), kind: "work" };
  return null;
}

export function assignTarget(agent, pools, rnd = Math.random) {
  const t = pickTarget(pools, rnd);
  if (!t) return;
  agent.tx = t.p.x; agent.ty = t.p.y; agent.tz = t.p.z;
  agent.kind = t.kind;
  agent.wait = 0;
}

// Шаг симуляции агентов: движение по прямой, пауза 1–3 с на точке.
export function stepResidents(agents, pools, dt, rnd = Math.random) {
  for (const a of agents) {
    if (a.wait > 0) {
      a.wait -= dt;
      if (a.wait <= 0) assignTarget(a, pools, rnd);
      continue;
    }
    const dx = a.tx - a.x, dy = a.ty - a.y, dz = a.tz - a.z;
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (d < 0.4) {
      a.wait = 1 + rnd() * 2;
      continue;
    }
    const v = Math.min(d, AGENT_SPEED * dt);
    a.x += (dx / d) * v;
    a.y += (dy / d) * v;
    a.z += (dz / d) * v;
  }
}

// Желаемое число агентов по населению (не 1:1 — представители).
export function desiredAgents(population) {
  if (population <= 0) return 0;
  return Math.min(MAX_AGENTS, Math.max(3, Math.ceil(population / 8)));
}
