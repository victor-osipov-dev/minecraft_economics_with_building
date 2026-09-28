const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const j = await (await fetch("https://www.mc-mod.net/wp-json/wp/v2/schematic/562560", { headers: { "user-agent": UA } })).json();
console.log("META:", JSON.stringify(j.meta, null, 2));
console.log("\nCONTENT:", j.content.rendered.slice(0, 2500));

// taxonomy listing
const t = await (await fetch("https://www.mc-mod.net/wp-json/wp/v2/schematic_category?per_page=100", { headers: { "user-agent": UA } })).json();
console.log("\nSCHEMATIC CATEGORIES:");
for (const c of t) console.log(`  ${c.id}\t${c.count}\t${c.slug}\t${c.name}`);
