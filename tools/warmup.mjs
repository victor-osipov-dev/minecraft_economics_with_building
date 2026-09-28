// Pre-warm the Vite dev-server transform cache.
// The browser reaches the dev server through a proxy with a ~3s upstream timeout;
// the first request for a big module (transform on the fly) can exceed it -> 502.
// Fetching everything server-side first makes subsequent browser requests fast.
// Usage: node tools/warmup.mjs [baseUrl]
const BASE = process.argv[2] || "http://127.0.0.1:5174";

const seen = new Set();
const stats = { n: 0, bytes: 0, slow: [], failed: [] };
let lastReq = 0;

async function get(rel) {
  const url = rel.startsWith("http") ? rel : new URL(rel, BASE).href;
  if (seen.has(url)) return null;
  seen.add(url);
  const t0 = Date.now();
  try {
    const r = await fetch(url);
    const buf = Buffer.from(await r.arrayBuffer());
    const ms = Date.now() - t0;
    stats.n++;
    stats.bytes += buf.length;
    if (ms > 700) stats.slow.push(`${ms}ms ${url.slice(BASE.length)} (${buf.length}B)`);
    if (!r.ok) stats.failed.push(`${r.status} ${url.slice(BASE.length)}`);
    // never hammer the dev server with parallel first-hits
    const since = Date.now() - lastReq;
    lastReq = Date.now();
    if (since < 40) await new Promise((res) => setTimeout(res, 40 - since));
    return { url, text: buf.toString("utf8") };
  } catch (e) {
    stats.failed.push(`ERR ${url.slice(BASE.length)} ${e.message}`);
    return null;
  }
}

// static + dynamic imports in a Vite-transformed module
function importsOf(text, fromUrl) {
  const out = new Set();
  const re = /(?:from\s*|import\s*|import\(\s*)["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(text))) {
    const spec = m[1];
    if (spec.startsWith("/node_modules/.vite/deps/") || spec.startsWith("/src/") || spec.startsWith("/schemes/") || spec.startsWith("./") || spec.startsWith("../")) {
      out.add(new URL(spec, fromUrl).href);
    } else if (spec.startsWith("/") && !spec.startsWith("/@")) {
      out.add(new URL(spec, fromUrl).href);
    }
  }
  // vite dep-mapping helper: __vite__mapDeps([...]) -> chunk list
  const depRe = /__vite__mapDeps\(\s*\[([^\]]*)\]\s*\)/g;
  while ((m = depRe.exec(text))) {
    for (const s of m[1].match(/"[^"]*"|'[^']*'/g) || []) {
      const name = s.slice(1, -1);
      if (name) out.add(new URL("/node_modules/.vite/deps/" + name, BASE).href);
    }
  }
  return out;
}

const queue = ["/src/main.js", "/schemes/index.json?import", "/@vite/client", "/"];
while (queue.length) {
  const rel = queue.shift();
  const res = await get(rel);
  if (!res || !/\.js(\?|$)/.test(res.url)) continue;
  for (const dep of importsOf(res.text, res.url)) if (!seen.has(dep)) queue.push(dep);
}

console.log(`warmed=${stats.n} bytes=${stats.bytes} failed=${stats.failed.length}`);
for (const f of stats.failed.slice(0, 12)) console.log("  FAILED " + f);
for (const s of stats.slow.slice(0, 12)) console.log("  SLOW   " + s);
