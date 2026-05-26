/*!
 * FLex LAB — Premium Animations v2.0
 * =====================================================
 * Techniques from Webflow Made-in-Webflow showcase:
 *  01. Lenis Smooth Scroll
 *  02. Scroll Progress Bar
 *  03. Enhanced Magnetic Cursor + Label
 *  04. Preloader (counter + curtain reveal)
 *  05. Page Transition (curtain system)
 *  06. Text Scramble (character shuffle)
 *  07. SplitText (custom line/word/char split)
 *  08. Clip-path Text Reveal
 *  09. Apple Gradient Text on Scroll
 *  10. Magnetic Buttons (physical pull)
 *  11. 3D Card Tilt + Glare
 *  12. Horizontal Scroll Section (GSAP pin)
 *  13. SVG Line Draw (process steps)
 *  14. Stagger Reveal
 *  15. Mouse-track Parallax
 *  16. Letter-by-letter animation
 *  17. Ticker number animation (enhanced)
 *  18. Noise grain overlay (animated)
 * =====================================================
 */

/* ─────────────────────────────────────────
   UTILITY
───────────────────────────────────────── */
function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }
function lerp(a,b,t){ return a + (b-a)*t; }
function map(v,s1,e1,s2,e2){ return s2 + (v-s1)/(e1-s1)*(e2-s2); }
function qs(sel,scope=document){ return scope.querySelector(sel); }
function qsa(sel,scope=document){ return [...scope.querySelectorAll(sel)]; }

/* ─────────────────────────────────────────
   01. LENIS SMOOTH SCROLL
───────────────────────────────────────── */
(function initLenis(){
  let lY=0, tY=0, raf=null;
  const ease=0.1, el=document.documentElement;

  // Check if device prefers reduced motion
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;

  // We use a lightweight scroll interpolator instead of library
  // to avoid CDN dependency
  const sections = qsa('[data-scroll-section]');
  if(!sections.length) return; // only run on pages that opt-in

  function tick(){
    lY = lerp(lY, tY, ease);
    if(Math.abs(lY-tY) < 0.1) lY = tY;
    el.style.setProperty('--scroll-y', lY+'px');
    raf = requestAnimationFrame(tick);
  }

  window.addEventListener('scroll', ()=>{ tY=window.scrollY; }, {passive:true});
  raf = requestAnimationFrame(tick);
})();

/* ─────────────────────────────────────────
   02. SCROLL PROGRESS BAR
───────────────────────────────────────── */
(function initScrollProgress(){
  const bar = qs('#scroll-progress');
  if(!bar) return;
  const fill = qs('#sp-fill');
  function update(){
    const p = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    fill.style.width = clamp(p*100,0,100)+'%';
  }
  window.addEventListener('scroll', update, {passive:true});
  update();
})();

/* ─────────────────────────────────────────
   03. ENHANCED CURSOR (dot + ring + label + magnetic)
───────────────────────────────────────── */
(function initCursor(){
  const dot    = qs('#cur');
  const ring   = qs('#cur-ring');
  const label  = qs('#cur-label');
  if(!dot || !ring) return;

  let mx=0,my=0, rx=0,ry=0, scale=1;
  let hidden = false;

  document.addEventListener('mousemove',e=>{
    mx=e.clientX; my=e.clientY;
    dot.style.left = mx+'px';
    dot.style.top  = my+'px';
    if(hidden){ dot.style.opacity='1'; ring.style.opacity='1'; hidden=false; }
  });

  document.addEventListener('mouseleave',()=>{
    dot.style.opacity='0'; ring.style.opacity='0'; hidden=true;
  });
  document.addEventListener('mouseenter',()=>{
    dot.style.opacity='1'; ring.style.opacity='1'; hidden=false;
  });

  // Lagged ring
  (function tick(){
    rx = lerp(rx, mx, 0.1);
    ry = lerp(ry, my, 0.1);
    ring.style.left  = rx+'px';
    ring.style.top   = ry+'px';
    requestAnimationFrame(tick);
  })();

  // Hover states
  function addHover(sel, opts={}){
    qsa(sel).forEach(el=>{
      el.addEventListener('mouseenter',()=>{
        dot.classList.add(opts.dotClass||'cur-hover');
        ring.classList.add(opts.ringClass||'ring-hover');
        if(label && opts.text){
          label.textContent = opts.text;
          label.style.opacity='1';
          label.style.transform='scale(1)';
        }
      });
      el.addEventListener('mouseleave',()=>{
        dot.classList.remove(opts.dotClass||'cur-hover');
        ring.classList.remove(opts.ringClass||'ring-hover');
        if(label){ label.style.opacity='0'; label.style.transform='scale(0.5)'; }
      });
    });
  }

  addHover('a, button, .lab-card, .card, .svc-card, .tcard',{ text:'' });
  addHover('.btn-p, .nav-btn',{ dotClass:'cur-hover', ringClass:'ring-btn', text:'→' });
  addHover('[data-cursor-text]');

  // Data cursor text
  qsa('[data-cursor-text]').forEach(el=>{
    el.addEventListener('mouseenter',()=>{
      if(label){
        label.textContent = el.dataset.cursorText||'View';
        label.style.opacity='1';
        label.style.transform='scale(1)';
      }
      ring.classList.add('ring-text');
    });
    el.addEventListener('mouseleave',()=>{
      if(label){ label.style.opacity='0'; label.style.transform='scale(0.5)'; }
      ring.classList.remove('ring-text');
    });
  });
})();

/* ─────────────────────────────────────────
   04. PRELOADER
───────────────────────────────────────── */
(function initPreloader(){
  const loader   = qs('#preloader');
  if(!loader) return;

  const numEl    = qs('#pre-num');
  const fill     = qs('#pre-fill');
  const curTop   = qs('.pre-curtain-top');
  const curBot   = qs('.pre-curtain-bot');
  const preInner = qs('.pre-inner');

  let progress = 0;
  const duration = 4500; // ms — lets the SVG lens-sting animation play through fully
  const start = performance.now();

  function step(now){
    const elapsed = now - start;
    progress = clamp(elapsed/duration, 0, 1);
    // Ease out quart
    const eased = 1 - Math.pow(1-progress, 3);
    const pct = Math.round(eased*100);
    if(numEl)  numEl.textContent = pct;
    if(fill)   fill.style.width  = pct+'%';
    if(progress < 1){ requestAnimationFrame(step); }
    else { reveal(); }
  }

  function reveal(){
    // Fade out inner
    if(preInner) preInner.style.opacity='0';
    setTimeout(()=>{
      if(curTop) curTop.style.transform='translateY(-100%)';
      if(curBot) curBot.style.transform='translateY(100%)';
    }, 150);
    setTimeout(()=>{
      loader.style.pointerEvents='none';
      loader.style.opacity='0';
      // Trigger hero entrance
      document.dispatchEvent(new CustomEvent('preloader:done'));
    }, 900);
    setTimeout(()=>{ loader.style.display='none'; }, 1100);
  }

  requestAnimationFrame(step);
})();

/* ─────────────────────────────────────────
   05. PAGE TRANSITIONS
───────────────────────────────────────── */
(function initPageTransitions(){
  const trans = qs('#page-trans');
  if(!trans) return;

  function leave(href){
    trans.classList.add('active');
    setTimeout(()=>{ window.location.href = href; }, 650);
  }

  qsa('a[href]').forEach(a=>{
    const href = a.getAttribute('href');
    if(!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('http') || a.target==='_blank') return;
    a.addEventListener('click',e=>{
      e.preventDefault();
      leave(href);
    });
  });

  // Enter animation
  trans.classList.add('exit');
  requestAnimationFrame(()=>{
    trans.style.transition='none';
    trans.classList.remove('exit','active');
    trans.offsetHeight; // reflow
    trans.style.transition='';
  });
})();

/* ─────────────────────────────────────────
   06. TEXT SCRAMBLE
───────────────────────────────────────── */
class TextScramble {
  constructor(el){
    this.el = el;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';
    this.frame = null;
  }
  scramble(text, onDone){
    const len = text.length;
    let iter = 0;
    const maxIter = len * 2.5;
    const run = ()=>{
      this.el.textContent = text.split('').map((char,i)=>{
        if(char===' ') return ' ';
        if(i < iter/2.5) return char;
        return this.chars[Math.floor(Math.random()*this.chars.length)];
      }).join('');
      iter++;
      if(iter < maxIter){ this.frame = requestAnimationFrame(run); }
      else { this.el.textContent=text; if(onDone) onDone(); }
    };
    if(this.frame) cancelAnimationFrame(this.frame);
    run();
  }
}
window.TextScramble = TextScramble;

// Auto-init scramble elements
(function(){
  qsa('.scramble').forEach(el=>{
    const original = el.textContent;
    const ts = new TextScramble(el);
    // Observe
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){ ts.scramble(original); obs.unobserve(el); }
      });
    },{threshold:0.5});
    obs.observe(el);
  });
})();

/* ─────────────────────────────────────────
   07. CUSTOM SPLIT TEXT
───────────────────────────────────────── */
function splitText(el, type='lines'){
  const text = el.textContent;
  if(type==='chars'){
    el.innerHTML = text.split('').map(c=>
      c===' '?'<span class="spc"> </span>':'<span class="ch" style="display:inline-block;overflow:hidden;"><span class="ch-inner">'+c+'</span></span>'
    ).join('');
  } else if(type==='words'){
    el.innerHTML = text.split(' ').map(w=>
      '<span class="wd" style="display:inline-block;overflow:hidden;"><span class="wd-inner" style="display:inline-block;">'+w+'</span></span>'
    ).join(' ');
  } else if(type==='lines'){
    // Wrap whole element for clip animation
    const wrapper = document.createElement('div');
    wrapper.style.overflow='hidden';
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
    el.style.display='block';
  }
  return el;
}

/* ─────────────────────────────────────────
   08. CLIP-PATH TEXT REVEAL (premium word-by-word)
───────────────────────────────────────── */
(function initTextReveal(){
  if(typeof gsap==='undefined') return;

  qsa('.text-reveal').forEach(el=>{
    // Split by <br> to preserve inline HTML (spans, etc.) — animate line by line
    const html = el.innerHTML.trim();
    const lines = html.split(/<br\s*\/?>/i);
    el.innerHTML = lines.map(line =>
      `<span class="tr-line" style="display:block;overflow:hidden;line-height:inherit;">
         <span class="tr-line-inner" style="display:block;transform:translateY(105%);">${line}</span>
       </span>`
    ).join('');

    gsap.to(el.querySelectorAll('.tr-line-inner'), {
      y:'0%', duration:0.85, ease:'power3.out', stagger:0.1,
      scrollTrigger:{
        trigger: el,
        start: 'top 88%',
        once: true
      }
    });
  });

  // Letter-by-letter for .text-reveal-chars
  qsa('.text-reveal-chars').forEach(el=>{
    const chars = el.textContent.trim().split('');
    el.innerHTML = chars.map(c=>
      c===' '
      ? '<span style="display:inline-block;width:.3em;"> </span>'
      : `<span class="trc" style="display:inline-block;transform:translateY(120%) rotateX(-90deg);opacity:0;transform-origin:50% 50%;">${c}</span>`
    ).join('');

    gsap.to(el.querySelectorAll('.trc'), {
      y:'0%', rotateX:0, opacity:1,
      duration:0.6, ease:'power2.out', stagger:0.03,
      scrollTrigger:{
        trigger: el,
        start: 'top 85%',
        once: true
      }
    });
  });
})();

/* ─────────────────────────────────────────
   09. APPLE GRADIENT TEXT ON SCROLL
───────────────────────────────────────── */
(function initGradientTextScroll(){
  if(typeof gsap==='undefined') return;

  qsa('.gradient-scroll').forEach(el=>{
    // Wrap each char
    const text = el.textContent;
    el.innerHTML = text.split('').map((c,i)=>
      c===' '
      ? ' '
      : `<span class="gsc" style="display:inline-block;color:var(--muted);transition:none;">${c}</span>`
    ).join('');

    const chars = qsa('.gsc', el);
    const total = chars.length;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1,
      onUpdate(self){
        const p = self.progress;
        const lit = Math.floor(p * total * 1.2);
        chars.forEach((c,i)=>{
          const intensity = clamp((lit-i)/5, 0, 1);
          if(intensity > 0){
            c.style.color = `rgba(241,245,249,${intensity})`;
            c.style.textShadow = intensity>0.8 ? '0 0 20px rgba(124,58,237,0.3)' : 'none';
          } else {
            c.style.color = 'var(--muted)';
            c.style.textShadow = 'none';
          }
        });
      }
    });
  });
})();

/* ─────────────────────────────────────────
   10. MAGNETIC BUTTONS (physical pull effect)
───────────────────────────────────────── */
(function initMagnetic(){
  qsa('.magnetic, .btn-p, .btn-g, .nav-btn, .btn-white').forEach(el=>{
    let tx=0,ty=0, ix=0,iy=0;
    const strength = parseFloat(el.dataset.magnetStrength)||0.35;

    el.addEventListener('mousemove',e=>{
      const r  = el.getBoundingClientRect();
      const cx = r.left + r.width/2;
      const cy = r.top  + r.height/2;
      ix = (e.clientX - cx) * strength;
      iy = (e.clientY - cy) * strength;
    });

    el.addEventListener('mouseleave',()=>{ ix=0; iy=0; });

    (function tick(){
      tx = lerp(tx, ix, 0.12);
      ty = lerp(ty, iy, 0.12);
      el.style.transform = `translate(${tx}px,${ty}px)`;
      requestAnimationFrame(tick);
    })();

    // Inner text also moves (slightly less)
    const inner = el.querySelector('span,em,.inner-text') || el;
    let innerTx=0, innerTy=0;
    el.addEventListener('mousemove',e=>{
      const r  = el.getBoundingClientRect();
      innerTx  = (e.clientX - r.left - r.width/2) * 0.15;
      innerTy  = (e.clientY - r.top  - r.height/2) * 0.15;
    });
    el.addEventListener('mouseleave',()=>{ innerTx=0; innerTy=0; });
  });
})();

/* ─────────────────────────────────────────
   11. 3D CARD TILT + GLARE
───────────────────────────────────────── */
(function initTilt(){
  qsa('[data-tilt], .lab-card, .feat-card, .tcard').forEach(card=>{
    const max = parseFloat(card.dataset.tiltMax)||12;
    const perspective = 1000;

    // Inject glare element
    const glare = document.createElement('div');
    glare.className = 'tilt-glare';
    glare.style.cssText='position:absolute;inset:0;border-radius:inherit;background:radial-gradient(circle at var(--gx,50%) var(--gy,50%),rgba(255,255,255,0.12),transparent 55%);opacity:0;transition:opacity .35s;pointer-events:none;z-index:2;';
    if(getComputedStyle(card).position==='static') card.style.position='relative';
    card.appendChild(glare);

    card.addEventListener('mousemove',e=>{
      const r    = card.getBoundingClientRect();
      const x    = (e.clientX - r.left) / r.width  - 0.5; // -0.5 to 0.5
      const y    = (e.clientY - r.top)  / r.height - 0.5;
      const rx   = -y * max * 2;
      const ry   =  x * max * 2;
      const gx   = (e.clientX - r.left) / r.width * 100;
      const gy   = (e.clientY - r.top)  / r.height* 100;

      card.style.transform     = `perspective(${perspective}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
      card.style.transition    = 'box-shadow .2s';
      card.style.boxShadow     = `0 ${15+Math.abs(rx)}px ${40+Math.abs(ry)*2}px rgba(0,0,0,.35), 0 0 30px rgba(124,58,237,.12)`;
      glare.style.setProperty('--gx', gx+'%');
      glare.style.setProperty('--gy', gy+'%');
      glare.style.opacity = '1';
    });

    card.addEventListener('mouseleave',()=>{
      card.style.transform  = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      card.style.transition = 'transform .55s cubic-bezier(.23,1,.32,1), box-shadow .4s';
      card.style.boxShadow  = '';
      glare.style.opacity   = '0';
    });
  });
})();

/* ─────────────────────────────────────────
   12. HORIZONTAL SCROLL (GSAP pin)
───────────────────────────────────────── */
(function initHorizontalScroll(){
  if(typeof gsap==='undefined' || typeof ScrollTrigger==='undefined') return;

  const section = qs('#horiz-scroll');
  if(!section) return;

  const track = qs('#horiz-track', section);
  if(!track) return;

  const cards = qsa('.h-card', track);
  if(!cards.length) return;

  // Calculate total scroll distance
  function setup(){
    const totalW = track.scrollWidth;
    const viewW  = window.innerWidth;
    const dist   = totalW - viewW + 160;

    gsap.to(track, {
      x: -dist,
      ease: 'none',
      scrollTrigger:{
        trigger: section,
        start: 'top top',
        end: `+=${dist}`,
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate(self){
          const pct = Math.round(self.progress*100);
          const pi  = qs('#horiz-progress');
          if(pi) pi.style.width = pct+'%';
          // Highlight active card
          const activeIdx = Math.floor(self.progress * (cards.length - 0.01));
          cards.forEach((c,i)=>{
            c.classList.toggle('h-card-active', i===activeIdx);
          });
        }
      }
    });
  }

  setup();
  window.addEventListener('resize', ()=>{ ScrollTrigger.refresh(); });
})();

/* ─────────────────────────────────────────
   13. SVG LINE DRAW (process steps)
───────────────────────────────────────── */
(function initSVGDraw(){
  if(typeof gsap==='undefined') return;

  qsa('.svg-draw').forEach(svg=>{
    const paths = svg.querySelectorAll('path,line,polyline');
    paths.forEach(path=>{
      const len = path.getTotalLength ? path.getTotalLength() : 300;
      path.style.strokeDasharray  = len;
      path.style.strokeDashoffset = len;
    });
    gsap.to(paths, {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: 'power2.inOut',
      stagger: 0.2,
      scrollTrigger:{
        trigger: svg,
        start: 'top 80%',
        once: true
      }
    });
  });
})();

/* ─────────────────────────────────────────
   14. STAGGER GRID REVEAL (enhanced)
───────────────────────────────────────── */
(function initStaggerReveal(){
  if(typeof gsap==='undefined') return;

  qsa('.stagger-parent').forEach(parent=>{
    const children = qsa('.stagger-child', parent);
    if(!children.length) return;
    gsap.from(children, {
      y: 50, opacity: 0, scale: 0.95,
      duration: 0.65, ease: 'power2.out',
      stagger: { amount: 0.5, from: 'start' },
      scrollTrigger:{
        trigger: parent,
        start: 'top 85%',
        once: true
      }
    });
  });
})();

/* ─────────────────────────────────────────
   15. MOUSE-TRACK PARALLAX
───────────────────────────────────────── */
(function initMouseParallax(){
  qsa('[data-parallax-mouse]').forEach(el=>{
    const depth = parseFloat(el.dataset.parallaxMouse)||20;
    let tx=0,ty=0;
    window.addEventListener('mousemove',e=>{
      const x = (e.clientX/window.innerWidth  - 0.5) * depth;
      const y = (e.clientY/window.innerHeight - 0.5) * depth;
      tx = lerp(tx, x, 0.05);
      ty = lerp(ty, y, 0.05);
      el.style.transform = `translate(${tx}px,${ty}px)`;
    });
  });

  // Orbs parallax on mouse
  qsa('.orb').forEach((orb,i)=>{
    const d = (i+1)*12;
    let ox=0,oy=0;
    window.addEventListener('mousemove',e=>{
      const tx = (e.clientX/window.innerWidth  - 0.5) * d;
      const ty = (e.clientY/window.innerHeight - 0.5) * d;
      ox = lerp(ox, tx, 0.04);
      oy = lerp(oy, ty, 0.04);
      orb.style.transform = `translate(${ox}px,${oy}px)`;
    });
  });
})();

/* ─────────────────────────────────────────
   16. LETTER-BY-LETTER HERO (on preloader done)
───────────────────────────────────────── */
(function initHeroLetters(){
  if(typeof gsap==='undefined') return;

  const heroTitle = qs('.h-title-animate');
  if(!heroTitle) return;

  function animate(){
    const lines = qsa('.hl', heroTitle);
    lines.forEach((line,li)=>{
      const text = line.textContent;
      line.innerHTML = text.split('').map(c=>
        c===' '
        ? '<span style="display:inline-block;width:.3em;"> </span>'
        : `<span class="hla" style="display:inline-block;opacity:0;transform:translateY(40px) rotate(${(Math.random()-.5)*8}deg);">${c}</span>`
      ).join('');
      gsap.to(line.querySelectorAll('.hla'),{
        opacity:1, y:0, rotation:0,
        duration:.55, ease:'power3.out',
        stagger:.03,
        delay: 0.1 + li*0.15
      });
    });

    // Sub-elements
    gsap.from('.h-sub-animate',{
      opacity:0, y:30, duration:.7, ease:'power2.out', delay:.8
    });
    gsap.from('.h-cta-animate',{
      opacity:0, y:20, duration:.6, ease:'power2.out', delay:1.1
    });
  }

  if(qs('#preloader')){
    document.addEventListener('preloader:done', animate);
  } else {
    setTimeout(animate, 300);
  }
})();

/* ─────────────────────────────────────────
   17. ENHANCED COUNTER with spring easing
───────────────────────────────────────── */
(function initCounters(){
  qsa('[data-count]').forEach(el=>{
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    let started = false;

    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting && !started){
          started = true;
          let start = 0, startT = null;
          const dur = 1800;
          function step(t){
            if(!startT) startT=t;
            const p = clamp((t-startT)/dur, 0, 1);
            // Ease out expo
            const eased = p===1 ? 1 : 1-Math.pow(2,-10*p);
            const val = Math.round(eased*target);
            el.textContent = prefix + val + suffix;
            if(p<1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          obs.unobserve(el);
        }
      });
    },{threshold:0.5});
    obs.observe(el);
  });
})();

/* ─────────────────────────────────────────
   18. ANIMATED NOISE GRAIN (canvas overlay)
───────────────────────────────────────── */
(function initNoise(){
  const canvas = qs('#noise-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w,h,frame=0;

  function resize(){ w=canvas.width=window.innerWidth; h=canvas.height=window.innerHeight; }
  resize(); window.addEventListener('resize',resize,{passive:true});

  function generate(){
    const img = ctx.createImageData(w,h);
    const d   = img.data;
    for(let i=0;i<d.length;i+=4){
      const v = (Math.random()*255)|0;
      d[i]=d[i+1]=d[i+2]=v; d[i+3]=18; // very low alpha
    }
    ctx.putImageData(img,0,0);
  }

  let last=0;
  (function loop(t){
    if(t-last>50){ generate(); last=t; } // 20fps for grain
    requestAnimationFrame(loop);
  })();
})();

/* ─────────────────────────────────────────
   GSAP GLOBAL SCROLL ANIMATIONS
───────────────────────────────────────── */
(function initGSAPScrolls(){
  if(typeof gsap==='undefined' || typeof ScrollTrigger==='undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Section headers slide up
  qsa('.s-title:not(.text-reveal):not(.h-title)').forEach(el=>{
    gsap.from(el,{
      y:50, opacity:0, duration:.8, ease:'power3.out',
      scrollTrigger:{trigger:el, start:'top 88%', once:true}
    });
  });

  // S-sub fade up
  qsa('.s-sub').forEach(el=>{
    gsap.from(el,{
      y:30, opacity:0, duration:.7, ease:'power2.out',
      scrollTrigger:{trigger:el, start:'top 90%', once:true}
    });
  });

  // Cards stagger (only non-tilt)
  qsa('.card-grid-3, .card-grid-2, .card-grid-4, .testi-grid, .pkg-grid, .bc-pkg-grid').forEach(grid=>{
    const cards = qsa(':scope > *', grid);
    gsap.from(cards,{
      y:60, opacity:0, scale:0.94,
      duration:.7, ease:'power2.out',
      stagger:{amount:0.5},
      scrollTrigger:{trigger:grid, start:'top 85%', once:true}
    });
  });

  // Process steps
  qsa('.process-row .p-step, .p-step').forEach((step,i)=>{
    gsap.from(step,{
      x: i%2===0 ? -40:40, opacity:0, duration:.7, ease:'power2.out',
      scrollTrigger:{trigger:step, start:'top 88%', once:true}
    });
  });

  // Stat bar
  qsa('.stat-bar .stat-item, .stats .stat').forEach((el,i)=>{
    gsap.from(el,{
      y:40, opacity:0, duration:.65, ease:'power2.out', delay:i*0.08,
      scrollTrigger:{trigger:el, start:'top 90%', once:true}
    });
  });

  // CTA band
  const cta = qs('.cta-band');
  if(cta){
    gsap.from(cta,{
      scale:0.96, opacity:0, duration:.8, ease:'power2.out',
      scrollTrigger:{trigger:cta, start:'top 85%', once:true}
    });
  }

  // Orb parallax on scroll
  qsa('.orb').forEach((orb,i)=>{
    const dir = i%2===0 ? -1:1;
    gsap.to(orb,{
      yPercent: dir*25,
      ease:'none',
      scrollTrigger:{
        trigger: orb.closest('section')||orb.parentElement,
        start:'top bottom',
        end:'bottom top',
        scrub:2
      }
    });
  });

  // Horizontal marquee speed on scroll
  // (handled in marquee CSS)

  // BLVCKCARD 3D card parallax
  const bc3d = qs('.bc-card');
  if(bc3d){
    gsap.to(bc3d,{
      rotateY:20, rotateX:-5,
      ease:'none',
      scrollTrigger:{
        trigger: bc3d.closest('section')||bc3d.parentElement,
        start:'top bottom',
        end:'bottom top',
        scrub:3
      }
    });
  }

  // Horizontal labs preview (if #labs-h exists)
  const labsH = qs('#labs-preview-h');
  if(labsH){
    const labCards = qsa('.lph-card', labsH);
    gsap.from(labCards,{
      xPercent:30, opacity:0, scale:0.92,
      duration:.8, ease:'power3.out',
      stagger:.1,
      scrollTrigger:{trigger:labsH, start:'top 80%', once:true}
    });
  }
})();

/* ─────────────────────────────────────────
   LINK HOVER UNDERLINE STYLES (CSS injection)
───────────────────────────────────────── */
(function injectLinkStyles(){
  const css=`
    .nav-links a{position:relative;}
    .nav-links a::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:1.5px;background:var(--cyan);transition:width .35s cubic-bezier(.23,1,.32,1);}
    .nav-links a:hover::after,.nav-links a.active::after{width:100%;}
    .f-col ul li a{position:relative;display:inline-block;}
    .f-col ul li a::after{content:'';position:absolute;bottom:-1px;left:0;width:0;height:1px;background:var(--text);transition:width .3s ease;}
    .f-col ul li a:hover::after{width:100%;}
  `;
  const s=document.createElement('style');
  s.textContent=css;
  document.head.appendChild(s);
})();

/* ─────────────────────────────────────────
   SCROLL-TRIGGERED LINE (process connector)
───────────────────────────────────────── */
(function initProcessLine(){
  const pRow = qs('.process-row');
  if(!pRow || typeof gsap==='undefined') return;

  // Create connecting SVG line
  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('class','process-line-svg svg-draw');
  svg.style.cssText='position:absolute;top:50%;left:0;right:0;height:2px;pointer-events:none;overflow:visible;';
  svg.innerHTML='<line x1="0" y1="0" x2="100%" y2="0" stroke="url(#pl-grad)" stroke-width="1.5" stroke-dasharray="6 4"/><defs><linearGradient id="pl-grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#06b6d4"/></linearGradient></defs>';

  if(getComputedStyle(pRow).position==='static') pRow.style.position='relative';
  pRow.appendChild(svg);

  // Trigger SVG draw
  if(typeof ScrollTrigger!=='undefined'){
    const line = svg.querySelector('line');
    const len  = 2000;
    line.style.strokeDasharray  = `${len} 0`;
    line.style.strokeDashoffset = len;
    gsap.to(line,{
      strokeDashoffset:0,
      ease:'none',
      scrollTrigger:{
        trigger: pRow,
        start:'top 75%',
        end:'top 30%',
        scrub:1
      }
    });
  }
})();

/* ─────────────────────────────────────────
   MARQUEE — pure JS smooth scroll
   (replaces CSS animation to eliminate retime/direction-flip glitch)
───────────────────────────────────────── */
(function initMarqueeEnhanced(){
  const rows = qsa('.m-track');
  if (!rows.length) return;

  const states = rows.map(r => {
    // Cancel any inherited CSS animation — JS drives everything
    r.style.animation = 'none';
    r.style.willChange = 'transform';
    r.style.transform = 'translate3d(0,0,0)';
    return {
      el: r,
      originals: [...r.children],
      offset: 0,
      speed: 70,        // base px/sec (left-bound)
      unitWidth: 0
    };
  });

  // Auto-clone children so total width >= 2.2x viewport — guarantees no gap at loop
  function rebuild() {
    const targetWidth = window.innerWidth * 2.2;
    states.forEach(s => {
      // Strip prior clones
      while (s.el.children.length > s.originals.length) {
        s.el.removeChild(s.el.lastElementChild);
      }
      // Measure one full unit width (sum of originals + gaps)
      let unitWidth = 0;
      s.originals.forEach(c => { unitWidth += c.offsetWidth; });
      const gapVal = parseFloat(getComputedStyle(s.el).gap || '0') || 0;
      if (s.originals.length > 1) unitWidth += gapVal * s.originals.length;
      s.unitWidth = unitWidth || 1;

      // Append clones until total span is wide enough
      let totalWidth = unitWidth;
      let safety = 14;
      while (totalWidth < targetWidth && safety-- > 0) {
        s.originals.forEach(c => {
          const clone = c.cloneNode(true);
          clone.setAttribute('aria-hidden', 'true');
          s.el.appendChild(clone);
        });
        totalWidth += unitWidth;
      }
      s.offset = 0;
      s.el.style.transform = 'translate3d(0,0,0)';
    });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(rebuild);
  else setTimeout(rebuild, 120);
  rebuild();

  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(rebuild, 200);
  }, { passive: true });

  // Scroll velocity boost — ADDITIVE px/sec, smooth decay, never retimes anything
  let scrollBoost = 0;
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const dy = window.scrollY - lastY;
    lastY = window.scrollY;
    // |dy| boosts speed regardless of scroll direction (no flips)
    scrollBoost = Math.min(200, scrollBoost + Math.abs(dy) * 0.5);
  }, { passive: true });

  // Pause on hover (JS replaces the CSS :hover rule we just disabled)
  const paused = new WeakSet();
  states.forEach(s => {
    s.el.addEventListener('mouseenter', () => paused.add(s.el));
    s.el.addEventListener('mouseleave', () => paused.delete(s.el));
  });

  let lastT = performance.now();
  (function tick(now) {
    const dt = Math.min((now - lastT) / 1000, 0.05);
    lastT = now;
    scrollBoost = lerp(scrollBoost, 0, 0.06);

    states.forEach(s => {
      if (!s.unitWidth || paused.has(s.el)) return;
      const v = (s.speed + scrollBoost) * dt;
      s.offset -= v;
      if (s.offset <= -s.unitWidth) s.offset += s.unitWidth;
      s.el.style.transform = `translate3d(${s.offset}px, 0, 0)`;
    });
    requestAnimationFrame(tick);
  })(lastT);
})();

/* ─────────────────────────────────────────
   HOVER TEXT GLITCH (on .glitch class)
───────────────────────────────────────── */
(function initGlitch(){
  qsa('.glitch').forEach(el=>{
    const original = el.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
    let frame=null, active=false;

    el.addEventListener('mouseenter',()=>{
      active=true; let i=0;
      (function scramble(){
        if(!active) return;
        el.textContent = original.split('').map((c,j)=>{
          if(j<i || c===' ') return c;
          return chars[Math.floor(Math.random()*chars.length)];
        }).join('');
        i+=0.4;
        if(i < original.length){ frame=requestAnimationFrame(scramble); }
        else el.textContent=original;
      })();
    });
    el.addEventListener('mouseleave',()=>{
      active=false;
      if(frame) cancelAnimationFrame(frame);
      el.textContent=original;
    });
  });
})();

/* ─────────────────────────────────────────
   SECTION ENTRANCE — clip-path reveal
───────────────────────────────────────── */
(function initClipReveal(){
  if(typeof gsap==='undefined') return;

  qsa('.clip-reveal').forEach(el=>{
    gsap.from(el,{
      clipPath:'inset(0 100% 0 0)',
      duration:1.2, ease:'power3.inOut',
      scrollTrigger:{trigger:el, start:'top 80%', once:true}
    });
  });

  // Scale reveal for images/visuals
  qsa('.scale-reveal').forEach(el=>{
    gsap.from(el,{
      scale:1.2, opacity:0, duration:1.1, ease:'power2.out',
      scrollTrigger:{trigger:el, start:'top 85%', once:true}
    });
  });
})();

/* ─────────────────────────────────────────
   TYPING CURSOR (for subtitle elements)
───────────────────────────────────────── */
(function initTypingCursor(){
  qsa('.typing-cursor').forEach(el=>{
    const phrases = JSON.parse(el.dataset.phrases||'[]');
    if(!phrases.length) return;
    let pi=0, ci=0, deleting=false;

    el.style.borderRight='2px solid var(--cyan)';
    el.style.paddingRight='2px';

    function type(){
      const phrase = phrases[pi];
      if(!deleting){
        el.textContent = phrase.slice(0,++ci);
        if(ci===phrase.length){ deleting=true; setTimeout(type,2000); }
        else setTimeout(type,80);
      } else {
        el.textContent = phrase.slice(0,--ci);
        if(ci===0){ deleting=false; pi=(pi+1)%phrases.length; setTimeout(type,500); }
        else setTimeout(type,45);
      }
    }
    type();
  });
})();

/* ─────────────────────────────────────────
   INIT CALL
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded',()=>{
  // Refresh ScrollTrigger after fonts load
  if(typeof ScrollTrigger!=='undefined'){
    document.fonts?.ready?.then(()=>ScrollTrigger.refresh());
  }
  // Re-run cursor hover on dynamically added elements
  document.querySelectorAll('a,button,.card,.lab-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('cbig'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('cbig'));
  });
});
