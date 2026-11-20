// How-to-play card for Paper Trail / 保單疑雲 (hub intro hook, see CONTRACT.md). Static, no case data.
const TX = {
  en: { title: '🧾 Paper Trail', ex: ['EX.A', 'EX.B', 'EX.C'], v: ['Accident', 'Fraud', 'Murder'], crack: '🔍 What cracked it?', crackSolo: '🔍 What cracked it?',
    steps: ['Exhibits from a real, closed insurance case in Taiwan.', 'Call it: accident, fraud, or murder. Right: +2.', 'Then pick what cracked the case: +1.'] },
  zh: { title: '🧾 保單疑雲', ex: ['證物甲', '證物乙', '證物丙'], v: ['意外', '詐保', '殺人詐保'], crack: '🔍 破綻在哪？', crackSolo: '🔍 破案關鍵是哪個？',
    steps: ['真實、已經定讞的台灣保險案件證物。', '先判斷：意外、詐保，還是殺人詐保？猜中 +2。', '再抓出破綻在哪，抓到 +1。'],
    stepsSolo: ['真實、已經定讞的台灣保險案件證物。', '先判斷：意外、詐保，還是殺人詐保？猜中 +2。', '再挑出破案關鍵，挑中 +1。'] }
};
function example(t, solo) {
  const ex = (n, w) => `<div style="display:flex;gap:.5em;align-items:center"><b style="font:900 .75em ui-monospace,monospace;color:#c9a227;flex:none;width:3.6em">${n}</b><span style="display:block;height:.45em;width:${w}%;background:#ffffff40;border-radius:.3em"></span></div>`;
  const v = s => `<span style="flex:1;text-align:center;padding:.3em .1em;border-radius:.4em;background:#2a2620;border:1px solid #ffffff38;font-weight:800">${s}</span>`;
  return `<div aria-hidden="true" style="font-size:.85em;display:flex;flex-direction:column;gap:.3em">
<div style="border-radius:.5em;background:#1b1914;border:1px solid #ffffff25;padding:.35em .55em;display:flex;flex-direction:column;gap:.25em">${ex(t.ex[0], 80)}${ex(t.ex[1], 62)}${ex(t.ex[2], 72)}</div>
<div style="display:flex;gap:.35em">${t.v.map(v).join('')}</div><div style="text-align:center;opacity:.8;font-size:.9em">→ ${solo ? t.crackSolo : t.crack}</div></div>`;
}
// Short landscape screens: the hub card hides the picture (the steps carry the rules); standalone pages lay it out side by side.
const wrap = h => `<style>@media (orientation:landscape) and (max-height:520px){.m-paper .mx-paper{display:none}}</style><div class="mx-paper">${h}</div>`;
export function intro(lang, solo) {
  const t = TX[lang === 'zh' ? 'zh' : 'en'];
  return { title: t.title, steps: ((solo && t.stepsSolo) || t.steps).slice(), example: wrap(example(t, solo)) };
}
export default intro;
