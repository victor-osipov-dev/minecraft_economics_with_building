// Print candidate download links from a page.
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const url = process.argv[2];
const r = await fetch(url, { headers: { "user-agent": UA } });
const html = await r.text();
console.log(`status=${r.status} len=${html.length}`);

const hrefs = [...html.matchAll(/(?:href|src|data-[a-z-]+)="([^"]+)"/gi)].map((m) => m[1]);
const interesting = hrefs.filter((h) => /(schem|nbt|litematic|download|dl\.php|9mcbox|\.zip|file=)/i.test(h));
console.log("--- link-ish ---");
console.log([...new Set(interesting)].join("\n"));

const jsonl = [...html.matchAll(/https?:\/\/[^\s"'<>\\]+/g)].map((m) => m[0]);
console.log("--- urls w/ schem/nbt/dl ---");
console.log([...new Set(jsonl.filter((u) => /(schem|nbt|litematic|9mcbox|download)/i.test(u)))].join("\n"));
