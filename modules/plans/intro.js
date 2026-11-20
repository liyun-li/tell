// How-to-play card for Who Lives Like This? (hub intro hook, see CONTRACT.md). Static, no round data.
const TX = {
  en: { title: '📐 Who Lives Like This?', kitchen: 'kitchen', who: 'Who lived here?', tap: 'tap', peeks: 'free peeks', noBonus: '🏷 all labels = no bonus',
    steps: ['A real floor plan. Tap a ◉ to see what that room was.', 'Pick who lived there from 3 suspects.', 'Right: +2. Peeked at 2 rooms or fewer (◆): +3.'],
    stepsSolo: ['A real floor plan. Tap a ◉ to see what that room was.', 'Pick who lived there from 3 suspects.', 'Guess right after 2 peeks or fewer (◆) for a bonus.'],
    aria: 'Example: a plan with three room dots, one showing “kitchen”, and three answer buttons' },
  zh: { title: '📐 誰會住成這樣？', kitchen: '廚房', who: '誰住過這裡？', tap: '點', peeks: '免費偷看', noBonus: '🏷 全部標籤＝沒加分',
    steps: ['真實的房屋平面圖。點 ◉ 看那間房是做什麼的。', '從 3 個人選裡，猜是誰住在這裡。', '猜中 +2；最多只偷看 2 間（◆）就 +3。'],
    stepsSolo: ['真實的房屋平面圖。點 ◉ 看那間房是做什麼的。', '從 3 個人選裡，猜是誰住在這裡。', '最多只偷看 2 間（◆）就猜中，有加分。'],
    aria: '範例：一張有三個房間圓點的平面圖，其中一個顯示「廚房」，旁邊是三個選項' }
};
function example(t) {
  const dot = (x, y, on) => `<circle cx="${x}" cy="${y}" r="5" fill="${on ? '#bff3ff' : '#7fe3ff2e'}" stroke="#8fe9ff" stroke-width="2"/>`;
  const opt = y => `<rect x="146" y="${y}" width="106" height="22" rx="3" fill="#1b2433" stroke="#eef4fc" stroke-width="1.5"/><rect x="151" y="${y + 5}" width="12" height="12" fill="none" stroke="#7fd3ff" stroke-width="1.5"/><rect x="169" y="${y + 9}" width="${y % 2 ? 70 : 60}" height="4" rx="2" fill="#eef4fc66"/>`;
  return `<svg viewBox="0 0 260 112" role="img" aria-label="${t.aria}" style="display:block;width:100%;height:auto;max-height:8.5rem;font-family:system-ui,sans-serif">
<rect width="260" height="112" rx="6" fill="#163a6e"/>
<g fill="none" stroke="#eef4fc" stroke-width="2"><path d="M10 14h124v88H10z"/><path d="M72 14v30M72 60v42M72 58h18M106 58h28"/></g>
${dot(40, 70, 1)}${dot(103, 45, 0)}${dot(103, 82, 0)}
<rect x="18" y="45" width="44" height="15" rx="3" fill="#0e2a52"/><text x="40" y="56" text-anchor="middle" font-size="10" font-weight="700" fill="#e8f7ff">${t.kitchen}</text>
<text x="48" y="88" font-size="13">👆</text>
<rect x="94" y="18" width="36" height="14" fill="#0e2a52" stroke="#7fd3ff"/><text x="112" y="28.5" text-anchor="middle" font-size="9.5" font-weight="900" fill="#7fd3ff">◆ 2</text>
<text x="199" y="13" text-anchor="middle" font-size="9.5" font-weight="800" fill="#ffd84a">${t.who}</text>
${[0, 1, 2].map(k => opt(20 + k * 28)).join('')}
${[0, 1, 2].map(k => `<text x="157" y="${35 + k * 28}" text-anchor="middle" font-size="9" font-weight="900" fill="#7fd3ff">${k + 1}</text>`).join('')}
</svg><div style="font-size:.78em;opacity:.8;text-align:center;margin-top:.25em">◉ ${t.tap} · ◆ ${t.peeks} · ${t.noBonus}</div>`;
}
// Short landscape screens: the hub card hides the picture (the steps carry the rules); standalone pages lay it out side by side.
const wrap = h => `<style>@media (orientation:landscape) and (max-height:520px){.m-plans .mx-plans{display:none}}</style><div class="mx-plans">${h}</div>`;
export function intro(lang, solo) {
  const t = TX[lang === 'zh' ? 'zh' : 'en'];
  return { title: t.title, steps: (solo ? t.stepsSolo : t.steps).slice(), example: wrap(example(t)) };
}
export default intro;
