
const r=document.documentElement;
const V={paper:'--paper',ink:'--ink',muted:'--muted',rule:'--rule',accent:'--accent'};
const dark=c=>{const n=parseInt(c.slice(1),16);return ((n>>16)*.3+((n>>8)&255)*.59+(n&255)*.11)<110};
function theme(i){const t=T[i];r.dataset.ui=t.ui||'';r.toggleAttribute('data-dark',!!t.paper&&dark(t.paper));Object.values(V).forEach(k=>r.style.removeProperty(k));r.style.colorScheme='';
 if(t.paper){for(const k in V)r.style.setProperty(V[k],t[k]);r.style.colorScheme=dark(t.paper)?'dark':'light'}
 try{localStorage.setItem('portfolio-theme',t.id)}catch(e){}}
function lang(l){r.lang=l;document.querySelectorAll('[data-i18n]').forEach(e=>{if(!e.dataset.en)e.dataset.en=e.innerHTML;e.innerHTML=D[l][e.dataset.i18n]||e.dataset.en});
 document.querySelectorAll('[data-i18n-ph]').forEach(e=>{if(!e.dataset.en)e.dataset.en=e.placeholder;e.placeholder=D[l][e.dataset.i18nPh]||e.dataset.en});try{localStorage.setItem('portfolio-lang',l)}catch(e){}}
const ts=document.getElementById('theme'),ls=document.getElementById('lang');
ts.onchange=()=>theme(+ts.value);ls.onchange=()=>lang(ls.value);
try{const a=localStorage.getItem('portfolio-theme'),b=localStorage.getItem('portfolio-lang');
 if(a){const i=T.findIndex(t=>t.id===a);if(i>0){ts.value=i;theme(i)}} }catch(e){}
if(!matchMedia('(prefers-reduced-motion:reduce)').matches)document.querySelectorAll('.pcard').forEach(c=>{const p=c.querySelector('.pbody p');let paused=false,wait=2000,pos=0,last=0,end=false;
const hold=()=>{paused=true},go=()=>{paused=false;pos=p.scrollTop;wait=3000};
c.addEventListener('mouseenter',hold);c.addEventListener('mouseleave',go);c.addEventListener('focusin',hold);c.addEventListener('focusout',go);
c.addEventListener('touchstart',hold,{passive:true});c.addEventListener('touchend',go);
const tick=t=>{const dt=Math.min(t-last,100);last=t;const max=p.scrollHeight-p.clientHeight;
if(max>2&&!paused){if(wait>0)wait-=dt;else if(end){end=false;pos=0;p.scrollTop=0;wait=2000}else{pos+=dt*.012;p.scrollTop=pos;if(pos>=max){end=true;wait=2000}}}
requestAnimationFrame(tick)};requestAnimationFrame(tick)});
(function(){const names={en:'English',fr:'Français',de:'Deutsch',es:'Español',ja:'日本語',zh:'中文'};
const $=id=>document.getElementById(id),th=$('theme'),lg=$('lang'),dds=[];
// swatch colours = what each theme looks like: page colour, text colour, then its signature colour(s)
const SW={paper:['#F1F2EF','#18212F','#2B3FBF'],light:['#FFFFFF','#0A0A0A','#D12E12'],github:['#0D1117','#E6EDF3','#58A6FF','#238636'],claude:['#F5F4ED','#1F1E1D','#D97757'],momiji:['#F5EFE6','#2B211E','#B3261E'],sakura:['#FFF7F8','#3B2A31','#B93A68'],yuzu:['#FFFCF0','#1C1A10','#FFD43B'],matcha:['#F2F5EE','#1E2A20','#3B6B2B'],sap:['#F5F6F7','#1D2D3E','#0070F2']};
const swp=t=>{if(t.id==='paper'&&matchMedia('(prefers-color-scheme:dark)').matches)return['#12161D','#E8EAE6','#8FA0FF'];return SW[t.id]||[t.paper||'#F1F2EF',t.ink||'#18212F',t.accent||'#2B3FBF']};
const sw=t=>{const p=swp(t);return `<span class="sw"><b style="background:${p[0]};color:${p[1]}">Aa</b><i>${p.slice(2).map(c=>`<u style="background:${c}"></u>`).join('')}</i></span>`};
function mk(host,get,items,pick,label){const render=()=>{const cur=get();
host.innerHTML=`<button type="button" aria-haspopup="menu" aria-expanded="false" aria-label="${label}"><span class="cur">${items.map(x=>`<span class="slot"${x.v===cur?'':' aria-hidden="true" style="visibility:hidden"'}>${x.btn}</span>`).join('')}</span></button><ul class="menu">${items.map(x=>`<li><button type="button" role="menuitemradio" aria-checked="${x.v===cur}" data-v="${x.v}">${x.html}</button></li>`).join('')}</ul>`;
const b=host.firstChild;b.onclick=()=>{const o=!host.classList.contains('open');dds.forEach(d=>d.classList.remove('open'));host.classList.toggle('open',o);b.setAttribute('aria-expanded',o)};
host.querySelectorAll('.menu button').forEach(m=>m.onclick=ev=>{ev.stopPropagation();const st=host.querySelector('.menu').scrollTop;pick(m.dataset.v);render();host.querySelector('.menu').scrollTop=st;host.firstChild.setAttribute('aria-expanded','true')})};
dds.push(host);render()}
document.addEventListener('click',e=>dds.forEach(d=>{if(!d.contains(e.target))d.classList.remove('open')}));
document.addEventListener('keydown',e=>{if(e.key==='Escape')dds.forEach(d=>{if(d.classList.contains('open')){d.classList.remove('open');d.querySelector('button').focus()}})});
mk($('ddTheme'),()=>th.value,T.map((t,i)=>({v:String(i),btn:sw(t)+'<span>'+t.name+'</span>',html:sw(t)+'<span>'+t.name+'</span>'})),v=>{th.value=v;theme(+v)},'Theme');
mk($('ddLang'),()=>lg.value,Object.keys(names).map(k=>({v:k,btn:'<svg class="globe" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/></svg><span class="code">'+k.toUpperCase()+'</span><span>'+names[k]+'</span>',html:'<span class="code">'+k.toUpperCase()+'</span><span>'+names[k]+'</span>'})),v=>{lg.value=v;lang(v)},'Language');
})();
const home=document.getElementById('home'),cvv=document.getElementById('cvview'),allv=document.getElementById('allview');
document.getElementById('cvpic').src=document.querySelector('#home .portrait').src;
function route(){const hs=location.hash,c=hs==='#cv',a=hs==='#all-projects';cvv.hidden=!c;allv.hidden=!a;home.hidden=c||a;if(c||a)window.scrollTo(0,0);else{const el=hs.length>1&&document.getElementById(hs.slice(1));if(el)el.scrollIntoView()}}
function fit(){cvv.style.setProperty('--z',Math.min(1,(innerWidth-24)/794))}
addEventListener('hashchange',route);addEventListener('resize',fit);fit();route();
function land(){const o=(screen.orientation&&screen.orientation.type)||'';const L=o.indexOf('landscape')===0||Math.abs(window.orientation||0)===90;r.toggleAttribute('data-land',L&&matchMedia('(pointer:coarse)').matches)}
addEventListener('resize',land);addEventListener('orientationchange',land);if(screen.orientation)screen.orientation.addEventListener('change',land);land();
allv.querySelectorAll('video[data-m]:not([src])').forEach(v=>{const s=home.querySelector('video[data-m="'+v.dataset.m+'"]');if(s){v.poster=s.poster;v.src=s.src}});
(function(){const cards=[...allv.querySelectorAll('.pcard')],box=document.getElementById('flt'),none=document.getElementById('nores'),q=document.getElementById('psearch');
const names=c=>[...c.querySelectorAll('.tags li')].map(li=>li.textContent.trim());
const techs=[...new Set(cards.flatMap(names))].sort((a,b)=>a.localeCompare(b));let cur='all';
box.innerHTML='<button type="button" class="btn primary" data-f="all" data-i18n="projects.filter.all">All</button>'+techs.map(t=>'<button type="button" class="btn" data-f="'+t.toLowerCase()+'">'+t+'</button>').join('');
function apply(){let n=0;const s=q.value.trim().toLowerCase();cards.forEach(c=>{const ok=(cur==='all'||names(c).map(x=>x.toLowerCase()).includes(cur))&&(!s||c.textContent.toLowerCase().includes(s));c.style.display=ok?'':'none';if(ok)n++});none.style.display=n?'none':'block'}
box.onclick=e=>{const b=e.target.closest('button');if(!b)return;cur=b.dataset.f;box.querySelectorAll('button').forEach(x=>x.classList.toggle('primary',x===b));apply()};
q.oninput=apply;if(ls.value!=='en')lang(ls.value)})();
function loadJs(src){return new Promise((ok,ko)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=ko;document.head.appendChild(s)})}
function imgPng(i){const c=document.createElement('canvas');c.width=i.naturalWidth;c.height=i.naturalHeight;c.getContext('2d').drawImage(i,0,0);return c.toDataURL('image/png')}
async function savePdf(btn){
 const label=btn.querySelector('span'),keep=label.textContent;
 if(btn.classList.contains('busy'))return;btn.classList.add('busy');btn.setAttribute('aria-busy','true');
 const sheet=document.querySelector('.a4'),sy=window.scrollY,z=cvv.style.getPropertyValue('--z');
 try{
  const dl=window.claude?await claude.use('downloads').catch(()=>null):null;
  await loadJs('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
  await loadJs('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
  if(document.fonts&&document.fonts.ready)await document.fonts.ready;
  cvv.style.setProperty('--z',1);window.scrollTo(0,0);
  await new Promise(r=>setTimeout(r,60));
  const canvas=await html2canvas(sheet,{scale:(matchMedia('(pointer:coarse)').matches?3:4),useCORS:true,logging:false,backgroundColor:'#ffffff',windowWidth:Math.max(innerWidth,1000),scrollX:0,scrollY:0,onclone:d=>{const w=d.defaultView;d.querySelectorAll('.a4 img').forEach(i=>{const cs=w.getComputedStyle(i),b=d.createElement('div');b.style.cssText='display:block;flex:none;box-sizing:border-box;width:'+cs.width+';height:'+cs.height+';padding:'+cs.padding+';margin:'+cs.margin+';border:'+cs.borderTopWidth+' '+cs.borderTopStyle+' '+cs.borderTopColor+';border-radius:'+cs.borderTopLeftRadius+';background-color:'+cs.backgroundColor+';background-image:'+(i.closest('.job')||i.id==='cvpic'?'none':'url("'+i.src+'")')+';background-repeat:no-repeat;background-position:center;background-origin:content-box;background-size:'+(cs.objectFit==='cover'?'cover':'contain');i.replaceWith(b)})}});
  const sr=sheet.getBoundingClientRect(),k=210/sr.width;
  const jsPDF=window.jspdf.jsPDF,pdf=new jsPDF({unit:'mm',format:'a4',orientation:'portrait',compress:true});
  pdf.addImage(canvas.toDataURL('image/jpeg',.95),'JPEG',0,0,210,297,undefined,'FAST');
  sheet.querySelectorAll('.job img').forEach(i=>{const r=i.getBoundingClientRect(),cs=getComputedStyle(i),p=parseFloat(cs.paddingLeft)||0,w=r.width-2*p,hh=r.height-2*p,s=Math.min(w/i.naturalWidth,hh/i.naturalHeight),iw=i.naturalWidth*s,ih=i.naturalHeight*s;pdf.addImage(imgPng(i),'PNG',(r.left-sr.left+p+(w-iw)/2)*k,(r.top-sr.top+p+(hh-ih)/2)*k,iw*k,ih*k)});
  const pi=document.getElementById('cvpic');if(pi&&pi.naturalWidth){const r=pi.getBoundingClientRect(),cs=getComputedStyle(pi),S=Math.round(r.width*k/25.4*450),cn=document.createElement('canvas');cn.width=cn.height=S;const cx=cn.getContext('2d');
   const rad=['TopLeft','TopRight','BottomRight','BottomLeft'].map(n=>{const v=cs['border'+n+'Radius'].split(' ')[0];return v.slice(-1)==='%'?parseFloat(v)/100*S:parseFloat(v)*S/r.width});
   const f=Math.min(1,S/((rad[0]+rad[1])||1),S/((rad[1]+rad[2])||1),S/((rad[2]+rad[3])||1),S/((rad[3]+rad[0])||1)),q=rad.map(v=>v*f);
   cx.beginPath();cx.moveTo(q[0],0);cx.lineTo(S-q[1],0);cx.arcTo(S,0,S,q[1],q[1]);cx.lineTo(S,S-q[2]);cx.arcTo(S,S,S-q[2],S,q[2]);cx.lineTo(q[3],S);cx.arcTo(0,S,0,S-q[3],q[3]);cx.lineTo(0,q[0]);cx.arcTo(0,0,q[0],0,q[0]);cx.closePath();cx.clip();
   const m=Math.min(pi.naturalWidth,pi.naturalHeight);cx.imageSmoothingQuality='high';cx.drawImage(pi,(pi.naturalWidth-m)/2,(pi.naturalHeight-m)/2,m,m,0,0,S,S);
   pdf.addImage(cn.toDataURL('image/png'),'PNG',(r.left-sr.left)*k,(r.top-sr.top)*k,r.width*k,r.height*k)}
  sheet.querySelectorAll('a[href]').forEach(a=>{const r=a.getBoundingClientRect();if(r.width&&r.height)pdf.link((r.left-sr.left)*k,(r.top-sr.top)*k,r.width*k,r.height*k,{url:a.href})});
  if(['en','fr','de','es'].includes(document.documentElement.lang)){try{
   pdf.setFont('helvetica','normal');
   sheet.querySelectorAll('h1,h2,h3,h4,p,li,.tg span').forEach(e=>{if(e.querySelector('li,p,h3'))return;const t=(e.textContent||'').replace(/\s+/g,' ').trim().replace(/[^\u0020-\u00ff\u2019\u2013]/g,'?');if(!t)return;
    const r=e.getBoundingClientRect(),fs=parseFloat(getComputedStyle(e).fontSize)*.75;pdf.setFontSize(fs);
    pdf.text(t,(r.left-sr.left)*k,(r.top-sr.top)*k+fs*.3528*.85,{maxWidth:r.width*k,renderingMode:'invisible'})})}catch(e){}}
  const blob=pdf.output('blob');if(dl)await dl.save({filename:'Adam_Schlee_CV.pdf',data:blob});else{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Adam_Schlee_CV.pdf';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),5000)}
 }catch(e){if(!e||e.code!=='declined')console.error(e)}
 finally{cvv.style.setProperty('--z',z||1);window.scrollTo(0,sy);btn.classList.remove('busy');btn.removeAttribute('aria-busy')}
}
const vs=[...document.querySelectorAll('.pmedia video')];
if(!matchMedia('(prefers-reduced-motion:reduce)').matches&&'IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?e.target.play().catch(()=>{}):e.target.pause()),{threshold:.5});vs.forEach(v=>io.observe(v))}

// language: saved choice, else the browser's, else French
try{const saved=localStorage.getItem('portfolio-lang'),want=saved&&D[saved]?saved:((navigator.languages||[navigator.language||'fr']).map(x=>String(x).slice(0,2)).find(x=>D[x])||'fr');ls.value=want;lang(want)}catch(e){lang('fr')}
// reveal on scroll
(function(){const sel=['#home section>h2','#home .entry','#home .skills>div','#home .cc','#home .pcard','#allview .ptools','#allview .pcard','#allview .pcta'].join(',');
const els=[...document.querySelectorAll(sel)];if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,sib=[...el.parentNode.children].filter(x=>x.classList.contains('rv')),k=Math.max(0,sib.indexOf(el));
el.style.setProperty('--d',(k%4)*.08+'s');el.classList.add('in');io.unobserve(el);
el.addEventListener('animationend',()=>{el.classList.remove('rv','in');el.style.removeProperty('--d')},{once:true})}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
els.forEach(el=>{el.classList.add('rv');io.observe(el)})})();
