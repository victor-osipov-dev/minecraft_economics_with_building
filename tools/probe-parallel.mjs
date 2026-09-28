// Are 502s server-side or browser-path-only? Fetch dev-server chunks in parallel.
const BASE = process.argv[2] || "http://127.0.0.1:5174";

async function text(path) {
  const r = await fetch(BASE + path);
  if (!r.ok) throw new Error(`${r.status} ${path}`);
  return await r.text();
}

function depImports(src) {
  return [
    ...(src.match(/\/node_modules\/\.vite\/deps\/[^"'`\s?]+\.js(\?v=[a-z0-9]+)?/g) || []),
    ...(src.match(/["'](\.?\.?\/)?[^"'`\s]*chunk-[A-Z0-9]+\.js\?v=[a-z0-9]+["']/g) || []).map((s) =>
      s.slice(1, -1).replace(/^\.\//, "/node_modules/.vite/deps/")
    ),
  ];
}

// BFS the dev module graph the way the browser does: entry -> deps -> their deps
let frontier = depImports(await text("/src/main.js"));
const seen = new Set(frontier);
const all = [...frontier];
while (frontier.length && all.length < 400) {
  const next = [];
  for (const u of frontier) {
    try {
      for (const d of depImports(await text(u.startsWith("/") ? u : "/" + u)))
        if (!seen.has(d)) { seen.add(d); next.push(d); all.push(d); }
    } catch { /* ignore */ }
  }
  frontier = next;
}
console.log(`module graph: ${all.length} dep files`);

for (const size of [8, 30, 60]) {
  const batch = all.slice(0, size);
  const t0 = Date.now();
  const res = await Promise.all(
    batch.map(async (u) => {
      try {
        const r = await fetch(BASE + (u.startsWith("/") ? u : "/" + u));
        const b = (await r.arrayBuffer()).byteLength;
        return { s: r.status, b };
      } catch (e) {
        return { s: "ERR", b: 0, e: e.message };
      }
    })
  );
  const fails = res.filter((r) => r.s !== 200);
  const bytes = res.reduce((a, r) => a + r.b, 0);
  console.log(
    `parallel-${size}: ok=${res.length - fails.length} fail=${fails.length} bytes=${bytes} time=${Date.now() - t0}ms` +
      (fails.length ? ` fails=${JSON.stringify(fails.slice(0, 3))}` : "")
  );
}
