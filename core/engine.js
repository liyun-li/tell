// TELL. / 破綻 — shared engine (rng, days, storage, lang, scoring). No DOM.
export const EPOCH = Date.UTC(2026, 10, 2); // Daily Mix #1 = 2026-11-02 (Taipei)
export function h32(s){let h=2166136261>>>0;s=String(s);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
export function rng(seed){let a=h32(seed);return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
export function shuf(a,r=Math.random){for(let i=a.length-1;i>0;i--){const j=r()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a}
// Day boundaries: Asia/Taipei (UTC+8, no DST) for every player.
export const dayStr=ms=>new Date(ms+8*36e5).toISOString().slice(0,10);
export const today=()=>dayStr(Date.now());
export function dayNo(day){const [y,m,d]=day.split('-').map(Number);return Math.round((Date.UTC(y,m-1,d)-EPOCH)/864e5)+1}
export function prevDay(day){const [y,m,d]=day.split('-').map(Number);return new Date(Date.UTC(y,m-1,d)-864e5).toISOString().slice(0,10)}
// localStorage, always "sus_" prefixed, never throws
export const LS={k:k=>'sus_'+k,
 get(k){try{return JSON.parse(localStorage.getItem('sus_'+k))}catch(e){return null}},
 set(k,v){try{localStorage.setItem('sus_'+k,JSON.stringify(v))}catch(e){}},
 del(k){try{localStorage.removeItem('sus_'+k)}catch(e){}}};
export function detectLang(qs){const q=qs&&qs.get('lang');if(q)return /^zh/i.test(q)?'zh':'en';const s=LS.get('lang');if(s==='zh'||s==='en')return s;
 for(const l of (navigator.languages||[navigator.language||'en'])){if(/^zh[-_](tw|hk|mo|hant)/i.test(l)||/hant/i.test(l))return 'zh';if(/^zh/i.test(l))return 'zh';if(/^en/i.test(l))return 'en'}return 'en'}
// Normalize a module result to 0..3 (one decimal)
export function norm(res){if(!res)return 0;const p=Number(res.points),m=Number(res.max);if(!isFinite(p)||!isFinite(m)||m<=0)return res.correct?3:0;
 return Math.round(Math.max(0,Math.min(1,p/m))*30)/10}
export const sq=n=>n>=3?'🟩':n>=1.5?'🟨':n>0?'🟧':'🟥';
export const fmt=n=>(Math.round(n*10)/10).toString();
// Shared hub strings exposed to modules via ctx2.t(key)
export const HT={en:{next:'NEXT →',results:'RESULTS →',correct:'Correct',wrong:'Nope',loading:'Loading…',retry:'RETRY',points:n=>`+${n}`,source:'Source ↗'},
 zh:{next:'下一題 →',results:'看結果 →',correct:'答對',wrong:'答錯',loading:'載入中…',retry:'重試',points:n=>`+${n}`,source:'來源 ↗'}};
export function mkT(lang){return (k,...a)=>{const v=(HT[lang]||HT.en)[k];return typeof v==='function'?v(...a):(v??k)}}
