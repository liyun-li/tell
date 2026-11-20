// Binary photo-guess engine (shared shape for sos/cozy; each module folder keeps its own copy).
// No globals: every listener is bound to an AbortController and torn down when the round ends.
const MAXZ = 5;
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const rnd = a => a[Math.floor(Math.random() * a.length)];

function PZ(vp, el, o, sig) {
  const st = { s: 1, x: 0, y: 0 }; let pts = new Map(), g = null, tap = null, lastTap = null, tapT = null, moved = false, multi = false;
  const W = () => el.offsetWidth, H = () => el.offsetHeight, VW = () => vp.clientWidth, VH = () => vp.clientHeight,
    over = () => W() * st.s > VW() + 1 || H() * st.s > VH() + 1;
  const L = (t, n, f, opt = {}) => t.addEventListener(n, f, { ...opt, signal: sig });
  function clamp() { const cw = W() * st.s, ch = H() * st.s, vw = VW(), vh = VH();
    st.x = cw <= vw ? (vw - cw) / 2 : Math.min(0, Math.max(vw - cw, st.x)); st.y = ch <= vh ? (vh - ch) / 2 : Math.min(0, Math.max(vh - ch, st.y)); }
  function apply(anim) { clamp(); el.style.transition = anim ? "transform .22s ease-out" : "none"; el.style.transform = `translate(${st.x}px,${st.y}px) scale(${st.s})`; vp.classList.toggle("zoomed", st.s > 1.01); o.onChange && o.onChange(st.s); }
  function zoomAt(ns, px, py, anim) { ns = Math.min(MAXZ, Math.max(1, ns)); const cx = (px - st.x) / st.s, cy = (py - st.y) / st.s; st.s = ns; st.x = px - cx * ns; st.y = py - cy * ns; apply(anim); }
  function reset() { st.s = 1; st.x = 0; st.y = 0; pts.clear(); g = null; clearTimeout(tapT); lastTap = null; apply(false); }
  const loc = t => { const r = vp.getBoundingClientRect(); return [t.clientX - r.left, t.clientY - r.top]; };
  function begin() { const a = [...pts.values()]; if (a.length >= 2) { const [p, q] = a; multi = true; g = { d: Math.hypot(p[0] - q[0], p[1] - q[1]) || 1, mx: (p[0] + q[0]) / 2, my: (p[1] + q[1]) / 2, s: st.s, x: st.x, y: st.y }; } else if (a.length === 1) { g = { px: a[0][0], py: a[0][1], x: st.x, y: st.y, one: true }; } else g = null; }
  L(vp, "touchstart", e => { for (const t of e.changedTouches) pts.set(t.identifier, loc(t));
    if (pts.size === 1) { moved = false; multi = false; const [p] = [...pts.values()]; tap = { x: p[0], y: p[1], t: Date.now() }; }
    if (pts.size >= 2 || st.s > 1.01) e.preventDefault(); begin(); }, { passive: false });
  L(vp, "touchmove", e => { for (const t of e.changedTouches) if (pts.has(t.identifier)) pts.set(t.identifier, loc(t)); if (!g) return;
    const a = [...pts.values()];
    if (a.length >= 2 && g.d) { e.preventDefault(); const [p, q] = a; const d = Math.hypot(p[0] - q[0], p[1] - q[1]), mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
      const ns = Math.min(MAXZ, Math.max(1, g.s * d / g.d)); const cx = (g.mx - g.x) / g.s, cy = (g.my - g.y) / g.s; st.s = ns; st.x = mx - cx * ns; st.y = my - cy * ns; moved = true; apply(false); }
    else if (a.length === 1 && g.one) { const dx = a[0][0] - g.px, dy = a[0][1] - g.py; if (Math.hypot(dx, dy) > 8) moved = true;
      if (st.s > 1.01) { e.preventDefault(); st.x = g.x + dx; st.y = g.y + dy; apply(false); } } }, { passive: false });
  const end = e => { for (const t of e.changedTouches) pts.delete(t.identifier);
    if (pts.size === 0) { if (e.type === "touchend" && !moved && !multi && tap && Date.now() - tap.t < 350) { e.preventDefault(); const now = Date.now();
        if (lastTap && now - lastTap.t < 320 && Math.hypot(tap.x - lastTap.x, tap.y - lastTap.y) < 40) { clearTimeout(tapT); lastTap = null; dbl(tap.x, tap.y); }
        else { lastTap = { x: tap.x, y: tap.y, t: now }; const tp = tap; tapT = setTimeout(() => { lastTap = null; o.onTap && o.onTap(tp.x, tp.y, st.s); }, 300); } }
      g = null; tap = null; } else begin(); };
  L(vp, "touchend", end, { passive: false }); L(vp, "touchcancel", end);
  ["gesturestart", "gesturechange"].forEach(n => L(vp, n, e => e.preventDefault()));
  function dbl(x, y) { if (st.s > 1.01) { st.s = 1; st.x = 0; st.y = 0; apply(true); } else zoomAt(2.5, x, y, true); }
  let lt = 0; L(vp, "touchstart", () => lt = Date.now(), { passive: true });
  L(vp, "click", e => { if (Date.now() - lt < 800) return; o.mouseClick && o.mouseClick(e); });
  L(vp, "dblclick", e => { if (Date.now() - lt < 800) return; if (o.mouseDbl) { const [x, y] = loc(e); dbl(x, y); } });
  L(vp, "wheel", e => { if (!(e.ctrlKey || o.wheel)) return; e.preventDefault(); const [x, y] = loc(e); zoomAt(st.s * Math.exp(-e.deltaY * (e.ctrlKey ? .01 : .0015)), x, y, false); }, { passive: false });
  let drag = null; L(vp, "mousedown", e => { if (!over() || e.button) return; drag = { px: e.clientX, py: e.clientY, x: st.x, y: st.y }; e.preventDefault(); });
  L(window, "mousemove", e => { if (!drag) return; if (Math.hypot(e.clientX - drag.px, e.clientY - drag.py) > 4) drag.m = true; st.x = drag.x + e.clientX - drag.px; st.y = drag.y + e.clientY - drag.py; apply(false); });
  L(window, "mouseup", () => { if (drag) setTimeout(() => drag = null, 0); });
  return { st, reset, apply, zoomAt, get dragging() { return !!(drag && drag.m); } };
}

const CSS = (p, c) => `
.${p}.r{--m-a:${c.colA};--m-b:${c.colB};--m-bfg:${c.fgB};--m-amb:#ffd400;container-type:size;flex:1 1 0;height:100%;width:100%;min-height:0;min-width:0;color:var(--fg,#fff);font-family:var(--sans,system-ui,sans-serif);position:relative;overflow:hidden}
.${p}.r *{box-sizing:border-box}
.${p}.r .in{height:100%;display:flex;flex-direction:column;gap:.6rem}
.${p}.r .shot{flex:1 1 0;min-height:4.5rem;container-type:size;display:flex;align-items:center;justify-content:center}
.${p}.r .vp{position:relative;overflow:hidden;background:${c.vpBg};border-radius:var(--radius,14px);touch-action:pan-y;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;
 width:min(100cqw,100cqh*${c.maxAR});height:min(100cqh,100cqw/${c.ar});box-shadow:0 0 0 2px #fff2}
.${p}.r .vp.zoomed{touch-action:none}
.${p}.r .vp img{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;object-position:${c.pos};display:block;transform-origin:0 0;will-change:transform;-webkit-user-drag:none;cursor:zoom-in}
.${p}.r .hint{position:absolute;bottom:.4rem;right:.4rem;background:#000a;color:#fff;font:700 .7rem system-ui;padding:.2rem .5rem;border-radius:.6rem;pointer-events:none;transition:opacity .2s}
.${p}.r .stamp{position:absolute;left:50%;top:52%;transform:translate(-50%,-50%) rotate(-12deg) scale(3);opacity:0;border:.3rem solid currentColor;padding:.1em .45em;font:900 min(clamp(1rem,11cqmin,3.6rem),calc(min(100cqw,100cqh*${c.maxAR})*.86/(var(--n,8)*.6 + 1.4))) Impact,"Anton","Arial Black",system-ui,sans-serif;letter-spacing:.04em;border-radius:.4rem;background:#000b;text-shadow:0 2px 0 #000;white-space:nowrap;pointer-events:none;max-width:96%;overflow:hidden;text-overflow:ellipsis}
.${p}.r .stamp.on{animation:${p}-slam .35s cubic-bezier(.2,1.6,.4,1) forwards}
@keyframes ${p}-slam{to{transform:translate(-50%,-50%) rotate(-12deg) scale(1);opacity:1}}
.${p}.r .shake{animation:${p}-sh .35s}@keyframes ${p}-sh{20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
.${p}.r .side{flex:none;display:flex;flex-direction:column;gap:.5rem;min-height:0}
.${p}.r .btns{display:grid;grid-template-columns:1fr 1fr;gap:.6rem}
.${p}.r button{font-family:Impact,"Anton","Arial Black",system-ui,sans-serif;border:0;cursor:pointer;border-radius:var(--radius,14px);letter-spacing:.03em;box-shadow:0 .3rem 0 #0009;transition:transform .08s;touch-action:manipulation;min-width:0}
.${p}.r button:active{transform:translateY(3px);box-shadow:0 .1rem 0 #0009}
.${p}.r .g{min-height:clamp(3.2rem,14cqh,6.5rem);font-size:clamp(1.05rem,6.4cqw,2rem);padding:.3rem;line-height:1.05;overflow-wrap:anywhere}
.${p}.r .ga{background:var(--m-a);color:#fff}.${p}.r .gb{background:var(--m-b);color:var(--m-bfg)}
.${p}.r .rev{display:none;flex-direction:column;align-items:center;text-align:center;gap:.25rem;min-height:0}
.${p}.r.done .btns{display:none}.${p}.r.done .rev{display:flex}
.${p}.r .vl{display:flex;flex-wrap:wrap;justify-content:center;align-items:baseline;column-gap:.6rem;line-height:1.05}
.${p}.r .verdict{font:900 clamp(1.3rem,8cqw,2.6rem) Impact,"Anton","Arial Black",system-ui,sans-serif}
.${p}.r .verdict.ok{color:#19e07a}.${p}.r .verdict.no{color:#ff2e4d}
.${p}.r .ans{font:900 clamp(.95rem,4.6cqw,1.3rem) Impact,"Anton","Arial Black",system-ui,sans-serif;letter-spacing:.03em}
.${p}.r .fact{font-weight:700;font-size:clamp(.78rem,3.9cqw,1rem);line-height:1.3;color:var(--fg,#ddd);opacity:.9;max-width:40rem}
.${p}.r .src{font-size:.68rem;color:var(--muted,#888);max-width:100%;line-height:1.3;overflow-wrap:anywhere}.${p}.r .src a{color:inherit}
.${p}.r .next{width:100%;background:var(--fg,#fff);color:var(--bg,#000);font-size:clamp(1.1rem,6cqw,1.6rem);padding:.55rem;margin-top:.15rem}
.${p}.r.lock .side{pointer-events:none}
@container (min-aspect-ratio: 6/5){
 .${p}.r .in{flex-direction:row;align-items:stretch}
 .${p}.r .side{flex:0 0 min(46%,24rem);justify-content:center}
 .${p}.r.done .side{flex-basis:min(58%,30rem)}
 .${p}.r .btns{grid-template-columns:1fr}
 .${p}.r .g{min-height:clamp(2.6rem,22cqh,6rem);font-size:clamp(1rem,min(4cqw,8cqh),2rem)}
 .${p}.r .rev{gap:.15rem}
 .${p}.r .verdict{font-size:clamp(.95rem,min(4.5cqw,9cqh),2.6rem)}.${p}.r .ans{font-size:clamp(.8rem,min(2.6cqw,5.5cqh),1.3rem)}
 .${p}.r .fact{font-size:clamp(.62rem,min(2.4cqw,4.6cqh),1rem);line-height:1.22}
 .${p}.r .src{font-size:clamp(.55rem,3.4cqh,.68rem);line-height:1.2}
 .${p}.r .next{font-size:clamp(.9rem,min(3.4cqw,7cqh),1.6rem);padding:.25rem;margin-top:.1rem}
}
.${p}.r .zoom{position:fixed;inset:0;background:#000f;z-index:9999;display:none;overscroll-behavior:contain}
.${p}.r .zoom.on{display:block}
.${p}.r .zvp{position:absolute;inset:0;overflow:hidden;touch-action:none;-webkit-user-select:none;user-select:none}
.${p}.r .zvp img{position:absolute;left:0;top:0;max-width:none;height:auto;transform-origin:0 0;will-change:transform;-webkit-user-drag:none;cursor:grab}
.${p}.r .zx{position:absolute;width:2.75rem;height:2.75rem;padding:0;border-radius:50%;background:#fff;color:#000;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px #0008;z-index:2;transition:none;font:inherit}
.${p}.r .zx svg{width:1.1rem;height:1.1rem}
.${p}.r .zhint{position:absolute;left:50%;bottom:calc(.9rem + env(safe-area-inset-bottom));transform:translateX(-50%);color:#fff9;font:700 .75rem system-ui;pointer-events:none;white-space:nowrap}
`;

export function makeGame(cfg) {
  let cur = null; // live round handle for setLang
  const L10N = cfg.text;
  const tx = (lang, k) => (L10N[lang === "zh" ? "zh" : "en"][k]);
  const isZh = l => /^zh/i.test(l || "");
  return {
    id: cfg.id, name: cfg.name, icon: cfg.icon,
    async load(ctx) {
      const base = (ctx && ctx.base || "https://liyun-li.github.io").replace(/\/$/, "");
      const root = `${base}/${cfg.repo}/`;
      const [rounds, zh] = await Promise.all([
        fetch(root + "rounds.json", { cache: "no-cache" }).then(r => { if (!r.ok) throw new Error("rounds " + r.status); return r.json(); }),
        fetch(new URL("./zh.json", import.meta.url)).then(r => r.ok ? r.json() : {}).catch(() => ({}))]);
      return rounds.filter(r => r && r.id && r.img && cfg.answers.includes(r.answer)).map(r => ({
        ...r, img: new URL(r.img, root).href, tier: cfg.tierOf ? cfg.tierOf(r) : 2,
        zh: zh[r.id] ? { stamp: zh[r.id][0], fact: zh[r.id][1] } : null }));
    },
    pick(pool, rng, tier) {
      let c = pool.filter(r => r.tier === tier); if (!c.length) c = pool;
      return c[Math.min(c.length - 1, Math.floor(rng() * c.length))];
    },
    setLang(lang) { cur && cur.setLang(lang); },
    render(round, el, ctx2 = {}) {
      return new Promise(resolve => {
        const ac = new AbortController(), sig = ac.signal;
        let lang = isZh(ctx2.lang) ? "zh" : "en";
        const p = "m-" + cfg.id;
        el.innerHTML = `<div class="${p}-w" aria-hidden="true" style="flex:none;height:0;overflow:hidden;visibility:hidden;line-height:0">${"\u2003 ".repeat(80)}</div><div class="${p} r"><style>${CSS(p, cfg.css)}</style><div class="in">
<div class="shot"><div class="vp"><img alt="" draggable="false"><div class="stamp"></div><div class="hint"></div></div></div>
<div class="side"><div class="btns"><button class="g ga" data-g="${cfg.answers[0]}"></button><button class="g gb" data-g="${cfg.answers[1]}"></button></div>
<div class="rev" aria-live="polite"><div class="vl"><div class="verdict"></div><div class="ans"></div></div><div class="fact"></div><div class="src"></div><button class="next"></button></div></div></div>
<div class="zoom"><div class="zvp"><img alt="" draggable="false"></div><button class="zx" aria-label="Close"><svg viewBox="0 0 18 18" aria-hidden="true"><path d="M2 2L16 16M16 2L2 16" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg></button><div class="zhint"></div></div></div>`;
        const R = el.querySelector(".r"), q = s => R.querySelector(s);
        const vp = q(".vp"), img = q(".vp img"), stamp = q(".stamp"), hint = q(".hint"), z = q(".zoom"), zvp = q(".zvp"), zi = q(".zvp img"), zx = q(".zx"), nextB = q(".next");
        const gb = [...R.querySelectorAll(".g")];
        // Fallback when the host container has no definite height: fill to the bottom of the viewport.
        const fixH = () => { if (R.parentElement && R.parentElement.clientHeight < 40) { const top = R.getBoundingClientRect().top; R.style.height = Math.max(240, (visualViewport ? visualViewport.height : innerHeight) - top) + "px"; } };
        requestAnimationFrame(fixH); addEventListener("resize", fixH, { signal: sig });
        let state = "guess", picked = null, ok = false, t0 = Date.now(), tRev = 0, vtext = null;
        const touch = matchMedia("(hover:none),(pointer:coarse)").matches;
        function paint() {
          const T = k => tx(lang, k);
          gb[0].textContent = T("a"); gb[1].textContent = T("b");
          hint.textContent = touch ? T("hintT") : T("hintM"); q(".zhint").textContent = touch ? T("zhintT") : T("zhintM");
          img.alt = T("alt"); zi.alt = T("alt");
          zx.setAttribute("aria-label", T("close"));
          nextB.textContent = T("next");
          if (state === "rev") {
            const zr = lang === "zh" && round.zh;
            stamp.textContent = zr ? round.zh.stamp : round.stamp;
            stamp.style.setProperty("--n", [...stamp.textContent].reduce((n, ch) => n + (/[\u2E80-\uFFEF]/.test(ch) ? 1.65 : 1), 0).toFixed(2));
            if (!vtext) vtext = { en: rnd(ok ? L10N.en.right : L10N.en.wrong), zh: rnd(ok ? L10N.zh.right : L10N.zh.wrong) };
            const v = q(".verdict"); v.className = "verdict " + (ok ? "ok" : "no");
            v.textContent = cfg.special && round.answer === cfg.special ? T("specialV") : vtext[lang];
            q(".ans").textContent = cfg.special && round.answer === cfg.special ? T("specialA") : T(round.answer === cfg.answers[0] ? "ansA" : "ansB");
            q(".fact").textContent = zr ? round.zh.fact : round.fact;
            q(".src").innerHTML = cfg.srcHtml(round, T, esc);
          }
        }
        cur = { setLang(l) { lang = isZh(l) ? "zh" : "en"; paint(); } };
        // zoom overlay
        function layout() { if (!z.classList.contains("on")) return; const vw = zvp.clientWidth, vh = zvp.clientHeight; const ar = (zi.naturalHeight || cfg.zh0) / (zi.naturalWidth || cfg.zw0);
          const w = Math.min(vw - 20, (vh - 120) / ar, zi.naturalWidth || cfg.zw0); zi.style.width = w + "px"; zi.style.height = w * ar + "px"; zp.apply(false);
          const top = (vh - w * ar) / 2, left = (vw - w) / 2;
          zx.style.top = `max(calc(10px + env(safe-area-inset-top)),${Math.round(top - 54)}px)`; zx.style.right = `max(calc(10px + env(safe-area-inset-right)),${Math.round(left)}px)`; }
        const zp = PZ(zvp, zi, { wheel: true, mouseDbl: true, onTap: (x, y, s) => { if (s > 1.01) return; const r = zi.getBoundingClientRect(), v = zvp.getBoundingClientRect(), X = x + v.left, Y = y + v.top; if (X < r.left || X > r.right || Y < r.top || Y > r.bottom) zclose(); }, mouseClick: e => { if (e.target === zvp) zclose(); } }, sig);
        function zopen() { zi.src = img.src; z.classList.add("on"); zp.reset(); layout(); if (!zi.complete) zi.onload = layout; }
        function zclose() { z.classList.remove("on"); zp.reset(); }
        const gp = PZ(vp, img, { onTap: (x, y, s) => { if (s <= 1.01) zopen(); }, mouseClick: () => { if (!gp.dragging && gp.st.s <= 1.01) zopen(); }, onChange: s => { hint.style.opacity = s > 1.01 ? 0 : 1; } }, sig);
        zx.addEventListener("click", e => { e.stopPropagation(); zclose(); }, { signal: sig });
        addEventListener("resize", () => { layout(); gp.apply(false); }, { signal: sig });
        img.addEventListener("load", () => gp.reset(), { signal: sig });
        img.src = round.img;
        R.classList.add("lock"); setTimeout(() => R.classList.remove("lock"), 350); // stray tap from the previous screen
        function guess(g) {
          if (state !== "guess" || Date.now() - t0 < 350) return; // swallow stray taps carried over from the previous screen
          state = "rev"; picked = g; tRev = Date.now();
          ok = (cfg.special && round.answer === cfg.special) || round.answer === g;
          if (!ok) { vp.classList.remove("shake"); void vp.offsetWidth; vp.classList.add("shake"); }
          gb.forEach(b => b.disabled = true);
          stamp.style.color = cfg.stampColor(round.answer); void stamp.offsetWidth; stamp.classList.add("on");
          R.classList.add("done", "lock");
          setTimeout(() => R.classList.remove("lock"), 450); // second tap of a double-tap can't hit Next or a source link
          paint(); ctx2.sfx && ctx2.sfx(ok ? "right" : "wrong");
        }
        gb.forEach(b => b.addEventListener("click", () => guess(b.dataset.g), { signal: sig }));
        function finish() {
          if (state !== "rev" || Date.now() - tRev < 450) return; // double-tap guard: a second tap on the guess can't skip the reveal
          state = "out"; ac.abort(); cur = null;
          const sp = cfg.special && round.answer === cfg.special;
          const zr = round.zh;
          const ansEn = sp ? L10N.en.specialA : L10N.en[round.answer === cfg.answers[0] ? "ansA" : "ansB"];
          const ansZh = sp ? L10N.zh.specialA : L10N.zh[round.answer === cfg.answers[0] ? "ansA" : "ansB"];
          resolve({ points: ok ? 3 : 0, max: 3, correct: ok, grid: sp ? cfg.specialEmoji : ok ? "🟩" : "🟥",
            summary_en: `${cfg.icon} ${ansEn} · ${round.stamp}`, summary_zh: `${cfg.icon} ${ansZh} · ${zr ? zr.stamp : round.stamp}` });
        }
        nextB.addEventListener("click", finish, { signal: sig });
        document.addEventListener("keydown", e => {
          if (z.classList.contains("on")) { if (e.key === "Escape") zclose(); return; }
          const k = e.key.toLowerCase();
          if (state === "guess") { if (k === "s" || k === "arrowleft" || k === "1") guess(cfg.answers[0]); else if (k === "d" || k === "arrowright" || k === "2") guess(cfg.answers[1]); }
          else if (state === "rev" && (k === "enter" || k === " " || k === "n")) { e.preventDefault(); finish(); }
        }, { signal: sig });
        if (ctx2.signal) ctx2.signal.addEventListener("abort", () => { ac.abort(); cur = null; }, { once: true });
        paint();
      });
    }
  };
}
