// How-to-play card for Scam or Startup? (hub intro hook, see CONTRACT.md). Static, no round data.
const TX = {
  en: { title: '🚩 Scam or Startup?', a: '🚩 SCAM', b: '🚀 STARTUP', zoom: '🔍 tap to zoom',
    steps: ['A real company’s website, saved years ago.', '🚩 Scam: later charged with fraud. 🚀 Startup: a legit business, hit or flop.', 'Right: +3.'],
    stepsSolo: ['A real company’s website, saved years ago.', '🚩 Scam: later charged with fraud. 🚀 Startup: a legit business, hit or flop.', 'Tap the page to zoom in on the fine print.'] },
  zh: { title: '🚩 詐騙還是新創？', a: '🚩 詐騙', b: '🚀 新創', zoom: '🔍 點一下放大',
    steps: ['一家真實公司多年前的官網存檔。', '🚩 詐騙：後來被控詐欺。🚀 新創：正派經營，不管後來成敗。', '猜對 +3。'],
    stepsSolo: ['一家真實公司多年前的官網存檔。', '🚩 詐騙：後來被控詐欺。🚀 新創：正派經營，不管後來成敗。', '點網頁可以放大看細節。'] }
};
const btn = (t, bg, fg) => `<span style="flex:1;text-align:center;padding:.35em .2em;border-radius:.4em;background:${bg};color:${fg};font-weight:900">${t}</span>`;
function example(t) {
  return `<div aria-hidden="true" style="display:flex;flex-direction:column;gap:.35em;font-size:.85em">
<div style="border:1px solid #ffffff40;border-radius:.4em;overflow:hidden;background:#fff;color:#333">
<div style="background:#ddd;padding:.15em .5em;font:600 .8em ui-monospace,monospace">● ● ● &nbsp;www.········.com</div>
<div style="padding:.4em .6em;display:flex;flex-direction:column;gap:.25em"><span style="display:block;height:.55em;width:70%;background:#bbb;border-radius:.3em"></span><span style="display:block;height:.4em;width:90%;background:#ddd;border-radius:.3em"></span><span style="font-size:.8em;color:#666;align-self:flex-end">${t.zoom}</span></div></div>
<div style="display:flex;gap:.4em">${btn(t.a, '#ff2e4d', '#1a0004')}${btn(t.b, '#19e07a', '#04210f')}</div></div>`;
}
// Short landscape screens: the hub card hides the picture (the steps carry the rules); standalone pages lay it out side by side.
const wrap = h => `<style>@media (orientation:landscape) and (max-height:520px){.m-sos .mx-sos{display:none}}</style><div class="mx-sos">${h}</div>`;
export function intro(lang, solo) {
  const t = TX[lang === 'zh' ? 'zh' : 'en'];
  return { title: t.title, steps: (solo ? t.stepsSolo : t.steps).slice(), example: wrap(example(t)) };
}
export default intro;
