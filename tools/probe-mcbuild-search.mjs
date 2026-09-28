// Inspect mcbuild.org search-result markup (id / slug / title association).
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0 Safari/537.36";
const q = process.argv[2] || "road";
const r = await fetch(`https://mcbuild.org/search?q=${encodeURIComponent(q)}`, {
  headers: { "user-agent": UA },
});
const h = await r.text();
console.log("status", r.status, "len", h.length);

const titles = [...h.matchAll(/data-title="([^"]*)"/g)].map((m) => m[1]);
console.log("data-titles:", JSON.stringify(titles.slice(0, 20)));

const links = [...h.matchAll(/href="\/schematics\/(\d+):([^"]+)"[^>]*>([\s\S]{0,120}?)<\/a>/g)].map(
  (m) => `${m[1]} | ${m[2]} | ${m[3].replace(/<[^>]+>/g, "").trim().slice(0, 50)}`,
);
console.log("links:", JSON.stringify(links.slice(0, 20)));

const cards = [...h.matchAll(/data-id="(\d+)" data-title="([^"]+)"/g)].map((m) => `${m[1]} | ${m[2]}`);
console.log("cards:", JSON.stringify(cards.slice(0, 20)));

// fallback: anchor text
const anchors = [...h.matchAll(/<a[^>]+href="\/schematics\/(\d+):([^"]+)"[^>]*>([^<]+)<\/a>/g)].map(
  (m) => `${m[1]} | ${m[2]} | ${m[3].trim()}`,
);
console.log("anchors:", JSON.stringify(anchors.slice(0, 20)));
