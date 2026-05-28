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

/* ── Premium Details Overlay Modal logic ── */
function toggleDetails(btn, event) {
  event.stopPropagation(); // Prevent parent clicks
  
  const container = btn.closest('.interactive-details');
  const categoryName = container.dataset.category || 'Service Focus';
  
  // Find card info
  const parentCard = btn.closest('.svc-card, .etype, .gift-card, .svc2, .dig-card, .pr-card');
  const cardTitle = parentCard ? parentCard.querySelector('h3').textContent : 'FLEX LAB Solution';
  const cardDesc = parentCard ? parentCard.querySelector('p').textContent : 'Premium custom services.';
  
  // Find options
  const select = container.querySelector('.option-dropdown');
  const options = select ? Array.from(select.querySelectorAll('option')).map(opt => opt.value) : [];
  if (options.length === 0) return;
  
  // Remove existing modal if any
  document.querySelectorAll('.details-modal-overlay').forEach(el => el.remove());
  
  // Create overlay modal
  const overlay = document.createElement('div');
  overlay.className = 'details-modal-overlay';
  
  overlay.innerHTML = `
    <div class="details-modal-card">
      <button class="modal-close-btn" aria-label="Close modal">×</button>
      <div class="modal-orb"></div>
      <div class="modal-header">
        <div class="modal-category-label">${categoryName}</div>
        <h2 class="modal-title">${cardTitle}</h2>
        <p class="modal-description">${cardDesc}</p>
      </div>
      <div class="modal-options-wrapper">
        <span class="modal-section-title">Select Service Focus</span>
        <div class="modal-chips-grid">
          ${options.map((opt, i) => `
            <button class="modal-chip ${i === 0 ? 'active' : ''}" data-value="${opt}">${opt}</button>
          `).join('')}
        </div>
      </div>
      <div class="modal-actions">
        <a href="#" class="btn-modal-inquiry" target="_blank">📂 Inquiry / Send File</a>
        <a href="#" class="btn-modal-appointment" target="_blank">📅 Book Design Call</a>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  const card = overlay.querySelector('.details-modal-card');
  const closeBtn = overlay.querySelector('.modal-close-btn');
  
  // Update mailto for default option immediately
  updateModalMailto(card, categoryName, options[0]);
  
  // Event listeners for chips
  overlay.querySelectorAll('.modal-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      overlay.querySelectorAll('.modal-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      updateModalMailto(card, categoryName, chip.dataset.value);
    });
  });
  
  // Trigger animations
  setTimeout(() => {
    overlay.classList.add('active');
  }, 10);
  
  // Close handler
  function closeThisModal() {
    overlay.classList.remove('active');
    setTimeout(() => {
      overlay.remove();
    }, 400);
  }
  
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeThisModal();
  });
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeThisModal();
    }
  });
  
  // Cursor scaling hover bindings
  overlay.querySelectorAll('a, button, .modal-chip').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cbig'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cbig'));
  });
}

function updateModalMailto(modalCard, category, optionValue) {
  const email = "flexlab.co.in@gmail.com";
  const inquiryBtn = modalCard.querySelector('.btn-modal-inquiry');
  const apptBtn = modalCard.querySelector('.btn-modal-appointment');
  
  const inquirySubject = encodeURIComponent(`[FLex LAB] Print/Production Inquiry - ${category} (${optionValue})`);
  const inquiryBody = encodeURIComponent(
`Hi FLex LAB Team,

I would like to inquire about print/production services for: ${optionValue} (under ${category}).

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
  
  const apptSubject = encodeURIComponent(`[FLex LAB] Design Appointment Request - ${category} (${optionValue})`);
  const apptBody = encodeURIComponent(
`Hi FLex LAB Team,

I would like to schedule a design consultation to create custom designs for: ${optionValue} (under ${category}).

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

window.toggleDetails = toggleDetails;

