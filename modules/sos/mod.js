// Scam or Startup → hub module "sos". Data: live https://liyun-li.github.io/scam-or-startup/rounds.json + img/.
// zh.json (this folder) adds Traditional Chinese stamp + fact per round id; missing ids fall back to English.
import { makeGame } from "./engine.js";
import intro from "./intro.js";
export default Object.assign(makeGame({
  id: "sos", repo: "scam-or-startup", icon: "🚩",
  name: { en: "Scam or Startup?", zh: "詐騙還是新創？" },
  answers: ["scam", "startup"], special: "both", specialEmoji: "🤡",
  // No solve-rate data exists for this game → every round is tier 2 (pick() falls back to the whole pool for tier 1/3).
  tierOf: () => 2,
  css: { colA: "#ff2e4d", colB: "#19e07a", fgB: "#062", vpBg: "#fff", ar: 1.6, maxAR: 2.1, pos: "top" },
  zw0: 1280, zh0: 800,
  stampColor: a => a === "startup" ? "#19e07a" : a === "both" ? "#ffd400" : "#ff2e4d",
  srcHtml: (r, T, esc) => (r.sources || []).map((u, k) => `<a href="${esc(u)}" target="_blank" rel="noopener">${T("source")}${r.sources.length > 1 ? " " + (k + 1) : ""}</a>`).join(" · ")
    + (r.archive ? ` · <a href="${esc(r.archive)}" target="_blank" rel="noopener">${T("archive")}</a>` : ""),
  text: {
    en: { a: "🚩 SCAM", b: "🚀 STARTUP", ansA: "🚩 SCAM", ansB: "🚀 STARTUP", specialV: "BOTH 🤡", specialA: "funded AND charged",
      right: ["NAILED IT", "CALLED IT", "CORRECT", "SHARP"], wrong: ["REKT", "WRONG", "BAGHOLDER", "OOF"],
      next: "NEXT →", source: "source", archive: "archive", alt: "Archived landing page", close: "Close",
      hintT: "🔍 tap · pinch", hintM: "🔍 click", zhintT: "pinch · double-tap", zhintM: "ctrl+scroll · double-click" },
    zh: { a: "🚩 詐騙", b: "🚀 新創", ansA: "🚩 詐騙", ansB: "🚀 新創", specialV: "兩個都是 🤡", specialA: "募到錢，也被起訴",
      right: ["神準", "答對", "眼光好", "內行喔"], wrong: ["被割韭菜", "錯了", "套牢", "看走眼"],
      next: "下一題 →", source: "來源", archive: "存檔", alt: "網站存檔畫面", close: "關閉",
      hintT: "🔍 點一下 · 雙指縮放", hintM: "🔍 點一下放大", zhintT: "雙指縮放 · 點兩下", zhintM: "ctrl+滾輪 · 點兩下" }
  }
}), { intro });
