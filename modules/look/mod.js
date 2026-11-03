// Look Again / 再看一眼 — hub module (TELL. / 破綻)
// Data: the live game's cached FBI snapshot (cases.json + img/) on liyun-li.github.io. The client never contacts fbi.gov;
// fbi.gov / tips.fbi.gov only appear as links the player can choose to open after the reveal.
// Guardrails kept: missing / parental-kidnapping / seeking-information files are excluded (never scored);
// the portrait is requested only after the guess; one-clue cases are left out so every round has its one hint.
import intro from './intro.js';
const GAME = '/look-again/';
const PTS = [3, 1];
const GMAP = { cyber: 'cyber', spy: 'spy', terror: 'terror', money: 'money', violent: 'violent', gangs: 'violent', topten: 'violent' };
const NEVER = new Set(['missing', 'parental', 'seeking']);
const GROUPS = ['cyber', 'spy', 'terror', 'money', 'violent'];
const CAT = {
  cyber: { en: '💻 Hacking & cyber', zh: '💻 駭客與網路犯罪' }, spy: { en: '🕵️ Spying & national security', zh: '🕵️ 間諜與國家安全' },
  terror: { en: '💣 Terrorism', zh: '💣 恐怖主義' }, money: { en: '💰 Money crimes', zh: '💰 金錢犯罪' }, violent: { en: '🚨 Violent & gang crime', zh: '🚨 暴力與幫派犯罪' }
};
const LIST = { topten: { en: '⭐ FBI Ten Most Wanted', zh: '⭐ FBI 十大通緝要犯' }, gangs: { en: 'Criminal enterprises', zh: '犯罪集團' }, violent: { en: 'Violent crime', zh: '暴力犯罪' },
  cyber: { en: 'Cyber’s Most Wanted', zh: '網路犯罪通緝' }, spy: { en: 'Counterintelligence', zh: '反情報' }, terror: { en: 'Terrorism', zh: '恐怖主義' }, money: { en: 'White-collar crime', zh: '白領犯罪' } };
const S = {
  en: { q: 'What kind of case?', worth: p => `+${p}`, more: p => `💡 Hint <small>→ then worth +${p}</small>`, last: 'Hint used. Make the call!',
    right: p => `✓ Cracked it! +${p}`, wrong: '✗ Not this time', was: 'It was', onList: 'On the list:', tip: 'Seen them? Submit a tip ↗', full: 'Full poster', fbi: 'FBI page ↗',
    next: 'NEXT →', lgWanted: 'Charges are allegations. Presumed innocent until proven guilty.', noPic: 'Photo unavailable', enNote: 'FBI wording:',
    fullFiled: 'FBI list', fullDesc: 'Poster', fullText: 'Details (FBI wording)', fullRm: 'Remarks', fullRw: 'Reward', cutNote: 'Descriptions of appearance are left out here. The FBI page has the full poster.',
    close: 'Close', redacted: 'redacted' },
  zh: { q: '這是哪種案子？', worth: p => `+${p}`, more: p => `💡 看提示 <small>→ 剩 +${p}</small>`, last: '提示用完了，選吧！',
    right: p => `✓ 破案！+${p}`, wrong: '✗ 猜錯了', was: '答案是', onList: '所屬名單：', tip: '見過這人？報給 FBI ↗', full: '完整公告', fbi: 'FBI 官方頁面 ↗',
    next: '下一題 →', lgWanted: '起訴內容僅為指控，未經定罪前推定無罪。', noPic: '照片無法顯示', enNote: 'FBI 原文：',
    fullFiled: 'FBI 名單', fullDesc: '公告', fullText: '案情（FBI 英文原文）', fullRm: '備註', fullRw: '懸賞', cutNote: '此處略去外貌描述；完整公告請見 FBI 官方頁面。',
    close: '關閉', redacted: '已塗黑' }
};
// Difficulty from the opener alone (EN): does clue 1 already carry its own category's words? (same keyword lists as the game's tell-solver)
const KW = {
  cyber: ['computer', 'hack', 'cyber', 'malware', 'ransomware', 'internet', 'online', 'network', 'data', 'crypto', 'bitcoin', 'software', 'server', 'tech', 'virtual'],
  spy: ['russia', 'china', 'chinese', 'iran', 'intelligence', 'export', 'agent', 'foreign', 'government', 'procurement', 'korea', 'beijing', 'moscow', 'tehran', 'military', 'embassy', 'state'],
  terror: ['terror', 'bomb', 'attack', 'embassy', 'qaeda', 'isis', 'hijack', 'explosive', 'hizballah', 'syria', 'iraq', 'yemen', 'lebanon', 'rewards for justice'],
  money: ['fraud', 'scheme', 'money', 'investment', 'bank', 'tax', 'medicare', 'health care', 'investors', 'loan', 'wire', 'ponzi', 'insurance', 'securities'],
  violent: ['murder', 'killed', 'shot', 'gun', 'robbery', 'assault', 'violent', 'gang', 'drug', 'cartel', 'cocaine', 'mexico', 'fled', 'armed']
};
function tierOf(c, g) {
  const t = String(c.k.cl.en[0] || '').toLowerCase(); const s = {}; for (const k of GROUPS) s[k] = KW[k].reduce((n, w) => n + t.split(w).length - 1, 0);
  const own = s[g], other = Math.max(...GROUPS.filter(x => x !== g).map(x => s[x]));
  return own > 0 && own > other ? 1 : other > own ? 3 : 2;
}
const CSS = `
.m-look{--pap:#ece6d6;--ink:#1d1b17;--mut2:#6b6252;--amb:var(--accent2,#f0b429);--grn:var(--ok,#3fb67d);--red:var(--bad,#e0645a);--k:1;
 flex:1 1 0;min-height:0;min-width:0;height:100%;width:100%;position:relative;color:var(--fg,#eef0f2);font-family:var(--sans,system-ui,sans-serif)}
.m-look *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
.m-look .cq{position:absolute;inset:0;container:mlook/size}
.m-look .w{height:100%;display:flex;flex-direction:column;gap:clamp(.25rem,1.1cqh,.55rem);min-height:0}
.m-look button{font:inherit;cursor:pointer;color:inherit;touch-action:manipulation}
.m-look .card{flex:1 1 0;min-height:0;display:flex;flex-direction:column;background:var(--pap);color:var(--ink);border-radius:calc(var(--radius,.55rem)*.8);padding:clamp(.35rem,1.6cqh,.85rem) clamp(.5rem,3.2cqw,1rem);gap:clamp(.2rem,1cqh,.5rem);overflow:hidden;position:relative;box-shadow:0 .3rem 0 #0006}
.m-look .chead{display:flex;justify-content:space-between;align-items:center;gap:.5rem;font:800 clamp(.58rem,min(3.2cqw,2.4cqh),.78rem) var(--mono,monospace);letter-spacing:.1em;color:var(--mut2);border-bottom:1px dashed #0003;padding-bottom:clamp(.12rem,.6cqh,.3rem);flex:none;min-width:0}
.m-look .chead>span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.m-look .worth{color:var(--ink);background:var(--amb);border-radius:999px;padding:.1em .55em;letter-spacing:.04em;flex:none}
.m-look .pop{animation:mlk-pop .35s}
.m-look .ladder{display:flex;gap:.2rem;flex:none;align-items:center}.m-look .ladder i{width:.55em;height:.55em;border-radius:50%;background:#0002;display:block}.m-look .ladder i.on{background:var(--ink)}
.m-look .meta{flex:none;font:700 clamp(.6rem,min(3.3cqw,2.5cqh),.8rem)/1.3 var(--mono,monospace);color:#5e5646;letter-spacing:.02em;overflow-wrap:anywhere}
.m-look .clues{list-style:none;flex:1 1 0;min-height:0;display:flex;flex-direction:column;gap:calc(var(--k)*clamp(.2rem,1cqh,.5rem));overflow:hidden}
.m-look .clues li{display:flex;gap:.45em;align-items:baseline;font:700 calc(var(--k)*clamp(.74rem,min(4.3cqw,3.3cqh),1.02rem))/1.28 var(--mono,monospace);overflow-wrap:anywhere;min-width:0;opacity:.6}
.m-look .clues li b{flex:none;font:900 .72em var(--sans,sans-serif);color:var(--pap);background:var(--mut2);border-radius:999px;min-width:1.6em;text-align:center;padding:.1em .3em}
.m-look .clues li.new{opacity:1;font-size:calc(var(--k)*clamp(.82rem,min(4.9cqw,3.7cqh),1.15rem));animation:mlk-slide .35s cubic-bezier(.2,.9,.3,1.3)}
.m-look .clues li.new b{background:var(--ink)}
.m-look .clues li.still{animation:none}
.m-look .clues mark{background:var(--ink);color:var(--ink);border-radius:2px;padding:0 .1em}
.m-look .clueb{flex:none;align-self:stretch;display:flex;justify-content:center;align-items:center;gap:.5em;background:var(--ink);color:var(--pap);border:0;border-radius:.5rem;font-weight:900;font-size:clamp(.74rem,min(4.1cqw,3.1cqh),.98rem);padding:clamp(.3rem,1.4cqh,.55rem) .6rem;box-shadow:0 .2rem 0 #0006;min-height:2.2rem}
.m-look .clueb small{font-weight:700;opacity:.75}
.m-look .clueb[disabled]{background:none;color:var(--mut2);box-shadow:none;cursor:default}
.m-look .opts{display:grid;grid-template-columns:1fr 1fr;gap:clamp(.3rem,1.1cqh,.5rem);flex:none}
.m-look .opts button{min-width:0;background:var(--card,#1b2027);border:1px solid #ffffff38;border-radius:calc(var(--radius,.6rem)*.85);padding:clamp(.3rem,1.4cqh,.65rem) .4rem;font-weight:800;font-size:clamp(.72rem,min(4cqw,3.05cqh),.98rem);line-height:1.2;min-height:clamp(2.3rem,9cqh,3.4rem);overflow-wrap:anywhere;box-shadow:0 .2rem 0 #0008;transition:transform .08s;color:var(--fg,#eef0f2)}
.m-look .opts button:active,.m-look .clueb:active,.m-look .next:active{transform:translateY(2px) scale(.98)}
.m-look .opts button:last-child:nth-child(odd){grid-column:1/-1}
.m-look .opts button.right{background:#17402c;border-color:var(--grn);animation:mlk-pop .4s}.m-look .opts button.wrong{background:#4a1d1a;border-color:var(--red);animation:mlk-shake .35s}
.m-look .opts button[disabled]{cursor:default}.m-look .opts button[disabled]:not(.right):not(.wrong){opacity:.4}
.m-look .rv{display:none;flex:1 1 0;min-height:0;gap:clamp(.2rem,1cqh,.45rem);flex-direction:column}
.m-look .ask{display:contents}.m-look.done .rv{display:flex}.m-look.done .ask{display:none}
.m-look .rtop{display:flex;gap:clamp(.45rem,2.6cqw,.8rem);min-height:0;flex:0 1 auto;height:clamp(6rem,34cqh,15rem)}
.m-look .pic{flex:none;height:100%;max-height:clamp(5rem,40cqh,16rem);aspect-ratio:4/5;max-width:42%;background:#d9d1bd;border-radius:.35rem;overflow:hidden;display:flex;align-items:center;justify-content:center;font:700 .7rem var(--sans,sans-serif);color:var(--mut2);text-align:center;position:relative}
.m-look.done .pic{animation:mlk-flip .5s cubic-bezier(.2,.9,.3,1.2)}
.m-look .pic img{object-position:50% 25%;width:100%;height:100%;object-fit:cover;display:block}
.m-look .stamp{position:absolute;left:50%;bottom:6%;transform:translateX(-50%) rotate(-8deg);font:900 clamp(.8rem,min(5cqw,3.8cqh),1.2rem) var(--mono,monospace);border:3px solid currentColor;border-radius:.3rem;padding:.05em .35em;background:#ece6d6e6;white-space:nowrap}
.m-look .stamp.ok{color:#17653f}.m-look .stamp.no{color:#a23a31}
.m-look.done .stamp{animation:mlk-stamp .45s .25s both cubic-bezier(.2,.9,.3,1.4)}
.m-look .rinfo{min-width:0;flex:1 1 0;display:flex;flex-direction:column;gap:clamp(.08rem,.5cqh,.28rem);overflow:hidden}
.m-look .verdict{font:900 calc(var(--rk,1)*clamp(.9rem,min(5.2cqw,3.8cqh),1.3rem)) var(--sans,sans-serif)}.m-look .verdict.ok{color:#17653f}.m-look .verdict.no{color:#a23a31}
.m-look .rname{font:900 calc(var(--rk,1)*clamp(.76rem,min(4.2cqw,3.1cqh),1.05rem))/1.15 var(--mono,monospace);overflow-wrap:break-word;word-break:normal}
.m-look .rcat{font-weight:800;font-size:calc(var(--rk,1)*clamp(.7rem,min(3.8cqw,2.8cqh),.92rem))}
.m-look .badge{display:inline-block;background:var(--ink);color:var(--amb);border-radius:.25rem;font:800 .72em var(--sans,sans-serif);padding:.05em .4em;margin-top:.1em}
.m-look .rd{font-size:clamp(.64rem,min(3.5cqw,2.6cqh),.85rem);color:#4b453a;line-height:1.35;overflow:hidden;flex:1 1 0;min-height:1.4em;-webkit-mask-image:linear-gradient(#000 70%,transparent);mask-image:linear-gradient(#000 70%,transparent)}
.m-look .legal{font-size:clamp(.56rem,min(3cqw,2.2cqh),.74rem);color:#5e5646;flex:none;line-height:1.25}
.m-look .racts{display:flex;flex-wrap:wrap;gap:.3rem;flex:none}
.m-look .racts a,.m-look .racts button{flex:1 1 auto;text-align:center;text-decoration:none;font-weight:800;font-size:clamp(.64rem,min(3.5cqw,2.6cqh),.84rem);border-radius:.45rem;padding:clamp(.28rem,1.1cqh,.5rem) .45rem;border:1px solid #0004;background:none;color:var(--ink)}
.m-look .racts .tip{background:var(--ink);color:var(--amb);border-color:var(--ink);flex-basis:100%}
.m-look .next{flex:none;background:var(--fg,#eef0f2);color:var(--bg,#121519);border:0;border-radius:calc(var(--radius,.6rem)*.85);font-weight:900;font-size:clamp(.95rem,min(5.4cqw,4cqh),1.25rem);padding:clamp(.38rem,1.7cqh,.7rem);box-shadow:0 .2rem 0 #0008}
.m-look:not(.done) .next{display:none}.m-look.done .opts{display:none}
.m-look .arming{pointer-events:none}
.m-look .side{display:contents}
.m-look dialog{margin:auto;width:min(100% - 1.2rem,34rem);max-height:calc(100dvh - 1.2rem);border:0;border-radius:.6rem;background:var(--pap);color:var(--ink);padding:0;overflow:hidden}
.m-look dialog::backdrop{background:#000b}
.m-look dialog[open]{display:flex;flex-direction:column}
.m-look .dh{display:flex;justify-content:space-between;align-items:center;gap:.5rem;padding:.6rem .9rem;border-bottom:1px solid #0002;flex:none}
.m-look .dh h2{font:900 1rem var(--mono,monospace);min-width:0;overflow-wrap:anywhere}
.m-look .x{flex:none;width:2.6rem;height:2.6rem;border-radius:50%;border:0;background:var(--ink);color:var(--pap);font-size:1.1rem}
.m-look .db{overflow-y:auto;overscroll-behavior:contain;padding:.8rem .9rem 1rem;font-size:.9rem;line-height:1.45;display:flex;flex-direction:column;gap:.55rem}
.m-look .db h3{font:800 .72rem var(--sans,sans-serif);letter-spacing:.08em;text-transform:uppercase;color:var(--mut2);margin-top:.3rem}
.m-look .db .wn{font-weight:900;color:#a23a31}.m-look .db a{color:#0b5aa6}
@container mlook (min-aspect-ratio:6/5){
 .m-look .w{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);grid-template-rows:minmax(0,1fr);gap:.4rem .8rem}
 .m-look .card{grid-row:1;grid-column:1;height:100%}
 .m-look .side{display:flex;flex-direction:column;gap:.35rem;justify-content:center;min-height:0;grid-column:2;grid-row:1}
 .m-look .opts{grid-template-columns:1fr;align-content:center}
 .m-look .opts button{min-height:0;font-size:clamp(.72rem,min(2.6cqw,5cqh),.98rem);padding:clamp(.25rem,2.2cqh,.6rem) .4rem}
 .m-look .opts button:last-child:nth-child(odd){grid-column:auto}
 .m-look .clues li{font-size:calc(var(--k)*clamp(.72rem,min(2.6cqw,5cqh),1rem))}.m-look .clues li.new{font-size:calc(var(--k)*clamp(.78rem,min(2.9cqw,5.6cqh),1.1rem))}
 .m-look .meta,.m-look .chead{font-size:clamp(.56rem,3.6cqh,.78rem)}.m-look .clueb{font-size:clamp(.7rem,4.6cqh,.95rem);min-height:0;padding:clamp(.2rem,1.8cqh,.5rem) .6rem}
 .m-look.done .w{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr) auto}
 .m-look.done .side{grid-column:1;grid-row:2}
 .m-look.done .rv{display:grid;grid-template-columns:auto minmax(0,1fr);grid-template-rows:auto minmax(0,1fr) auto auto;gap:clamp(.15rem,1.4cqh,.4rem) clamp(.5rem,2cqw,1rem)}
 .m-look .rtop{display:contents}
 .m-look .pic{grid-column:1;grid-row:1/-1;height:100%;max-height:none;width:clamp(4.5rem,22cqw,13rem);aspect-ratio:auto}
 .m-look .rinfo{grid-column:2;grid-row:1;overflow:visible}.m-look .rd{grid-column:2;grid-row:2}.m-look .legal{grid-column:2;grid-row:3}.m-look .racts{grid-column:2;grid-row:4}
 .m-look .racts .tip{flex-basis:auto}
.m-look .verdict{font-size:calc(var(--rk,1)*clamp(.85rem,6cqh,1.3rem))}.m-look .rname{font-size:calc(var(--rk,1)*clamp(.72rem,4.8cqh,1.05rem))}
 .m-look .rcat,.m-look .rd,.m-look .racts a,.m-look .racts button{font-size:clamp(.6rem,3.8cqh,.85rem)}.m-look .legal{font-size:clamp(.52rem,3.2cqh,.74rem)}
 .m-look .racts a,.m-look .racts button{padding:clamp(.2rem,1.5cqh,.5rem) .4rem}
 .m-look .next{font-size:clamp(.9rem,6cqh,1.25rem);padding:clamp(.3rem,2.6cqh,.7rem)}
}
@keyframes mlk-pop{0%{transform:scale(1)}40%{transform:scale(1.08)}100%{transform:scale(1)}}
@keyframes mlk-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
@keyframes mlk-slide{from{opacity:0;transform:translateY(.6em)}to{opacity:1;transform:none}}
@keyframes mlk-flip{from{opacity:0;transform:perspective(40rem) rotateY(80deg) scale(.85)}to{opacity:1;transform:none}}
@keyframes mlk-stamp{from{opacity:0;transform:translateX(-50%) rotate(-8deg) scale(2.4)}to{opacity:1;transform:translateX(-50%) rotate(-8deg) scale(1)}}
@media (prefers-reduced-motion:reduce){.m-look *,.m-look *::before,.m-look *::after{animation:none!important;transition:none!important}}
`;
function injectCSS() { if (document.getElementById('m-look-css')) return; const s = document.createElement('style'); s.id = 'm-look-css'; s.textContent = CSS; document.head.appendChild(s) }
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
function money(n, L) {
  if (!n) return ''; if (L === 'zh') { const w = n / 1e4; return (w >= 1 ? (w >= 1e4 ? (w / 1e4).toLocaleString('zh-TW') + ' 億' : w.toLocaleString('zh-TW', { maximumFractionDigits: 1 }) + ' 萬') : n.toLocaleString('zh-TW')) + ' 美元' }
  return n >= 1e6 ? '$' + (n / 1e6).toLocaleString('en-US', { maximumFractionDigits: 1 }) + ' million' : '$' + n.toLocaleString('en-US')
}
function metaOf(c, L) {
  const m = c.k && c.k.mt; if (m && m[L]) return m[L]; const k = c.k || {}, o = [];
  if (k.y) o.push(L === 'zh' ? `${k.y / 10 | 0}0 年代` : `${k.y / 10 | 0}0s`);
  const w = L === 'zh' ? (k.ofz ? `FBI ${k.ofz}分局` : k.plz) : (k.of ? `FBI ${k.of}` : k.pl); if (w) o.push(w);
  o.push(k.rw ? (L === 'zh' ? `懸賞最高 ${money(k.rw, L)}` : `Reward up to ${money(k.rw, L)}`) : (L === 'zh' ? '未列懸賞' : 'No reward listed')); return o.join(' · ')
}
const cluesOf = (c, L) => (c.k.cl[L] || c.k.cl.en).slice(0, 2).map(x => esc(x).replace(/▇+/g, m => `<mark aria-label="${S[L].redacted}">${m}</mark>`));
const nameOf = c => (c.title || '').split(/ - | – /)[0];
const grp = c => GMAP[c.c];
function grpSet(c) { const s = new Set([grp(c)]); for (const a of c.all || []) if (GMAP[a]) s.add(GMAP[a]); return s }
let active = null;

export default {
  id: 'look',
  name: { en: 'Look Again', zh: '再看一眼' }, intro,
  icon: '🔎',
  async load(ctx) {
    const base = (ctx && ctx.base || 'https://liyun-li.github.io') + GAME;
    let d = null, err;
    for (let k = 0; k < 3 && !d; k++) {
      try { const r = await fetch(base + 'cases.json', { cache: 'no-cache' }); if (!r.ok) throw new Error('http ' + r.status); d = await r.json() }
      catch (e) { err = e; await new Promise(r => setTimeout(r, 600 * (k + 1))) }
    }
    if (!d || !d.cases || !d.cases.length) throw err || new Error('empty');
    const ok2 = a => Array.isArray(a) && a.filter(x => typeof x === 'string' && x.trim()).length >= 2;
    const cases = d.cases.filter(c => c && c.id && c.im && GMAP[c.c] && !NEVER.has(c.c) && !(c.all || []).some(a => NEVER.has(a))
      && c.k && c.k.cl && ok2(c.k.cl.en) && ok2(c.k.cl.zh) && c.r && /^https:\/\/www\.fbi\.gov\//.test(c.url || ''))
      .sort((a, b) => a.id < b.id ? -1 : 1)
      .map(c => Object.assign({}, c, { _g: grp(c), _t: tierOf(c, grp(c)) }));
    if (!cases.length) throw new Error('empty');
    const groups = GROUPS.filter(g => cases.some(c => c._g === g));
    return { base, cases, groups, updated: d.updated };
  },
  pick(pool, rng, tier) {
    const t = Math.max(1, Math.min(3, Math.round(tier) || 1));
    let gs = pool.groups.filter(g => pool.cases.some(c => c._g === g && c._t === t)), byT = true;
    if (!gs.length) { gs = pool.groups; byT = false }
    const g = gs[Math.floor(rng() * gs.length) % gs.length];
    const L = pool.cases.filter(c => c._g === g && (!byT || c._t === t));
    const c = L[Math.floor(rng() * L.length) % L.length];
    const set = grpSet(c);
    const d = pool.groups.filter(x => !set.has(x));
    for (let i = d.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [d[i], d[j]] = [d[j], d[i]] }
    const opts = [g, ...d.slice(0, 3)];
    for (let i = opts.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [opts[i], opts[j]] = [opts[j], opts[i]] }
    return { id: c.id, tier: c._t, c, opts, base: pool.base };
  },
  setLang(lang) { if (active) active.setLang(lang) },
  render(round, el, ctx2) {
    injectCSS();
    return new Promise(resolve => {
      const c = round.c, g = c._g || grp(c), ac = new AbortController(), sig = ac.signal;
      let L = (ctx2 && ctx2.lang) === 'zh' ? 'zh' : 'en';
      const T = k => S[L][k];
      const root = document.createElement('div'); root.className = 'm-look';
      root.innerHTML = `<div class="cq"><div class="w">
<div class="card"><div class="chead"><span data-r="lbl">🔎</span><span class="ladder" data-r="ladder" aria-hidden="true"></span><span class="worth" data-r="worth"></span></div>
 <div class="ask"><p class="meta" data-r="meta"></p><ol class="clues" data-r="clues" aria-live="polite"></ol><button class="clueb" data-r="clueBtn" type="button"></button></div>
 <div class="rv" data-r="rv" aria-live="polite"><div class="rtop"><div class="pic" data-r="pic"></div><div class="rinfo"><div class="verdict" data-r="verdict"></div><div class="rname" data-r="rname" lang="en"></div><div class="rcat" data-r="rcat"></div></div></div><div class="rd" data-r="rd"></div>
  <p class="legal" data-r="legal"></p><div class="racts"><a class="tip" href="https://tips.fbi.gov/" target="_blank" rel="noopener" data-r="tip"></a><button type="button" data-r="fullBtn"></button><a data-r="fbiLink" target="_blank" rel="noopener"></a></div></div>
</div>
<div class="side"><h2 class="sr" data-r="qText" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)"></h2><div class="opts" data-r="opts" role="group"></div><button class="next" data-r="next" type="button"></button></div>
</div></div>
<dialog data-r="dlg"><div class="dh"><h2 data-r="dlgT" lang="en"></h2><button class="x" data-r="dlgX" type="button">✕</button></div><div class="db" data-r="dlgB"></div></dialog>`;
      const $ = n => root.querySelector(`[data-r="${n}"]`);
      el.appendChild(root);
      let n = 1, done = false, finished = false, res = null, revT = 0, pick = null;
      const CL = () => cluesOf(c, L);

      function fitR() {
        const e = root.querySelector('.rinfo'); let k = 1; root.style.setProperty('--rk', 1);
        while ((e.scrollHeight > e.clientHeight + 1 || e.scrollWidth > e.clientWidth + 1) && k > .55) { k -= .05; root.style.setProperty('--rk', k.toFixed(2)) }
      }
      function fit() {
        if (done) return fitR(); const e = $('clues'); let k = 1.45; root.style.setProperty('--k', k);
        while (e.scrollHeight > e.clientHeight + 1 && k > .6) { k -= .05; root.style.setProperty('--k', k.toFixed(2)) }
      }
      function renderAsk(fresh) {
        const cl = CL();
        $('lbl').textContent = '🔎 ' + (L === 'zh' ? '再看一眼' : 'LOOK AGAIN');
        $('ladder').innerHTML = cl.map((_, j) => `<i${j < n ? ' class="on"' : ''}></i>`).join('');
        $('worth').textContent = T('worth')(PTS[n - 1]);
        $('meta').textContent = metaOf(c, L);
        $('clues').innerHTML = cl.slice(0, n).map((x, j) => `<li class="${j === n - 1 ? 'new' + (fresh ? '' : ' still') : ''}"><b>${j + 1}</b><span>${x}</span></li>`).join('');
        const cb = $('clueBtn'); if (n < cl.length) { cb.disabled = false; cb.innerHTML = T('more')(PTS[n]) } else { cb.disabled = true; cb.textContent = T('last') }
        $('qText').textContent = T('q'); $('opts').setAttribute('aria-label', T('q'));
        $('opts').querySelectorAll('button').forEach(b => b.querySelector('.t').textContent = CAT[b.dataset.b][L]);
        requestAnimationFrame(fit)
      }
      $('opts').innerHTML = round.opts.map((b, j) => `<button type="button" data-b="${b}"><span aria-hidden="true">${j + 1} </span><span class="t"></span></button>`).join('');
      const OB = [...$('opts').querySelectorAll('button')];
      OB.forEach(b => b.addEventListener('click', () => answer(b.dataset.b)));
      function moreClue() {
        if (done) return; if (n >= CL().length) return; n++; renderAsk(true);
        const w = $('worth'); w.classList.remove('pop'); void w.offsetWidth; w.classList.add('pop');
        if (navigator.vibrate) try { navigator.vibrate(8) } catch (e) { }
      }
      $('clueBtn').addEventListener('click', moreClue);
      function answer(b) {
        if (done || finished) return; done = true; pick = b; const ok = b === g, p = ok ? PTS[n - 1] : 0;
        res = { points: p, max: 3, correct: ok, hint: n > 1, grid: '🟨'.repeat(n - 1) + (ok ? '🟩' : '🟥'),
          summary_en: `🔎 ${ok ? '✓' : '✗'} ${CAT[g].en}${n > 1 ? ' · hint' : ''}`, summary_zh: `🔎 ${ok ? '✓' : '✗'} ${CAT[g].zh}${n > 1 ? '・用了提示' : ''}` };
        if (ctx2 && ctx2.sfx) try { ctx2.sfx(ok ? 'right' : 'wrong') } catch (e) { }
        OB.forEach(e => { e.disabled = true; e.classList.toggle('right', e.dataset.b === g); e.classList.toggle('wrong', e.dataset.b === b && !ok) });
        root.classList.add('done'); renderReveal(true);
        revT = Date.now(); const nx = $('next'), arm = [nx, $('rv')]; arm.forEach(e => e.classList.add('arming')); setTimeout(() => arm.forEach(e => e.classList.remove('arming')), 350);
        if (navigator.vibrate) try { navigator.vibrate(ok ? [15, 30, 15] : [40]) } catch (e) { }
        setTimeout(() => { if (root.isConnected) nx.focus({ preventScroll: true }) }, 60)
      }
      function renderReveal(first) {
        const ok = pick === g;
        $('verdict').textContent = ok ? T('right')(res.points) : T('wrong'); $('verdict').className = 'verdict ' + (ok ? 'ok' : 'no');
        $('rname').textContent = nameOf(c);
        const lst = c.c === 'topten' && LIST[c.c] ? `<br><span class="badge">${esc(T('onList'))} ${esc(LIST[c.c][L])}</span>` : '';
        $('rcat').innerHTML = `${esc(T('was'))} ${esc(CAT[g][L])}${lst}`;
        const r = c.r || {}, firstT = (r.t || []).slice(0, 1).join(' ');
        $('rd').innerHTML = (L === 'zh' ? `<b>${esc(T('enNote'))}</b> ` : '') + `<span lang="en">${L === 'zh' && r.d ? esc(r.d) : esc(r.d ? r.d + ' — ' : '') + esc(firstT)}</span>`;
        $('legal').textContent = T('lgWanted'); $('tip').textContent = T('tip'); $('fullBtn').textContent = T('full');
        $('fbiLink').textContent = T('fbi'); $('fbiLink').href = c.url;
        if (first) { // portrait requested only now, after the guess
          const pic = $('pic'); pic.innerHTML = '';
          const im = new Image(); im.alt = nameOf(c); im.decoding = 'async'; im.onerror = () => { im.remove(); pic.prepend(T('noPic')) }; im.src = round.base + c.im; pic.appendChild(im);
          const st = document.createElement('span'); st.className = 'stamp ' + (ok ? 'ok' : 'no'); st.setAttribute('aria-hidden', 'true'); st.textContent = ok ? `+${res.points}` : '✗'; pic.appendChild(st)
        }
        $('next').textContent = (ctx2 && typeof ctx2.t === 'function' && ctx2.t('next') !== 'next') ? ctx2.t('next') : T('next');
        $('dlgX').setAttribute('aria-label', T('close'));
        requestAnimationFrame(fitR)
      }
      function fullPoster() {
        const r = c.r || {}; let h = '';
        h += `<h3>${esc(T('fullFiled'))}</h3><p>${esc(CAT[g][L])}${LIST[c.c] ? ' · ' + esc(LIST[c.c][L]) : ''}</p>`;
        if (r.w) h += `<p class="wn" lang="en">${esc(r.w)}</p>`;
        if (r.d) h += `<h3>${esc(T('fullDesc'))}</h3><p lang="en">${esc(r.d)}</p>`;
        if (r.t && r.t.length) h += `<h3>${esc(T('fullText'))}</h3>` + r.t.map(s => `<p lang="en">${esc(s)}</p>`).join('');
        if (r.rm && r.rm.filter(Boolean).length) h += `<h3>${esc(T('fullRm'))}</h3>` + r.rm.filter(Boolean).map(s => `<p lang="en">${esc(s)}</p>`).join('');
        if (r.rw) h += `<h3>${esc(T('fullRw'))}</h3><p lang="en">${esc(r.rw)}</p>`;
        h += `<p><i>${esc(T('lgWanted'))}</i></p><p><i>${esc(T('cutNote'))}</i></p>`;
        h += `<p><a href="https://tips.fbi.gov/" target="_blank" rel="noopener"><b>${esc(T('tip'))}</b></a><br><a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(T('fbi'))}</a></p>`;
        $('dlgT').textContent = nameOf(c); $('dlgB').innerHTML = h; $('dlgB').scrollTop = 0; const d = $('dlg'); if (!d.open) d.showModal()
      }
      $('fullBtn').addEventListener('click', () => { if (done && Date.now() - revT >= 350) fullPoster() });
      $('dlgX').addEventListener('click', () => $('dlg').close());
      $('dlg').addEventListener('click', e => { if (e.target === $('dlg')) $('dlg').close() });
      function userNext() { if (!done || finished || Date.now() - revT < 350) return; finished = true; $('next').disabled = true; cleanup(); resolve(res) }
      $('next').addEventListener('click', userNext);
      document.addEventListener('keydown', e => {
        if (!root.isConnected || $('dlg').open || e.ctrlKey || e.metaKey || e.altKey) return;
        if (e.target.closest && e.target.closest('input,textarea')) return;
        const i = '1234'.indexOf(e.key);
        if (!done && i >= 0 && OB[i]) { e.preventDefault(); answer(OB[i].dataset.b) }
        else if (!done && (e.key === 'h' || e.key === 'H' || e.key === 'c' || e.key === 'C')) { e.preventDefault(); moreClue() }
        else if (done && e.key === 'Enter' && (document.activeElement === document.body || document.activeElement === $('next'))) { e.preventDefault(); userNext() }
      }, { signal: sig });
      if (window.ResizeObserver) { let rq = 0; const ro = new ResizeObserver(() => { if (!rq) rq = requestAnimationFrame(() => { rq = 0; fit() }) }); ro.observe(root); sig.addEventListener('abort', () => ro.disconnect()) }
      function cleanup() { ac.abort(); const d = $('dlg'); if (d.open) d.close(); if (active === ctl) active = null }
      const ctl = { setLang(l) { L = l === 'zh' ? 'zh' : 'en'; renderAsk(false); if (done) renderReveal(false) } };
      active = ctl;
      if (ctx2 && ctx2.signal) { if (ctx2.signal.aborted) { cleanup(); return } ctx2.signal.addEventListener('abort', () => { if (!finished) { finished = true; cleanup() } }, { once: true }) }
      renderAsk(true);
      setTimeout(() => { if (root.isConnected && !done) OB[0].focus({ preventScroll: true }) }, 30)
    });
  }
};
