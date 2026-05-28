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

/* ── Premium Interactive Details Dropdown logic ── */
function toggleDetails(btn, event) {
  event.stopPropagation(); // Prevent parent clicks
  const container = btn.closest('.interactive-details');
  const panel = container.querySelector('.details-panel');
  
  if (panel.classList.contains('open')) {
    panel.classList.remove('open');
    btn.classList.remove('active');
    btn.innerHTML = 'Explore Options ▾';
  } else {
    // Close other panels on the page
    document.querySelectorAll('.interactive-details').forEach(otherContainer => {
      if (otherContainer !== container) {
        const otherPanel = otherContainer.querySelector('.details-panel');
        const otherBtn = otherContainer.querySelector('.details-toggle');
        if (otherPanel && otherPanel.classList.contains('open')) {
          otherPanel.classList.remove('open');
          if (otherBtn) {
            otherBtn.classList.remove('active');
            otherBtn.innerHTML = 'Explore Options ▾';
          }
        }
      }
    });

    panel.classList.add('open');
    btn.classList.add('active');
    btn.innerHTML = 'Close Options ▴';
    const select = container.querySelector('.option-dropdown');
    if (select) updateMailto(select);
  }
}

function updateMailto(select) {
  const container = select.closest('.interactive-details');
  const categoryName = container.dataset.category;
  const subCategory = select.value;
  const email = "flexlab.co.in@gmail.com";
  
  const inquiryBtn = container.querySelector('.btn-inquiry');
  const apptBtn = container.querySelector('.btn-appointment');
  
  const inquirySubject = encodeURIComponent(`[FLex LAB] Print/Production Inquiry - ${categoryName} (${subCategory})`);
  const inquiryBody = encodeURIComponent(
`Hi FLex LAB Team,

I would like to inquire about print/production services for: ${subCategory} (under ${categoryName}).

[CRITICAL]: I have attached the design files/assets I would like to get produced/printed to this email.

Project details:
- Quantity required: [Enter quantity here]
- Preferred size/finishes: [Enter preferred details here]
- Delivery deadline: [Enter date here]
- Special requirements: [Enter any special instructions here]

Please get back to me with a price estimate and turnaround time.

Best regards,
[My Name]
[My Company]
[My Phone Number]`
  );
  
  const apptSubject = encodeURIComponent(`[FLex LAB] Design Appointment Request - ${categoryName} (${subCategory})`);
  const apptBody = encodeURIComponent(
`Hi FLex LAB Team,

I would like to schedule a design consultation to create custom designs for: ${subCategory} (under ${categoryName}).

Project Brief:
- Design style preferred: [Enter brand vibe, color choices, or design inspiration here]
- Intended audience/use: [Enter details here]
- Timeline/Deadline: [Enter target date here]

Preferred Appointment Times:
- Option 1: [Date & Time]
- Option 2: [Date & Time]

Please let me know if this works or suggest an alternative time for our call.

Best regards,
[My Name]
[My Company]
[My Phone Number]`
  );
  
  if (inquiryBtn) inquiryBtn.href = `mailto:${email}?subject=${inquirySubject}&body=${inquiryBody}`;
  if (apptBtn) apptBtn.href = `mailto:${email}?subject=${apptSubject}&body=${apptBody}`;
}

// Auto-initialize all mailto links on window load or script execution
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.interactive-details .option-dropdown').forEach(select => {
    updateMailto(select);
  });
});
// Fallback in case DOMContentLoaded already fired
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  document.querySelectorAll('.interactive-details .option-dropdown').forEach(select => {
    updateMailto(select);
  });
}

window.toggleDetails = toggleDetails;
window.updateMailto  = updateMailto;

