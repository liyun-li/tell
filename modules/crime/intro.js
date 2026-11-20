// How-to-play card for Do The Crime (hub intro hook, see CONTRACT.md). Static, no case data.
const TX = {
  en: { title: '⚖️ Do The Crime', a: 'Case A', b: 'Case B', got: 'Sentenced to', yrs: '4 yrs', more: 'More time?',
    steps: ['Two real US federal cases. One shows its sentence.', 'Tap the one that got more prison time.', '3 match-ups, +1 each. The revealed case stays for the next one.'],
    stepsSolo: ['Two real US federal cases. One shows its sentence.', 'Tap the one that got more prison time.', 'Each right call grows your 🔥 streak. The revealed case stays for the next one.'] },
  zh: { title: '⚖️ 關多久？', a: '案件 A', b: '案件 B', got: '判刑', yrs: '4 年', more: '誰比較久？',
    steps: ['兩件真實的美國聯邦案件，其中一件會先告訴你判多久。', '點你覺得被關比較久的那一件。', '一輪比 3 次，每次猜中 +1；揭曉的那件會留到下一題。'],
    stepsSolo: ['兩件真實的美國聯邦案件，其中一件會先告訴你判多久。', '點你覺得被關比較久的那一件。', '猜中就累積 🔥 連勝；揭曉的那件會留到下一題。'] }
};
function example(t) {
  const card = (n, v, q) => `<div style="flex:1;min-width:0;border-radius:.5em;background:#f3e9d8;color:#1d1712;padding:.35em .5em;display:flex;flex-direction:column;gap:.25em">
<span style="font:700 .75em ui-monospace,monospace;color:#6d5f50">${n}</span><span style="display:block;height:.45em;width:85%;background:#0002;border-radius:.3em"></span>
<span style="font-size:.7em;color:#6d5f50">${t.got}</span><b style="font:900 1.05em ui-monospace,monospace;color:${q ? '#d8321b' : '#1d1712'}">${v}</b></div>`;
  return `<div aria-hidden="true" style="font-size:.85em;display:flex;flex-direction:column;gap:.3em"><div style="text-align:center;font-weight:900">${t.more}</div>
<div style="display:flex;gap:.6em;align-items:center">${card(t.a, t.yrs, 0)}<b style="font-size:.75em;background:#ff4d78;color:#1a0d08;border-radius:999px;padding:.2em .45em">VS</b>${card(t.b, '?', 1)}</div></div>`;
}
// Short landscape screens: the hub card hides the picture (the steps carry the rules); standalone pages lay it out side by side.
const wrap = h => `<style>@media (orientation:landscape) and (max-height:520px){.m-crime .mx-crime{display:none}}</style><div class="mx-crime">${h}</div>`;
export function intro(lang, solo) {
  const t = TX[lang === 'zh' ? 'zh' : 'en'];
  return { title: t.title, steps: (solo ? t.stepsSolo : t.steps).slice(), example: wrap(example(t)) };
}
export default intro;
