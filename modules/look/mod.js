// Look Again / 再看一眼 — hub module (TELL. / 破綻), FACE-FIRST.
// Data: the live game's cached FBI snapshot (cases.json + img/) on liyun-li.github.io. The client never contacts fbi.gov;
// fbi.gov / tips.fbi.gov only appear as links the player can choose to open after the reveal.
// Guardrails: only wanted fugitives/suspects with a clear photo (cases.json fq=1, set by tools/faces.py) are used.
// Missing / parental-kidnapping / seeking-information files are excluded entirely (never scored).
// Humor targets the player's assumptions, never the person in the photo; no appearance copy.
import intro from './intro.js';
const GAME = '/look-again/';
const PTS = [3, 1];
const GMAP = { violent: 'violent', topten: 'violent', gangs: 'gangs', money: 'money', cyber: 'cyber', spy: 'spy', terror: 'terror' };
const NEVER = new Set(['missing', 'parental', 'seeking']);
const GROUPS = ['violent', 'gangs', 'money', 'cyber', 'spy', 'terror'];
const CAT = {
  violent: { e: '🔪', en: 'Violent crime', zh: '暴力犯罪' }, gangs: { e: '🕴️', en: 'Criminal enterprise', zh: '犯罪集團' },
  money: { e: '💸', en: 'White-collar crime', zh: '白領犯罪' }, cyber: { e: '💻', en: 'Cyber crime', zh: '網路犯罪' },
  spy: { e: '🕵️', en: 'Counterintelligence', zh: '反情報（間諜）' }, terror: { e: '💣', en: 'Terrorism', zh: '恐怖主義' }
};
const S = {
  en: { q: 'The FBI files them under…?', peek: '💡 Peek at a clue', cost: '+3 → +1', peeked: 'Clue used · now +1',
    right: p => `✓ Called it! +${p}`, wrong: '✗ Your gut lied', wantedFor: 'Wanted for', more: n => ` (+${n} more)`,
    tip: 'Seen them? Tip the FBI ↗', full: 'Full poster', fbi: 'FBI page ↗', next: 'NEXT →', lgWanted: 'Allegations only. Presumed innocent until proven guilty.',
    noPic: 'Photo unavailable', enNote: 'FBI wording:', photo: 'Wanted poster photo',
    fullFiled: 'FBI list', onList: 'FBI list:', fullDesc: 'Charges', fullText: 'Details (FBI wording)', fullRm: 'Remarks', fullRw: 'Reward', cutNote: 'Physical descriptions are left out here. The FBI page has the full poster.',
    close: 'Close', redacted: 'redacted', said: 'you said' },
  zh: { q: 'FBI 把這個人歸在哪一類？', peek: '💡 偷看線索', cost: '+3 → +1', peeked: '已看線索・現在 +1',
    right: p => `✓ 一眼看穿！+${p}`, wrong: '✗ 被直覺騙了', wantedFor: '涉嫌', more: n => `（另有 ${n} 項）`,
    tip: '見過這個人？向 FBI 報案 ↗', full: '完整公告', fbi: 'FBI 頁面 ↗', next: '下一題 →', lgWanted: '僅為指控，未經定罪前推定無罪。',
    noPic: '照片無法顯示', enNote: 'FBI 原文：', photo: '通緝照',
    fullFiled: 'FBI 名單', onList: 'FBI 名單：', fullDesc: '罪名', fullText: '案情（FBI 英文原文）', fullRm: '備註', fullRw: '懸賞', cutNote: '此處略去外貌描述；完整公告請見 FBI 官方頁面。',
    close: '關閉', redacted: '已塗黑', said: '你猜' }
};
// Charge headline + zh gist, derived only from the FBI poster's own charge text (r.d) or first sentence (r.t).
// Order = drama: the most dramatic matching charge becomes the headline.
const CHG=[
 [/murder[- ]for[- ]hire/i,'買兇殺人'],[/murder|homicide|\bkill/i,'殺人'],[/war crimes/i,'戰爭罪'],[/hostage/i,'挾持人質'],[/kidnap|abduct/i,'綁架'],[/air(craft)? piracy/i,'劫機'],[/manslaughter/i,'過失致死'],
 [/narco-?terror/i,'毒品恐怖主義'],[/bomb|explosive|destructive device|weapons? of mass/i,'爆裂物'],[/material support/i,'資助恐怖組織'],[/terroris|\bterror\b|lethal plots/i,'恐怖主義'],[/sabotage/i,'蓄意破壞'],[/revolutionary guard|irgc|qods/i,'伊朗革命衛隊相關'],
 [/arson|by means of fire/i,'縱火'],[/robbery/i,'搶劫'],[/assault/i,'暴力傷害'],[/machine gun|firearm/i,'非法槍械'],
 [/racketeer|\brico\b/i,'集團犯罪（RICO）'],[/controlled substance|cocaine|heroin|methamphetamine|fentanyl|narcotic|marijuana|\bdrug|intent to distribute/i,'毒品'],
 [/espionage|national defense information/i,'間諜'],[/agents? of a foreign government|foreign agent|illegal agent/i,'替外國政府做事'],[/trade secret/i,'竊取商業機密'],
 [/smuggl/i,'走私'],[/emergency economic powers|ieepa|export control|arms export|export information/i,'違反制裁與出口管制'],
 [/extortion|ransom|demand in relation to damaging/i,'勒索'],
 [/computer|hack|intrusion|malware/i,'駭客入侵'],[/identity theft/i,'身分盜用'],
 [/securities fraud/i,'證券詐欺'],[/bank fraud/i,'銀行詐欺'],[/health care fraud/i,'健保詐欺'],[/wire fraud|mail fraud/i,'電信詐欺'],[/launder/i,'洗錢'],[/fraud|defraud/i,'詐欺'],
 [/passport|false document|visa/i,'偽造證件'],[/stalking|harassment/i,'跟蹤騷擾'],[/escape/i,'逃獄'],[/surrender for service of sentence/i,'拒不入監服刑'],[/naturaliz|citizenship/i,'非法取得公民身分'],[/hobbs act/i,'勒索'],[/failure to appear/i,'未出庭'],[/obstruction/i,'妨礙司法'],[/\btax/i,'逃漏稅'],[/theft|stolen/i,'竊盜']];
const BORING=/^(aiding and abetting|conspiracy|criminal forfeiture|forfeiture)$/i;
function rankOf(s){for(let i=0;i<CHG.length;i++)if(CHG[i][0].test(s))return i;return 99}
function tidy(s){s=String(s||'').trim().replace(/\.$/,'').replace(/^unlawful flight to avoid prosecution\s*[-–:]\s*/i,'Fled prosecution: ');const o=(s.match(/\(/g)||[]).length-(s.match(/\)/g)||[]).length;if(o>0)s+=')'.repeat(o);if(s&&s===s.toUpperCase())s=s.toLowerCase().replace(/(^|[\s(\-])(\w)/g,(m,a,b)=>a+b.toUpperCase());return s}
function firstSentence(t){const s=String(t||'').trim();const m=s.match(/^.{20,}?[a-z0-9)"”’][.!?](?=\s|$)/);return (m?m[0]:s)}
function clip(s,n){s=String(s||'');if(s.length<=n)return s;const c=s.slice(0,n);return c.slice(0,Math.max(c.lastIndexOf(' '),n*.6|0)).replace(/[,;:\s]+$/,'')+'…'}
// returns {head:'EN charge headline', more:n extra charges, zh:'中文重點' or ''}
function chargeOf(c){const r=c.r||{};const d=String(r.d||'').trim();let parts=d?d.split(/;\s*/).map(tidy).filter(Boolean):[];
 let head,more=0;
 if(parts.length){const cand=parts.filter(p=>!BORING.test(p));const pool=cand.length?cand:parts;
  head=pool.slice().sort((a,b)=>rankOf(a)-rankOf(b))[0];more=parts.length-1}
 else{const s=firstSentence((r.t||[])[0]);const m=s.match(/\bis wanted (for .+?)[.]?$/i);head=m?'Wanted '+m[1]:clip(s,140)}
 const src=d||((r.t||[])[0]||'');const zs=[];
 for(const p of (parts.length?parts:[src])){const k=rankOf(p);if(k<99&&!zs.includes(CHG[k][1]))zs.push(CHG[k][1])}
 zs.sort((a,b)=>CHG.findIndex(x=>x[1]===a)-CHG.findIndex(x=>x[1]===b));
 return {head:clip(head,150),more,q:/^wanted for questioning/i.test(head),zh:zs.slice(0,3).join('、')}}

// Tier from the optional clue (EN): does the clue already carry its own category's words?
const KW = {
  cyber: ['computer', 'hack', 'cyber', 'malware', 'ransomware', 'internet', 'online', 'network', 'data', 'crypto', 'bitcoin', 'software', 'server'],
  spy: ['russia', 'china', 'chinese', 'iran', 'intelligence', 'export', 'agent', 'foreign', 'government', 'procurement', 'korea', 'military', 'embassy'],
  terror: ['terror', 'bomb', 'attack', 'qaeda', 'isis', 'hijack', 'explosive', 'hizballah', 'syria', 'iraq', 'yemen', 'lebanon'],
  money: ['fraud', 'scheme', 'money', 'investment', 'bank', 'tax', 'medicare', 'health care', 'investors', 'loan', 'wire', 'ponzi', 'insurance', 'securities'],
  gangs: ['gang', 'drug', 'cartel', 'cocaine', 'fentanyl', 'meth', 'heroin', 'trafficking', 'sinaloa', 'ms-13'],
  violent: ['murder', 'killed', 'shot', 'gun', 'robbery', 'assault', 'violent', 'fled', 'armed', 'kidnap']
};
function tierOf(c, g) {
  const t = String(((c.k.cl || {}).en || [])[0] || '').toLowerCase(); const s = {}; for (const k of GROUPS) s[k] = KW[k].reduce((n, w) => n + t.split(w).length - 1, 0);
  const own = s[g], other = Math.max(...GROUPS.filter(x => x !== g).map(x => s[x]));
  return own > 0 && own > other ? 1 : other > own ? 3 : 2;
}
const CSS = `
.m-look{--pap:#ece6d6;--ink:#1d1b17;--mut2:#5e5646;--amb:#f0b429;--grn:var(--ok,#3fb67d);--red:var(--bad,#e0645a);
 flex:1 1 0;min-height:0;min-width:0;height:100%;width:100%;position:relative;color:var(--fg,#eef0f2);font-family:var(--sans,system-ui,sans-serif)}
.m-look *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
.m-look .cq{position:absolute;inset:0;container:mlook/size}
.m-look .w{height:100%;display:flex;flex-direction:column;gap:clamp(.3rem,1.2cqh,.6rem);min-height:0}
.m-look button{font:inherit;cursor:pointer;color:inherit;touch-action:manipulation}
.m-look .poster{flex:1 1 0;min-height:0;display:flex;justify-content:center;align-items:stretch}
.m-look .pic{position:relative;height:100%;max-width:100%;aspect-ratio:3/4;background:var(--pap);border-radius:.6rem;overflow:hidden;box-shadow:0 .3rem 0 #0007,0 0 0 clamp(.18rem,1cqw,.32rem) var(--pap);display:flex;align-items:center;justify-content:center;color:var(--mut2);font:700 .8rem var(--sans,sans-serif)}
.m-look .pic>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 22%;display:block;background:#d9d1bd}
.m-look .ptop{position:absolute;left:0;right:0;top:0;display:flex;justify-content:space-between;align-items:center;padding:.3rem .5rem;background:linear-gradient(#000a,#0000);color:#fff;font:900 clamp(.58rem,min(3.2cqw,2.4cqh),.8rem) var(--mono,monospace);letter-spacing:.08em;z-index:1;text-shadow:0 1px 2px #000}
.m-look .worth{position:absolute;right:.45rem;top:1.9rem;z-index:1;background:var(--amb);color:#111;font:900 clamp(.78rem,min(4.4cqw,3.2cqh),1.1rem) var(--mono,monospace);border-radius:999px;padding:.12em .55em;box-shadow:0 .15rem 0 #0006}
.m-look .pop{animation:mlk-pop .35s}
.m-look .clue{position:absolute;left:0;right:0;bottom:0;z-index:1;padding:1.5rem .6rem .5rem;max-height:55%;overflow:hidden;background:linear-gradient(#0000,#000d 38%);color:#fff;font:700 clamp(.7rem,min(3.9cqw,2.9cqh),.98rem)/1.3 var(--sans,sans-serif);text-align:left;animation:mlk-slide .3s}
.m-look .clue mark{background:#fff;color:#fff;border-radius:2px}
.m-look .stamp{position:absolute;left:5%;top:11%;z-index:2;font:900 clamp(1.2rem,min(10cqw,7cqh),2.6rem) var(--mono,monospace);border:.18em solid currentColor;border-radius:.25em;padding:.02em .3em;background:#ece6d6e0;white-space:nowrap;transform:rotate(-12deg);box-shadow:0 .15rem .4rem #0005;animation:mlk-stamp .4s both cubic-bezier(.2,.9,.3,1.4);pointer-events:none}
.m-look .stamp.ok{color:#17653f}.m-look .stamp.no{color:#a23a31}
.m-look .side{display:flex;flex-direction:column;gap:clamp(.3rem,1.1cqh,.55rem);flex:none;min-height:0}
.m-look .ask{display:flex;flex-direction:column;gap:clamp(.3rem,1.1cqh,.55rem)}
.m-look .qrow{display:flex;align-items:center;justify-content:space-between;gap:.5rem;min-width:0}
.m-look .q{font:900 clamp(.95rem,min(5.4cqw,4cqh),1.35rem)/1.1 var(--sans,sans-serif);text-align:left;min-width:0;color:var(--fg,#eef0f2)}
.m-look .peek{flex:none;background:none;border:1px dashed #ffffff70;border-radius:.5rem;color:var(--fg,#eef0f2);font-weight:800;font-size:clamp(.66rem,min(3.5cqw,2.7cqh),.88rem);padding:clamp(.28rem,1.1cqh,.45rem) .55rem;line-height:1.15;text-align:center}
.m-look .peek small{display:block;font-weight:700;color:var(--amb);font-size:.85em}
.m-look .peek[disabled]{border-style:solid;border-color:#ffffff30;color:var(--muted,#a9b2bd);cursor:default}
.m-look .opts{display:grid;grid-template-columns:1fr 1fr;gap:clamp(.3rem,1.1cqh,.5rem)}
.m-look .opts button{min-width:0;display:flex;align-items:center;gap:.45em;text-align:left;background:var(--card,#1b2027);color:var(--fg,#eef0f2);border:1px solid #ffffff38;border-radius:calc(var(--radius,.65rem)*.85);padding:clamp(.32rem,1.4cqh,.7rem) .55rem;font-weight:800;font-size:clamp(.74rem,min(4cqw,3.05cqh),1.02rem);line-height:1.15;min-height:clamp(2.5rem,9cqh,3.8rem);box-shadow:0 .2rem 0 #0008;transition:transform .08s}
.m-look .opts .e{font-size:1.45em;flex:none;line-height:1}.m-look .opts .t{min-width:0;overflow-wrap:anywhere}
.m-look .opts button:active,.m-look .peek:active,.m-look .next:active{transform:translateY(2px) scale(.98)}
.m-look .rv{display:none;flex-direction:column;gap:clamp(.15rem,.8cqh,.4rem);background:var(--pap);color:var(--ink);border-radius:.6rem;padding:clamp(.4rem,1.4cqh,.75rem) clamp(.55rem,3cqw,.9rem);min-height:0;overflow:hidden;animation:mlk-slide .28s}
.m-look.done .rv{display:flex}.m-look.done .ask{display:none}
.m-look .vrow{display:flex;align-items:baseline;justify-content:space-between;gap:.5rem;min-width:0}
.m-look .verdict{font:900 clamp(.95rem,min(5.4cqw,4cqh),1.35rem) var(--sans,sans-serif);flex:none}.m-look .verdict.ok{color:#17653f}.m-look .verdict.no{color:#a23a31}
.m-look .rname{font:800 clamp(.58rem,min(3.1cqw,2.4cqh),.8rem) var(--mono,monospace);color:var(--mut2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.m-look .rcat{font:900 clamp(1rem,min(6cqw,4.4cqh),1.55rem)/1.15 var(--sans,sans-serif)}
.m-look .rcat s{font-size:.6em;font-weight:700;color:var(--mut2);margin-left:.3em;white-space:nowrap}
.m-look .rcat .fl{display:block;font-size:.55em;font-weight:700;color:var(--mut2);white-space:normal;margin-top:.15em}
.m-look .rhead{font:700 clamp(.72rem,min(3.9cqw,2.9cqh),.98rem)/1.3 var(--sans,sans-serif);display:flex;flex-direction:column;gap:.1em}
.m-look .rhead .en{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.m-look .rhead b{color:#a23a31}.m-look .rhead small{font-weight:600;color:var(--mut2)}
.m-look .rhead.zhm .en{font-weight:600;font-size:.86em;color:#4b453a;-webkit-line-clamp:2}
.m-look .rline{font-size:clamp(.64rem,min(3.4cqw,2.6cqh),.86rem);line-height:1.3;color:#4b453a;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.m-look .rline:empty{display:none}.m-look .rline mark{background:var(--ink);color:var(--ink);border-radius:2px}
.m-look .racts{display:flex;flex-wrap:wrap;gap:.3rem}
.m-look .racts a,.m-look .racts button{flex:1 1 auto;text-align:center;text-decoration:none;font-weight:800;font-size:clamp(.62rem,min(3.3cqw,2.5cqh),.84rem);border-radius:.45rem;padding:clamp(.28rem,1cqh,.5rem) .45rem;border:1px solid #0004;background:none;color:var(--ink);min-height:1.9rem;display:flex;align-items:center;justify-content:center}
.m-look .racts .tip{background:var(--ink);color:var(--amb);border-color:var(--ink)}
.m-look .legal{font-size:clamp(.54rem,min(2.8cqw,2.1cqh),.72rem);color:var(--mut2);line-height:1.25}
.m-look .next{background:var(--ink);color:var(--pap);border:0;border-radius:.6rem;font-weight:900;font-size:clamp(.95rem,min(5.4cqw,4cqh),1.3rem);padding:clamp(.4rem,1.6cqh,.75rem);box-shadow:0 .2rem 0 #0006}
.m-look .arming{pointer-events:none}
.m-look dialog{margin:auto;width:min(100% - 1.2rem,34rem);max-height:calc(100dvh - 1.2rem);border:0;border-radius:.6rem;background:var(--pap);color:var(--ink);padding:0;overflow:hidden}
.m-look dialog::backdrop{background:#000b}
.m-look dialog[open]{display:flex;flex-direction:column}
.m-look .dh{display:flex;justify-content:space-between;align-items:center;gap:.5rem;padding:.6rem .9rem;border-bottom:1px solid #0002;flex:none}
.m-look .dh h2{font:900 1rem var(--mono,monospace);min-width:0;overflow-wrap:anywhere}
.m-look .x{flex:none;width:2.6rem;height:2.6rem;border-radius:50%;border:0;background:var(--ink);color:var(--pap);font-size:1.1rem}
.m-look .db{overflow-y:auto;overscroll-behavior:contain;padding:.8rem .9rem 1rem;font-size:.9rem;line-height:1.45;display:flex;flex-direction:column;gap:.55rem}
.m-look .db h3{font:800 .72rem var(--sans,sans-serif);letter-spacing:.08em;text-transform:uppercase;color:var(--mut2);margin-top:.3rem}
.m-look .db .wn{font-weight:900;color:#a23a31}.m-look .db a{color:#0b5aa6}
@container mlook (max-height:440px){.m-look .legal,.m-look .rline{display:none}}
@container mlook (min-aspect-ratio:6/5){
 .m-look .w{display:grid;grid-template-columns:auto minmax(0,1fr);grid-template-rows:minmax(0,1fr);gap:.6rem .9rem}
 .m-look .poster{height:100%}
 .m-look .side{justify-content:center;overflow:hidden}
 .m-look .q,.m-look .verdict{font-size:clamp(.9rem,6cqh,1.35rem)}.m-look .rcat{font-size:clamp(.95rem,7cqh,1.55rem)}
 .m-look .opts button{font-size:clamp(.7rem,4.4cqh,1rem);min-height:clamp(2.2rem,13cqh,3.6rem)}
 .m-look .peek,.m-look .rhead,.m-look .racts a,.m-look .racts button{font-size:clamp(.6rem,3.9cqh,.9rem)}
 .m-look .clue{font-size:clamp(.6rem,3.6cqh,.85rem);padding:1rem .45rem .35rem}
 .m-look .next{font-size:clamp(.9rem,6cqh,1.25rem);padding:clamp(.3rem,2.4cqh,.7rem)}
}
@keyframes mlk-pop{0%{transform:scale(1)}40%{transform:scale(1.08)}100%{transform:scale(1)}}
@keyframes mlk-slide{from{opacity:0;transform:translateY(.5em)}to{opacity:1;transform:none}}
@keyframes mlk-stamp{from{opacity:0;transform:rotate(-12deg) scale(2.4)}to{opacity:1;transform:rotate(-12deg) scale(1)}}
@media (prefers-reduced-motion:reduce){.m-look *,.m-look *::before,.m-look *::after{animation:none!important;transition:none!important}}
`;
function injectCSS() { let s = document.getElementById('m-look-css'); if (!s) { s = document.createElement('style'); s.id = 'm-look-css'; document.head.appendChild(s) } s.textContent = CSS }
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const hl = (x, L) => esc(x).replace(/▇+/g, m => `<mark aria-label="${S[L].redacted}">${m}</mark>`);
const cluesOf = (c, L) => { const f = c.k && c.k.cl && (c.k.cl[L] || c.k.cl.en); return Array.isArray(f) ? f.filter(x => typeof x === 'string' && x.trim()) : [] };
const nameOf = c => (c.title || '').split(/ - | – /)[0];
const titleCase = s => s.toLowerCase().replace(/(^|[\s\-'"(])(\p{L})/gu, (m, a, b) => a + b.toUpperCase());
// Categories = the FBI's own crime lists. cases.json g = the answer, m = every category the case defensibly matches
// (built by look-again tools/cats.py). Options = the answer + categories outside m only, so two can never both be right.
const grp = c => c.g;
function grpSet(c) { return new Set([c.g, ...(c.m || [])]) }
const freeOf = (c, groups) => { const s = grpSet(c); return groups.filter(x => !s.has(x)) };
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
    let cases = d.cases.filter(c => c && c.id && c.im && c.fq === 1 && GROUPS.includes(c.g) && Array.isArray(c.m) && !NEVER.has(c.c) && !(c.all || []).some(a => NEVER.has(a))
      && c.r && /^https:\/\/www\.fbi\.gov\//.test(c.url || ''))
      .sort((a, b) => a.id < b.id ? -1 : 1)
      .map(c => Object.assign({}, c, { _g: grp(c), _t: tierOf(c, grp(c)) }));
    const groups = GROUPS.filter(g => cases.some(c => c._g === g));
    cases = cases.filter(c => freeOf(c, groups).length >= 2);
    if (!cases.length) throw new Error('empty');
    return { base, cases, groups, updated: d.updated };
  },
  pick(pool, rng, tier) {
    const t = Math.max(1, Math.min(3, Math.round(tier) || 1));
    let gs = pool.groups.filter(g => pool.cases.some(c => c._g === g && c._t === t)), byT = true;
    if (!gs.length) { gs = pool.groups; byT = false }
    const g = gs[Math.floor(rng() * gs.length) % gs.length];
    const L = pool.cases.filter(c => c._g === g && (!byT || c._t === t));
    const c = L[Math.floor(rng() * L.length) % L.length];
    const d = freeOf(c, pool.groups);
    for (let i = d.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [d[i], d[j]] = [d[j], d[i]] }
    const opts = [g, ...d.slice(0, 3)];
    for (let i = opts.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [opts[i], opts[j]] = [opts[j], opts[i]] }
    return { id: c.id, tier: c._t, c, opts, base: pool.base };
  },
  setLang(lang) { if (active) active.setLang(lang) },
  render(round, el, ctx2) {
    injectCSS();
    return new Promise(resolve => {
      const c = round.c, g = c._g || grp(c), ac = new AbortController(), sig = ac.signal, gs = grpSet(c);
      let L = (ctx2 && ctx2.lang) === 'zh' ? 'zh' : 'en';
      const T = k => S[L][k];
      const root = document.createElement('div'); root.className = 'm-look';
      root.innerHTML = `<div class="cq"><div class="w">
<div class="poster"><div class="pic" data-r="pic"><div class="ptop" aria-hidden="true"><span>FBI · WANTED</span><span>🔎</span></div><span class="worth" data-r="worth"></span><p class="clue" data-r="clue" aria-live="polite" hidden></p></div></div>
<div class="side">
 <div class="ask"><div class="qrow"><h2 class="q" data-r="qText"></h2><button class="peek" data-r="peek" type="button"></button></div><div class="opts" data-r="opts" role="group"></div></div>
 <div class="rv" data-r="rv" aria-live="polite"><div class="vrow"><span class="verdict" data-r="verdict"></span><span class="rname" data-r="rname" lang="en"></span></div>
  <div class="rcat" data-r="rcat"></div><p class="rhead" data-r="rhead"></p><p class="rline" data-r="rline"></p>
  <div class="racts"><a data-r="fbiLink" target="_blank" rel="noopener"></a><button type="button" data-r="fullBtn"></button><a class="tip" href="https://tips.fbi.gov/" target="_blank" rel="noopener" data-r="tip"></a></div>
  <p class="legal" data-r="legal"></p><button class="next" data-r="next" type="button"></button></div>
</div>
</div></div>
<dialog data-r="dlg"><div class="dh"><h2 data-r="dlgT" lang="en"></h2><button class="x" data-r="dlgX" type="button">✕</button></div><div class="db" data-r="dlgB"></div></dialog>`;
      const $ = n => root.querySelector(`[data-r="${n}"]`);
      el.appendChild(root);
      let pk = 0, done = false, finished = false, res = null, revT = 0, pick = null;
      // the face is the round: it loads immediately
      const im = new Image(); im.decoding = 'async'; im.alt = T('photo');
      im.onerror = () => { im.remove(); const s = document.createElement('span'); s.textContent = T('noPic'); $('pic').prepend(s) };
      im.src = round.base + c.im; $('pic').prepend(im);
      function renderAsk() {
        const cl = cluesOf(c, L);
        $('worth').textContent = '+' + PTS[pk]; $('worth').hidden = done;
        $('qText').textContent = T('q'); $('opts').setAttribute('aria-label', T('q'));
        const pb = $('peek'); pb.hidden = !cl.length; pb.disabled = !!pk; pb.innerHTML = pk ? esc(T('peeked')) : `${esc(T('peek'))} <small>${esc(T('cost'))}</small>`;
        $('clue').hidden = !pk || !cl.length; $('clue').innerHTML = pk && cl.length ? `💡 <span>${hl(cl[0], L)}</span>` : '';
        OB.forEach(b => b.querySelector('.t').textContent = CAT[b.dataset.b][L]);
        if (!done) im.alt = T('photo');
      }
      $('opts').innerHTML = round.opts.map(b => `<button type="button" data-b="${b}"><span class="e" aria-hidden="true">${CAT[b].e}</span><span class="t"></span></button>`).join('');
      const OB = [...$('opts').querySelectorAll('button')];
      OB.forEach(b => b.addEventListener('click', () => answer(b.dataset.b)));
      function peek() {
        if (done || pk || !cluesOf(c, L).length) return; pk = 1; renderAsk();
        const w = $('worth'); w.classList.remove('pop'); void w.offsetWidth; w.classList.add('pop');
        if (navigator.vibrate) try { navigator.vibrate(8) } catch (e) { }
      }
      $('peek').addEventListener('click', peek);
      function answer(b) {
        if (done || finished) return; done = true; pick = b; const ok = gs.has(b), p = ok ? PTS[pk] : 0;
        const tc = CAT[g], pc = CAT[b];
        res = { points: p, max: 3, correct: ok, hint: !!pk, grid: ok ? (pk ? '🟨' : '🟩') : '🟥',
          summary_en: ok ? `🔎 ✓ ${tc.e} ${tc.en}${pk ? ' · clue' : ''}` : `🔎 ✗ ${pc.e}→${tc.e} ${tc.en}`,
          summary_zh: ok ? `🔎 ✓ ${tc.e} ${tc.zh}${pk ? '・看了線索' : ''}` : `🔎 ✗ ${pc.e}→${tc.e} ${tc.zh}` };
        if (ctx2 && ctx2.sfx) try { ctx2.sfx(ok ? 'right' : 'wrong') } catch (e) { }
        root.classList.add('done'); renderReveal(true);
        revT = Date.now(); const nx = $('next'), arm = [nx, $('rv')]; arm.forEach(e => e.classList.add('arming')); setTimeout(() => arm.forEach(e => e.classList.remove('arming')), 350);
        if (navigator.vibrate) try { navigator.vibrate(ok ? [15, 30, 15] : [40]) } catch (e) { }
        setTimeout(() => { if (root.isConnected) nx.focus({ preventScroll: true }) }, 60)
      }
      function renderReveal(first) {
        const ok = gs.has(pick), ch = chargeOf(c);
        $('worth').hidden = true;
        if (first) { const st = document.createElement('span'); st.className = 'stamp ' + (ok ? 'ok' : 'no'); st.setAttribute('aria-hidden', 'true'); st.textContent = ok ? `+${res.points}` : '✗'; $('pic').appendChild(st) }
        $('verdict').textContent = ok ? T('right')(res.points) : T('wrong'); $('verdict').className = 'verdict ' + (ok ? 'ok' : 'no');
        $('rname').textContent = titleCase(nameOf(c)); im.alt = titleCase(nameOf(c));
        $('rcat').innerHTML = `<span aria-hidden="true">${CAT[g].e}</span> ${esc(CAT[g][L])}` + (ok ? '' : ` <s>${esc(CAT[pick].e + ' ' + CAT[pick][L])}</s>`) + (c.sj && c.sj.length ? `<small class="fl">${esc(T('onList'))} <span lang="en">${esc(c.sj.join(' · '))}</span></small>` : '');
        let h = '';
        if (L === 'zh') { h += `<span class="zh"><b>${esc(ch.q ? 'FBI 要約談' : T('wantedFor'))}</b>${ch.zh ? '：' + esc(ch.zh) : ''}</span><span class="en" lang="en"><i>${esc(T('enNote'))}</i> ${esc(ch.head)}${ch.more ? esc(S.en.more(ch.more)) : ''}</span>` }
        else h += `<span class="en"><b>${ch.q ? '' : esc(T('wantedFor')) + ': '}</b>${esc(ch.head)}${ch.more ? `<small>${esc(T('more')(ch.more))}</small>` : ''}</span>`;
        $('rhead').innerHTML = h; $('rhead').classList.toggle('zhm', L === 'zh');
        let line = '';
        if (L === 'zh') { const cl = cluesOf(c, 'zh'); const z = cl.length > 1 && pk ? cl[1] : cl[0]; line = z ? hl(z, 'zh') : '' }
        else for (const s0 of (c.r.t || [])) { const s = firstSentence(s0); if (s && s.indexOf(ch.head.replace(/…$/, '')) < 0) { line = esc(clip(s, 170)); break } }
        $('rline').innerHTML = line;
        $('legal').textContent = T('lgWanted'); $('tip').textContent = T('tip'); $('fullBtn').textContent = T('full');
        $('fbiLink').textContent = T('fbi'); $('fbiLink').href = c.url;
        $('next').textContent = (ctx2 && typeof ctx2.t === 'function' && ctx2.t('next') !== 'next') ? ctx2.t('next') : T('next');
        $('dlgX').setAttribute('aria-label', T('close'));
      }
      function fullPoster() {
        const r = c.r || {}; let h = '';
        h += `<h3>${esc(T('fullFiled'))}</h3><p>${esc(CAT[g].e + ' ' + CAT[g][L])}${c.sj && c.sj.length ? ` · <span lang="en">${esc(c.sj.join(' · '))}</span>` : ''}</p>`;
        if (r.w) h += `<p class="wn" lang="en">${esc(r.w)}</p>`;
        if (r.d) h += `<h3>${esc(T('fullDesc'))}</h3><p lang="en">${esc(r.d)}</p>`;
        if (r.t && r.t.length) h += `<h3>${esc(T('fullText'))}</h3>` + r.t.map(s => `<p lang="en">${esc(s)}</p>`).join('');
        if (r.rm && r.rm.filter(Boolean).length) h += `<h3>${esc(T('fullRm'))}</h3>` + r.rm.filter(Boolean).map(s => `<p lang="en">${esc(s)}</p>`).join('');
        if (r.rw) h += `<h3>${esc(T('fullRw'))}</h3><p lang="en">${esc(r.rw)}</p>`;
        h += `<p><i>${esc(T('lgWanted'))}</i></p><p><i>${esc(T('cutNote'))}</i></p>`;
        h += `<p><a href="https://tips.fbi.gov/" target="_blank" rel="noopener"><b>${esc(T('tip'))}</b></a><br><a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(T('fbi'))}</a></p>`;
        $('dlgT').textContent = titleCase(nameOf(c)); $('dlgB').innerHTML = h; $('dlgB').scrollTop = 0; const d = $('dlg'); if (!d.open) d.showModal()
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
        else if (!done && (e.key === 'p' || e.key === 'P')) { e.preventDefault(); peek() }
        else if (done && e.key === 'Enter' && (document.activeElement === document.body || document.activeElement === $('next'))) { e.preventDefault(); userNext() }
      }, { signal: sig });
      function cleanup() { ac.abort(); const d = $('dlg'); if (d.open) d.close(); if (active === ctl) active = null }
      const ctl = { setLang(l) { L = l === 'zh' ? 'zh' : 'en'; renderAsk(); if (done) renderReveal(false) } };
      active = ctl;
      if (ctx2 && ctx2.signal) { if (ctx2.signal.aborted) { cleanup(); return } ctx2.signal.addEventListener('abort', () => { if (!finished) { finished = true; cleanup() } }, { once: true }) }
      renderAsk();
      setTimeout(() => { if (root.isConnected && !done) OB[0].focus({ preventScroll: true }) }, 30)
    });
  }
};
