// Who Lives Like This? / 誰會住成這樣？ — hub module (TELL. / 破綻)
// Data: the live game's own round table (inline `const R=[...]` in its index.html) + its img/ folder, same origin.
import intro from './intro.js';
const GAME = '/who-lives-like-this/';
const PEEKS = 2;
const S = {
  en: { drafting: 'DRAFTING…', slow: 'STILL DRAFTING… slow line', lost: 'PLAN LOST IN THE MAIL.', retry: 'RETRY ↻', allLabels: '🏷 all labels',
    noLab: '🙈 no labels · hard mode', coach: '◉ tap dots to peek at rooms', hintT: '🔍 tap · pinch', hintM: '🔍 click to zoom', zhintT: 'pinch · double-tap · tap outside to close',
    zhintM: 'scroll to zoom · drag · Esc to close', close: 'Close', aDots: 'Room dots', alt: 'Floor plan', altZoom: 'Floor plan, full screen', zoomA: 'Full-screen plan',
    right: ['NAILED IT', 'CALLED IT', 'CORRECT', 'CLOCKED', 'SHARP'], wrong: ['NOPE', 'OOF', 'WRONG HOUSE', 'EVICTED', 'MISREAD'],
    barely: '◆ BARELY PEEKED', blind: '◆ BLIND READ', next: 'NEXT →', srcNote: 'recolored, original lettering replaced by tap labels, names redacted', factSrc: 'fact source',
    q: 'Who lived here?', peeksLeft: n => `${n} peeks left for the bonus`, dia: n => `◆ ${n} peeks for +1` },
  zh: { drafting: '繪圖中…', slow: '還在畫…網路有點慢', lost: '圖紙寄丟了。', retry: '重試 ↻', allLabels: '🏷 全部標籤',
    noLab: '🙈 沒標籤，硬猜', coach: '◉ 點圓點偷看房間', hintT: '🔍 點一下 · 雙指縮放', hintM: '🔍 點一下放大', zhintT: '雙指縮放 · 點兩下 · 點外面關閉',
    zhintM: '滾輪縮放 · 拖曳 · Esc 關閉', close: '關閉', aDots: '房間圓點', alt: '平面圖', altZoom: '平面圖（全螢幕）', zoomA: '全螢幕平面圖',
    right: ['命中', '被你抓到', '答對', '看穿了', '眼真尖'], wrong: ['不對', '慘', '走錯家', '被趕出去', '看走眼'],
    barely: '◆ 只瞄一眼', blind: '◆ 盲猜神準', next: '下一題 →', srcNote: '已重新上色，原圖文字改為點擊標籤，名字已塗掉', factSrc: '資料來源',
    q: '誰住過這裡？', peeksLeft: n => `再偷看 ${n} 次內猜中有加分`, dia: n => `◆ 再看 ${n} 間內猜中 +1` }
};
const CSS = `
.m-plans{--bp:#163a6e;--bp2:#0e2a52;--ln:var(--fg,#eef4fc);--cy:#7fd3ff;--ylw:var(--accent2,#ffd84a);--grn:var(--ok,#3ee08f);--red:var(--bad,#ff5a6e);--k:1;
 flex:1 1 0;min-height:0;min-width:0;height:100%;width:100%;position:relative;color:var(--ln);font-family:var(--sans,system-ui,sans-serif)}
.m-plans *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
.m-plans .cq{position:absolute;inset:0;container:mplans/size}
.m-plans .w{height:100%;display:flex;flex-direction:column;gap:clamp(.25rem,1.2cqh,.55rem);min-height:0}
.m-plans .shot{position:relative;overflow:hidden;background:var(--bp);border:2px solid var(--ln);border-radius:calc(var(--radius,.5rem)*.5);flex:1 1 0;min-height:clamp(4rem,22cqh,11rem)}
.m-plans.done .shot{min-height:clamp(3.5rem,16cqh,9rem)}
.m-plans .vp{position:absolute;inset:0;overflow:hidden;touch-action:pan-y;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
.m-plans .vp.zoomed{touch-action:none}
.m-plans .vp img{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:contain;display:block;transform-origin:0 0;will-change:transform;-webkit-user-drag:none;cursor:zoom-in}
.m-plans .ph{position:absolute;inset:0;z-index:4;display:none;flex-direction:column;gap:.7rem;align-items:center;justify-content:center;background:var(--bp);background-image:linear-gradient(#7fd3ff14 1px,transparent 1px),linear-gradient(90deg,#7fd3ff14 1px,transparent 1px);background-size:20px 20px;color:var(--cy);font:900 clamp(.75rem,4cqw,1rem) var(--mono,monospace);letter-spacing:2px;text-align:center;padding:.5rem}
.m-plans .loading .ph,.m-plans .failed .ph{display:flex}
.m-plans .loading .hs,.m-plans .failed .hs,.m-plans .loading .ov,.m-plans .failed .ov,.m-plans .loading img,.m-plans .failed img{visibility:hidden}
.m-plans .ph button{background:var(--ylw);color:#000;border:0;border-radius:4px;font:900 1rem var(--mono,monospace);padding:.6rem 1.2rem}
.m-plans .ov{position:absolute;z-index:3;pointer-events:none}
.m-plans .qtag{left:6px;top:6px;background:var(--ylw);color:#0e2a52;font:900 clamp(.6rem,3.2cqw,.75rem) var(--mono,monospace);letter-spacing:1px;padding:3px 7px;display:none;max-width:calc(100% - 4.5rem);box-shadow:3px 3px 0 #0006}
.m-plans .qtag.on{display:block}
.m-plans .dia{right:6px;top:6px;font:900 clamp(.66rem,3.4cqw,.8rem) var(--sans,sans-serif);color:var(--cy);background:#0e2a52d9;border:1px solid var(--cy);padding:3px 7px}
.m-plans .dia.gone{color:#9fb3cf;border-color:#ffffff40;text-decoration:line-through}
.m-plans.done .dia,.m-plans.nolab .dia,.m-plans.nolab .lbtn{display:none}
.m-plans .coach{left:50%;top:6px;transform:translateX(-50%);max-width:calc(100% - 1rem);background:var(--ylw);color:#000;font:800 clamp(.64rem,3.4cqw,.8rem) var(--sans,sans-serif);padding:3px 9px;border-radius:3px;box-shadow:3px 3px 0 #0006;display:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.m-plans .coach.on{display:block}
.m-plans .qtag.on~.coach{top:calc(12px + 1.4em)}
.m-plans .hint{right:6px;bottom:6px;z-index:1;background:#0e2a52cc;border:1px solid #ffffff55;color:#fff;font:700 clamp(.6rem,3cqw,.75rem) var(--sans,sans-serif);padding:3px 7px;transition:opacity .2s}
.m-plans .lbtn{position:absolute;bottom:6px;left:6px;z-index:3;background:#0e2a52cc;border:1px solid #ffffff55;color:#fff;font:700 clamp(.66rem,3.4cqw,.8rem) var(--sans,sans-serif);padding:.35rem .6rem;min-height:2rem;display:flex;align-items:center;cursor:pointer;user-select:none;-webkit-user-select:none}
.m-plans .lbtn::after{content:"";position:absolute;inset:-6px}
.m-plans .lbtn.on{background:#1f5f8f;border-color:#8fe9ff;color:#bff3ff}
.m-plans .ms{display:none}@media (hover:hover) and (pointer:fine){.m-plans .ms{display:inline}.m-plans .tch{display:none}}
.m-plans .hs{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:2}
.m-plans .hs .d{position:absolute;left:0;top:0;width:40px;height:40px;margin:-20px 0 0 -20px;pointer-events:auto;touch-action:manipulation;cursor:pointer;border-radius:50%;outline:none}
.m-plans .hs .d::before{content:"";position:absolute;left:50%;top:50%;width:10px;height:10px;margin:-7px 0 0 -7px;border:2px solid #8fe9ff;border-radius:50%;background:#7fe3ff2e;box-shadow:0 0 6px 1px #5fd8ffb0}
.m-plans .hs .d.on::before{background:#bff3ff;box-shadow:0 0 8px 2px #5fd8ffd0}
.m-plans .hs .d:focus-visible::before{outline:2px solid #ffd84a;outline-offset:2px}
.m-plans .hs.pulse .d::after{content:"";position:absolute;left:50%;top:50%;width:14px;height:14px;margin:-7px 0 0 -7px;border:1.5px solid var(--ylw);border-radius:50%;animation:mpl-pulse 1.4s ease-out 4;opacity:0;pointer-events:none}
@keyframes mpl-pulse{0%{transform:scale(1);opacity:.75}100%{transform:scale(2.2);opacity:0}}
.m-plans .hs .lb{position:absolute;left:0;top:0;display:none;pointer-events:none;color:#e8f7ff;font:700 .72rem/1.12 var(--sans,sans-serif);letter-spacing:.2px;width:max-content;max-width:120px;padding:1px 3px;border-radius:3px;background:#0e2a5259;text-shadow:0 0 2px #0e2a52,1px 1px 0 #163a6e,-1px -1px 0 #163a6e,1px -1px 0 #163a6e,-1px 1px 0 #163a6e}
.m-plans .hs .lb.on{display:block}
.m-plans .btns{flex:none;display:grid;grid-template-columns:1fr;gap:clamp(.25rem,1cqh,.5rem)}
.m-plans button.o{font:900 clamp(.78rem,min(4.4cqw,3.3cqh),1.06rem)/1.15 var(--mono,monospace);border:2px solid var(--ln);color:var(--ln);background:var(--card,var(--bp));border-radius:calc(var(--radius,.5rem)*.6);padding:clamp(.2rem,1cqh,.5rem) .6rem;min-height:clamp(2.2rem,9cqh,4.2rem);box-shadow:4px 4px 0 #0008;text-align:left;display:flex;align-items:center;gap:.6rem;cursor:pointer;touch-action:manipulation;transition:transform .08s}
.m-plans button.o .k{flex:none;width:1.6rem;height:1.6rem;border:2px solid var(--cy);color:var(--cy);display:flex;align-items:center;justify-content:center;font-size:.9em}
.m-plans button.o .t{min-width:0;overflow-wrap:anywhere}
.m-plans button.o:active{transform:translate(3px,3px);box-shadow:1px 1px 0 #0008}
.m-plans button.o[disabled]{opacity:.45;cursor:default}
.m-plans button.o.right{opacity:1;border-color:var(--grn);background:#13492f}.m-plans button.o.right .k{border-color:var(--grn);color:var(--grn)}
.m-plans button.o.wrong{opacity:1;border-color:var(--red);background:#4a1622}
.m-plans.done .btns{display:none}
.m-plans .rev{display:none;flex:0 1 auto;min-height:0;flex-direction:column;align-items:center;text-align:center;gap:clamp(.1rem,.7cqh,.3rem)}
.m-plans.done .rev{display:flex}
.m-plans .rhead{display:flex;align-items:center;justify-content:center;gap:.7rem;flex-wrap:wrap;flex:none;max-width:100%}
.m-plans .verdict{font:900 calc(var(--k)*clamp(1.2rem,min(8cqw,6cqh),2.6rem))/1 var(--mono,monospace);letter-spacing:2px}
.m-plans .verdict.ok{color:var(--grn)}.m-plans .verdict.no{color:var(--red)}
.m-plans .stamp{display:inline-block;transform:rotate(-4deg) scale(1.9);opacity:0;border:4px double currentColor;padding:1px 8px;font:900 calc(var(--k)*clamp(.8rem,min(4.6cqw,3.4cqh),1.4rem)) var(--mono,monospace);letter-spacing:3px;white-space:nowrap}
.m-plans .stamp.on{animation:mpl-slam .35s cubic-bezier(.2,1.6,.4,1) forwards}
@keyframes mpl-slam{to{transform:rotate(-4deg) scale(1);opacity:1}}
.m-plans .rbody{display:flex;flex-direction:column;align-items:center;gap:inherit;min-height:0;max-width:100%;overflow:hidden;flex:0 1 auto}
.m-plans .mine{font:900 calc(var(--k)*clamp(.72rem,min(3.9cqw,2.8cqh),.94rem)) var(--mono,monospace);color:var(--red)}.m-plans .mine:empty{display:none}
.m-plans .ans{font:900 calc(var(--k)*clamp(.8rem,min(4.4cqw,3.2cqh),1.06rem)) var(--mono,monospace);color:var(--cy)}
.m-plans .fact{font-weight:600;font-size:calc(var(--k)*clamp(.7rem,min(3.9cqw,2.7cqh),.95rem));color:#dbe7f7;max-width:30rem;line-height:1.3}
.m-plans .src{font-size:calc(var(--k)*clamp(.56rem,min(2.9cqw,2cqh),.7rem));color:#9fb3cf;max-width:30rem;line-height:1.3}.m-plans .src a{color:#b9cbe4;padding:10px 3px 0;margin:0 -3px;-webkit-box-decoration-break:clone;box-decoration-break:clone}
.m-plans .toast{font:900 calc(var(--k)*clamp(.74rem,2.8cqh,.95rem)) var(--mono,monospace);color:var(--ylw);flex:none}.m-plans .toast:empty{display:none}
.m-plans .next{flex:none;width:100%;background:var(--ln);color:var(--bg,#0e2a52);border:0;border-radius:calc(var(--radius,.5rem)*.6);font:900 clamp(.95rem,min(5.5cqw,4cqh),1.35rem) var(--mono,monospace);padding:clamp(.35rem,1.8cqh,.8rem);box-shadow:4px 4px 0 #0008;cursor:pointer;margin-top:clamp(.1rem,.6cqh,.3rem)}
.m-plans .arming{pointer-events:none}
.m-plans .shake{animation:mpl-sh .35s}@keyframes mpl-sh{20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
.m-plans .zoom{position:fixed;inset:0;background:#0e2a52;z-index:99;display:none;overscroll-behavior:contain}
.m-plans .zoom.on{display:block}
.m-plans .zvp{position:absolute;inset:0;overflow:hidden;touch-action:none;-webkit-user-select:none;user-select:none}
.m-plans .zvp img{position:absolute;left:0;top:0;max-width:none;height:auto;transform-origin:0 0;will-change:transform;-webkit-user-drag:none;cursor:grab}
.m-plans .zoom .lbtn{bottom:calc(40px + env(safe-area-inset-bottom));left:calc(12px + env(safe-area-inset-left))}
.m-plans .zoom .x{position:absolute;width:44px;height:44px;padding:0;border-radius:50%;background:#fff;color:#000;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px #0008;z-index:2;border:0;cursor:pointer}
.m-plans .zoom .x svg{display:block;width:18px;height:18px}
.m-plans .zhint{position:absolute;left:50%;bottom:calc(14px + env(safe-area-inset-bottom));transform:translateX(-50%);color:#fff9;font:700 .75rem var(--sans,sans-serif);pointer-events:none;width:max-content;max-width:calc(100% - 2rem);text-align:center}
@container mplans (min-aspect-ratio:6/5){
 .m-plans .w{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);grid-template-rows:auto auto minmax(0,1fr);column-gap:clamp(.5rem,2.5cqw,1.5rem);row-gap:.35rem;align-items:start}
 .m-plans .shot,.m-plans.done .shot{grid-column:1;grid-row:1/4;height:100%;min-height:0}
 .m-plans .btns{grid-column:2;grid-row:1}
 .m-plans button.o{min-height:clamp(2rem,16cqh,4rem);font-size:clamp(.76rem,min(2.6cqw,5.5cqh),1.06rem)}
 .m-plans .rev{grid-column:2;grid-row:1/4;align-self:stretch;max-height:100%;justify-content:center}
 .m-plans .verdict{font-size:calc(var(--k)*clamp(1.1rem,9cqh,2.4rem))}.m-plans .stamp{font-size:calc(var(--k)*clamp(.75rem,5cqh,1.2rem))}
 .m-plans .ans{font-size:calc(var(--k)*clamp(.75rem,5cqh,1.06rem))}.m-plans .mine{font-size:calc(var(--k)*clamp(.7rem,4.4cqh,.94rem))}
 .m-plans .fact{font-size:calc(var(--k)*clamp(.68rem,4.4cqh,.95rem))}.m-plans .src{font-size:calc(var(--k)*clamp(.55rem,3.2cqh,.7rem))}
 .m-plans .next{font-size:clamp(.9rem,6.5cqh,1.3rem);padding:clamp(.3rem,2.5cqh,.7rem)}
}
@media (prefers-reduced-motion:reduce){.m-plans *,.m-plans *::before,.m-plans *::after{animation:none!important;transition:none!important}.m-plans .stamp.on{transform:rotate(-4deg);opacity:1}}
`;
function injectCSS() {
  if (document.getElementById('m-plans-css')) return;
  const s = document.createElement('style'); s.id = 'm-plans-css'; s.textContent = CSS; document.head.appendChild(s);
}
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const LO = (r, L) => L === 'zh' && r.zh ? { q: r.zh.q || '', options: r.zh.o, stamp: r.zh.s, fact: r.zh.f, credit: r.zh.c, license: r.zh.l, labels: r.labels.map(l => Object.assign({}, l, { t: l.z || l.t })) }
  : { q: r.q || '', options: r.options, stamp: r.stamp, fact: r.fact, credit: r.credit, license: r.license, labels: r.labels };
let active = null;
let onboarded = false; // first labelled round of a session pulses the dots, like the live game's first visit

// ---- pinch / pan / double-tap (ported from the live game) ----
function PZ(vp, el, o, sig) {
  const MAX = 5, on = (t, n, f, opt) => t.addEventListener(n, f, Object.assign({ signal: sig }, opt || {}));
  const st = { s: 1, x: 0, y: 0 }; let pts = new Map(), g = null, tap = null, lastTap = null, tapT = null, moved = false, multi = false;
  const W = () => el.offsetWidth, H = () => el.offsetHeight, VW = () => vp.clientWidth, VH = () => vp.clientHeight, over = () => W() * st.s > VW() + 1 || H() * st.s > VH() + 1;
  function clamp() { const cw = W() * st.s, ch = H() * st.s, vw = VW(), vh = VH(); st.x = cw <= vw ? (vw - cw) / 2 : Math.min(0, Math.max(vw - cw, st.x)); st.y = ch <= vh ? (vh - ch) / 2 : Math.min(0, Math.max(vh - ch, st.y)) }
  function apply(anim) { clamp(); el.style.transition = anim ? 'transform .22s ease-out' : 'none'; el.style.transform = `translate(${st.x}px,${st.y}px) scale(${st.s})`; vp.classList.toggle('zoomed', st.s > 1.01); o.onChange && o.onChange(st.s); o.onApply && o.onApply(anim) }
  function zoomAt(ns, px, py, anim) { ns = Math.min(MAX, Math.max(1, ns)); const cx = (px - st.x) / st.s, cy = (py - st.y) / st.s; st.s = ns; st.x = px - cx * ns; st.y = py - cy * ns; apply(anim) }
  function reset() { st.s = 1; st.x = 0; st.y = 0; pts.clear(); g = null; clearTimeout(tapT); lastTap = null; apply(false) }
  const loc = t => { const r = vp.getBoundingClientRect(); return [t.clientX - r.left, t.clientY - r.top] };
  function begin() { const a = [...pts.values()]; if (a.length >= 2) { const [p, q] = a; multi = true; g = { d: Math.hypot(p[0] - q[0], p[1] - q[1]) || 1, mx: (p[0] + q[0]) / 2, my: (p[1] + q[1]) / 2, s: st.s, x: st.x, y: st.y } } else if (a.length === 1) { g = { px: a[0][0], py: a[0][1], x: st.x, y: st.y, one: true } } else g = null }
  on(vp, 'touchstart', e => {
    if (e.target.closest && e.target.closest('button')) return; for (const t of e.changedTouches) pts.set(t.identifier, loc(t));
    if (pts.size === 1) { moved = false; multi = false; const [p] = [...pts.values()]; const tg = e.changedTouches[0] && e.changedTouches[0].target; tap = { x: p[0], y: p[1], t: Date.now(), dot: tg && tg.closest ? tg.closest('.d') : null } }
    if (pts.size >= 2 || st.s > 1.01) e.preventDefault(); begin()
  }, { passive: false });
  on(vp, 'touchmove', e => {
    for (const t of e.changedTouches) if (pts.has(t.identifier)) pts.set(t.identifier, loc(t)); if (!g) return; const a = [...pts.values()];
    if (a.length >= 2 && g.d) { e.preventDefault(); const [p, q] = a; const d = Math.hypot(p[0] - q[0], p[1] - q[1]), mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2; const ns = Math.min(MAX, Math.max(1, g.s * d / g.d)); const cx = (g.mx - g.x) / g.s, cy = (g.my - g.y) / g.s; st.s = ns; st.x = mx - cx * ns; st.y = my - cy * ns; moved = true; apply(false) }
    else if (a.length === 1 && g.one) { const dx = a[0][0] - g.px, dy = a[0][1] - g.py; if (Math.hypot(dx, dy) > 8) moved = true; if (st.s > 1.01) { e.preventDefault(); st.x = g.x + dx; st.y = g.y + dy; apply(false) } else if (over() && (g.h || Math.abs(dx) > Math.abs(dy))) { g.h = true; if (e.cancelable) e.preventDefault(); st.x = g.x + dx; apply(false) } }
  }, { passive: false });
  const end = e => {
    for (const t of e.changedTouches) pts.delete(t.identifier);
    if (pts.size === 0) {
      if (e.type === 'touchend' && !moved && !multi && tap && Date.now() - tap.t < 350) {
        e.preventDefault(); const now = Date.now();
        if (tap.dot) { lastTap = null; clearTimeout(tapT); o.onDot && o.onDot(tap.dot) }
        else if (lastTap && now - lastTap.t < 320 && Math.hypot(tap.x - lastTap.x, tap.y - lastTap.y) < 40) { clearTimeout(tapT); lastTap = null; dbl(tap.x, tap.y) }
        else { lastTap = { x: tap.x, y: tap.y, t: now }; const tp = tap; tapT = setTimeout(() => { lastTap = null; o.onTap && o.onTap(tp.x, tp.y, st.s) }, 300) }
      }
      g = null; tap = null
    } else begin()
  };
  on(vp, 'touchend', end, { passive: false }); on(vp, 'touchcancel', end);
  ['gesturestart', 'gesturechange'].forEach(n => on(vp, n, e => e.preventDefault()));
  function dbl(x, y) { if (st.s > 1.01) { st.s = 1; st.x = 0; st.y = 0; apply(true) } else zoomAt(2.5, x, y, true) }
  let lt = 0; on(vp, 'touchstart', () => lt = Date.now(), { passive: true });
  on(vp, 'click', e => { if (Date.now() - lt < 800) return; if (e.target.closest && e.target.closest('button')) return; if (o.mouseClick) o.mouseClick(e) });
  on(vp, 'dblclick', e => { if (Date.now() - lt < 800) return; if (o.mouseDbl) { const [x, y] = loc(e); dbl(x, y) } });
  on(vp, 'wheel', e => { if (!(e.ctrlKey || o.wheel)) return; e.preventDefault(); const [x, y] = loc(e); zoomAt(st.s * Math.exp(-e.deltaY * (e.ctrlKey ? .01 : .0015)), x, y, false) }, { passive: false });
  let drag = null; on(vp, 'mousedown', e => { if (!over() || e.button) return; drag = { px: e.clientX, py: e.clientY, x: st.x, y: st.y }; e.preventDefault() });
  on(window, 'mousemove', e => { if (!drag) return; if (Math.hypot(e.clientX - drag.px, e.clientY - drag.py) > 4) drag.m = true; st.x = drag.x + e.clientX - drag.px; st.y = drag.y + e.clientY - drag.py; apply(false) });
  on(window, 'mouseup', () => { if (drag) setTimeout(() => drag = null, 0) });
  return { st, reset, apply, zoomAt, get dragging() { return !!(drag && drag.m) } }
}

// ---- room labels (ported) ----
function mkLB(lay, btns, onPeek, getL, sig) {
  const L = { data: [], open: new Set(), all: false, reveal: false, hover: -1, last: -1 };
  const vis = i => L.all || L.reveal || L.open.has(i) || L.hover === i;
  const peek = (i, all) => { if (!L.reveal) onPeek(i, all) };
  let hovT = null;
  function build() {
    lay.forEach(ly => {
      ly.hs.innerHTML = ''; ly.dots = []; ly.lbs = [];
      L.data.forEach((d, i) => {
        const dot = document.createElement('div'); dot.className = 'd'; dot.setAttribute('role', 'button'); dot.tabIndex = i === 0 ? 0 : -1; dot.setAttribute('aria-label', getL() === 'zh' ? d.t : d.t.toLowerCase()); dot.dataset.i = i;
        const lb = document.createElement('div'); lb.className = 'lb'; lb.textContent = d.t; lb.setAttribute('aria-hidden', 'true');
        ['mousedown', 'dblclick', 'wheel'].forEach(n => dot.addEventListener(n, e => { e.stopPropagation(); if (n === 'dblclick') e.preventDefault() }, { passive: n === 'wheel' }));
        dot.addEventListener('click', e => { e.stopPropagation(); e.preventDefault(); toggle(i) });
        dot.addEventListener('keydown', e => {
          const k = e.key; if (k === 'Enter' || k === ' ') { e.preventDefault(); e.stopPropagation(); toggle(i); return }
          const mv = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[k]; let to = null; if (mv) to = (i + mv + ly.dots.length) % ly.dots.length; if (k === 'Home') to = 0; if (k === 'End') to = ly.dots.length - 1;
          if (to != null) { e.preventDefault(); e.stopPropagation(); ly.dots.forEach((x, j) => x.tabIndex = j === to ? 0 : -1); ly.dots[to].focus() }
        });
        dot.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { L.hover = i; sync(); clearTimeout(hovT); hovT = setTimeout(() => { if (L.hover === i) peek(i) }, 350) } });
        dot.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse' && L.hover === i) { L.hover = -1; clearTimeout(hovT); sync() } });
        ly.hs.appendChild(dot); ly.hs.appendChild(lb); ly.dots.push(dot); ly.lbs.push(lb)
      })
    }); sync()
  }
  function toggle(i) { if (L.all || L.reveal) { L.last = i; sync(); return } if (L.open.has(i)) L.open.delete(i); else { L.open.add(i); peek(i) } if (L.hover === i && !L.open.has(i)) L.hover = -2; sync() }
  function sync() {
    btns.forEach(b => { b.classList.toggle('on', L.all); b.setAttribute('aria-pressed', L.all) });
    lay.forEach(ly => { if (!ly.dots) return; ly.dots.forEach((d, i) => { d.classList.toggle('on', vis(i)); d.setAttribute('aria-pressed', vis(i)) }); ly.lbs.forEach((b, i) => b.classList.toggle('on', vis(i))) }); place(0); place(1)
  }
  function place(li, anim) {
    const ly = lay[li]; if (!ly.dots || !ly.dots.length) return; const el = ly.el, pz = ly.pz(); if (!pz || !el.naturalWidth) return;
    const W = el.offsetWidth, H = el.offsetHeight; if (!W || !H) return; const nw = el.naturalWidth, nh = el.naturalHeight; const k = Math.min(W / nw, H / nh), cw = nw * k, ch = nh * k, ox = (W - cw) / 2, oy = (H - ch) / 2;
    const st = pz.st, VW = ly.vp.clientWidth, VH = ly.vp.clientHeight;
    const P = L.data.map(d => [st.x + st.s * (ox + d.x * cw), st.y + st.s * (oy + d.y * ch)]);
    P.forEach((p, i) => { let m = 44; P.forEach((q, j) => { if (j !== i) m = Math.min(m, Math.hypot(p[0] - q[0], p[1] - q[1])) }); const sz = Math.max(24, Math.min(44, Math.floor(m))); const d = ly.dots[i]; d.style.left = p[0] + 'px'; d.style.top = p[1] + 'px'; d.style.width = d.style.height = sz + 'px'; d.style.margin = `${-sz / 2}px 0 0 ${-sz / 2}px` });
    const vr = ly.vp.getBoundingClientRect(), placed = [...ly.vp.parentNode.querySelectorAll(':scope>.hint,:scope>.lbtn,:scope>.dia,:scope>.coach.on')].filter(e => e.offsetParent && getComputedStyle(e).opacity !== '0' && getComputedStyle(e).display !== 'none').map(e => { const q = e.getBoundingClientRect(); return [q.left - vr.left - 3, q.top - vr.top - 3, q.right - vr.left + 3, q.bottom - vr.top + 3] }), ov = (a, b) => Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));
    const DR = P.map(p => [p[0] - 8, p[1] - 8, p[0] + 8, p[1] + 8]);
    const dense = L.all || L.reveal, prot = i => i === L.last || L.open.has(i) || L.hover === i, pri = i => (i === L.last ? 4 : 0) + (prot(i) ? 2 : 0) + (L.reveal && L.data[i].k ? 1 : 0);
    const order = L.data.map((_, i) => i).filter(vis).sort((a, b) => pri(b) - pri(a) || L.data[b].t.length - L.data[a].t.length), PL = [];
    order.forEach(i => {
      const b = ly.lbs[i], p = P[i]; const bw = b.offsetWidth, bh = b.offsetHeight;
      const C = [[p[0] + 10, p[1] - bh / 2], [p[0] - 10 - bw, p[1] - bh / 2], [p[0] - bw / 2, p[1] - bh - 9], [p[0] - bw / 2, p[1] + 9], [p[0] + 8, p[1] - bh - 4], [p[0] + 8, p[1] + 4], [p[0] - 8 - bw, p[1] - bh - 4], [p[0] - 8 - bw, p[1] + 4], [p[0] + 10, p[1] - bh * 1.5 - 6], [p[0] + 10, p[1] + bh / 2 + 6], [p[0] - 10 - bw, p[1] - bh * 1.5 - 6], [p[0] - 10 - bw, p[1] + bh / 2 + 6]];
      let best = null, bs = 1e18;
      for (let c = 0; c < C.length; c++) { let x = Math.max(4, Math.min(VW - bw - 4, C[c][0])), y = Math.max(4, Math.min(VH - bh - 4, C[c][1])); const r = [x, y, x + bw, y + bh]; let sc = c * 0.5 + (Math.abs(x - C[c][0]) + Math.abs(y - C[c][1])) * 2; placed.forEach(q => sc += ov(r, q) * 4); DR.forEach((q, j) => { sc += ov(r, q) * (j === i ? 20 : 3) }); if (sc < bs) { bs = sc; best = r } if (sc < 1) break }
      let lo = 0; PL.forEach(q => lo += ov(best, q)); const hide = dense && !prot(i) && lo > 12; b.style.visibility = hide ? 'hidden' : ''; if (hide) return;
      placed.push([best[0] - 2, best[1] - 1, best[2] + 2, best[3] + 1]); PL.push(best); b.style.left = best[0] + 'px'; b.style.top = best[1] + 'px'
    })
  }
  function closeOpen() { if (L.all || L.reveal || !L.open.size) return false; L.open.clear(); sync(); return true }
  function setAll(v) { L.all = v; if (v) peek(-1, true); if (!v) L.open.clear(); sync() }
  btns.forEach(b => {
    ['touchstart', 'touchend', 'mousedown', 'click', 'dblclick'].forEach(n => b.addEventListener(n, e => e.stopPropagation(), { passive: true }));
    b.addEventListener('click', () => { if (!L.reveal || L.all) setAll(!L.all) }); b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setAll(!L.all) } })
  });
  document.addEventListener('click', e => { if (!L.open.size || L.all || L.reveal) return; if (e.target.closest && e.target.closest('.vp,.zvp,.lbtn')) return; closeOpen() }, { signal: sig });
  return { L, build, sync, place, closeOpen, setAll, toggle, relabel(d) { L.data = d || []; build() }, load(d) { L.data = d || []; L.last = -1; L.open.clear(); L.all = false; L.reveal = false; L.hover = -1; build() }, reveal() { L.reveal = true; sync() } }
}

function parseRounds(html) {
  const line = html.split('\n').find(l => l.startsWith('const R=['));
  if (!line) return null;
  return JSON.parse(line.slice(8).replace(/;\s*$/, ''));
}

export default {
  id: 'plans',
  name: { en: 'Who Lives Like This?', zh: '誰會住成這樣？' },
  icon: '📐',
  intro,
  async load(ctx) {
    const base = (ctx && ctx.base || 'https://liyun-li.github.io') + GAME;
    let R = null, err;
    for (let k = 0; k < 3 && !R; k++) {
      try { const r = await fetch(base, { cache: 'no-cache' }); if (!r.ok) throw new Error('http ' + r.status); R = parseRounds(await r.text()) }
      catch (e) { err = e; await new Promise(r => setTimeout(r, 500 * (k + 1))) }
    }
    if (!R) { // fallback: the game's rounds.json (no tiers / no Chinese)
      const r = await fetch(base + 'rounds.json', { cache: 'no-cache' }); if (!r.ok) throw err || new Error('load');
      R = (await r.json()).map(x => Object.assign({ tier: x.labels && x.labels.length ? 2 : 3 }, x));
    }
    const rounds = R.filter(r => r && r.id && r.img && Array.isArray(r.options) && r.options.length === 3 && r.answer >= 0 && r.answer < 3 && Array.isArray(r.labels))
      .sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    if (!rounds.length) throw new Error('empty');
    return { base, rounds };
  },
  pick(pool, rng, tier) {
    const t = Math.max(1, Math.min(3, Math.round(tier) || 1));
    let L = pool.rounds.filter(r => (r.tier || 2) === t);
    if (!L.length) L = pool.rounds;
    const r = L[Math.floor(rng() * L.length) % L.length];
    return { id: r.id, tier: r.tier || t, r, base: pool.base };
  },
  setLang(lang) { if (active) active.setLang(lang) },
  render(round, el, ctx2) {
    injectCSS();
    return new Promise(resolve => {
      const r = round.r, ac = new AbortController(), sig = ac.signal;
      let L = (ctx2 && ctx2.lang) === 'zh' ? 'zh' : 'en';
      const T = k => (S[L] && k in S[L]) ? S[L][k] : S.en[k];
      const nolab = !r.labels.length;
      const root = document.createElement('div'); root.className = 'm-plans' + (nolab ? ' nolab' : '');
      root.innerHTML = `<div class="cq"><div class="w">
<div class="shot loading" data-r="shot"><div class="vp" data-r="vp"><img data-r="img" draggable="false" alt=""><div class="hs" data-r="hs" role="group"></div><div class="ph" data-r="ph" role="status"><span data-r="phTxt"></span><button type="button" data-r="retry" hidden></button></div></div><div class="lbtn" data-r="lbtn" role="button" tabindex="0" aria-pressed="false"></div><div class="ov qtag" data-r="qtag"></div><div class="ov dia" data-r="dia" aria-hidden="true"></div><div class="ov coach" data-r="coach" aria-hidden="true"></div><div class="ov hint" data-r="hint" aria-hidden="true"><span class="tch" data-r="hintT"></span><span class="ms" data-r="hintM"></span></div></div>
<div class="btns" data-r="btns" role="group">${[0, 1, 2].map(b => `<button type="button" class="o" data-b="${b}" disabled><span class="k" aria-hidden="true">${b + 1}</span><span class="t"></span></button>`).join('')}</div>
<div class="rev" data-r="rev" aria-live="polite"><div class="rhead"><div class="verdict" data-r="verdict"></div><div class="stamp" data-r="stamp"></div></div><div class="toast" data-r="toast"></div><div class="rbody" data-r="rbody"><div class="mine" data-r="mine"></div><div class="ans" data-r="ans"></div><div class="fact" data-r="fact"></div><div class="src" data-r="src"></div></div><button type="button" class="next" data-r="next"></button></div>
</div></div>
<div class="zoom" data-r="zoom" role="dialog"><div class="zvp" data-r="zvp"><img data-r="zimg" draggable="false" alt=""><div class="hs" data-r="zhs" role="group"></div></div><div class="lbtn" data-r="zlbtn" role="button" tabindex="0" aria-pressed="false"></div><button type="button" class="x" data-r="zx"><svg viewBox="0 0 18 18" aria-hidden="true"><path d="M2 2L16 16M16 2L2 16" stroke="#000" stroke-width="2.6" stroke-linecap="round"/></svg></button><div class="zhint"><span class="tch" data-r="zhintT"></span><span class="ms" data-r="zhintM"></span></div></div>`;
      const $ = n => root.querySelector(`[data-r="${n}"]`);
      const B = [...root.querySelectorAll('button.o')];
      el.appendChild(root);
      let loading = true, locked = false, pick = -1, peeked = new Set(), allUsed = false, revT = 0, slowT = null, vk = 0, finished = false, res = null;
      const img = $('img'), zimg = $('zimg'), shot = $('shot');
      const src = round.base + r.img;

      function diaUI() { const left = PEEKS - peeked.size, e = $('dia'); const gone = allUsed || left < 0; e.textContent = gone ? '◆' : T('dia')(left); e.classList.toggle('gone', gone); e.title = gone ? '' : T('peeksLeft')(left) }
      function onPeek(k, isAll) { if (locked || loading) return; if (isAll) allUsed = true; else peeked.add(k); diaUI(); if (!onboarded) { onboarded = true; $('hs').classList.remove('pulse'); $('zhs').classList.remove('pulse'); if (!nolab) $('coach').classList.remove('on') } }
      const LB = mkLB([{ hs: $('hs'), vp: $('vp'), el: img, pz: () => gp }, { hs: $('zhs'), vp: $('zvp'), el: zimg, pz: () => zp }], [$('lbtn'), $('zlbtn')], onPeek, () => L, sig);

      // full-screen zoom
      const z = $('zoom'), zvp = $('zvp'), zx = $('zx'); let lastFocus = null;
      function layout() { if (!z.classList.contains('on')) return; const vw = zvp.clientWidth, vh = zvp.clientHeight; const ar = (zimg.naturalHeight || 1000) / (zimg.naturalWidth || 1000); const w = Math.min(vw - 20, (vh - 140) / ar, 1000); zimg.style.width = w + 'px'; zimg.style.height = w * ar + 'px'; zp.apply(false); const top = (vh - w * ar) / 2, left = (vw - w) / 2; zx.style.top = `max(calc(10px + env(safe-area-inset-top)),${Math.round(top - 54)}px)`; zx.style.right = `max(calc(10px + env(safe-area-inset-right)),${Math.round(left)}px)` }
      function zopen() { if (shot.classList.contains('loading') || shot.classList.contains('failed')) return; lastFocus = document.activeElement; zimg.src = img.src; z.classList.add('on'); LB.build(); zp.reset(); layout(); if (!zimg.complete) zimg.onload = () => { layout(); LB.place(1) }; zx.focus({ preventScroll: true }) }
      function zclose() { if (!z.classList.contains('on')) return; z.classList.remove('on'); zp.reset(); if (lastFocus && lastFocus.focus && root.contains(lastFocus)) lastFocus.focus({ preventScroll: true }) }
      const dotTap = d => LB.toggle(+d.dataset.i);
      const zp = PZ(zvp, zimg, { wheel: true, mouseDbl: true, onDot: dotTap, onApply: a => LB.place(1, a), onTap: (x, y, s) => { if (LB.closeOpen()) return; if (s > 1.01) return; const rr = zimg.getBoundingClientRect(), v = zvp.getBoundingClientRect(), X = x + v.left, Y = y + v.top; if (X < rr.left || X > rr.right || Y < rr.top || Y > rr.bottom) zclose() }, mouseClick: e => { if (LB.closeOpen()) return; if (e.target === zvp) zclose() } }, sig);
      const gp = PZ($('vp'), img, { onDot: dotTap, onTap: (x, y, s) => { if (LB.closeOpen()) return; if (s <= 1.01) zopen() }, mouseClick: () => { if (gp.dragging) return; if (LB.closeOpen()) return; if (gp.st.s <= 1.01) zopen() }, onChange: s => { $('hint').style.opacity = s > 1.01 ? 0 : 1 }, onApply: a => LB.place(0, a) }, sig);
      zx.addEventListener('click', e => { e.stopPropagation(); zclose() });
      document.addEventListener('keydown', e => {
        if (!root.isConnected) return;
        if (e.key === 'Escape' && z.classList.contains('on')) { e.stopPropagation(); zclose(); return }
        if (z.classList.contains('on') || e.ctrlKey || e.metaKey || e.altKey) return;
        if (e.target.closest && e.target.closest('input,textarea')) return;
        const k = e.key.toLowerCase();
        if (k === 'l' && !LB.L.reveal && !loading && !nolab) { LB.setAll(!LB.L.all); return }
        if (!locked) { if (k === '1' || k === '2' || k === '3') guess(+k - 1) }
        else if (k === 'enter' || k === 'n' || k === 'arrowright') { if (e.target.closest && e.target.closest('a')) return; e.preventDefault(); userNext() }
      }, { signal: sig, capture: true });

      function fit() {
        const rb = $('rbody'); let k = 1; root.style.setProperty('--k', k);
        if (!locked) { gp.apply(false); LB.place(0); return }
        const rev = $('rev'); const over = () => rb.scrollHeight > rb.clientHeight + 1 || rev.scrollHeight > rev.clientHeight + 1;
        while (over() && k > .55) { k -= .05; root.style.setProperty('--k', k.toFixed(2)) }
        gp.apply(false); LB.place(0)
      }
      if (window.ResizeObserver) { let rq = 0; const ro = new ResizeObserver(() => { if (!rq) rq = requestAnimationFrame(() => { rq = 0; fit(); layout(); LB.place(1) }) }); ro.observe(root); ro.observe($('vp')); sig.addEventListener('abort', () => ro.disconnect()) }

      function texts() {
        const o = LO(r, L);
        img.alt = T('alt'); zimg.alt = T('altZoom'); z.setAttribute('aria-label', T('zoomA')); zx.setAttribute('aria-label', T('close'));
        $('hs').setAttribute('aria-label', T('aDots')); $('zhs').setAttribute('aria-label', T('aDots'));
        $('lbtn').textContent = T('allLabels'); $('zlbtn').textContent = T('allLabels');
        $('hintT').textContent = T('hintT'); $('hintM').textContent = T('hintM'); $('zhintT').textContent = T('zhintT'); $('zhintM').textContent = T('zhintM');
        $('retry').textContent = T('retry'); if (loading) $('phTxt').textContent = T('drafting'); if (shot.classList.contains('failed')) $('phTxt').textContent = T('lost');
        $('qtag').textContent = o.q || T('q'); $('qtag').classList.toggle('on', true);
        $('btns').setAttribute('aria-label', T('q'));
        $('coach').textContent = nolab ? T('noLab') : T('coach');
        B.forEach((b, j) => b.querySelector('.t').textContent = o.options[j]);
        $('next').textContent = (ctx2 && typeof ctx2.t === 'function' && ctx2.t('next') !== 'next') ? ctx2.t('next') : T('next');
        LB.relabel(o.labels); if (LB.L.reveal) LB.reveal();
        if (locked) revealText();
      }
      function revealText() {
        const o = LO(r, L), ok = r.answer === pick, bonus = res && res.bonus;
        $('stamp').textContent = o.stamp; $('stamp').style.color = ok ? 'var(--grn)' : 'var(--red)';
        $('verdict').textContent = T(ok ? 'right' : 'wrong')[vk % 5]; $('verdict').className = 'verdict ' + (ok ? 'ok' : 'no');
        $('mine').innerHTML = ok ? '' : `✗ <s>${esc(o.options[pick])}</s>`;
        $('ans').textContent = (ok ? '✓ ' : '→ ') + o.options[r.answer] + (bonus ? '  ◆' : '');
        $('fact').textContent = o.fact;
        const fs = (r.sources || []).slice(1).map(u => ` · <a href="${esc(u)}" target="_blank" rel="noopener" hreflang="en">${esc(T('factSrc'))}</a>`).join('');
        $('src').innerHTML = `📐 <a href="${esc(r.page)}" target="_blank" rel="noopener">${esc(o.credit)}</a> · <a href="${esc(r.license_url)}" target="_blank" rel="noopener">${esc(o.license)}</a> · ${esc(T('srcNote'))}${fs}`;
        $('toast').textContent = bonus ? (peeked.size ? T('barely') : T('blind')) : '';
        requestAnimationFrame(fit)
      }
      function planReady() {
        if (!loading) return; loading = false; clearTimeout(slowT); shot.classList.remove('loading', 'failed');
        if (!locked) B.forEach(b => b.disabled = false); gp.reset(); LB.place(0); fit();
        const a = document.activeElement; if (!locked && root.isConnected && (!a || a === document.body || a.disabled)) B[0].focus({ preventScroll: true })
      }
      function planFail() { if (!loading) return; clearTimeout(slowT); shot.classList.remove('loading'); shot.classList.add('failed'); $('phTxt').textContent = T('lost'); $('retry').hidden = false }
      $('retry').addEventListener('click', e => { e.stopPropagation(); loading = true; shot.classList.remove('failed'); shot.classList.add('loading'); $('phTxt').textContent = T('drafting'); $('retry').hidden = true; img.src = src + (src.includes('?') ? '&' : '?') + 'r=' + Date.now() });
      img.addEventListener('load', () => { planReady(); gp.reset(); LB.place(0) }, { signal: sig });
      img.addEventListener('error', planFail, { signal: sig });

      function guess(g) {
        if (locked || loading || finished) return; locked = true; pick = g; const ok = r.answer === g; const bonus = ok && !allUsed && peeked.size <= PEEKS; vk = Math.floor(Math.random() * 5);
        const o = LO(r, L), pts = ok ? (bonus ? 3 : 2) : 0;
        res = { points: pts, max: 3, correct: ok, bonus, grid: ok ? (bonus ? '🔷' : '🟦') : '🟥',
          summary_en: `📐 ${ok ? '✓' : '✗'} ${r.options[r.answer]}${bonus ? ' ◆' : ''}`, summary_zh: `📐 ${ok ? '✓' : '✗'} ${(r.zh && r.zh.o || r.options)[r.answer]}${bonus ? ' ◆' : ''}` };
        B.forEach((b, j) => { b.disabled = true; b.classList.toggle('right', j === r.answer); b.classList.toggle('wrong', j === g && !ok) });
        if (!ok) { shot.classList.remove('shake'); void shot.offsetWidth; shot.classList.add('shake') }
        if (ctx2 && ctx2.sfx) try { ctx2.sfx(ok ? 'right' : 'wrong') } catch (e) { }
        zclose(); root.classList.add('done'); $('coach').classList.remove('on'); $('hs').classList.remove('pulse'); LB.reveal();
        revealText(); const st = $('stamp'); st.classList.remove('on'); void st.offsetWidth; st.classList.add('on');
        revT = Date.now(); const rv = $('rev'); rv.classList.add('arming'); setTimeout(() => rv.classList.remove('arming'), 350);
        setTimeout(() => { if (root.isConnected) $('next').focus({ preventScroll: true }) }, 60)
      }
      function userNext() { if (!locked || finished || Date.now() - revT < 350) return; finished = true; $('next').disabled = true; cleanup(); resolve(res) }
      B.forEach(b => b.addEventListener('click', () => guess(+b.dataset.b)));
      $('next').addEventListener('click', userNext);
      function cleanup() { ac.abort(); clearTimeout(slowT); zclose(); if (active === ctl) active = null }
      const ctl = { setLang(l) { L = l === 'zh' ? 'zh' : 'en'; texts() } };
      active = ctl;
      if (ctx2 && ctx2.signal) { if (ctx2.signal.aborted) { cleanup(); return } ctx2.signal.addEventListener('abort', () => { if (!finished) { finished = true; cleanup() } }, { once: true }) }

      // first paint
      const first = !onboarded && !nolab;
      $('hs').classList.toggle('pulse', first); $('zhs').classList.toggle('pulse', first); $('coach').classList.toggle('on', first || nolab);
      diaUI(); texts(); LB.load(LO(r, L).labels);
      slowT = setTimeout(() => { if (loading) $('phTxt').textContent = T('slow') }, 3500);
      img.src = src; if (img.complete && img.naturalWidth) Promise.resolve().then(planReady);
    });
  }
};
