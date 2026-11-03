// TELL. / 破綻 — hub app. Modules live in ../modules/<id>/mod.js (see CONTRACT.md).
import * as E from './engine.js';
import SHIP from './ship.js?v=2611040301';
const V=new URL(import.meta.url).searchParams.get('v')||'0';
const QS=new URLSearchParams(location.search);
const LOCAL=/^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(location.hostname);
const BASE=(QS.get('base')&&LOCAL)?QS.get('base'):(location.hostname==='liyun-li.github.io'?location.origin:'https://liyun-li.github.io');
const ALL=SHIP;
// dev only: ?dev=fake (localhost) swaps in the fake module from /dev; never on production
const DEV=LOCAL&&QS.get('dev')?QS.get('dev').split(','):[];
const IDS=(LOCAL&&QS.get('only'))?QS.get('only').split(','):(DEV.length?[...DEV,...ALL]:ALL);
const META={sos:{icon:'🚩',repo:'scam-or-startup',en:'Scam or Startup?',zh:'詐騙還是新創？'},
 cozy:{icon:'🔪',repo:'crime-scene-or-cozy-studio',en:'Crime Scene or Cozy Studio?',zh:'犯罪現場還是溫馨套房？'},
 plans:{icon:'📐',repo:'who-lives-like-this',en:'Who Lives Like This?',zh:'誰會住成這樣？'},
 look:{icon:'🔎',repo:'look-again',en:'Look Again',zh:'再看一眼'},
 crime:{icon:'⚖️',repo:'do-the-crime',en:'Do The Crime',zh:'關多久？'},
 paper:{icon:'🧾',repo:'paper-trail',en:'Paper Trail',zh:'保單疑雲'},
 fake:{icon:'🧪',repo:'',en:'Fake (dev)',zh:'假模組（開發）'}};
const URL0='https://liyun-li.github.io/tell/';
const S={en:{
 tag:"Everything has a tell. Spot it.",
 daily:(n,k)=>`👀 DAILY MIX #${n}<small>${k} games · same for everyone</small>`,
 dailyRes:(n,i,k)=>`▶ KEEP GOING · MIX #${n}<small>round ${i+1} of ${k}</small>`,
 dailyDone:(n,p,m)=>`✓ MIX #${n} · ${p}/${m}<small>tap for results · new mix at midnight</small>`,
 shuffle:b=>`🔀 SHUFFLE<small>all six, random · 3 lives${b?` · best ${b}`:''}</small>`,
 tilesL:"Play one game",solo:(n,b)=>`${n}${b?` · best ${b}`:''}`,
 about:"About",foot:"Real cases, public data",
 round:(i,k)=>`ROUND ${i}/${k}`,roundE:i=>`ROUND ${i}`,
 tierL:t=>['','Easy','Medium','Hard'][t],
 loading:"Loading…",skipped:"Couldn't load that one. Skipping.",noneOk:"Games didn't load. Check your connection and try again.",
 next:"NEXT →",results:"RESULTS →",
 pts:"pts",share:"SHARE",again:"PLAY AGAIN",shuffle2:"🔀 SHUFFLE",home:"← Home",copied:"Copied!",how:"How to play",got:"GOT IT",lifeLost:"−1 life",
 rank:["Easy mark","Side-eye","Lie detector","Bloodhound","Nothing gets past you"],
 streak:n=>`🔥 ${n}-day streak · new mix at midnight`,newBest:"New best!",
 st:{correct:(c,n)=>[`🎯`,`${c}/${n} calls right`],fast:(g,s)=>[`⚡`,`Fastest: ${s}s · ${g}`],slow:(g,s)=>[`🐢`,`Longest stare: ${s}s · ${g}`],
  best:g=>[`👑`,`Your strongest game: ${g}`],worst:g=>[`👻`,`Your nemesis: ${g}`],rounds:n=>[`💀`,`Out after ${n} rounds`],best2:b=>[`🏆`,`Best: ${b}`]},
 sh:(n,p,m)=>`TELL. #${n} · ${p}/${m}`,shE:(p,c)=>`TELL. Shuffle · ${p} pts in ${c} rounds`,shS:(g,p,c)=>`TELL. ${g} · ${p} pts in ${c} rounds`,shStreak:n=>`🔥 ${n}-day streak`
},zh:{
 tag:"每一題都有破綻，你看得出來嗎？",
 daily:(n,k)=>`👀 每日挑戰 #${n}<small>${k} 款各一題・大家同一套</small>`,
 dailyRes:(n,i,k)=>`▶ 繼續挑戰 #${n}<small>第 ${i+1}/${k} 回合</small>`,
 dailyDone:(n,p,m)=>`✓ 挑戰 #${n}・${p}/${m} 分<small>點我看結果・午夜換新題</small>`,
 shuffle:b=>`🔀 隨機混搭<small>六款亂入・3 條命${b?`・最佳 ${b} 分`:''}</small>`,
 tilesL:"單玩一款",solo:(n,b)=>`${n}${b?`・最佳 ${b}`:''}`,
 about:"關於",foot:"真實案件・公開資料",
 round:(i,k)=>`第 ${i}/${k} 回合`,roundE:i=>`第 ${i} 回合`,
 tierL:t=>['','簡單','中等','困難'][t],
 loading:"載入中…",skipped:"這款載不出來，先跳過。",noneOk:"遊戲載不出來，檢查網路再試一次。",
 next:"下一題 →",results:"看結果 →",
 pts:"分",share:"分享",again:"再玩一次",shuffle2:"🔀 隨機混搭",home:"← 回首頁",copied:"複製好了！",how:"怎麼玩",got:"懂了",lifeLost:"−1 命",
 rank:["好騙仔","半信半疑","有點東西","抓包高手","什麼都瞞不過你"],
 streak:n=>`🔥 連續 ${n} 天・午夜換新題`,newBest:"新紀錄！",
 st:{correct:(c,n)=>[`🎯`,`答對 ${c}/${n} 題`],fast:(g,s)=>[`⚡`,`最快出手：${s} 秒・${g}`],slow:(g,s)=>[`🐢`,`盯最久：${s} 秒・${g}`],
  best:g=>[`👑`,`最強：${g}`],worst:g=>[`👻`,`你的剋星：${g}`],rounds:n=>[`💀`,`撐了 ${n} 回合`],best2:b=>[`🏆`,`最佳：${b} 分`]},
 sh:(n,p,m)=>`破綻 #${n}・${p}/${m}`,shE:(p,c)=>`破綻 隨機混搭・${c} 回合 ${p} 分`,shS:(g,p,c)=>`破綻 ${g}・${c} 回合 ${p} 分`,shStreak:n=>`🔥 連續 ${n} 天`
}};
const $=id=>document.getElementById(id);
let L=E.detectLang(QS);const T=k=>S[L][k];
const LOG=[];function log(...a){LOG.push(a.join(' '));console.warn('[sus]',...a)}
window.__sus={LOG,get run(){return run},get mods(){return MODS}};

// ---- tap guard: swallow taps for 350 ms after every accepted tap and every new step ----
let holdUntil=0;const hold=ms=>{holdUntil=Math.max(holdUntil,performance.now()+ms)};
for(const ev of ['pointerdown','mousedown','touchstart','touchend','click'])document.addEventListener(ev,e=>{
 if(e.target&&e.target.closest&&e.target.closest('#langBtn'))return;
 if(performance.now()<holdUntil){e.stopImmediatePropagation();if(e.cancelable)e.preventDefault();return}
 if(ev==='click')hold(350)},{capture:true,passive:false});

// ---- modules ----
const MODS={};   // id -> {state:'ok'|'fail', mod, pool, why}
const LOADP={};
const timeout=(p,ms,what)=>Promise.race([p,new Promise((_,j)=>setTimeout(()=>j(new Error(what+' timeout')),ms))]);
const meta=id=>META[id]||{icon:'❓',en:id,zh:id};
function gname(id,lang=L){const m=MODS[id]&&MODS[id].mod;const n=m&&m.name;return (n&&(n[lang]||n.en))||meta(id)[lang]}
function gicon(id){const m=MODS[id]&&MODS[id].mod;return (m&&typeof m.icon==='string'&&m.icon)||meta(id).icon}
function getMod(id){if(LOADP[id])return LOADP[id];
 const url=(LOCAL&&(id==='fake'||id.startsWith('dev')))?`../dev/${id}/mod.js`:`../modules/${id}/mod.js?v=${V}`;
 LOADP[id]=(async()=>{try{const ns=await timeout(import(url),15000,'import');const mod=ns&&ns.default;
   if(!mod||typeof mod.load!=='function'||typeof mod.pick!=='function'||typeof mod.render!=='function')throw new Error('bad export (need load/pick/render)');
   MODS[id]={state:'loading',mod};
   const pool=await timeout(Promise.resolve(mod.load({base:BASE,lang:L})),25000,'load');
   if(pool==null||(Array.isArray(pool)&&!pool.length))throw new Error('empty pool');
   MODS[id]={state:'ok',mod,pool};return MODS[id]}
  catch(e){MODS[id]={state:'fail',why:String(e&&e.message||e),mod:MODS[id]&&MODS[id].mod};log('module',id,'skipped:',MODS[id].why);
   setTimeout(()=>{delete LOADP[id]},30000);return MODS[id]}})();
 return LOADP[id]}
// probe which modules exist (import only, cheap) so home tiles reflect reality
async function probe(){await Promise.all(IDS.map(id=>getMod(id)));renderHome()}

// ---- state ----
let run=null,curR=null;
const tierAt=i=>i<3?1:i<7?2:3;
const DTIERS=[1,1,2,2,3,3];
function dailyOrder(day){return E.shuf(IDS.slice().sort(),E.rng('sus|order|'+day))}
function freshDaily(day){return {mode:'daily',day,n:E.dayNo(day),order:dailyOrder(day),i:0,res:[]}}
function getDaily(){const d=E.today();let s=E.LS.get('daily');if(!s||s.day!==d||!Array.isArray(s.order))s=freshDaily(d);return s}
const total=res=>res.reduce((a,r)=>a+(r&&!r.skip?r.n:0),0);
const maxOf=res=>res.reduce((a,r)=>a+(r&&!r.skip?3:0),0);
const lives=n=>'❤️'.repeat(Math.max(0,n))+'🖤'.repeat(Math.max(0,3-n));

// ---- UI ----
function show(id){for(const s of ['home','play','end'])$(s).classList.toggle('on',s===id);document.body.dataset.scr=id}
function setLangUI(){document.documentElement.lang=L==='zh'?'zh-Hant':'en';$('lEn').classList.toggle('on',L==='en');$('lZh').classList.toggle('on',L==='zh');
 $('tag').textContent=T('tag');$('footT').textContent=T('foot');$('aboutL').textContent=T('about');$('tilesL').textContent=T('tilesL');
 document.title=L==='zh'?'破綻 TELL.':'TELL. 破綻'}
function renderHome(){const d=getDaily(),k=d.order.length,done=d.i>=k;
 $('dailyBtn').innerHTML=done?T('dailyDone')(d.n,E.fmt(total(d.res)),maxOf(d.res)):d.i>0?T('dailyRes')(d.n,d.i,k):T('daily')(d.n,k);
 $('shuffleBtn').innerHTML=T('shuffle')(E.LS.get('best_shuffle')||0);
 const box=$('tiles');box.replaceChildren(...IDS.map(id=>{const b=document.createElement('button');b.className='tile';b.type='button';b.dataset.id=id;
  const st=MODS[id]&&MODS[id].state,best=E.LS.get('best_'+id)||0;if(st==='fail')b.setAttribute('aria-disabled','true');
  b.innerHTML=`<span class="ic" aria-hidden="true">${gicon(id)}</span><span class="nm">${esc(T('solo')(gname(id),best))}</span>`;
  b.onclick=()=>{if(MODS[id]&&MODS[id].state==='fail'){note(T('noneOk'));return}startSolo(id)};return b}));
 const fails=IDS.filter(id=>MODS[id]&&MODS[id].state==='fail');$('note').textContent='';if(fails.length&&fails.length===IDS.length)$('note').textContent=T('noneOk');
 if($('home').classList.contains('on')){$('hud').textContent='';$('prog').style.width='0'}}
function note(s){$('note').textContent=s}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function hud(fx){if(!run){$('hud').textContent='';return}const p=E.fmt(total(run.res));const h=$('hud');
 if(run.mode==='daily'){h.textContent=`#${run.n} · ${p} ${T('pts')}`;$('prog').style.width=(100*run.i/run.order.length)+'%'}
 else{h.textContent=`${lives(run.lives)} · ${p} ${T('pts')}`;$('prog').style.width='0'}
 $('prog').parentNode.style.visibility=run.mode==='daily'?'':'hidden';
 if(fx){h.classList.remove('pop','hurt');void h.offsetWidth;h.classList.add(fx)}}
// ---- how-to-play intro (CONTRACT.md: mod.intro(lang) -> {title, steps[<=3], example?}) ----
let introOpen=null;
function introData(id){const m=MODS[id]&&MODS[id].mod;if(!m||typeof m.intro!=='function')return null;try{const d=m.intro(L);return d&&d.title?d:null}catch(e){log('intro',id,'failed:',e&&e.message||e);return null}}
function drawIntro(){if(!introOpen)return;const d=introData(introOpen.id);if(!d)return;
 const ic=gicon(introOpen.id);$('introT').textContent=String(d.title).startsWith(ic)?d.title:`${ic} ${d.title}`;
 $('introS').innerHTML=(Array.isArray(d.steps)?d.steps:[]).slice(0,3).map(x=>`<li>${esc(x)}</li>`).join('');
 $('introX').innerHTML=d.example||'';$('introX').hidden=!d.example;$('introX').className='iex m-'+introOpen.id;$('introOk').textContent=T('got')}
function showIntro(id){if(!introData(id))return Promise.resolve();closeIntro();
 return new Promise(ok=>{introOpen={id,ok};drawIntro();$('intro').hidden=false;hold(350);setTimeout(()=>{try{$('introOk').focus({preventScroll:true})}catch(e){}},30)})}
function closeIntro(){if(!introOpen)return;const o=introOpen;introOpen=null;$('intro').hidden=true;E.LS.set('intro_'+o.id,1);hold(350);o.ok()}
function rhead(id){const k=run.mode==='daily'?T('round')(run.i+1,run.order.length):T('roundE')(run.i+1);
 $('rgame').textContent=`${k} · ${gicon(id)} ${gname(id)}`;const hb=$('helpBtn');hb.dataset.id=id;hb.hidden=!introData(id);hb.setAttribute('aria-label',T('how'));hb.title=T('how')}
function waitUI(msg){const w=document.createElement('div');w.className='hub-wait';w.innerHTML=`<div class="hub-spin" aria-hidden="true"></div><span>${esc(msg)}</span>`;$('stage').replaceChildren(w)}

// ---- runs ----
function startDaily(){run=getDaily();E.LS.set('daily',run);if(run.i>=run.order.length)return endRun();show('play');playLoop()}
function startShuffle(){run={mode:'shuffle',seed:(Math.random()*1e9|0),i:0,res:[],lives:3,last:null};show('play');playLoop()}
function startSolo(id){run={mode:'solo',gid:id,seed:(Math.random()*1e9|0),i:0,res:[],lives:3};show('play');playLoop()}
function okIds(){return IDS.filter(id=>(id!=='fake'||DEV.includes('fake'))&&!(MODS[id]&&MODS[id].state==='fail'))}
function nextSpec(){
 if(run.mode==='daily'){if(run.i>=run.order.length)return null;const id=run.order[run.i];return {id,tier:DTIERS[Math.min(run.i,5)],seed:`sus|${run.day}|${id}|${run.i}`}}
 if(run.lives<=0)return null;
 if(run.mode==='solo')return {id:run.gid,tier:tierAt(run.i),seed:`sus|solo|${run.seed}|${run.i}`};
 // rotate through all games before repeating (no back-to-back, avoid the last few)
 const all=okIds();if(!all.length)return null;const rec=run.recent||[];let ok=all.filter(x=>!rec.includes(x));if(!ok.length)ok=all.filter(x=>x!==run.last);if(!ok.length)ok=all;const r=E.rng(`sus|sh|${run.seed}|${run.i}|pick`);
 return {id:ok[r()*ok.length|0],tier:tierAt(run.i),seed:`sus|sh|${run.seed}|${run.i}`}}
let loopTok=0,curId=null;
async function playLoop(){const tok=++loopTok;let skips=0;
 while(run&&tok===loopTok){const sp=nextSpec();if(!sp)break;curId=sp.id;hud();rhead(sp.id);$('hnext').hidden=true;
  waitUI(T('loading'));const m=await getMod(sp.id);if(tok!==loopTok)return;rhead(sp.id);
  if(m.state==='ok'&&!E.LS.get('intro_'+sp.id)&&introData(sp.id)){await showIntro(sp.id);if(tok!==loopTok)return}
  let res=null,ms=0;
  if(m.state==='ok'){try{res=await playOne(sp,m,tok)}catch(e){log('round',sp.id,'failed:',e&&e.message||e);res=null}}
  if(tok!==loopTok)return;
  if(res==='abort')return;
  if(!res){skips++;$('live').textContent=T('skipped');
   if(run.mode==='daily'){run.res[run.i]={id:sp.id,skip:true};run.i++;E.LS.set('daily',run);continue}
   if(run.mode==='solo'||skips>6){run.lives=0;break}
   run.last=sp.id;continue}
  skips=0;run.res[run.i]=res;run.i++;let fx='pop';if(run.mode!=='daily'){run.last=sp.id;run.recent=[...(run.recent||[]),sp.id].slice(-Math.max(1,okIds().length-2));if(!res.correct){run.lives--;fx='hurt';$('live').textContent=T('lifeLost')}}
  if(run.mode==='daily')E.LS.set('daily',run);bumpStats(res);hud(fx)}
 if(tok===loopTok&&run)endRun()}
function rkey(x){const v=x&&(x.id??x.key??x.slug??x.name);return String(v!=null&&typeof v!=='object'?v:E.h32(JSON.stringify(x).slice(0,400)))}
async function playOne(sp,m,tok){
 const {mod,pool}=m;let r=E.rng(sp.seed);let round=mod.pick(pool,r,sp.tier);
 if(round!=null){const seen=E.LS.get('seen')||{},arr=seen[sp.id]||[];let k=rkey(round);
  if(run.mode!=='daily'){for(let a=1;a<12&&arr.includes(k);a++){const r2=E.rng(sp.seed+'|re'+a),x=mod.pick(pool,r2,sp.tier);if(x==null)break;r=r2;round=x;k=rkey(x)}}
  if(!arr.includes(k))arr.push(k);seen[sp.id]=arr.slice(-400);try{E.LS.set('seen',seen)}catch(e){}}
if(round==null)throw new Error('pick returned nothing');
 const el=document.createElement('div');el.className='mroot';el.dataset.game=sp.id;el.lang=L==='zh'?'zh-Hant':'en';$('stage').replaceChildren(el);hold(350);
 const ac=new AbortController();const ctx2={lang:L,t:E.mkT(L),signal:ac.signal,sfx:null,tier:sp.tier,rng:r};curR={id:sp.id,mod,ac,ctx2,el};
 const aborted=new Promise(ok=>ac.signal.addEventListener('abort',()=>ok('abort')));
 const t0=performance.now();let res=await Promise.race([Promise.resolve().then(()=>mod.render(round,el,ctx2)).catch(e=>{if(ac.signal.aborted||(e&&e.name==='AbortError'))return 'abort';throw e}),aborted]);
 if(res==='abort'||tok!==loopTok)return 'abort';
 const ms=Math.round(performance.now()-t0);
 if(!res||typeof res!=='object')throw new Error('render resolved without result');
 const n=E.norm(res);const out={id:sp.id,n,correct:!!res.correct,grid:String(res.grid||''),ms,sum_en:res.summary_en||'',sum_zh:res.summary_zh||'',tier:sp.tier};
 if(res.useHubNext){const last=run.mode==='daily'?run.i+1>=run.order.length:(run.lives-(out.correct?0:1))<=0;const b=$('hnext');b.dataset.last=last?'1':'';b.textContent=last?T('results'):T('next');b.hidden=false;hold(350);
  const go=await Promise.race([new Promise(ok=>{b.onclick=()=>ok('go')}),aborted]);b.onclick=null;b.hidden=true;if(go==='abort'||tok!==loopTok)return 'abort'}
 curR=null;return out}
function stopRound(){loopTok++;closeIntro();if(curR){try{curR.ac.abort()}catch(e){}curR=null}$('hnext').hidden=true;$('stage').replaceChildren()}
function bumpStats(r){const g=E.LS.get('gstats')||{};const s=g[r.id]||{n:0,p:0};s.n++;s.p+=r.n;g[r.id]=s;E.LS.set('gstats',g)}

// ---- end ----
let lastEnd=null;
function endRun(){const R=run;stopRound();show('end');hold(500);const res=R.res.filter(x=>x&&!x.skip),p=E.fmt(total(R.res)),m=maxOf(R.res);
 let streakN=0,isBest=false;
 if(R.mode==='daily'){const ds=E.LS.get('dstats')||{};if(ds.last!==R.day){ds.streak=ds.last===E.prevDay(R.day)?(ds.streak||0)+1:1;ds.last=R.day;ds.played=(ds.played||0)+1;E.LS.set('dstats',ds)}streakN=ds.streak||1}
 else{const k=R.mode==='solo'?'best_'+R.gid:'best_shuffle';const b=E.LS.get(k)||0;if(total(R.res)>b){E.LS.set(k,Math.round(total(R.res)*10)/10);isBest=total(R.res)>0}}
 lastEnd={R,p,m,streakN,isBest};run=null;renderEnd();$('prog').style.width='100%'}
function renderEnd(){if(!lastEnd)return;const {R,p,m,streakN,isBest}=lastEnd;const res=R.res.filter(x=>x&&!x.skip);
 const pct=m?total(R.res)/m:Math.min(1,total(R.res)/30);const rk=T('rank')[Math.min(4,Math.floor(pct*5))];
 $('score').innerHTML=R.mode==='daily'?`${p}<small>/${m}</small>`:`${p}<small> ${T('pts')}</small>`;
 $('rank').textContent=rk;
 $('grid').textContent=gridText(R);
 // recap: one row per round (what you called, what it was, points) so nobody is left guessing what just happened
 const st=T('st'),top=[];if(R.mode!=='daily')top.push(st.rounds(res.length));if(isBest)top.push(['🏆',T('newBest')]);
 const rows=(R.mode==='daily'?res:res.slice(-Math.max(1,5-top.length))).map(x=>{const ic=gicon(x.id);let t=String((L==='zh'?x.sum_zh:x.sum_en)||gname(x.id)).trim();
   if(t.startsWith(ic))t=t.slice(ic.length).trim();t=t.replace(/^[✓✗]\s*/,'');if(!/^\p{Extended_Pictographic}/u.test(t))t=`${ic} ${t}`;return [E.sq(x.n),t,'+'+E.fmt(x.n)]});
 $('stats').innerHTML=top.map(([a,b])=>`<li><b aria-hidden="true">${a}</b><span>${esc(b)}</span></li>`).join('')+rows.map(([a,b,c])=>`<li class="rc"><b aria-hidden="true">${a}</b><span>${esc(b)}</span><i>${c}</i></li>`).join('');
 $('streak').textContent=R.mode==='daily'?T('streak')(streakN):'';
 $('shareBtn').textContent=T('share');$('homeBtn').textContent=T('home');$('againBtn').textContent=R.mode==='daily'?T('shuffle2'):T('again');$('toast').textContent='';
 $('hud').textContent=R.mode==='daily'?`#${R.n}`:''}
function gridText(R){const rs=R.res.filter(Boolean);return rs.map(x=>gicon(x.id)).join('')+'\n'+rs.map(x=>x.skip?'⬜':E.sq(x.n)).join('')}
async function share(){if(!lastEnd)return;const {R,p,m,streakN}=lastEnd;const res=R.res.filter(x=>x&&!x.skip);
 const head=R.mode==='daily'?T('sh')(R.n,p,m):R.mode==='solo'?T('shS')(gname(R.gid),p,res.length):T('shE')(p,res.length);
 const txt=[head,gridText(R),R.mode==='daily'&&streakN>1?T('shStreak')(streakN):'',URL0+(R.mode==='daily'?'?daily':'')].filter(Boolean).join('\n');
 try{if(navigator.share&&/Mobi|Android/i.test(navigator.userAgent)){await navigator.share({text:txt});return}}catch(e){if(e&&e.name==='AbortError')return}
 try{await navigator.clipboard.writeText(txt)}catch(e){const t=document.createElement('textarea');t.value=txt;document.body.append(t);t.select();try{document.execCommand('copy')}catch(_){}t.remove()}
 $('toast').textContent=T('copied')}

// ---- wiring ----
$('helpBtn').onclick=()=>{const id=$('helpBtn').dataset.id;if(id)showIntro(id)};$('introOk').onclick=()=>closeIntro();
document.addEventListener('keydown',e=>{if(introOpen&&e.key==='Escape')closeIntro()});
$('homeBtn').onclick=()=>$('logo').onclick();
$('logo').onclick=()=>{stopRound();run=null;show('home');renderHome();if(QS.has('daily')||QS.has('play'))history.replaceState(null,'',location.pathname+(QS.get('lang')?'?lang='+QS.get('lang'):''))};
$('langBtn').onclick=()=>{L=L==='en'?'zh':'en';E.LS.set('lang',L);setLangUI();
 if(curR){curR.ctx2.lang=L;curR.ctx2.t=E.mkT(L);curR.el.lang=L==='zh'?'zh-Hant':'en';try{curR.mod.setLang&&curR.mod.setLang(L)}catch(e){log('setLang',curR.id,'failed:',e&&e.message||e)}}
 if($('play').classList.contains('on')&&run){const sp=run.mode==='daily'?run.order[run.i]:null;const id=curR?curR.id:(sp||curId);if(id)rhead(id);const wt=document.querySelector('#stage>.hub-wait>span');if(wt)wt.textContent=T('loading');hud();drawIntro();$('hnext').textContent=$('hnext').dataset.last?T('results'):T('next')}
 if($('home').classList.contains('on'))renderHome();if($('end').classList.contains('on'))renderEnd()};
$('dailyBtn').onclick=()=>startDaily();$('shuffleBtn').onclick=()=>startShuffle();
$('shareBtn').onclick=share;
$('againBtn').onclick=()=>{const R=lastEnd&&lastEnd.R;if(!R||R.mode==='daily')startShuffle();else if(R.mode==='solo')startSolo(R.gid);else startShuffle()};
window.addEventListener('error',e=>log('error',e.message));window.addEventListener('unhandledrejection',e=>log('rejection',e.reason&&e.reason.message||e.reason));
setLangUI();renderHome();probe();
if(QS.has('daily'))startDaily();else if(QS.get('play')&&IDS.includes(QS.get('play')))startSolo(QS.get('play'));
