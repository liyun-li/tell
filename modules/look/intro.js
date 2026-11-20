// How-to-play card for Look Again (hub intro hook, see CONTRACT.md). Static, no case data, no photo.
const TX = {
  en: { title: '🔎 Look Again', chips: ['Violent', 'White-collar', 'Cyber', 'Terror'],
    steps: ['A real FBI wanted poster. Just the face.', 'Guess which FBI list they’re on. One tap.', 'Gut call: +3. After a 💡 peek at a clue: +1.'] },
  zh: { title: '🔎 再看一眼', chips: ['暴力', '白領', '網路', '恐攻'],
    steps: ['一張真實的 FBI 通緝照，只看臉。', '猜 FBI 把這個人歸在哪一類，點一下就好。', '憑直覺猜中 +3；偷看 💡 線索再猜中 +1。'] }
};
function example(t) {
  const b = (e, s) => `<span style="padding:.35em .4em;border-radius:.45em;background:#1b2027;border:1px solid #ffffff38;color:#eef0f2">${e} ${s}</span>`;
  return `<div aria-hidden="true" style="display:flex;gap:.6em;align-items:stretch;font-size:.85em">
<div style="flex:none;width:4.2em;aspect-ratio:3/4;border-radius:.45em;background:#ece6d6;color:#1d1b17;display:flex;align-items:center;justify-content:center;font:900 1.9em system-ui,sans-serif;position:relative">?<span style="position:absolute;top:.25em;right:.25em;background:#f0b429;color:#111;border-radius:999px;font-size:.36em;padding:0 .45em">+3</span></div>
<div style="flex:1;display:grid;grid-template-columns:1fr 1fr;gap:.35em;align-content:center">${['🔪', '💸', '💻', '💣'].map((e, i) => b(e, t.chips[i])).join('')}</div></div>`;
}
// Short landscape screens: the hub card hides the picture (the steps carry the rules).
const wrap = h => `<style>@media (orientation:landscape) and (max-height:520px){.m-look .mx-look,.mx-look{display:none}}</style><div class="mx-look">${h}</div>`;
export function intro(lang) {
  const t = TX[lang === 'zh' ? 'zh' : 'en'];
  return { title: t.title, steps: t.steps.slice(), example: wrap(example(t)) };
}
export default intro;
