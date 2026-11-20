// Crime Scene or Cozy Studio → hub module "cozy". Data: live https://liyun-li.github.io/crime-scene-or-cozy-studio/rounds.json + img/.
// zh.json (this folder) adds Traditional Chinese stamp + fact per round id; missing ids fall back to English.
// Photo credit + license link stay on every reveal (CC BY-SA attribution requirement).
import { makeGame } from "./engine.js";
import intro from "./intro.js";
export default Object.assign(makeGame({
  id: "cozy", repo: "crime-scene-or-cozy-studio", icon: "🔪",
  name: { en: "Crime Scene or Cozy Studio?", zh: "犯罪現場還是溫馨套房？" },
  answers: ["crime", "home"],
  // No solve-rate data exists for this game → every round is tier 2.
  tierOf: () => 2,
  css: { colA: "#ff2e4d", colB: "#e9c58f", fgB: "#2a1a05", vpBg: "#000", ar: 1, maxAR: 1.4, pos: "center" },
  zw0: 1000, zh0: 1000,
  stampColor: a => a === "crime" ? "#ff2e4d" : "#e9c58f",
  srcHtml: (r, T, esc) => `📷 <a href="${esc(r.page)}" target="_blank" rel="noopener">${esc(r.credit)}</a> · <a href="${esc(r.license_url)}" target="_blank" rel="noopener">${esc(r.license)}</a> · ${T("edited")}`
    + (r.sources || []).slice(1).map(u => ` · <a href="${esc(u)}" target="_blank" rel="noopener">${T("factsrc")}</a>`).join(""),
  text: {
    en: { a: "🔪 CRIME", b: "🏠 COZY STUDIO", ansA: "🔪 CRIME SCENE", ansB: "🏠 COZY STUDIO",
      right: ["DETECTIVE", "NAILED IT", "CORRECT", "CASE CLOSED", "SHARP"], wrong: ["WRONG", "OOF", "NOPE", "MISREAD"],
      next: "NEXT →", edited: "edited", factsrc: "fact source", alt: "A room", close: "Close",
      hintT: "🔍 tap · pinch", hintM: "🔍 click", zhintT: "pinch · double-tap", zhintM: "ctrl+scroll · double-click" },
    zh: { a: "🔪 犯罪現場", b: "🏠 溫馨套房", ansA: "🔪 犯罪現場", ansB: "🏠 溫馨套房",
      right: ["神探", "神準", "答對", "破案", "眼光好"], wrong: ["錯了", "噢不", "看走眼", "不對"],
      next: "下一題 →", edited: "已修圖", factsrc: "資料來源", alt: "一個房間", close: "關閉",
      hintT: "🔍 點一下 · 雙指縮放", hintM: "🔍 點一下放大", zhintT: "雙指縮放 · 點兩下", zhintM: "ctrl+滾輪 · 點兩下" }
  }
}), { intro });
