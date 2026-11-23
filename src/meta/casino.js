// Мини-игра в коллекционном казино. Сама по себе постройка экономики не даёт:
// ставка списывается из казны, выигрыш возвращается в неё же.
// Матожидание 0.85 — «ничего не даёт» в долгую, но иногда веселит.
import { charge } from "../city/city.js";

export const CASINO_BETS = [100, 500, 1000];

const REELS = [
  { id: "cherry", icon: "🍒", mult: 0, threshold: 0.65 },
  { id: "lemon", icon: "🍋", mult: 2, threshold: 0.95 },
  { id: "diamond", icon: "💎", mult: 5, threshold: 1.01 },
];

export function spin(city, bet) {
  const amount = Math.round(Number(bet));
  if (!Number.isFinite(amount) || !CASINO_BETS.includes(amount)) return { ok: false, reason: "badBet" };
  if (city.money < amount) return { ok: false, reason: "noMoney" };
  charge(city, amount);
  const r = Math.random();
  const reel = REELS.find((x) => r < x.threshold) || REELS[0];
  const win = Math.round(amount * reel.mult);
  if (win > 0) city.money = Math.round((city.money + win) * 100) / 100;
  return {
    ok: true,
    icon: reel.icon,
    reelId: reel.id,
    mult: reel.mult,
    win,
    net: win - amount,
    balance: city.money,
  };
}
