(()=>{
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
document.documentElement.classList.add('js');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmt=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function countTo(el,to,ms=1800){
  const suf=el.dataset.suffix||'';
  if(reduce){el.textContent=fmt(to)+suf;return}
  const t0=performance.now();
  (function f(t){const k=Math.min(1,(t-t0)/ms);el.textContent=fmt(to*(1-Math.pow(1-k,3)))+suf;if(k<1)requestAnimationFrame(f)})(t0);
}

/* confeti */
const cf=document.createElement('canvas');cf.id='cf';document.body.appendChild(cf);
const cx=cf.getContext('2d');let parts=[],running=false;
const fitCf=()=>{cf.width=innerWidth;cf.height=innerHeight};fitCf();addEventListener('resize',fitCf);
function burst(x,y,o={}){
  if(reduce)return;
  const cols=o.colors||['#ff3b2f','#ffc20e','#19c25d','#fff4dc'],n=o.n||90;
  for(let i=0;i<n;i++){
    const a=(o.dir===undefined?-Math.PI/2:o.dir)+(Math.random()-.5)*(o.spread||Math.PI*1.2),v=(o.v||12)*(.4+Math.random()*.9);
    parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,w:5+Math.random()*7,h:3+Math.random()*5,r:Math.random()*6,vr:(Math.random()-.5)*.4,c:cols[i%cols.length],life:0,max:80+Math.random()*50});
  }
  if(!running){running=true;requestAnimationFrame(tickCf)}
}
function tickCf(){
  cx.clearRect(0,0,cf.width,cf.height);
  parts=parts.filter(p=>p.life<p.max&&p.y<cf.height+40);
  parts.forEach(p=>{p.life++;p.vy+=.35;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;
    cx.save();cx.globalAlpha=Math.min(1,(p.max-p.life)/25);cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillStyle=p.c;cx.fillRect(-p.w/2,-p.h/2,p.w,p.h);cx.restore()});
  if(parts.length)requestAnimationFrame(tickCf);else{running=false;cx.clearRect(0,0,cf.width,cf.height)}
}
const burstAt=(el,o)=>{const r=el.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2,o)};

/* títulos por letras / palabras */
function split(el,mode){
  if(el.dataset.sp)return;el.dataset.sp='1';
  const chars=mode!=='w';let n=0;
  const walk=node=>[...node.childNodes].forEach(c=>{
    if(c.nodeType===3){
      const f=document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(w=>{
        if(!w)return;
        if(/^\s+$/.test(w)){f.appendChild(document.createTextNode(' '));return}
        const sp=document.createElement('span');sp.className='w';
        if(chars){
          sp.setAttribute('aria-hidden','true');
          [...w].forEach(ch=>{const i=document.createElement('span');i.className='ch';i.style.setProperty('--i',n++);i.textContent=ch;sp.appendChild(i)});
        }else{sp.classList.add('ch');sp.style.setProperty('--i',n++);sp.textContent=w}
        f.appendChild(sp);
      });
      c.replaceWith(f);
    }else if(c.nodeType===1)walk(c);
  });
  const label=el.textContent.replace(/\s+/g,' ').trim();
  walk(el);el.classList.add('sp');
  if(chars)el.setAttribute('aria-label',label);
}
/* año que rueda */
function roll(el,ms=1500){
  if(!el)return;const to=+el.dataset.roll;
  if(reduce){el.textContent=to;return}
  const from=to-220,t0=performance.now();
  (function f(t){const k=Math.min(1,(t-t0)/ms);el.textContent=Math.round(from+(to-from)*(1-Math.pow(1-k,4)));if(k<1)requestAnimationFrame(f)})(t0);
}

/* ticker */
(()=>{
  const items=['Charles Richard Drew','Banco de sangre','Marie Van Brittan Brown','Videoportero','Plasma','Alarma','Blood for Britain','US3482037A'];
  const rows=[{el:$('#tk'),dir:1,list:items},{el:$('#tk2'),dir:-1,list:items.slice().reverse()}];
  rows.forEach(r=>{const h=r.list.map(t=>`<span>${t}</span>`).join('');r.el.innerHTML=h+h;r.x=0;r.w=0});
  const measure=()=>rows.forEach(r=>{const n=r.list.length;r.w=r.el.children[n].offsetLeft-r.el.children[0].offsetLeft;if(r.dir<0&&r.x===0)r.x=-r.w});
  measure();addEventListener('resize',measure);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(measure);
  if(reduce)return;
  let last=performance.now(),sy=scrollY,vel=0;
  (function loop(t){
    const dt=Math.min(50,t-last);last=t;
    const d=Math.abs(scrollY-sy);sy=scrollY;vel+=(Math.min(d,90)-vel)*.12;
    const rc=rows[0].el.parentNode.getBoundingClientRect();
    if(rc.bottom>-200&&rc.top<innerHeight+200)rows.forEach(r=>{
      if(!r.w)return;
      r.x-=r.dir*(.055*dt+vel*.7);
      if(r.x<=-r.w)r.x+=r.w;if(r.x>0)r.x-=r.w;
      r.el.style.transform=`translate3d(${r.x}px,0,0)`;
    });
    requestAnimationFrame(loop);
  })(last);
})();

/* progreso, nav y color de barra */
const pct=$('#pct'),fill=$('#barfill');
function onScroll(){const m=document.documentElement.scrollHeight-innerHeight;const p=m>0?Math.min(1,scrollY/m):0;pct.textContent=String(Math.round(p*100)).padStart(3,'0');fill.style.transform=`scaleX(${p})`}
addEventListener('scroll',onScroll,{passive:true});onScroll();
const colors={rojo:'var(--rojo)',verde:'var(--verde)',oro:'var(--oro)',bone:'var(--crema)'};
const navIo=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;
  document.documentElement.style.setProperty('--bar-c',colors[e.target.dataset.c]||colors.oro);
  $$('.bar nav a').forEach(a=>a.classList.toggle('on',a.dataset.s===e.target.id));
}),{rootMargin:'-50% 0px -50% 0px'});
$$('section[data-c]').forEach(s=>navIo.observe(s));
const rvIo=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rvIo.unobserve(e.target)}}),{threshold:.15});
$$('h1,.ch-head h2,.sect h2,.end h2,.card h3').forEach(el=>split(el));
$$('.juntos,.team li').forEach(el=>split(el,'w'));
$$('.rv,.stripe,.qrbox').forEach(el=>rvIo.observe(el));
$$('.sp').filter(el=>!el.closest('.card')&&!el.closest('.hero')).forEach(el=>rvIo.observe(el));
(()=>{const h=$('.hero h1');if(h)setTimeout(()=>h.classList.add('now'),200)})();

/* hero: luz que revela */
(()=>{
  const hero=$('#top'),field=$('#field');
  const W=[['Banco de sangre',3,6,9,-2,'r'],['Plasma',62,3,13,2,'r'],['Videoportero',16,24,10,-1.5,'a'],['Alarma',66,26,11,3,'o'],['US3482037A',4,44,6,0,'a'],['Blood for Britain',36,41,7,-2,'r'],['1904',80,15,8,0,'r'],['1966',44,9,6,0,'a'],['Patente',72,48,7,-3,'o'],['Cerradura',4,30,6,1,'o'],['Donantes',30,3,6,2,'o']];
  const mk=cls=>`<div class="layer ${cls}">${W.map(w=>`<span class="${w[5]}" style="left:${w[1]}%;top:${w[2]}%;--s:${w[3]};--r:${w[4]}deg">${w[0]}</span>`).join('')}</div>`;
  field.innerHTML=mk('base')+mk('lit');
  const set=(x,y)=>{hero.style.setProperty('--mx',x+'px');hero.style.setProperty('--my',y+'px');hero.style.setProperty('--px',(x/hero.offsetWidth-.5).toFixed(3));hero.style.setProperty('--py',(y/hero.offsetHeight-.5).toFixed(3))};
  let last=-9999,vis=true;
  const mv=e=>{const r=hero.getBoundingClientRect();set(e.clientX-r.left,e.clientY-r.top);last=performance.now()};
  hero.addEventListener('pointermove',mv);hero.addEventListener('pointerdown',mv);
  new IntersectionObserver(es=>{vis=es[0].isIntersecting}).observe(hero);
  const r0=hero.getBoundingClientRect();set(r0.width*.5,r0.height*.34);
  if(!reduce)(function d(t){if(vis&&t-last>2500){const r=hero.getBoundingClientRect();set(r.width*(.5+.34*Math.sin(t/2300)),r.height*(.34+.2*Math.sin(t/1700+1)))}requestAnimationFrame(d)})(0);
})();

/* scrollytelling */
const scrollies=$$('.scrolly').map(sc=>({sc,stage:$('.stage',sc),steps:$$('.step',sc),panels:$$('.panel',sc),si:$('.si',sc)}));
const hooks={
  'stage-drew':{1:s=>roll($('.big-year',s.stage)),3:()=>demoSep(),4:s=>$$('.count',s.stage).forEach(c=>countTo(c,+c.dataset.to)),5:()=>{}},
  'stage-brown':{1:s=>roll($('.big-year',s.stage)),5:s=>$$('.count',s.stage).forEach(c=>countTo(c,+c.dataset.to,1400))}
};
function activate(s,i){
  if(s.cur===i)return;s.cur=i;
  s.stage.dataset.step=i;s.si.textContent=i;
  s.steps.forEach((el,k)=>el.classList.toggle('on',k===i-1));
  s.panels.forEach((el,k)=>el.classList.toggle('on',k===i-1));
  const h=hooks[s.stage.id]&&hooks[s.stage.id][i];if(h)h(s);
}
let ios=[];
function build(){
  ios.forEach(o=>o.disconnect());ios=[];
  const rm=matchMedia('(max-width: 860px)').matches?'-60% 0px -32% 0px':'-45% 0px -45% 0px';
  scrollies.forEach(s=>{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)activate(s,+e.target.dataset.i)}),{rootMargin:rm});s.steps.forEach(el=>io.observe(el));ios.push(io)});
}
build();matchMedia('(max-width: 860px)').addEventListener('change',build);

/* Drew: separador de plasma */
const sep=$('#sepRange'),pl=$('#plasma'),cl=$('#cells'),lp=$('#lblPlasma'),lc=$('#lblCells'),sok=$('#sepOk');
let touched=false;
function setSep(v){const k=v/100,hp=k*120;
  pl.setAttribute('height',hp);pl.style.opacity=.2+.8*k;
  cl.setAttribute('y',70+hp);cl.style.opacity=k;
  lp.setAttribute('y',70+hp/2+4);lp.style.opacity=k;
  lc.setAttribute('y',70+hp+(240-hp)/2);lc.style.opacity=k;
  sok.classList.toggle('on',k>.9);sep.value=v}
sep.addEventListener('input',()=>{touched=true;setSep(+sep.value)});
function demoSep(){if(touched)return;const t0=performance.now();
  if(reduce){setSep(100);return}
  (function f(t){if(touched)return;const k=Math.min(1,(t-t0)/2600);setSep(100*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)})(t0)}
setSep(0);

/* Drew: gotas */
(()=>{const box=$('#drops'),msg=$('#dropMsg');
  $$('.drop',box).forEach(b=>b.addEventListener('click',()=>{box.classList.add('shown');burstAt(b,{colors:['#ff3b2f','#b3231b','#ff7a6e'],n:44,v:9});msg.innerHTML='<b>Imposible saberlo.</b> La sangre no se divide por raza y no había ciencia que lo sustentara. Drew renunció.'}))})();

/* Brown: piezas */
(()=>{const dg=$('#diagram'),cap=$('#bCap'),hs=$$('.hs',dg);
  const caps={1:'Varias mirillas y una cámara con motor que sube y baja por control remoto.',2:'Un monitor dentro de casa: ves quién llama sin abrir.',3:'Micrófono y altavoz: hablas con quien está afuera antes de decidir.',4:'Control remoto de la cerradura eléctrica y botón de alarma para avisar a la policía o a un centro de seguridad.'};
  hs.forEach(h=>h.addEventListener('click',()=>{dg.dataset.hl=h.dataset.n;cap.textContent=caps[h.dataset.n];hs.forEach(x=>x.classList.toggle('hl',x===h))}))})();

/* Reflexión: franjas que se abren */
(()=>{
  const L=[
    {s:'Importancia',t:'Importancia para la humanidad',d:'Hizo posible guardar y trasladar sangre y plasma: urgencias, cirugías mayores y heridas graves.',b:'Anticipó la vigilancia residencial y el acceso a distancia: video, audio y mando remoto en casa.'},
    {s:'Problema',t:'Problema que resolvió',d:'La sangre fresca dura poco, y hospitales y campos de batalla necesitaban reponer volumen ya.',b:'Abrir la puerta sin saber quién llama y no poder pedir ayuda rápido ante una amenaza.'},
    {s:'Impacto',t:'Impacto en la sociedad',d:'Los bancos de sangre y los hemocomponentes son pilares de cualquier hospital.',b:'Videoporteros, cámaras domésticas, intercomunicadores y alarmas conectadas repiten su arquitectura.'},
    {s:'Historia',t:'Importancia histórica',d:'Rigor técnico y ética: renunció antes que aceptar sangre separada por raza.',b:'Una mujer afro enfermera patentó tecnología pese a las barreras de acceso y de reconocimiento.'}
  ];
  const el=$('#lens');
  el.innerHTML=L.map((x,i)=>`<article class="ln${i?'':' on'}" data-n="0${i+1}"><button type="button" class="lh" aria-expanded="${!i}" aria-controls="lb${i}"><i>0${i+1}</i><span class="vl">${x.s}</span></button><div class="lb" id="lb${i}"><h3>${x.t}</h3><div class="pair"><div class="who" style="--w:var(--rojo)"><em>Charles Drew</em><p>${x.d}</p></div><div class="who" style="--w:var(--verde)"><em>Marie Brown</em><p>${x.b}</p></div></div></div><span class="bar"></span></article>`).join('');
  const ns=$$('.ln',el);let cur=0,hov=false,vis=false;
  const mob=()=>matchMedia('(max-width: 860px)').matches;
  function open(i){cur=i;ns.forEach((n,k)=>{const on=k===i;n.classList.toggle('on',on);$('.lh',n).setAttribute('aria-expanded',String(on))})}
  ns.forEach((n,k)=>$('.lh',n).addEventListener('click',()=>{if(k!==cur)open(k)}));
  el.addEventListener('animationend',e=>{if(e.animationName!=='lbar'||reduce||mob())return;open((cur+1)%ns.length)});
  const sync=()=>el.classList.toggle('paused',hov||!vis);
  el.addEventListener('pointerenter',()=>{hov=true;sync()});
  el.addEventListener('pointerleave',()=>{hov=false;sync()});
  new IntersectionObserver(es=>{vis=es[0].isIntersecting;sync()},{threshold:.35}).observe(el);
  sync();
})();

/* pestañas de juegos */
const gameTabs=$$('.gt');
function showGame(g){gameTabs.forEach(t=>{const on=t.dataset.g===g;t.setAttribute('aria-selected',String(on));$('#p-'+t.dataset.g).hidden=!on});
}
gameTabs.forEach(t=>t.addEventListener('click',()=>showGame(t.dataset.g)));

/* Imágenes: llena los huecos .slot con los archivos de img/ */
function makeSlots(root){
  $$('.slot[data-src]',root||document).forEach(s=>{
    if(s.dataset.ready)return;s.dataset.ready='1';
    if(s.dataset.ar)s.style.setProperty('--ar',s.dataset.ar);
    const src=s.dataset.src;
    s.insertAdjacentHTML('beforeend',`<img alt="${s.dataset.alt||''}"><div class="ph">Agrega la imagen<b>${src}</b></div>${s.dataset.cap?`<figcaption>${s.dataset.cap}</figcaption>`:''}`);
    const im=s.querySelector('img');
    if(s.dataset.pos)im.style.objectPosition=s.dataset.pos;
    im.addEventListener('error',()=>s.classList.add('missing'));
    im.src=src;
  });
}
makeSlots();

/* lightbox: toca una imagen del escenario para verla grande */
function openBox(s){
  if(s.classList.contains('missing'))return;
  const im=s.querySelector('img'),b=document.createElement('div');
  b.className='lbx';
  b.innerHTML=`<figure><img src="${im.currentSrc||im.src}" alt="${s.dataset.alt||''}"><figcaption>${s.dataset.cap||''}</figcaption></figure><button type="button">Cerrar ✕</button>`;
  const close=()=>{b.remove();removeEventListener('keydown',k)},k=e=>{if(e.key==='Escape')close()};
  b.addEventListener('click',close);addEventListener('keydown',k);document.body.appendChild(b);b.querySelector('button').focus();
  const li=b.querySelector('img');
  const size=()=>{const sc=Math.min(innerWidth*.94/li.naturalWidth,innerHeight*.82/li.naturalHeight,2.6);li.style.width=li.naturalWidth*sc+'px';li.style.height=li.naturalHeight*sc+'px'};
  if(li.complete&&li.naturalWidth)size();else li.addEventListener('load',size);
}
$$('.stage .slot,.paper .slot').forEach(s=>{
  s.dataset.zoom='1';s.tabIndex=0;s.setAttribute('role','button');s.setAttribute('aria-label','Ampliar imagen: '+(s.dataset.alt||''));
  s.addEventListener('click',()=>openBox(s));
  s.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openBox(s)}});
});

/* Juego A: memoria de pares */
(()=>{
  const grid=$('#mem'),hm=$('#g1m'),hc=$('#g1c'),msg=$('#g1msg');
  let first=null,lock=false,moves=0,pairs=0;
  const total=INV.memoria.length;
  function build(){
    moves=0;pairs=0;first=null;lock=false;hm.textContent=0;hc.textContent='0/'+total;msg.textContent='';
    const cards=[];INV.memoria.forEach(it=>{cards.push({it,t:'img'});cards.push({it,t:'txt'})});
    grid.innerHTML=shuffle(cards).map((c,i)=>`<button type="button" class="mc" style="--k:${i}" data-k="${c.it.k}" data-name="${c.it.name}" aria-label="Carta ${i+1} boca abajo"><span class="in"><span class="front"><i>?</i></span><span class="back">${c.t==='img'?`<div class="slot" data-src="${c.it.img}" data-ar="4/5" data-alt="${c.it.name}"></div>`:`<b>${c.it.name}</b><small>${c.it.sub}</small>`}</span></span></button>`).join('');
    makeSlots(grid);
  }
  grid.addEventListener('click',e=>{
    const b=e.target.closest('.mc');if(!b||lock||b.classList.contains('flip'))return;
    b.classList.add('flip');b.setAttribute('aria-label',b.dataset.name);
    if(!first){first=b;return}
    moves++;hm.textContent=moves;
    if(first.dataset.k===b.dataset.k){
      first.classList.add('ok');b.classList.add('ok');burstAt(b,{n:26,v:8});first=null;pairs++;hc.textContent=pairs+'/'+total;
      if(pairs===total){burstAt(grid,{n:140,v:15});setTimeout(()=>burstAt(grid,{n:90,v:12}),350)}
      if(pairs===total)msg.innerHTML=`<b>Completo en ${moves} movimientos.</b> Ya no son invisibles para ti.`;
    }else{
      lock=true;const a=first;first=null;
      setTimeout(()=>[a,b].forEach(x=>x.classList.add('bad')),480);
      setTimeout(()=>{[a,b].forEach(x=>{x.classList.remove('bad');x.classList.remove('flip');x.setAttribute('aria-label','Carta boca abajo')});lock=false},900);
    }
  });
  $('#g1reset').addEventListener('click',build);
  build();
})();

/* Juego B: rompecabezas deslizante 3x3 */
(()=>{
  const board=$('#pz'),tabs=$('#pzTabs'),fb=$('#g2fb'),hm=$('#g2m');
  const P=INV.puzzle;let cur=0,tiles,moves,won,peek=false,hasImg=false,asp=1,mvInfo=null;
  tabs.innerHTML=P.map((p,i)=>`<button type="button" role="tab" data-i="${i}" aria-selected="${i===0}">${p.name.split(' ').slice(-1)[0]}</button>`).join('');
  const goal=[1,2,3,4,5,6,7,8,0];
  function neighbors(z){const r=Math.floor(z/3),c=z%3,n=[];if(r>0)n.push(z-3);if(r<2)n.push(z+3);if(c>0)n.push(z-1);if(c<2)n.push(z+1);return n}
  function mix(){tiles=goal.slice();let z=8,prev=-1;for(let k=0;k<80;k++){const n=neighbors(z).filter(x=>x!==prev);const t=n[Math.floor(Math.random()*n.length)];[tiles[z],tiles[t]]=[tiles[t],tiles[z]];prev=z;z=t}
    if(tiles.every((v,i)=>v===goal[i]))return mix();
    moves=0;won=false;peek=false;hm.textContent=0;fb.textContent='Toca una pieza al lado del hueco para moverla.';render()}
  function bg(n){
    const c=(n-1)%3,r=Math.floor((n-1)/3),fx=P[cur].fx===undefined?.5:P[cur].fx,fy=P[cur].fy===undefined?.3:P[cur].fy;
    let sw=300,sh=300,x=c*50,y=r*50;
    if(asp>1.001){sw=300*asp;x=100*(c+3*(asp-1)*fx)/(3*asp-1)}
    else if(asp<.999){sh=300/asp;y=100*(r+3*(1/asp-1)*fy)/(3/asp-1)}
    return `background-size:${sw}% ${sh}%;background-position:${x}% ${y}%`;
  }
  function render(){
    const src=P[cur].img;
    board.className='pz'+(hasImg?'':' noimg')+(won||peek?' show':'');
    board.innerHTML=tiles.map((v,i)=>{
      if(v===0&&!(won||peek))return `<div class="pt blank"></div>`;
      const n=(won||peek)&&v===0?9:v,mv=mvInfo&&mvInfo.pos===i;
      return `<button type="button" class="pt${mv?' mv':''}" data-i="${i}" aria-label="Pieza ${n}" style="background-image:url('${src}');${bg(n)}${mv?`;--dx:${mvInfo.dx}%;--dy:${mvInfo.dy}%`:''}"><span>${n}</span></button>`}).join('');
    mvInfo=null;
  }
  function loadImg(){hasImg=false;const im=new Image();im.onload=()=>{hasImg=true;asp=im.naturalWidth/im.naturalHeight;render()};im.onerror=()=>{hasImg=false;render()};im.src=P[cur].img}
  board.addEventListener('click',e=>{
    const b=e.target.closest('.pt');if(!b||b.classList.contains('blank')||won||peek)return;
    const i=+b.dataset.i,z=tiles.indexOf(0);
    if(!neighbors(z).includes(i)){return}
    [tiles[z],tiles[i]]=[tiles[i],tiles[z]];moves++;hm.textContent=moves;mvInfo={pos:z,dx:(i%3-z%3)*100,dy:(Math.floor(i/3)-Math.floor(z/3))*100};
    if(tiles.every((v,k)=>v===goal[k])){won=true;fb.innerHTML=`<b class="y">${P[cur].name}</b> ${P[cur].fact}`}
    render();
    if(won){board.classList.add('won');burstAt(board,{n:130,v:14})}
  });
  tabs.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;cur=+b.dataset.i;$$('button',tabs).forEach(x=>x.setAttribute('aria-selected',String(x===b)));loadImg();mix()});
  $('#pzMix').addEventListener('click',mix);
  $('#pzPeek').addEventListener('click',()=>{if(won)return;peek=!peek;mvInfo=null;fb.textContent=peek?'Este es el modelo. Pulsa de nuevo para volver.':'Toca una pieza al lado del hueco para moverla.';render()});
  loadImg();mix();
})();

/* Juego C: ordena la historia */
(()=>{
  const ol=$('#ol'),fb=$('#g3fb'),tabs=$$('#ordTabs button');
  let key='drew',arr,sel=null,checked=false,sw=[];
  const items=()=>INV.orden[key];
  function mix(){const n=items().length;let a;do{a=shuffle([...Array(n).keys()])}while(a.every((v,k)=>v===k));arr=a;sel=null;checked=false;sw=[];ol.classList.add('fresh');fb.textContent='Toca dos hitos para intercambiarlos.';render()}
  function render(){
    ol.innerHTML=arr.map((idx,pos)=>{
      const it=items()[idx];let cls='oi';
      if(sel===pos)cls+=' sel';
      if(sw.includes(pos))cls+=' sw';
      if(checked)cls+=idx===pos?' ok':' no';
      return `<li><button type="button" class="${cls}" style="--k:${pos}" data-p="${pos}"><span class="n">${pos+1}</span><span>${it.t}</span><span class="yr">${checked?it.y:''}</span></button></li>`}).join('');
  }
  ol.addEventListener('click',e=>{
    const b=e.target.closest('.oi');if(!b)return;const p=+b.dataset.p;
    ol.classList.remove('fresh');sw=[];
    if(sel===null)sel=p;else if(sel===p)sel=null;else{[arr[sel],arr[p]]=[arr[p],arr[sel]];sw=[sel,p];sel=null}
    checked=false;render();
  });
  $('#ordCheck').addEventListener('click',()=>{
    ol.classList.remove('fresh');sw=[];checked=true;sel=null;render();
    const ok=arr.filter((v,k)=>v===k).length,n=arr.length;
    if(ok===n)setTimeout(()=>burstAt(ol,{n:120,v:14}),n*90);
    fb.innerHTML=ok===n?'<b class="y">Completa</b> La historia quedó en orden.':`<b class="x">${ok} de ${n}</b> en su lugar. Corrige los rojos.`;
  });
  $('#ordMix').addEventListener('click',mix);
  tabs.forEach(t=>t.addEventListener('click',()=>{key=t.dataset.k;tabs.forEach(x=>x.setAttribute('aria-selected',String(x===t)));mix()}));
  mix();
})();

/* cursor que sigue */
(()=>{
  if(reduce||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  const c=document.createElement('div');c.className='cur';document.body.appendChild(c);
  let x=-100,y=-100,tx=-100,ty=-100;
  addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;c.classList.add('on');c.classList.toggle('big',!!(e.target.closest&&e.target.closest('a,button,.ln,.slot[data-zoom],input')))},{passive:true});
  document.addEventListener('pointerleave',()=>c.classList.remove('on'));
  (function f(){x+=(tx-x)*.22;y+=(ty-y)*.22;c.style.transform=`translate(${x}px,${y}px)`;requestAnimationFrame(f)})();
})();

/* inclinación 3D al pasar el puntero */
(()=>{
  if(reduce||!matchMedia('(hover:hover)').matches)return;
  const tl=(el,max)=>{
    el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.setProperty('--ry',(x*max*2).toFixed(2)+'deg');el.style.setProperty('--rx',(-y*max*2).toFixed(2)+'deg')});
    el.addEventListener('pointerleave',()=>{el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')});
  };
  $$('.row .slot,.stage .wide').forEach(el=>{el.classList.add('tilt');tl(el,7)});
  $$('.paper').forEach(el=>tl(el,4));
})();

/* QR */
(()=>{
  const box=$('#qr'),inp=$('#qrUrl');
  const u=location.href.split('#')[0];if(/^https?:/.test(u))inp.value=u;
  function draw(){const url=inp.value.trim();if(!url){box.textContent='Pega abajo el enlace de la web para crear el QR.';return}
    box.innerHTML='';
    try{new QRCode(box,{text:url,width:208,height:208,colorDark:'#120b08',colorLight:'#fff4dc',correctLevel:QRCode.CorrectLevel.M})}
    catch(e){box.textContent='No se pudo crear el QR. Revisa el enlace.'}}
  inp.addEventListener('input',draw);addEventListener('load',draw);
})();
})();