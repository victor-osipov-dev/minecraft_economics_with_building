import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";

// The scheme library is referenced by relative URL paths (`schemes/<file>`),
// built at runtime from schemes/index.json — one request per file actually
// used, instead of one import-module request per file at startup.
// This copies the library into dist/ so those paths also work after `build`.
// base './' + relative paths: required for the Yandex Games archive build,
// which is served from an arbitrary subpath inside an iframe.
function copySchemes() {
  return {
    name: "copy-schemes",
    closeBundle() {
      const src = path.resolve("schemes");
      const out = path.resolve("dist/schemes");
      if (!fs.existsSync(src)) return;
      fs.mkdirSync(out, { recursive: true });
      let n = 0;
      for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const from = path.join(src, entry.name);
        const to = path.join(out, entry.name);
        if (entry.isDirectory()) {
          fs.mkdirSync(to, { recursive: true });
          for (const f of fs.readdirSync(from)) {
            fs.copyFileSync(path.join(from, f), path.join(to, f));
            n++;
          }
        } else {
          fs.copyFileSync(from, to);
          n++;
        }
      }
      console.log(`[copy-schemes] ${n} files -> dist/schemes`);
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [copySchemes()],
});
