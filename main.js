/* =====================================================
   FLex LAB — Shared Scripts
   ===================================================== */

/* ── Custom Cursor ── */
const cur  = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx=0, my=0, rx=0, ry=0;

if(cur && ring){
  document.addEventListener('mousemove', e=>{
    mx=e.clientX; my=e.clientY;
    cur.style.left=mx+'px'; cur.style.top=my+'px';
  });
  (function tick(){
    rx+=(mx-rx)*.1; ry+=(my-ry)*.1;
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
    requestAnimationFrame(tick);
  })();
  document.querySelectorAll('a,button,.card,.svc-card,.tcard,.num-item,.lab-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('cbig'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('cbig'));
  });
}

/* ── Mobile nav ── */
function toggleMob(){
  document.getElementById('ham')?.classList.toggle('open');
  document.getElementById('mob-menu')?.classList.toggle('open');
}
function closeMob(){
  document.getElementById('ham')?.classList.remove('open');
  document.getElementById('mob-menu')?.classList.remove('open');
}
window.toggleMob = toggleMob;
window.closeMob  = closeMob;

/* ── Sticky nav ── */
const nav = document.getElementById('nav');
if(nav){
  window.addEventListener('scroll',()=>nav.classList.toggle('stuck',scrollY>60),{passive:true});
}

/* ── Active nav link ── */
(function(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a=>{
    const href = a.getAttribute('href')?.split('/').pop() || '';
    if(href === path || (path==='' && href==='index.html')) a.classList.add('active');
  });
})();

/* ── Scroll reveal ── */
const rvObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); rvObs.unobserve(e.target); } });
},{threshold:.12});
document.querySelectorAll('.rv').forEach(el=>rvObs.observe(el));

/* ── Counter animation ── */
function countUp(el){
  const to=parseInt(el.dataset.to), suf=el.dataset.suf||'';
  let v=0; const step=to/55;
  const t=setInterval(()=>{
    v+=step;
    if(v>=to){el.textContent=to+suf;clearInterval(t);}
    else el.textContent=Math.floor(v)+suf;
  },20);
}
const cntObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('[data-to]').forEach(countUp);
      cntObs.unobserve(e.target);
    }
  });
},{threshold:.4});
document.querySelectorAll('.stat-item,.stat').forEach(s=>cntObs.observe(s));

/* ── Particles (hero canvas) ── */
function initParticles(canvasId){
  const cvs=document.getElementById(canvasId);
  if(!cvs)return;
  const ctx=cvs.getContext('2d');
  let W,H,pts=[];
  function resize(){ W=cvs.width=innerWidth; H=cvs.height=cvs.parentElement?.offsetHeight||innerHeight; }
  resize(); window.addEventListener('resize',resize,{passive:true});
  class Pt{
    constructor(){this.reset();}
    reset(){
      this.x=Math.random()*W; this.y=Math.random()*H;
      this.vx=(Math.random()-.5)*.25; this.vy=(Math.random()-.5)*.25;
      this.r=Math.random()*1.3+.4; this.a=Math.random()*.3+.07;
      this.c=Math.random()>.5?'124,58,237':'6,182,212';
    }
    step(){ this.x+=this.vx; this.y+=this.vy; if(this.x<0||this.x>W||this.y<0||this.y>H)this.reset(); }
    draw(){ ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fillStyle=`rgba(${this.c},${this.a})`; ctx.fill(); }
  }
  for(let i=0;i<70;i++) pts.push(new Pt());
  function lines(){
    for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
      const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.hypot(dx,dy);
      if(d<110){ ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.strokeStyle=`rgba(124,58,237,${.035*(1-d/110)})`; ctx.lineWidth=.5; ctx.stroke(); }
    }
  }
  (function loop(){ ctx.clearRect(0,0,W,H); pts.forEach(p=>{p.step();p.draw();}); lines(); requestAnimationFrame(loop); })();
}
initParticles('cvs');

/* ── Service card glow ── */
document.querySelectorAll('.svc-card,.card-glow').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    card.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
    card.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
  });
});

/* ── Grid dot animation (about visual) ── */
(function(){
  const g=document.getElementById('gdot-grid');
  if(!g)return;
  for(let i=0;i<100;i++){ const d=document.createElement('div'); d.className='gdot'; g.appendChild(d); }
  setInterval(()=>{
    const dots=g.querySelectorAll('.gdot');
    dots.forEach(d=>d.classList.remove('lit'));
    const n=Math.floor(Math.random()*14)+5;
    for(let i=0;i<n;i++) dots[Math.floor(Math.random()*100)].classList.add('lit');
  },650);
})();
