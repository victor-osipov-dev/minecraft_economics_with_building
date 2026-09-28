const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const page = "https://mcbuild.org/schematics/10601:wooden-house";

const r1 = await fetch(page, { headers: { "user-agent": UA } });
const setCookie = r1.headers.getSetCookie ? r1.headers.getSetCookie() : [];
console.log("cookies from page:", JSON.stringify(setCookie));
const cookie = setCookie.map((c) => c.split(";")[0]).join("; ");
await r1.text();

const variants = [
  { name: "referer+cookie", headers: { "user-agent": UA, referer: page, cookie } },
  { name: "referer only", headers: { "user-agent": UA, referer: page } },
  { name: "accept html", headers: { "user-agent": UA, referer: page, accept: "text/html,application/xhtml+xml" } },
  { name: "bare", headers: { "user-agent": UA } },
];
for (const v of variants) {
  const r = await fetch("https://mcbuild.org/download/schematic=10601?format=schem", { headers: v.headers, redirect: "follow" });
  const buf = new Uint8Array(await r.arrayBuffer());
  const ct = r.headers.get("content-type") || "";
  const cd = r.headers.get("content-disposition") || "";
  const head = new TextDecoder("latin1").decode(buf.slice(0, 60)).replace(/\s+/g, " ");
  console.log(`${v.name}: ${r.status} ${ct} ${buf.length}B cd="${cd}" head="${head}"`);
}
