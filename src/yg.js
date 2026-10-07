// Yandex Games SDK: изоляция платформы от игры.
// Вне iframe Яндекса (локалка без прокси, обычный хостинг) всё деградирует
// в гостя: игра работает, облако/реклама/таблица тихо отключены.
//
// Пути подключения по документации (sdk-about#connect):
// - игра загружена архивом в Консоль -> ОТНОСИТЕЛЬНЫЙ путь (рекомендуется);
// - игра на своём домене -> абсолютный путь.
// Относительный /sdk.js — это точка входа: платформа (и локальный прокси
// @yandex-games/sdk-dev-proxy) сама отдаёт актуальную v2. Абсолютный —
// запасной вариант для своего домена.
const SDK_URLS = ["/sdk.js", "https://yandex.ru/games/sdk/v2"];
const SDK_TIMEOUT_MS = 8000;
// Ставится dev.mjs при --no-proxy: скрипты SDK не грузятся вообще.
const NO_SDK = import.meta.env.VITE_YG_NO_SDK === "1";

function loadScript(url, timeoutMs) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    const timer = setTimeout(() => {
      s.remove();
      reject(new Error("sdk load timeout"));
    }, timeoutMs);
    s.onload = () => {
      clearTimeout(timer);
      resolve();
    };
    s.onerror = (e) => {
      clearTimeout(timer);
      s.remove();
      reject(e instanceof Error ? e : new Error("sdk load error"));
    };
    s.src = url;
    document.head.appendChild(s);
  });
}

// Первый рабочий URL из списка.
async function loadSdk() {
  let lastErr = null;
  for (const url of SDK_URLS) {
    try {
      await loadScript(url, SDK_TIMEOUT_MS);
      if (window.YaGames && typeof window.YaGames.init === "function") return url;
      lastErr = new Error("YaGames undefined: " + url);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("sdk unavailable");
}

export const yg = {
  ok: false, // SDK жив и инициализирован
  sdkUrl: "", // какой путь сработал
  mock: false, // локальный dev-режим прокси: вызовы SDK заглушены
  ysdk: null,
  player: null,
  authorized: false,
  playerName: "",
  lang: (navigator.language || "ru").toLowerCase().startsWith("en") ? "en" : "ru",
  device: "desktop",
  advOpen: false, // полноэкранная реклама на экране: сим стоит
  onPause: null, // назначит игра: game_api_pause
  onResume: null, // назначит игра: game_api_resume

  async init() {
    if (NO_SDK) return false;
    try {
      this.sdkUrl = await loadSdk();
      const YG = window.YaGames;
      if (!YG || typeof YG.init !== "function") return false;
      const ysdk = await YG.init();
      this.ysdk = ysdk;
      // Локальный dev-режим (@yandex-games/sdk-dev-proxy --dev-mode):
      // платформы за игрой нет, все ответы — моки.
      try {
        this.mock = !ysdk.environment.appId;
      } catch (e) {
        this.mock = true;
      }
      // Язык интерфейса платформы -> язык игры (заявлены ru+en).
      try {
        const l = ysdk.environment && ysdk.environment.i18n && ysdk.environment.i18n.lang;
        if (typeof l === "string") this.lang = l.toLowerCase().startsWith("ru") ? "ru" : "en";
      } catch (e) {}
      // Тип устройства для плашки про ПК-режим.
      try {
        const t = ysdk.deviceInfo && ysdk.deviceInfo.type;
        if (typeof t === "string") this.device = t;
      } catch (e) {}
      // Игрок: гость работает всегда, имя — только у авторизованных.
      try {
        const player = await ysdk.getPlayer();
        this.player = player;
        try {
          this.authorized = player.isAuthorized();
          if (this.authorized) this.playerName = player.getName() || "";
        } catch (e) {}
      } catch (e) {
        this.player = null;
      }
      // Пауза/возврат от платформы (стартовая реклама, сворачивание, покупки).
      try {
        ysdk.on("game_api_pause", () => {
          if (typeof this.onPause === "function") this.onPause();
        });
        ysdk.on("game_api_resume", () => {
          if (typeof this.onResume === "function") this.onResume();
        });
      } catch (e) {}
      this.ok = true;
      return true;
    } catch (e) {
      return false;
    }
  },

  // Игра загрузилась и готова к взаимодействию (Game Ready).
  gameReady() {
    try {
      if (this.ysdk && this.ysdk.features && this.ysdk.features.LoadingAPI) {
        this.ysdk.features.LoadingAPI.ready();
      }
    } catch (e) {}
  },

  playStart() {
    try {
      if (this.ysdk && this.ysdk.features && this.ysdk.features.GameplayAPI) {
        this.ysdk.features.GameplayAPI.start();
      }
    } catch (e) {}
  },

  playStop() {
    try {
      if (this.ysdk && this.ysdk.features && this.ysdk.features.GameplayAPI) {
        this.ysdk.features.GameplayAPI.stop();
      }
    } catch (e) {}
  },

  // Полноэкранная реклама в логической паузе. Возвращает Promise:
  // резолвится всегда (показана или нет), игра продолжается в .then().
  fullscreenAdv() {
    if (!this.ok || !this.ysdk || !this.ysdk.adv || this.advOpen) return Promise.resolve(false);
    const adv = this.ysdk.adv;
    return new Promise((resolve) => {
      let done = false;
      const fin = (v) => {
        if (done) return;
        done = true;
        this.advOpen = false;
        resolve(v);
      };
      try {
        this.advOpen = true;
        adv.showFullscreenAdv({
          onOpen: () => {},
          onClose: (wasShown) => fin(!!wasShown),
          onError: () => fin(false),
        });
        // страховка: колбэки могут не прийти
        setTimeout(() => fin(false), 60000);
      } catch (e) {
        fin(false);
      }
    });
  },

  // Rewarded: награда только в onRewarded (досмотр засчитан).
  rewarded() {
    if (!this.ok || !this.ysdk || !this.ysdk.adv || this.advOpen) return Promise.resolve(false);
    const adv = this.ysdk.adv;
    return new Promise((resolve) => {
      let done = false;
      let earned = false;
      const fin = () => {
        if (done) return;
        done = true;
        this.advOpen = false;
        resolve(earned);
      };
      try {
        this.advOpen = true;
        adv.showRewardedVideo({
          onOpen: () => {},
          onRewarded: () => {
            earned = true;
          },
          onClose: () => fin(),
          onError: () => fin(),
        });
        setTimeout(fin, 120000);
      } catch (e) {
        fin();
      }
    });
  },

  // Авторизация по осознанному клику (п.1.2.1): кнопка говорит, зачем.
  async auth() {
    if (!this.ok || !this.ysdk) return false;
    try {
      if (this.player && this.player.isAuthorized()) {
        this.authorized = true;
        try {
          this.playerName = this.player.getName() || "";
        } catch (e) {}
        return true;
      }
      await this.ysdk.auth.openAuthDialog();
      const player = await this.ysdk.getPlayer();
      this.player = player;
      this.authorized = player.isAuthorized();
      try {
        this.playerName = this.authorized ? player.getName() || "" : "";
      } catch (e) {}
      return this.authorized;
    } catch (e) {
      return false;
    }
  },

  async cloudSave(data) {
    if (!this.ok || !this.player) return false;
    try {
      await this.player.setData(data, true);
      return true;
    } catch (e) {
      return false;
    }
  },

  async cloudload(keys) {
    if (!this.ok || !this.player) return null;
    try {
      const data = await this.player.getData(keys);
      return data || null;
    } catch (e) {
      return null;
    }
  },

  // Рекорд населения в лидерборд (нужен созданный в консоли 'population').
  // Только для авторизованных; молча пропускаем, если недоступно.
  async submitPopulation(score) {
    if (!this.ok || !this.ysdk || !this.authorized) return false;
    try {
      const avail = await this.ysdk.isAvailableMethod("leaderboards.setScore");
      if (!avail) return false;
      await this.ysdk.leaderboards.setScore("population", Math.max(0, Math.floor(score)));
      return true;
    } catch (e) {
      return false;
    }
  },
};
