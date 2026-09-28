// Test a real download from mc-mod / buildschematics mirrors.
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

const urls = process.argv.slice(2);
for (const u of urls) {
  try {
    const t0 = Date.now();
    const r = await fetch(u, { headers: { "user-agent": UA, referer: "https://www.mc-mod.net/" } });
    const buf = new Uint8Array(await r.arrayBuffer());
    const ct = r.headers.get("content-type") || "";
    const cd = r.headers.get("content-disposition") || "";
    const head = new TextDecoder("latin1").decode(buf.slice(0, 4));
    const isGzip = head === "\x1f\x8b\x00\x00" || (buf[0] === 0x1f && buf[1] === 0x8b);
    console.log(`${u}\n  ${r.status} ${ct} ${buf.length}B ${Date.now() - t0}ms gzip=${isGzip} cd="${cd}"`);
    if (!isGzip) console.log("  head:", new TextDecoder("latin1").decode(buf.slice(0, 120)).replace(/\s+/g, " "));
  } catch (e) {
    console.log(`${u}\n  !! ${e.message}`);
  }
}
