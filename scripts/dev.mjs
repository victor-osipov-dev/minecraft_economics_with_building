// Один запуск вместо двух терминалов: Vite + официальный dev-прокси SDK
// Яндекс Игр (@yandex-games/sdk-dev-proxy).
//
//   npm run dev                 vite + прокси в dev-режиме (моки SDK)
//   npm run dev -- --prod       прокси в prod-режиме (реальная платформа)
//   npm run dev -- --no-proxy   только vite, SDK деградирует в гостя
//   npm run dev -- --dist       отдать собранный dist через прокси
//
// Флаги: --port N (vite), --proxy-port N, --host H, --tld ru|com, --app-id ID,
//        --debug-sdk (в баннере даём ссылку с ?debug-sdk=1 — так его читает адаптер)
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const val = (f, d) => {
  const i = argv.indexOf(f);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : d;
};

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
// Vite и прокси должны говорить на ОДНОМ адресе. `localhost` для связки
// vite -> proxy не годится: на части машин (в т.ч. здесь) connect к [::1]
// отбивается фильтром с EACCES, а vite по умолчанию вешается на ::1 —
// прокси получает AggregateError [EACCES, ECONNREFUSED] и отдаёт 500 на /.
// Поэтому адрес задаётся явно и по умолчанию — IPv4 loopback.
const HOST = val("--host", process.env.YG_HOST || "127.0.0.1");
const GAME_PORT = Number(val("--port", process.env.YG_GAME_PORT || 5173));
const PROXY_PORT = Number(val("--proxy-port", process.env.YG_PROXY_PORT || 8080));
const TLD = val("--tld", "ru");
const APP_ID = val("--app-id", null);
const DEBUG_SDK = has("--debug-sdk");
const PROD = has("--prod");
const NO_PROXY = has("--no-proxy");
const DIST = has("--dist");
const MOCK_AUTH = '{"isAuthorized":true}';

const PROXY_BIN = createRequire(import.meta.url).resolve(
  "@yandex-games/sdk-dev-proxy/bin/index.js"
);

let vite = null;
let proxy = null;
let closing = false;

async function shutdown(code = 0) {
  if (closing) return;
  closing = true;
  if (proxy && !proxy.killed) proxy.kill();
  if (vite) {
    try {
      await vite.close();
    } catch (e) {}
  }
  process.exit(code);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
process.on("exit", () => {
  if (proxy && !proxy.killed) proxy.kill();
});

function startProxy() {
  const args = ["--port", String(PROXY_PORT)];
  if (DIST) args.push("-p", path.join(ROOT, "dist"));
  else args.push("-h", `http://${HOST}:${GAME_PORT}`);
  if (!DIST && !PROD) args.push("--dev-mode=true");
  if (TLD) args.push("--tld", TLD);
  if (APP_ID) args.push("--app-id", APP_ID);

  proxy = spawn(process.execPath, [PROXY_BIN, ...args], {
    cwd: ROOT,
    stdio: "inherit",
    env: process.env,
  });
  proxy.on("exit", (code) => {
    if (!closing) {
      console.error(`\n[sdk-dev-proxy] завершился с кодом ${code}. Запуск остановлен.`);
      shutdown(code || 1);
    }
  });
}

function banner() {
  const line = "-".repeat(58);
  console.log(`\n${line}`);
  if (NO_PROXY) {
    console.log("  Только Vite — SDK Яндекс Игр отключится, игра в режиме гостя.");
    console.log(`  Игра:    http://localhost:${GAME_PORT}/`);
  } else {
    console.log(`  Игра:    https://localhost:${PROXY_PORT}/`);
    console.log(
      DIST || PROD
        ? "  Режим:   prod (настоящая платформа, реклама и облако как в бою)"
        : "  Режим:   dev (SDK на моках, без аккаунта Яндекса)"
    );
    if (!DIST && !PROD) {
      const q = DEBUG_SDK ? `debug-sdk=1&mocks=${MOCK_AUTH}` : `mocks=${MOCK_AUTH}`;
      console.log(`  Мок авторизации:  https://localhost:${PROXY_PORT}/?${q}`);
      if (DEBUG_SDK) console.log("                  (в консоли браузера будет лог каждого вызова SDK)");
    }
  }
  console.log(`${line}\n`);
}

async function main() {
  // --no-proxy: игра вообще не дёргает SDK — консоль остаётся чистой.
  if (NO_PROXY) process.env.VITE_YG_NO_SDK = "1";
  if (!DIST) {
    const { createServer } = await import("vite");
    vite = await createServer({
      root: ROOT,
      server: { host: HOST, port: GAME_PORT, strictPort: true, open: false },
    });
    await vite.listen();
  }
  if (!NO_PROXY) startProxy();
  banner();
}

main().catch((e) => {
  console.error(e);
  shutdown(1);
});