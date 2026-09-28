const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
async function text(u) {
  const r = await fetch(u, { headers: { "user-agent": UA } });
  return { status: r.status, body: await r.text() };
}

// 1) mcbuild: which download formats does an item offer?
{
  const { status, body } = await text("https://mcbuild.org/schematics/10601:wooden-house");
  const dl = [...body.matchAll(/\/download\/[^"'<> ]+/g)].map((m) => m[0]);
  const fmt = [...body.matchAll(/format=([a-z]+)/g)].map((m) => m[1]);
  console.log(`mcbuild item status=${status} download-links=${JSON.stringify([...new Set(dl)])} formats=${[...new Set(fmt)].join(",")}`);
  const ids = [...body.matchAll(/data-format="([^"]+)"/g)].map((m) => m[1]);
  console.log("  data-format attrs:", JSON.stringify([...new Set(ids)]));
  const btns = body.match(/format[^<]{0,200}/gi)?.slice(0, 6);
  console.log("  format snippets:", JSON.stringify(btns));
}

// 2) mc-schematics: does an item offer formats other than litematic?
{
  const { status, body } = await text("https://mc-schematics.com/s/evil-incorporated-minecraft-build-schematic-ab5425cf17");
  const files = [...body.matchAll(/https?:\/\/files\.mc-schematics\.com\/[^"'<> ]+/g)].map((m) => m[0]);
  console.log(`\nmcschem item status=${status} files=${JSON.stringify([...new Set(files)])}`);
  const alts = [...body.matchAll(/["']([^"']*\.(?:schem|schematic|nbt|litematic))["']/g)].map((m) => m[1]);
  console.log("  quoted file refs:", JSON.stringify([...new Set(alts)].slice(0, 20)));
  const dims = body.match(/\d+\s*[x×]\s*\d+\s*[x×]\s*\d+/);
  console.log("  dims snippet:", dims && dims[0]);
}
