// Quick connectivity + structure probe for schematic sources.
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

async function get(url, opt = {}) {
  const t0 = Date.now();
  const r = await fetch(url, { redirect: "follow", headers: { "user-agent": UA, accept: "*/*" }, ...opt });
  const buf = new Uint8Array(await r.arrayBuffer());
  return { status: r.status, url: r.url, type: r.headers.get("content-type") || "", len: buf.length, buf, ms: Date.now() - t0 };
}

const targets = process.argv.slice(2);
for (const u of targets) {
  try {
    const r = await get(u);
    const isText = /text|html|json/.test(r.type);
    console.log(`\n=== ${u}\n  -> ${r.status} ${r.type} ${r.len}B ${r.ms}ms final=${r.url}`);
    if (isText) {
      const s = new TextDecoder().decode(r.buf).replace(/\s+/g, " ");
      console.log("  " + s.slice(0, 1200));
    }
  } catch (e) {
    console.log(`\n=== ${u}\n  !! ${e.message}`);
  }
}
