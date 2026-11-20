// Paper Trail / 保單疑雲 — hub module. Verdict call (+2), then the crack (+1) = 0..3.
import intro from './intro.js';
const CSS_ID='m-paper-css';
const MONO='ui-monospace,"SF Mono",Menlo,Consolas,"Courier New","PingFang TC","Noto Sans TC","Noto Sans CJK TC",monospace';
const CSS=`
.m-paper{--mp-pap:#ece4cf;--mp-pap2:#f7f2e4;--mp-dk:#1d1a14;--mp-red:#a82a20;--mp-man:#d9b56a;--mp-grn:#1d6b43;--mp-btn:color-mix(in srgb,var(--fg,#f1ece0) 8%,var(--bg,#15130f));--k:1;
 container:mp/size;height:100%;width:100%;min-width:0;min-height:0;color:var(--fg,#f1ece0);position:relative;overflow:hidden;box-sizing:border-box}
.m-paper .mp-in{height:100%;width:100%;min-height:0;min-width:0;display:flex;flex-direction:column;gap:clamp(.3rem,1.4cqh,.55rem);overflow:hidden}
.m-paper *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
.m-paper button{font:inherit;cursor:pointer;color:inherit;touch-action:manipulation}
.m-paper :focus-visible{outline:3px solid var(--mp-man);outline-offset:2px}
.m-paper .mp-card{flex:1 1 0;min-height:0;display:flex;flex-direction:column;background:var(--mp-pap);color:var(--mp-dk);border-radius:.3rem .55rem .55rem .55rem;padding:clamp(.35rem,2cqh,.85rem) clamp(.5rem,3cqi,1rem);gap:clamp(.2rem,1.3cqh,.5rem);overflow:hidden;position:relative;box-shadow:0 .3rem 0 #0006;
 background-image:repeating-linear-gradient(0deg,transparent 0 1.6rem,#0000000a 1.6rem calc(1.6rem + 1px))}
.m-paper .mp-head{display:flex;justify-content:space-between;align-items:center;gap:.5rem;font:800 clamp(.56rem,min(3cqi,2.9cqh),.78rem) ${MONO};letter-spacing:.1em;color:#6b6252;border-bottom:1px dashed #0003;padding-bottom:clamp(.12rem,.8cqh,.3rem);flex:none;min-width:0}
.m-paper .mp-head>span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.m-paper .mp-worth{color:var(--mp-pap);background:var(--mp-dk);border-radius:999px;padding:.1em .55em;letter-spacing:.04em;flex:none}
.m-paper .mp-steps{display:flex;gap:.25rem;flex:none;align-items:center}.m-paper .mp-steps i{width:1.1em;height:.3em;border-radius:2px;background:#0002;display:block}.m-paper .mp-steps i.on{background:var(--mp-red)}
.m-paper .mp-mrow{display:flex;align-items:center;justify-content:space-between;gap:.4rem;flex:none;min-width:0;min-height:1.2em}
.m-paper .mp-meta{flex:0 1 auto;min-width:0;font:700 clamp(.58rem,min(3.1cqi,3cqh),.8rem)/1.3 ${MONO};color:#5e5646;letter-spacing:.04em;overflow-wrap:anywhere;text-transform:uppercase}
.m-paper .mp-docs{list-style:none;flex:1 1 0;min-height:0;display:flex;flex-direction:column;gap:calc(var(--k)*clamp(.18rem,1.2cqh,.45rem));overflow:hidden;padding:0 .15rem .15rem 0}
.m-paper .mp-doc{flex:none;display:flex;gap:.5em;align-items:baseline;background:var(--mp-pap2);border:1px solid #0000001f;border-left:.25em solid var(--mp-dk);border-radius:.2rem;box-shadow:.12rem .12rem 0 #0000001a;
 padding:calc(var(--k)*clamp(.2rem,1.2cqh,.45rem)) .5em;font:600 calc(var(--k)*clamp(.72rem,min(4.1cqi,3.9cqh),1.02rem))/1.3 system-ui,-apple-system,"Segoe UI",Roboto,"PingFang TC","Noto Sans TC",sans-serif;overflow-wrap:anywhere;min-width:0}
.m-paper.anim.s-v .mp-doc{animation:mp-slide .3s both}
.m-paper .mp-doc b{flex:none;font:900 .7em ${MONO};color:#6b6252;letter-spacing:.06em}
.m-paper .mp-doc span{min-width:0;flex:1 1 0}
.m-paper .mp-doc.red span{display:flex;align-items:center;align-self:stretch}.m-paper .mp-doc.red i{display:block;height:.95em;background:var(--mp-dk);border-radius:1px}
.m-paper .mp-stamp{flex:none;margin:clamp(.1rem,.9cqh,.35rem) .3rem clamp(.1rem,.9cqh,.35rem) 0;transform:rotate(-6deg);font:900 clamp(.9rem,min(6cqi,5.4cqh),1.5rem)/1 ${MONO};border:.18em double currentColor;border-radius:.25rem;padding:.12em .4em;background:#f7f2e4d9;white-space:nowrap;letter-spacing:.06em;pointer-events:none;display:none;max-width:90%;overflow:hidden;text-overflow:ellipsis}
.m-paper .mp-stamp.ok{color:var(--mp-grn)}.m-paper .mp-stamp.no{color:var(--mp-red)}
.m-paper.s-c .mp-stamp,.m-paper.s-r .mp-stamp{display:block}
.m-paper.s-c .mp-stamp{margin-block:.15rem;font-size:clamp(.7rem,min(4.6cqi,4.2cqh),1.3rem)}
.m-paper.anim .mp-stamp{animation:mp-stamp .45s cubic-bezier(.2,.9,.3,1.4)}
.m-paper .mp-rv{display:none;flex:1 1 0;min-height:0;flex-direction:column;gap:calc(var(--k)*clamp(.25rem,1.5cqh,.6rem));overflow:hidden}
.m-paper.s-r .mp-rv{display:flex}.m-paper.s-r .mp-docs{display:none}
.m-paper .mp-rline{font:900 calc(var(--k)*clamp(.78rem,min(4.4cqi,4.2cqh),1.1rem))/1.25 ${MONO};flex:none}
.m-paper .mp-rcrack{font:700 calc(var(--k)*clamp(.7rem,min(3.9cqi,3.7cqh),.98rem))/1.3 system-ui,sans-serif;background:var(--mp-pap2);border-left:.25em solid var(--mp-red);padding:.3em .5em;border-radius:.2rem;flex:none;overflow-wrap:anywhere}
.m-paper .mp-rcrack b{font:900 .78em ${MONO};color:#6b6252;letter-spacing:.06em;display:block}
.m-paper .mp-rtext{font:500 calc(var(--k)*clamp(.72rem,min(4cqi,3.8cqh),1rem))/1.4 system-ui,sans-serif;flex:none;overflow-wrap:anywhere}
.m-paper .mp-rsrc{flex:none;font:700 calc(var(--k)*clamp(.62rem,min(3.4cqi,3.3cqh),.86rem)) ${MONO};overflow-wrap:anywhere}
.m-paper .mp-rsrc a{color:#0b4f94;display:inline-flex;align-items:center;min-height:max(1.5rem,1.6em)}
.m-paper .mp-side{display:flex;flex-direction:column;gap:clamp(.25rem,1.3cqh,.5rem);flex:none;min-height:0}
.m-paper .mp-q{font:900 clamp(.7rem,min(3.9cqi,3.7cqh),.98rem) ${MONO};color:var(--mp-man);letter-spacing:.04em;text-align:center}
.m-paper.s-r .mp-q{display:none}
.m-paper .mp-opts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(.3rem,1.5cqh,.5rem);flex:none}
.m-paper .mp-opts.c4{grid-template-columns:1fr;grid-auto-rows:1fr;gap:calc(var(--ko,1)*clamp(.3rem,1.5cqh,.5rem))}
.m-paper .mp-opts button{min-width:0;background:var(--mp-btn);border:1px solid color-mix(in srgb,var(--fg,#fff) 22%,transparent);border-radius:var(--radius,.55rem);padding:clamp(.3rem,1.6cqh,.6rem) .25rem;font-weight:800;font-size:clamp(.62rem,min(3.7cqi,3.7cqh),1rem);overflow-wrap:break-word;line-height:1.2;min-height:clamp(2.4rem,13cqh,4.2rem);box-shadow:0 .2rem 0 #0008;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.15em}
.m-paper .mp-opts button small{font-weight:600;font-size:.72em;color:var(--muted,#b3aa98);line-height:1.15}
.m-paper .mp-opts.c4 button{min-height:calc(var(--ko,1)*clamp(2.1rem,9.5cqh,3rem));flex-direction:row;justify-content:flex-start;text-align:left;gap:.55em;padding:calc(var(--ko,1)*clamp(.3rem,1.6cqh,.6rem)) .6rem;font-weight:700;font-size:calc(var(--ko,1)*clamp(.68rem,min(3.7cqi,3.5cqh),.95rem));line-height:1.15}
.m-paper .mp-opts.c4 button>i{font:900 .8em ${MONO};font-style:normal;color:var(--mp-man);flex:none}
.m-paper .mp-opts button:active,.m-paper .mp-next:active{transform:translateY(2px) scale(.98);box-shadow:0 .08rem 0 #0008}
.m-paper.s-r .mp-opts{display:none}
.m-paper .mp-next{flex:none;background:var(--fg,#f1ece0);color:var(--bg,#15130f);border:0;border-radius:var(--radius,.6rem);font-weight:900;font-size:clamp(.9rem,min(5.2cqi,4.9cqh),1.25rem);padding:clamp(.35rem,2cqh,.7rem);box-shadow:0 .2rem 0 #0008;display:none}
.m-paper.s-r .mp-next{display:block}
.m-paper.nodocs .mp-docs{display:none}
.m-paper .mp-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@container mp (min-aspect-ratio:5/4){
 .m-paper .mp-in{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);grid-template-rows:minmax(0,1fr);gap:.4rem .8rem}
 .m-paper .mp-side{justify-content:center}
 .m-paper .mp-opts{grid-template-columns:1fr}
 .m-paper .mp-opts button{min-height:0;flex-direction:row;gap:.5em}
}
@container mp (max-height:300px){.m-paper .mp-opts button small{display:none}}
@keyframes mp-slide{from{opacity:0;transform:translateY(.5em)}to{opacity:1;transform:none}}
@keyframes mp-stamp{from{opacity:0;transform:rotate(-6deg) scale(2.4)}to{opacity:1;transform:rotate(-6deg) scale(1)}}
@media (prefers-reduced-motion:reduce){.m-paper *,.m-paper *::before,.m-paper *::after{animation:none!important;transition:none!important}}
`;
const VP=2,CP=1,HOLD=350,VS=['accident','fraud','murder'];
const S={en:{head:'🧾 PAPER TRAIL',ex:i=>`EX.${'ABCDEFGH'[i]}`,qV:'Accident, fraud, or murder?',qC:'What cracked it?',
 v:{accident:['Accident','insurer had to pay'],fraud:['Fraud','faked, no one killed'],murder:['Murder','killed for the payout']},
 st:{accident:'ACCIDENT',fraud:'FRAUD',murder:'MURDER'},crack:'THE CRACK',rcOk:'✓ You found it',rcNo:'✗ You picked',
 line:(ok,v,p)=>ok?`✓ ${v}. +${p}`:`✗ It was ${v}.`,src:id=>`Ruling: ${id} ↗`,next:'NEXT →',
 sum:(v,vok,cok)=>`${vok?'✓':'✗'} ${v} · crack ${cok?'✓':'✗'}`},
zh:{head:'🧾 保單疑雲',ex:i=>`證物${'甲乙丙丁戊己庚辛'[i]}`,qV:'意外、詐保，還是殺人？',qC:'破綻在哪？',
 v:{accident:['意外','保險得照賠'],fraud:['詐保','造假，沒出人命'],murder:['殺人詐保','為了保險金殺人']},
 st:{accident:'意外',fraud:'詐保',murder:'殺人詐保'},crack:'破綻',rcOk:'✓ 你抓到了',rcNo:'✗ 你選的是',
 line:(ok,v,p)=>ok?`✓ ${v}，+${p}`:`✗ 答案是${v}。`,src:id=>`判決：${id} ↗`,next:'下一題 →',
 sum:(v,vok,cok)=>`${vok?'✓':'✗'} ${v}・破綻 ${cok?'✓':'✗'}`}};
const norm=l=>/^zh/i.test(l||'')?'zh':'en';
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function h32(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function prng(seed){let a=h32(String(seed));return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function valid(c){return c&&c.id&&VS.includes(c.verdict)&&Array.isArray(c.trail_en)&&Array.isArray(c.trail_zh)&&c.trail_en.length&&c.trail_zh.length&&Array.isArray(c.cracks_en)&&c.cracks_en.length===4&&Array.isArray(c.cracks_zh)&&c.cracks_zh.length===4&&c.crack_answer>=0&&c.crack_answer<4&&c.reveal_en&&c.reveal_zh}
// Difficulty: how much the trail "reads" like its true verdict. Tiers are ranked WITHIN each verdict
// and the verdict is drawn uniformly, so the hub's tier never hints at the answer.
const DEATH=/死|過世|身亡|喪命|屍|溺|墜|殺|命/g,FLAG=/萬|保了|投保|加保|買了|負債|欠|債|受益人|天內|月內|前\d+天|前.天|多張|三張|兩張|五家|三家/g;
function deception(c){const t=c.trail_zh.join(''),d=(t.match(DEATH)||[]).length,f=(t.match(FLAG)||[]).length;
 return c.verdict==='accident'?f+2*d:c.verdict==='fraud'?2*d-f*.5:-2*d-f*.5}
let live=null;
export default {
 id:'paper',name:{en:'Paper Trail',zh:'保單疑雲'},icon:'🧾',intro,
 async load(ctx){const base=(ctx&&ctx.base)||'https://liyun-li.github.io';let d,err;
  for(let k=0;k<3;k++){try{const r=await fetch(base+'/paper-trail/cases.json',{cache:'no-cache'});if(!r.ok)throw new Error('HTTP '+r.status);d=await r.json();break}catch(e){err=e;if(k<2)await new Promise(r=>setTimeout(r,600*(k+1)))}}
  if(!d)throw err||new Error('load');
  const cases=(Array.isArray(d)?d:d.cases||[]).filter(valid).sort((a,b)=>a.id<b.id?-1:1);if(cases.length<3)throw new Error('empty');
  const slots=Math.min(6,Math.max(...cases.map(c=>Math.max(c.trail_en.length,c.trail_zh.length))));
  const tier={};for(const v of VS){const g=cases.filter(c=>c.verdict===v).map(c=>({c,s:deception(c),h:h32(c.id)})).sort((a,b)=>a.s-b.s||a.h-b.h);
   g.forEach((x,i)=>{tier[x.c.id]=1+Math.min(2,Math.floor(i*3/g.length))})}
  return {cases,slots,tier}},
 pick(pool,rng,tier){tier=Math.min(3,Math.max(1,tier|0||2));
  const vs=VS.filter(v=>pool.cases.some(c=>c.verdict===v)),v=vs[Math.floor(rng()*vs.length)];
  let cand=pool.cases.filter(c=>c.verdict===v&&pool.tier[c.id]===tier);if(!cand.length)cand=pool.cases.filter(c=>c.verdict===v);
  const c=cand[Math.floor(rng()*cand.length)],co=[0,1,2,3];for(let i=3;i>0;i--){const j=rng()*(i+1)|0;[co[i],co[j]]=[co[j],co[i]]}
  return {c,co,slots:pool.slots,tier}},
 setLang(l){live&&live(norm(l))},
 render(round,el,ctx2={}){
  if(!document.getElementById(CSS_ID)){const s=document.createElement('style');s.id=CSS_ID;s.textContent=CSS;document.head.appendChild(s)}
  let L=norm(ctx2.lang);const T=k=>S[L][k],sig=ctx2.signal,c=round.c,co=round.co,SLOTS=Math.max(round.slots||0,c.trail_en.length,c.trail_zh.length);
  const sfx=k=>{try{ctx2.sfx&&ctx2.sfx(k)}catch(e){}};
  el.innerHTML=`<div class="m-paper s-v"><div class="mp-in">
 <div class="mp-card">
  <div class="mp-head"><span class="mp-title"></span><span class="mp-steps" aria-hidden="true"><i></i><i></i><i></i></span><span class="mp-worth"></span></div>
  <div class="mp-mrow"><p class="mp-meta"></p><span class="mp-stamp" aria-hidden="true"></span></div>
  <ol class="mp-docs"></ol>
  <div class="mp-rv" aria-live="polite"><p class="mp-rline"></p><p class="mp-rcrack"></p><p class="mp-rtext"></p><p class="mp-rsrc"><a href="#" target="_blank" rel="noopener"></a></p></div>
 </div>
 <div class="mp-side"><h2 class="mp-q"></h2><div class="mp-opts" role="group"></div><button type="button" class="mp-next"></button></div>
 </div><p class="mp-sr" aria-live="polite"></p></div>`;
  const root=el.firstElementChild,inner=root.firstElementChild,q=s=>root.querySelector(s),docs=q('.mp-docs'),rv=q('.mp-rv'),opts=q('.mp-opts');
  const qid='mpq'+Math.random().toString(36).slice(2,8);q('.mp-q').id=qid;opts.setAttribute('aria-labelledby',qid);
  const st={s:'v',x:null,hold:0};const held=()=>performance.now()<st.hold;
  const tx=k=>c[k+'_'+L];
  function fit(e){let k=1.3;e.style.setProperty('--k',k);while(e.scrollHeight>e.clientHeight&&k>.4){k-=.05;e.style.setProperty('--k',k.toFixed(2))}return k}
  function fitAll(){if(!root.isConnected)return;root.classList.remove('nodocs');opts.style.removeProperty('--ko');if(st.s==='r'){fit(rv);return}
   if(st.s==='c'){root.classList.add('nodocs');let ko=1;const over=()=>inner.scrollHeight>inner.clientHeight+1||[...opts.children].some(b=>b.scrollHeight>b.clientHeight+1);
    while(over()&&ko>.6){ko-=.05;opts.style.setProperty('--ko',ko.toFixed(2))}root.classList.remove('nodocs')}
   const k=fit(docs);if(st.s==='c'&&k<.7)root.classList.add('nodocs')}
  const ro=new ResizeObserver(()=>fitAll());ro.observe(root);
  function paint(anim){if(anim)st.hold=performance.now()+HOLD;const x=st.x,s=st.s;root.lang=L==='zh'?'zh-Hant':'en';
   root.className='m-paper s-'+s+(anim?' anim':'');
   q('.mp-title').textContent=T('head');
   root.querySelectorAll('.mp-steps i').forEach((e,j)=>e.classList.toggle('on',j<=['v','c','r'].indexOf(s)));
   const pts=x?(x.vok?VP:0)+(x.cok?CP:0):0;q('.mp-worth').textContent=s==='v'?`+${VP}`:s==='c'?`+${CP}`:`+${pts}`;
   q('.mp-meta').textContent=`${c.year} · ${tx('place')}`;
   // Same exhibit count for every file: short trails get redacted slips so card count never hints at the verdict.
   const tr=tx('trail'),r0=prng('pad|'+c.id),sty=j=>anim&&s==='v'?` style="animation-delay:${j*70}ms"`:'';
   docs.innerHTML=tr.map((t,j)=>`<li class="mp-doc"${sty(j)}><b>${esc(T('ex')(j))}</b><span>${esc(t)}</span></li>`).join('')+
    Array.from({length:Math.max(0,SLOTS-tr.length)},(_,k)=>{const j=tr.length+k;return `<li class="mp-doc red" aria-hidden="true"${sty(j)}><b>${esc(T('ex')(j))}</b><span><i style="width:${45+(r0()*50|0)}%"></i></span></li>`}).join('');
   const sp=q('.mp-stamp');if(x){sp.textContent=(x.vok?'✓ ':'✗ ')+T('st')[c.verdict];sp.className='mp-stamp '+(x.vok?'ok':'no')}
   if(s==='v'){q('.mp-q').textContent=T('qV');opts.className='mp-opts';
    opts.innerHTML=VS.map((v,j)=>`<button type="button" data-n="${j}" data-v="${v}">${esc(T('v')[v][0])}<small>${esc(T('v')[v][1])}</small></button>`).join('');
    opts.querySelectorAll('button').forEach(b=>b.onclick=()=>pickV(b.dataset.v))}
   else if(s==='c'){q('.mp-q').textContent=T('qC');opts.className='mp-opts c4';
    opts.innerHTML=co.map((ci,j)=>`<button type="button" data-n="${j}" data-c="${ci}"><i aria-hidden="true">${j+1}</i><span>${esc(tx('cracks')[ci])}</span></button>`).join('');
    opts.querySelectorAll('button').forEach(b=>b.onclick=()=>pickC(+b.dataset.c))}
   else{opts.innerHTML='';reveal()}
   requestAnimationFrame(fitAll)}
  function reveal(){const x=st.x,v=T('st')[c.verdict],rl=q('.mp-rline');
   rl.textContent=T('line')(x.vok,v,VP);rl.style.color=x.vok?'var(--mp-grn)':'var(--mp-red)';
   q('.mp-rcrack').innerHTML=`<b>${esc(T('crack'))} · ${x.cok?esc(T('rcOk'))+' +'+CP:esc(T('rcNo'))+(L==='zh'?'：':': ')+esc(tx('cracks')[x.c])}</b>${esc(tx('cracks')[c.crack_answer])}`;
   q('.mp-rtext').textContent=tx('reveal');
   const so=c.source||{},a=q('.mp-rsrc a');a.textContent=T('src')(so.id||'');a.href=so.url||'#';a.hidden=!so.url;
   q('.mp-next').textContent=T('next')}
  const vib=p=>{if(navigator.vibrate)try{navigator.vibrate(p)}catch(e){}};
  const focus0=()=>setTimeout(()=>{const b=opts.querySelector('button');b&&root.isConnected&&b.focus({preventScroll:true})},60);
  function pickV(v){if(st.s!=='v'||held())return;const ok=v===c.verdict;st.x={v,vok:ok,c:null,cok:false};st.s='c';paint(true);
   vib(ok?[15,30,15]:[40]);sfx(ok?'ok':'no');q('.mp-sr').textContent=(ok?'✓ ':'✗ ')+T('st')[c.verdict];focus0()}
  function pickC(ci){if(st.s!=='c'||held())return;const x=st.x;x.c=ci;x.cok=ci===c.crack_answer;st.s='r';paint(true);
   vib(x.cok?[15]:[30]);sfx(x.cok?'ok':'no');q('.mp-sr').textContent=q('.mp-rline').textContent;
   setTimeout(()=>root.isConnected&&q('.mp-next').focus({preventScroll:true}),60)}
  return new Promise((resolve,reject)=>{
   const done=()=>{ro.disconnect();live=null};
   q('.mp-next').onclick=()=>{if(st.s!=='r'||held())return;done();const x=st.x,pts=(x.vok?VP:0)+(x.cok?CP:0);
    resolve({points:pts,max:3,correct:x.vok,grid:(x.vok?'🟩':'🟥')+(x.cok?'🔍':'⬛'),summary_en:S.en.sum(S.en.st[c.verdict],x.vok,x.cok),summary_zh:S.zh.sum(S.zh.st[c.verdict],x.vok,x.cok)})};
   root.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;const n=+e.key;if(n>=1&&n<=4){const b=opts.querySelector(`[data-n="${n-1}"]`);if(b){b.click();e.preventDefault()}}});
   live=l=>{if(!root.isConnected)return;L=l;paint(false)};
   if(sig){const ab=()=>{done();reject(sig.reason||new DOMException('Aborted','AbortError'))};if(sig.aborted){ab();return}sig.addEventListener('abort',ab,{once:true})}
   paint(true)})}
};
