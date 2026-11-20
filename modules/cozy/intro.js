// How-to-play card for Crime Scene or Cozy Studio? (hub intro hook, see CONTRACT.md). Static, no round data.
const TX = {
  en: { title: '🔪 Crime Scene or Cozy Studio?', a: '🔪 CRIME', b: '🏠 COZY STUDIO', zoom: '🔍 tap to zoom',
    steps: ['A real room, photographed decades ago.', '🔪 Crime: shot after a break-in or theft. 🏠 Cozy: a real home from the same era.', 'Right: +3.'],
    stepsSolo: ['A real room, photographed decades ago.', '🔪 Crime: shot after a break-in or theft. 🏠 Cozy: a real home from the same era.', 'Tap the photo to zoom in.'] },
  zh: { title: '🔪 犯罪現場還是溫馨套房？', a: '🔪 犯罪現場', b: '🏠 溫馨套房', zoom: '🔍 點一下放大',
    steps: ['一張幾十年前拍的真實房間照片。', '🔪 犯罪現場：遭竊或搶案後拍的。🏠 溫馨套房：同年代真的有人住的家。', '猜對 +3。'],
    stepsSolo: ['一張幾十年前拍的真實房間照片。', '🔪 犯罪現場：遭竊或搶案後拍的。🏠 溫馨套房：同年代真的有人住的家。', '點照片可以放大看。'] }
};
const btn = (t, bg, fg) => `<span style="flex:1;text-align:center;padding:.35em .2em;border-radius:.4em;background:${bg};color:${fg};font-weight:900">${t}</span>`;
function example(t) {
  return `<div aria-hidden="true" style="display:flex;flex-direction:column;gap:.35em;font-size:.85em">
<div style="height:3.6em;border:1px solid #ffffff40;border-radius:.4em;background:linear-gradient(135deg,#3a2f28,#6b5a4a 60%,#2a2320);display:flex;align-items:center;justify-content:center;position:relative;font-size:1.4em">🛋️<span style="position:absolute;right:.4em;bottom:.25em;font-size:.55em;color:#fff;opacity:.85">${t.zoom}</span></div>
<div style="display:flex;gap:.4em">${btn(t.a, '#ff2e4d', '#1a0004')}${btn(t.b, '#e9c58f', '#2a1a05')}</div></div>`;
}
// Short landscape screens: the hub card hides the picture (the steps carry the rules); standalone pages lay it out side by side.
const wrap = h => `<style>@media (orientation:landscape) and (max-height:520px){.m-cozy .mx-cozy{display:none}}</style><div class="mx-cozy">${h}</div>`;
export function intro(lang, solo) {
  const t = TX[lang === 'zh' ? 'zh' : 'en'];
  return { title: t.title, steps: (solo ? t.stepsSolo : t.steps).slice(), example: wrap(example(t)) };
}
export default intro;
