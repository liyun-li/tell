// Do The Crime / 關多久？ — hub module. Higher-or-lower on real DOJ sentences.
// One hub round = a chain of 3 comparisons (the revealed card becomes the known one), 1 pt each.
import intro from './intro.js';
const CSS_ID='m-crime-css';
const CSS=`
.m-crime{--mc-paper:#f3e9d8;--mc-paper2:#fff6e6;--mc-ink:#1d1712;--mc-mut:#6d5f50;--mc-hot:var(--accent,#ff4d2e);--mc-hot2:#ffb000;
 container:mc/size;height:100%;width:100%;min-width:0;min-height:0;display:flex;flex-direction:column;gap:clamp(.25rem,1.6cqh,.6rem);color:var(--fg,#f6efe6);font-family:inherit;position:relative;overflow:hidden;box-sizing:border-box}
.m-crime *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
.m-crime button{font:inherit;cursor:pointer;color:inherit;touch-action:manipulation}
.m-crime .mc-top{flex:none;display:flex;align-items:center;justify-content:center;gap:.6em;min-width:0}
.m-crime .mc-q{min-width:0;text-align:center;font-weight:900;font-size:clamp(.8rem,min(4.6cqi,4.4cqh),1.25rem);letter-spacing:.01em;line-height:1.15}
.m-crime .mc-q b{color:var(--mc-hot)}
.m-crime .mc-chain{flex:none;display:flex;gap:.25em;align-items:center}
.m-crime .mc-chain i{display:block;width:clamp(.45rem,2.4cqi,.75rem);height:clamp(.45rem,2.4cqi,.75rem);border-radius:50%;border:2px solid var(--muted,#b9ada0);opacity:.55}
.m-crime .mc-chain i.cur{opacity:1;border-color:var(--fg,#f6efe6)}
.m-crime .mc-chain i.ok{background:#2fbf71;border-color:#2fbf71;opacity:1}.m-crime .mc-chain i.no{background:#ff4d2e;border-color:#ff4d2e;opacity:1}
.m-crime .mc-arena{flex:1 1 0;min-height:0;display:flex;flex-direction:column;gap:clamp(.2rem,1.2cqh,.45rem);position:relative}
.m-crime .mc-vs{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:3;background:var(--mc-hot);color:#1a0d08;font:900 clamp(.6rem,min(3.2cqi,3.2cqh),.9rem) ui-monospace,Menlo,Consolas,monospace;border-radius:999px;padding:.3em .55em;box-shadow:0 0 0 .25em var(--bg,#14110f);pointer-events:none}
.m-crime .mc-case{flex:1 1 0;min-height:0;min-width:0;position:relative;container-type:size;border-radius:var(--radius,.8rem);background:var(--mc-paper);color:var(--mc-ink);box-shadow:0 .3rem 0 #000a;overflow:hidden;transition:transform .15s}
.m-crime .mc-pick{position:absolute;inset:0;width:100%;height:100%;border:0;background:none;color:inherit;text-align:left;display:flex;flex-direction:column;justify-content:center;gap:clamp(.1rem,3cqh,.6rem);padding:clamp(.35rem,6cqh,1rem) clamp(.5rem,5cqi,1.1rem);border-radius:inherit}
.m-crime .mc-pick:disabled{cursor:default}
.m-crime .mc-pick:focus-visible{outline:3px solid var(--mc-hot2);outline-offset:-3px}
.m-crime .mc-meta{font:700 clamp(.55rem,min(3.6cqi,8cqh),.85rem)/1.2 ui-monospace,Menlo,Consolas,"PingFang TC","Noto Sans TC",monospace;color:var(--mc-mut);letter-spacing:.03em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:none}
.m-crime .mc-crime{font-weight:850;font-size:clamp(.6rem,min(7.4cqi,12.5cqh),2.1rem);line-height:1.15;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:5;text-wrap:balance;flex:0 1 auto;min-height:0}
.m-crime .mc-time{flex:none;display:flex;align-items:baseline;gap:.4em;font:900 clamp(.8rem,min(8cqi,17cqh),2.4rem)/1 ui-monospace,Menlo,Consolas,"PingFang TC","Noto Sans TC",monospace;color:var(--mc-ink)}
.m-crime .mc-time .mc-lbl{font:700 clamp(.5rem,min(3.2cqi,7cqh),.8rem) system-ui,sans-serif;color:var(--mc-mut);letter-spacing:.04em;text-transform:uppercase}
.m-crime .mc-num.q2{color:var(--mc-hot)}
.m-crime .mc-case.known{background:var(--mc-paper2)}
.m-crime .mc-case.win .mc-num{color:#0f7a43}
.m-crime .mc-case.lose{filter:saturate(.6) brightness(.93)}
.m-crime .mc-src{position:absolute;right:.5em;bottom:.45em;z-index:2;font:800 clamp(.55rem,min(3.4cqi,7.5cqh),.8rem) system-ui,sans-serif;color:#5b3c00;background:#ffffffb0;border-radius:999px;padding:.2em .6em;text-decoration:none;border:1px solid #0002}
.m-crime .mc-stamp{position:absolute;right:4%;top:8%;z-index:2;pointer-events:none;font:900 clamp(.8rem,min(9cqi,18cqh),2.6rem)/1 ui-monospace,Menlo,Consolas,"PingFang TC","Noto Sans TC",monospace;text-transform:uppercase;letter-spacing:.04em;border:.14em solid currentColor;border-radius:.25em;padding:.1em .3em;transform:rotate(-12deg) scale(2.4);opacity:0;mix-blend-mode:multiply;white-space:nowrap}
.m-crime .mc-stamp.ok{color:#0f8a4b}.m-crime .mc-stamp.no{color:#d8321b}
.m-crime .mc-stamp.on{animation:mc-slam .38s cubic-bezier(.2,1.6,.4,1) forwards}
.m-crime .mc-stamp.still{animation:none;transform:rotate(-12deg) scale(1);opacity:.92}
@keyframes mc-slam{to{transform:rotate(-12deg) scale(1);opacity:.92}}
.m-crime .mc-case.good{animation:mc-pop .35s ease-out}.m-crime .mc-case.bad{animation:mc-shake .45s}
@keyframes mc-pop{40%{transform:scale(1.035)}}
@keyframes mc-shake{20%{transform:translateX(-3%)}40%{transform:translateX(3%)}60%{transform:translateX(-2%)}80%{transform:translateX(1%)}}
.m-crime .mc-foot{flex:none;display:flex;align-items:center;gap:.5rem;min-height:clamp(2rem,10cqh,3.4rem)}
.m-crime .mc-quip{flex:1 1 auto;min-width:0;font-weight:800;font-size:clamp(.7rem,min(3.8cqi,3.6cqh),1rem);line-height:1.2;color:var(--mc-hot2);display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;text-wrap:balance}
.m-crime .mc-quip.hint{color:var(--muted,#b9ada0);font-weight:600;text-align:center}
.m-crime .mc-next{flex:none;background:var(--mc-hot);color:#1a0d08;border:0;border-radius:.7rem;font-weight:900;letter-spacing:.03em;box-shadow:0 .25rem 0 #000a;font-size:clamp(.85rem,min(5cqi,4.6cqh),1.25rem);padding:clamp(.3rem,1.8cqh,.6rem) clamp(.9rem,6cqi,1.8rem);white-space:nowrap}
.m-crime .mc-next:active{transform:translateY(2px);box-shadow:none}
.m-crime.wait .mc-next{display:none}
.m-crime .mc-flash{position:absolute;inset:0;pointer-events:none;z-index:9;opacity:0}
.m-crime .mc-flash.ok{background:radial-gradient(circle,#2fbf7155,transparent 70%);animation:mc-fl .5s}
.m-crime .mc-flash.no{background:radial-gradient(circle,#ff4d2e66,transparent 70%);animation:mc-fl .6s}
@keyframes mc-fl{20%{opacity:1}}
.m-crime .mc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@container mc (min-aspect-ratio:4/3){.m-crime .mc-arena{flex-direction:row}.m-crime .mc-crime{-webkit-line-clamp:6}}
@media (prefers-reduced-motion:reduce){.m-crime *{animation-duration:.01s!important;transition:none!important}}
`;
const T={en:{q:'Who got <b>more time</b>?',hint:'Tap who got more prison time.',next:'NEXT →',done:'NEXT →',known:'Sentenced to',
 mo:n=>n===1?'1 month':`${n} months`,dy:n=>n===1?'1 day':`${n} days`,ym:(y,m)=>`${y} yr${y>1?'s':''}`+(m?` ${m} mo`:''),life:'LIFE',prob:'Probation',
 src:'DOJ ↗',srcL:'Read the DOJ press release',ok:['CALLED IT','NAILED IT','CORRECT','SHARP'],no:['NOPE','WRONG','OOF','NOT EVEN'],
 quips:{soft:'Paperwork crime, serious time.',prob:'One of them went home.',life:'Life. As in, the rest of it.',close:'Closer than it looks.',
  huge:r=>`${r}× the time. Justice math.`,gen:['Justice is weird.','The guidelines have spoken.','Nobody saw that coming. Except the judge.','Federal sentencing: it’s complicated.','The math is mathing. Kind of.']},
 step:(i,n)=>`Comparison ${i} of ${n}`,sum:p=>`${p}/3 sentences called`},
zh:{q:'誰被關<b>比較久</b>？',hint:'點被關比較久的那個。',next:'下一題 →',done:'下一題 →',known:'判刑',
 mo:n=>`${n} 個月`,dy:n=>`${n} 天`,ym:(y,m)=>`${y} 年`+(m?` ${m} 個月`:''),life:'無期徒刑',prob:'緩刑',
 src:'司法部原文 ↗',srcL:'閱讀司法部原文（美國司法部新聞稿）',ok:['猜中','神準','正解','內行'],no:['猜錯','翻車','錯了','差遠了'],
 quips:{soft:'文書犯罪，刑期一點都不文。',prob:'其中一個直接回家。',life:'無期，就是字面上的無期。',close:'比你想的還接近。',
  huge:r=>`差了 ${r} 倍，司法數學。`,gen:['司法就是這麼玄。','量刑指南說了算。','沒人想到，除了法官。','美國聯邦量刑，就是這麼難懂。','這數學……好像說得通？']},
 step:(i,n)=>`第 ${i} / ${n} 題`,sum:p=>`刑期猜中 ${p}/3`}};
const ST={'Florida':'佛羅里達','Texas':'德州','California':'加州','New York':'紐約','Montana':'蒙大拿','South Dakota':'南達科他','Massachusetts':'麻州','District of Columbia':'華府','Virginia':'維吉尼亞','Indiana':'印第安納','Iowa':'愛荷華','Louisiana':'路易斯安那','Connecticut':'康乃狄克','Ohio':'俄亥俄','Pennsylvania':'賓州','Georgia':'喬治亞','North Carolina':'北卡','South Carolina':'南卡','Tennessee':'田納西','Kentucky':'肯塔基','Alabama':'阿拉巴馬','Mississippi':'密西西比','Arkansas':'阿肯色','Missouri':'密蘇里','Kansas':'堪薩斯','Nebraska':'內布拉斯加','Oklahoma':'奧克拉荷馬','Colorado':'科羅拉多','Utah':'猶他','Nevada':'內華達','Arizona':'亞利桑那','New Mexico':'新墨西哥','Washington':'華盛頓州','Oregon':'奧勒岡','Idaho':'愛達荷','Wyoming':'懷俄明','North Dakota':'北達科他','Minnesota':'明尼蘇達','Wisconsin':'威斯康辛','Michigan':'密西根','Illinois':'伊利諾','New Jersey':'紐澤西','Delaware':'德拉瓦','Maryland':'馬里蘭','West Virginia':'西維吉尼亞','Maine':'緬因','New Hampshire':'新罕布夏','Vermont':'佛蒙特','Rhode Island':'羅德島','Alaska':'阿拉斯加','Hawaii':'夏威夷','Puerto Rico':'波多黎各','Guam':'關島','Virgin Islands':'美屬維京群島','Northern Mariana Islands':'北馬里亞納'};
const HARD=new Set(['firearm','drugs','violent','threat','theft']),SOFT=new Set(['fraud','tax','covid','health','corruption','crypto','cyber','wildlife','mail','other','air','sport']);
const CHAIN=3,HOLD=350;
const norm=l=>/^zh/i.test(l||'')?'zh':'en';
const val=c=>c.k==='life'?2400:Math.max(c.m,1);
const ratio=(a,b)=>Math.max(val(a),val(b))/Math.min(val(a),val(b));
// Tier = how close the two sentences in each pair are (ratio bigger/smaller). Easy: ≥3×, medium 1.6–4×, hard 1.2–2×.
const BAND={1:[3,1e9],2:[1.6,4],3:[1.2,2]};
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function challenger(pool,champ,tier,R,seen){const [lo,hi]=BAND[tier]||BAND[2],v=val(champ);
 const ok=c=>!seen.has(c.id)&&c.id!==champ.id&&!(c.k==='life'&&champ.k==='life');
 let cand=pool.filter(c=>ok(c)&&ratio(c,champ)>=lo&&ratio(c,champ)<=hi);
 if(cand.length<4)cand=pool.filter(c=>ok(c)&&ratio(c,champ)>=1.2);
 if(!cand.length)return null;
 // balanced higher/lower, prefer a different category, early tiers lean soft-vs-hard surprises
 const up=R()<.5;let side=cand.filter(c=>(val(c)>v)===up);if(side.length)cand=side;
 const diff=cand.filter(c=>c.g!==champ.g);if(diff.length&&R()<.97)cand=diff;
 if(tier<3&&HARD.has(champ.g)&&R()<.8){const sf=cand.filter(c=>SOFT.has(c.g));if(sf.length)cand=sf}
 if(R()<(tier>=3?.5:.3)){const cx=cand.filter(c=>{const big=val(c)>v?c:champ,small=big===c?champ:c;return SOFT.has(big.g)&&HARD.has(small.g)});if(cx.length)cand=cx}
 const cnt={};for(const c of cand)cnt[c.g]=(cnt[c.g]||0)+1;const w=cand.map(c=>1/Math.sqrt(cnt[c.g]));let s=w.reduce((a,b)=>a+b,0)*R();
 for(let i=0;i<cand.length;i++){s-=w[i];if(s<=0)return cand[i]}return cand[cand.length-1]}
let live=null;
export default {
 id:'crime',name:{en:'Do The Crime',zh:'關多久？'},icon:'⚖️',intro,
 async load(ctx){const base=(ctx&&ctx.base)||'https://liyun-li.github.io';let d,err;
  for(let k=0;k<3;k++){try{const r=await fetch(base+'/do-the-crime/curated.json',{cache:'no-cache'});if(!r.ok)throw new Error('HTTP '+r.status);d=await r.json();break}catch(e){err=e;if(k<2)await new Promise(r=>setTimeout(r,600*(k+1)))}}
  if(!d)throw err||new Error('load');
  const day=new Date().toISOString().slice(0,10);
  // Only translated, released cases (the live daily uses the same rule) and well-formed sentences.
  const cases=(d.cases||[]).filter(c=>c&&c.id&&c.c&&c.zc&&c.u&&(c.k==='life'||c.k==='probation'||(c.k==='prison'&&c.m>0))&&(!c.a||c.a<day));
  cases.sort((a,b)=>a.id<b.id?-1:1);
  if(cases.length<8)throw new Error('empty');return {cases}},
 pick(pool,rng,tier){const R=rng,P=pool.cases;tier=Math.min(3,Math.max(1,tier|0||2));
  for(let tries=0;tries<6;tries++){
   let firsts=P.filter(c=>c.k==='prison'&&c.m>=12&&c.m<=120);if(R()<.7){const s=firsts.filter(c=>SOFT.has(c.g));if(s.length)firsts=s}
   const champ=firsts[Math.floor(R()*firsts.length)],seen=new Set([champ.id]),chain=[champ];
   for(let i=0;i<CHAIN;i++){const c=challenger(P,chain[i],tier,R,seen);if(!c)break;seen.add(c.id);chain.push(c)}
   if(chain.length===CHAIN+1)return {tier,cases:chain}}
  throw new Error('crime: could not build a chain')},
 setLang(l){live&&live(norm(l))},
 render(round,el,ctx2={}){
  if(!document.getElementById(CSS_ID)){const s=document.createElement('style');s.id=CSS_ID;s.textContent=CSS;document.head.appendChild(s)}
  let L=norm(ctx2.lang);const S=()=>T[L];const sig=ctx2.signal;
  const sfx=k=>{try{ctx2.sfx&&ctx2.sfx(k)}catch(e){}};
  el.innerHTML=`<div class="m-crime wait" lang="${L==='zh'?'zh-Hant':'en'}">
 <div class="mc-top"><h2 class="mc-q"></h2><span class="mc-chain" aria-hidden="true">${'<i></i>'.repeat(CHAIN)}</span></div>
 <div class="mc-arena">
  <div class="mc-case" data-k="A"><button type="button" class="mc-pick"></button><div class="mc-stamp" aria-hidden="true"></div></div>
  <div class="mc-vs" aria-hidden="true">VS</div>
  <div class="mc-case" data-k="B"><button type="button" class="mc-pick"></button><div class="mc-stamp" aria-hidden="true"></div></div>
 </div>
 <div class="mc-foot"><p class="mc-quip hint" aria-live="polite"></p><button type="button" class="mc-next"></button></div>
 <p class="mc-sr" aria-live="polite"></p><div class="mc-flash"></div></div>`;
  const root=el.firstElementChild,q=s=>root.querySelector(s),cA=q('[data-k=A]'),cB=q('[data-k=B]'),pA=cA.firstElementChild,pB=cB.firstElementChild;
  const C=round.cases;const st={i:0,picked:null,ok:null,hist:[],busy:false,raf:0,hold:0};
  const held=()=>performance.now()<st.hold;
  const txt=c=>L==='en'?{s:c.s,c:c.c}:{s:c.zs||'',c:c.zc};
  const stateName=s=>!s?'':L==='en'?s:(ST[s]||s);
  function fmt(c,m){const X=S();if(c.k==='life'&&m===undefined)return X.life;if(c.k==='probation')return X.prob;if(c.dy)return X.dy(m===undefined?c.dy:Math.max(1,Math.round(m/c.m*c.dy)));m=m===undefined?c.m:m;m=Math.round(m);return m<24?X.mo(m):X.ym(Math.floor(m/12),m%12)}
  function card(cel,p,c,known){const x=txt(c),X=S(),meta=[x.s,c.y,stateName(c.st)].filter(Boolean).join(' · ');cel.classList.toggle('known',known);
   p.innerHTML=`<span class="mc-meta">${esc(meta)}</span> <span class="mc-crime">${esc(x.c.charAt(0).toUpperCase()+x.c.slice(1))}</span> <span class="mc-time"><span class="mc-lbl">${esc(X.known)}</span> <span class="mc-num${known?'':' q2'}">${known?esc(fmt(c)):'?'}</span></span>`;
   p.removeAttribute('aria-label')}
  function quip(a,b){const X=S().quips,big=val(a)>=val(b)?a:b,small=big===a?b:a,r=val(big)/val(small);
   if(big.k==='life')return X.life;if(small.k==='probation')return X.prob;if(SOFT.has(big.g)&&HARD.has(small.g))return X.soft;if(r>=5)return X.huge(Math.round(r));if(r<1.5)return X.close;
   const g=X.gen;return g[(a.id.charCodeAt(0)+b.id.charCodeAt(1))%g.length]}
  function chain(){root.querySelectorAll('.mc-chain i').forEach((e,j)=>{e.className=j<st.hist.length?(st.hist[j]?'ok':'no'):j===st.i?'cur':''})}
  function paint(anim){const X=S(),a=C[st.i],b=C[st.i+1];root.lang=L==='zh'?'zh-Hant':'en';
   q('.mc-q').innerHTML=X.q;q('.mc-q').setAttribute('aria-description',X.step(st.i+1,CHAIN));
   card(cA,pA,a,true);card(cB,pB,b,!!st.picked&&!st.busy);
   for(const cel of [cA,cB]){cel.classList.remove('win','lose','good','bad');const s=cel.querySelector('.mc-stamp');s.className='mc-stamp';s.textContent='';const o=cel.querySelector('.mc-src');if(o)o.remove()}
   pA.disabled=pB.disabled=!!st.picked;root.classList.toggle('wait',!st.picked||st.busy);chain();
   if(!st.picked){const qp=q('.mc-quip');qp.className='mc-quip hint';qp.textContent=X.hint}
   else if(!st.busy)reveal(true);
   if(anim)st.hold=performance.now()+HOLD}
  function count(numEl,c,done){const target=c.k==='life'?600:c.m;
   if(c.k==='probation'||matchMedia('(prefers-reduced-motion:reduce)').matches){numEl.textContent=fmt(c);done();return}
   const t0=performance.now(),dur=900;let last=0;const step=now=>{if(!root.isConnected)return;const p=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-p,3);
    numEl.textContent=p<1?fmt({k:'prison',m:c.m,dy:c.dy},target*e):fmt(c);if(now-last>70&&p<1){sfx('tick');last=now}
    if(p<1)st.raf=requestAnimationFrame(step);else done()};st.raf=requestAnimationFrame(step)}
  function choose(k){if(st.picked||st.busy||held())return;const a=C[st.i],b=C[st.i+1],aWins=val(a)>val(b),ok=(k==='A')===aWins;
   st.picked=k;st.ok=ok;st.hist.push(ok?1:0);st.busy=true;pA.disabled=pB.disabled=true;
   card(cB,pB,b,true);const num=pB.querySelector('.mc-num');num.classList.remove('q2');
   if(navigator.vibrate)try{navigator.vibrate(ok?20:[40,40,40])}catch(e){}
   count(num,b,()=>{st.busy=false;root.classList.remove('wait');reveal(false)})}
  function reveal(instant){const X=S(),a=C[st.i],b=C[st.i+1],ok=st.ok,aWins=val(a)>val(b);
   (aWins?cA:cB).classList.add('win');(aWins?cB:cA).classList.add('lose');
   const P=st.picked==='A'?cA:cB;if(!instant)P.classList.add(ok?'good':'bad');
   const s=P.querySelector('.mc-stamp'),list=ok?X.ok:X.no;s.textContent=list[(st.i+(a.id.charCodeAt(2)||0))%list.length];s.className='mc-stamp '+(ok?'ok':'no')+(instant?' still':' on');
   for(const [cel,c] of [[cA,a],[cB,b]]){if(cel.querySelector('.mc-src'))continue;const l=document.createElement('a');l.className='mc-src';l.href=c.u;l.target='_blank';l.rel='noopener';l.textContent=X.src;l.setAttribute('aria-label',X.srcL+' — '+txt(c).c);cel.appendChild(l)}
   const qp=q('.mc-quip');qp.className='mc-quip';qp.textContent=(ok?'':'✗ ')+quip(a,b);chain();
   const nx=q('.mc-next');nx.textContent=st.i+1>=CHAIN?X.done:X.next;
   q('.mc-sr').textContent=(ok?'✓ ':'✗ ')+fmt(b);
   if(!instant){sfx(ok?'ok':'no');const f=q('.mc-flash');f.className='mc-flash';void f.offsetWidth;f.className='mc-flash '+(ok?'ok':'no');st.hold=performance.now()+HOLD;nx.focus({preventScroll:true})}}
  return new Promise((resolve,reject)=>{
   const finish=()=>{live=null;const pts=st.hist.reduce((s,x)=>s+x,0);
    resolve({points:pts,max:3,correct:pts>=2,grid:st.hist.map(x=>x?'🟩':'🟥').join(''),summary_en:T.en.sum(pts),summary_zh:T.zh.sum(pts)})};
   pA.onclick=()=>choose('A');pB.onclick=()=>choose('B');
   q('.mc-next').onclick=()=>{if(!st.picked||st.busy||held())return;if(st.i+1>=CHAIN){finish();return}
    st.i++;st.picked=null;st.ok=null;paint(true);pA.focus({preventScroll:true})};
   root.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;if(e.key==='1'||e.key==='ArrowUp'||e.key==='ArrowLeft'){choose('A');e.preventDefault()}else if(e.key==='2'||e.key==='ArrowDown'||e.key==='ArrowRight'){choose('B');e.preventDefault()}});
   live=l=>{if(!root.isConnected)return;L=l;const keepBusy=st.busy;paint(false);if(keepBusy){card(cB,pB,C[st.i+1],true);pB.querySelector('.mc-num').classList.remove('q2')}};
   if(sig){const ab=()=>{cancelAnimationFrame(st.raf);live=null;reject(sig.reason||new DOMException('Aborted','AbortError'))};if(sig.aborted){ab();return}sig.addEventListener('abort',ab,{once:true})}
   paint(true)})}
};
