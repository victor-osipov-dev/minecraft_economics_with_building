const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0 Safari/537.36";

async function text(u) {
  const r = await fetch(u, { headers: { "user-agent": UA } });
  return { status: r.status, body: await r.text(), url: r.url };
}

const url = process.argv[2];
const filter = process.argv[3] || "";
const { status, body } = await text(url);
console.log(`status=${status} len=${body.length}`);
const hrefs = [...body.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
const uniq = [...new Set(hrefs)].filter((h) => !filter || h.includes(filter));
console.log(uniq.join("\n"));
