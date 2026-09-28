// Inspect schemcraft.com listing: categories, search form, pagination size.
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0 Safari/537.36";
const url = process.argv[2] || "https://www.schemcraft.com/schematics";
const r = await fetch(url, { headers: { "user-agent": UA } });
const h = await r.text();
console.log("status", r.status, "len", h.length);

const cats = [...new Set([...h.matchAll(/category=([a-z0-9-]+)/g)].map((m) => m[1]))];
console.log("categories:", cats.join(", "));

const forms = [...h.matchAll(/<form[\s\S]{0,600}?<\/form>/g)].map((m) => m[0].replace(/\s+/g, " ").slice(0, 300));
console.log("forms:", JSON.stringify(forms.slice(0, 5)));

const inputs = [...h.matchAll(/<input[^>]*>/g)].map((m) => m[0].replace(/\s+/g, " "));
console.log("inputs:", JSON.stringify(inputs.slice(0, 15)));

const items = [...new Set([...h.matchAll(/href="\/schematics\/([a-z0-9-]+)"/g)].map((m) => m[1]))];
console.log("items:", items.length, JSON.stringify(items.slice(0, 8)));
