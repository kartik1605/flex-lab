/*!
 * FLex LAB — Premium Interaction Layer
 * Synthesised from: thestacksmiths.com, flow.party, blvckcard.com
 * =====================================================
 *  01. Cursor Spotlight (illuminates content)
 *  02. Section Counter (right-side pill)
 *  03. Floating Dock Navigation
 *  04. Confetti Burst on CTA Click
 *  05. Lab Card Stack Focus
 *  06. Section Curtain Reveal
 *  07. Nav Hide-on-Scroll-Down
 *  08. Big Type Statement (hover reveals giant text)
 *  09. Section Color Tint
 *  10. Scroll-velocity Skew
 *  11. Mouse-follow Image Peek
 *  12. Premium Smooth-scroll Anchors
 *  13. Console Brand Stamp
 * =====================================================
 */

(function() {
  'use strict';

  // ── Utils ──
  const qs  = (s, c = document) => c.querySelector(s);
  const qsa = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, mn, mx) => Math.max(mn, Math.min(mx, v));
  const lerp  = (a, b, t) => a + (b - a) * t;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch      = window.matchMedia('(hover: none)').matches || ('ontouchstart' in window);
  const isMobile     = window.innerWidth < 700;

  /* ─────────────────────────────────────────
     01. CURSOR SPOTLIGHT
  ───────────────────────────────────────── */
  function initSpotlight() {
    if (reduceMotion || isTouch || isMobile) return;
    const sp = document.createElement('div');
    sp.id = 'cursor-spotlight';
    document.body.appendChild(sp);
    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let cx = tx, cy = ty;
    document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    document.addEventListener('mouseleave', () => { document.body.classList.add('spotlight-hidden'); });
    document.addEventListener('mouseenter', () => { document.body.classList.remove('spotlight-hidden'); });
    (function tick() {
      cx = lerp(cx, tx, 0.12);
      cy = lerp(cy, ty, 0.12);
      sp.style.transform = `translate(${cx - 126}px, ${cy - 126}px)`;
      requestAnimationFrame(tick);
    })();
  }

  /* ─────────────────────────────────────────
     02. SECTION COUNTER (right side)
  ───────────────────────────────────────── */
  function initSectionCounter() {
    const sections = qsa('section, .stat-bar, .marquee-wrap, .cta-band, footer.footer')
      .filter(s => s.offsetHeight > 120);
    if (sections.length < 3) return;

    const counter = document.createElement('div');
    counter.id = 'section-counter';
    counter.innerHTML = `
      <span class="sc-cur">01</span>
      <span class="sc-sep">/</span>
      <span class="sc-total">${String(sections.length).padStart(2, '0')}</span>
      <div class="sc-bar"><div class="sc-bar-fill"></div></div>
    `;
    document.body.appendChild(counter);

    const curEl  = counter.querySelector('.sc-cur');
    const barEl  = counter.querySelector('.sc-bar-fill');

    let currentIdx = 0;
    function update() {
      const vh = window.innerHeight;
      const scrollY = window.scrollY + vh * 0.4;
      let idx = 0;
      sections.forEach((s, i) => {
        const top = s.offsetTop;
        if (scrollY >= top) idx = i;
      });
      if (idx !== currentIdx) {
        currentIdx = idx;
        curEl.textContent = String(idx + 1).padStart(2, '0');
        const pct = ((idx + 1) / sections.length) * 100;
        barEl.style.width = pct + '%';
      }
    }
    window.addEventListener('scroll', update, { passive: true });
    setTimeout(() => { counter.classList.add('visible'); }, 1000);
    update();
  }

  /* ─────────────────────────────────────────
     03. FLOATING DOCK NAVIGATION
  ───────────────────────────────────────── */
  function initFloatingDock() {
    const dock = document.createElement('div');
    dock.id = 'floating-dock';
    dock.innerHTML = `
      <a href="index.html"     data-tooltip="Home"     aria-label="Home">⌂</a>
      <a href="branding.html"  data-tooltip="Branding" aria-label="Branding">◈</a>
      <a href="events.html"    data-tooltip="Events"   aria-label="Events">✦</a>
      <a href="blvckcard.html" data-tooltip="BLVCKCARD" aria-label="BLVCKCARD">⬛</a>
      <a href="print.html"     data-tooltip="Print Lab" aria-label="Print Lab">⎙</a>
      <span class="dock-sep"></span>
      <a href="contact.html"   data-tooltip="Contact"  aria-label="Contact" style="background:linear-gradient(135deg,rgba(109,40,217,.35),rgba(212,175,55,.22));color:#fff;">✉</a>
      <button id="dock-top" data-tooltip="Top" aria-label="Scroll to top">↑</button>
    `;
    document.body.appendChild(dock);

    qs('#dock-top').addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Mark active
    const path = location.pathname.split('/').pop() || 'index.html';
    qsa('a', dock).forEach(a => {
      if (a.getAttribute('href') === path) a.classList.add('active');
    });

    // Show after scroll threshold
    let lastY = 0, accumDown = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > 500) {
        dock.classList.add('visible');
      } else {
        dock.classList.remove('visible');
      }
      lastY = y;
    }, { passive: true });
  }

  /* ─────────────────────────────────────────
     04. CONFETTI BURST + RIPPLE on CTA CLICK
  ───────────────────────────────────────── */
  function burstConfetti(x, y) {
    if (reduceMotion) return;
    // Vibrant Indian-festival palette — hot pink, marigold, electric cyan, lime, royal violet, gold, white
    const colors  = ['#ff2d8f', '#ffa600', '#00d4ff', '#c1ff00', '#a855f7', '#ffd60a', '#ffffff', '#ff5722'];
    const shapes  = ['', 'shape-circle', 'shape-triangle'];
    const count   = 32;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-particle ' + shapes[i % shapes.length];
      const c = colors[Math.floor(Math.random() * colors.length)];
      if (!p.className.includes('shape-triangle')) p.style.background = c;
      else p.style.borderBottom = `8px solid ${c}`;
      p.style.left = (x - 4) + 'px';
      p.style.top  = (y - 4) + 'px';
      document.body.appendChild(p);

      const angle    = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.4;
      const velocity = 80 + Math.random() * 220;
      const dx       = Math.cos(angle) * velocity;
      const dy       = Math.sin(angle) * velocity;
      const gravity  = 250 + Math.random() * 150;
      const rot      = (Math.random() - 0.5) * 720;
      const dur      = 900 + Math.random() * 600;

      p.animate([
        { transform: 'translate(0,0) rotate(0deg) scale(1)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy + gravity}px) rotate(${rot}deg) scale(0.4)`, opacity: 0 }
      ], {
        duration: dur,
        easing: 'cubic-bezier(.18,.7,.42,1)'
      }).onfinish = () => p.remove();
    }
  }

  function clickRipple(x, y, color = 'rgba(124,58,237,0.5)') {
    if (reduceMotion) return;
    const r = document.createElement('div');
    r.className = 'click-ripple';
    r.style.borderColor = color;
    r.style.left = (x - 10) + 'px';
    r.style.top  = (y - 10) + 'px';
    r.style.width = '20px';
    r.style.height = '20px';
    document.body.appendChild(r);
    r.animate([
      { transform: 'scale(1)', opacity: 0.8 },
      { transform: 'scale(8)', opacity: 0 }
    ], { duration: 700, easing: 'cubic-bezier(.16,1,.3,1)' }).onfinish = () => r.remove();
  }

  function initCTAClick() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('.btn-p, .submit-btn');
      if (btn) {
        burstConfetti(e.clientX, e.clientY);
        clickRipple(e.clientX, e.clientY);
      } else if (e.target.closest('.btn-g, .nav-btn')) {
        clickRipple(e.clientX, e.clientY, 'rgba(212,175,55,0.5)');
      }
    });
  }

  /* ─────────────────────────────────────────
     05. LAB CARD STACK FOCUS
  ───────────────────────────────────────── */
  function initLabStackFocus() {
    if (isTouch) return;
    const grid = qs('.labs-grid');
    if (!grid) return;
    grid.addEventListener('mouseenter', () => grid.classList.add('has-hover'));
    grid.addEventListener('mouseleave', () => grid.classList.remove('has-hover'));
  }

  /* ─────────────────────────────────────────
     06. SECTION CURTAIN REVEAL
  ───────────────────────────────────────── */
  function initSectionCurtain() {
    if (reduceMotion) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('curtain-up');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    qsa('[data-curtain]').forEach(s => obs.observe(s));
  }

  /* ─────────────────────────────────────────
     07. NAV HIDE on SCROLL DOWN, SHOW on UP
  ───────────────────────────────────────── */
  function initNavScroll() {
    const nav = qs('#nav');
    if (!nav) return;
    let lastY = 0, hideTimer = null;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      const diff = y - lastY;
      if (y > 100) {
        nav.classList.add('nav-condensed');
        if (diff > 8 && y > 300) {
          nav.classList.add('nav-hidden');
        } else if (diff < -4) {
          nav.classList.remove('nav-hidden');
        }
      } else {
        nav.classList.remove('nav-condensed', 'nav-hidden');
      }
      lastY = y;
    }, { passive: true });
  }

  /* ─────────────────────────────────────────
     08. BIG TYPE STATEMENT (cursor-following huge text)
  ───────────────────────────────────────── */
  function initBigStatement() {
    if (isTouch || isMobile) return;
    const triggers = qsa('[data-big-statement]');
    if (!triggers.length) return;
    const el = document.createElement('div');
    el.className = 'big-statement';
    document.body.appendChild(el);
    triggers.forEach(t => {
      t.addEventListener('mouseenter', () => {
        el.textContent = t.dataset.bigStatement || '';
        el.classList.add('visible');
      });
      t.addEventListener('mousemove', e => {
        el.style.left = e.clientX + 'px';
        el.style.top  = e.clientY + 'px';
      });
      t.addEventListener('mouseleave', () => {
        el.classList.remove('visible');
      });
    });
  }

  /* ─────────────────────────────────────────
     09. SECTION COLOR TINT
  ───────────────────────────────────────── */
  function initSectionTint() {
    const tinted = qsa('[data-tint]');
    if (!tinted.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && e.intersectionRatio > 0.35) {
          document.documentElement.style.setProperty('--theme-tint', e.target.dataset.tint);
        }
      });
    }, { threshold: [0.35, 0.7] });
    tinted.forEach(s => obs.observe(s));
  }

  /* ─────────────────────────────────────────
     10. SCROLL-VELOCITY SKEW
  ───────────────────────────────────────── */
  function initScrollSkew() {
    if (reduceMotion) return;
    const targets = qsa('[data-skew]');
    if (!targets.length) return;
    let lastY = window.scrollY, vel = 0, target = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      target = clamp((y - lastY) * 0.3, -8, 8);
      lastY = y;
    }, { passive: true });
    (function tick() {
      vel = lerp(vel, target, 0.1);
      target = lerp(target, 0, 0.08);
      targets.forEach(t => {
        const amp = parseFloat(t.dataset.skew) || 1;
        t.style.transform = `skewY(${vel * amp}deg)`;
      });
      requestAnimationFrame(tick);
    })();
  }

  /* ─────────────────────────────────────────
     11. MOUSE-FOLLOW IMAGE PEEK
  ───────────────────────────────────────── */
  function initImagePeek() {
    if (isTouch || isMobile) return;
    const triggers = qsa('[data-peek]');
    if (!triggers.length) return;
    const peek = document.createElement('div');
    peek.className = 'peek-img';
    document.body.appendChild(peek);
    let tx = 0, ty = 0, cx = 0, cy = 0, active = false;
    triggers.forEach(t => {
      t.addEventListener('mouseenter', () => {
        const data = t.dataset.peek;
        const grad = t.dataset.peekGrad || 'linear-gradient(135deg,#7c3aed,#06b6d4)';
        peek.style.background = grad;
        peek.textContent = data;
        peek.classList.add('visible');
        active = true;
      });
      t.addEventListener('mousemove', e => { tx = e.clientX + 30; ty = e.clientY - 100; });
      t.addEventListener('mouseleave', () => {
        peek.classList.remove('visible');
        active = false;
      });
    });
    (function tick() {
      if (active) {
        cx = lerp(cx, tx, 0.18);
        cy = lerp(cy, ty, 0.18);
        peek.style.left = (cx - 110) + 'px';
        peek.style.top  = (cy - 140) + 'px';
      }
      requestAnimationFrame(tick);
    })();
  }

  /* ─────────────────────────────────────────
     12. SMOOTH-SCROLL ANCHOR LINKS
  ───────────────────────────────────────── */
  function initSmoothScroll() {
    qsa('a[href^="#"]').forEach(a => {
      const href = a.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      a.addEventListener('click', e => {
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ─────────────────────────────────────────
     12b. GIANT WATERMARK SCROLL PARALLAX (hencubed)
  ───────────────────────────────────────── */
  function initGiantMarks() {
    if (reduceMotion) return;
    const marks = qsa('.giant-mark.scroll-shift');
    if (!marks.length) return;
    function update() {
      marks.forEach(m => {
        const r = m.getBoundingClientRect();
        const vh = window.innerHeight;
        const center = r.top + r.height / 2;
        const offset = (center - vh / 2) / vh;
        const speed = parseFloat(m.dataset.speed) || 30;
        m.style.transform = `translateX(${offset * speed}px)`;
      });
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ─────────────────────────────────────────
     12c. MARQUEE BAND — pure JS smooth scroll
     (auto-duplicates content; no CSS retime stutter)
  ───────────────────────────────────────── */
  function initMarqueeBand() {
    const rows = qsa('.marquee-band .mb-row');
    if (!rows.length) return;

    const states = rows.map(r => {
      // Cancel any CSS animation — JS drives everything
      r.style.animation = 'none';
      r.style.willChange = 'transform';
      r.style.transform = 'translate3d(0,0,0)';

      // Snapshot the ORIGINAL children before cloning
      const originals = [...r.children];

      const reverse = r.classList.contains('reverse');
      const speed = reverse ? 55 : 70;

      return {
        el: r,
        originals,
        offset: 0,
        speed,
        reverse,
        unitWidth: 0
      };
    });

    // Auto-clone until row content is at least 2× viewport, then keep wrap unit consistent
    function rebuild() {
      const targetWidth = window.innerWidth * 2.2;
      states.forEach(s => {
        // Remove any prior clones (keep originals)
        while (s.el.children.length > s.originals.length) {
          s.el.removeChild(s.el.lastElementChild);
        }
        // Measure ONE unit (original content set) width
        let unitWidth = 0;
        s.originals.forEach(c => { unitWidth += c.offsetWidth; });
        s.unitWidth = unitWidth || 1;

        // Append clones of the originals until total width > target
        let totalWidth = unitWidth;
        let safety = 12;
        while (totalWidth < targetWidth && safety-- > 0) {
          s.originals.forEach(c => {
            const clone = c.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            s.el.appendChild(clone);
          });
          totalWidth += unitWidth;
        }
        // Reset offset on rebuild to avoid jumps
        s.offset = 0;
        s.el.style.transform = 'translate3d(0,0,0)';
      });
    }

    // Wait for fonts so width measurement is accurate
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(rebuild);
    } else {
      setTimeout(rebuild, 100);
    }
    rebuild();

    // Debounced rebuild on resize
    let resizeT;
    window.addEventListener('resize', () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(rebuild, 200);
    }, { passive: true });

    // Scroll velocity boost — additive, smooth, never retimes the loop
    let scrollBoost = 0;
    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      scrollBoost = clamp(scrollBoost + Math.abs(dy) * 0.6, 0, 180);
    }, { passive: true });

    let lastT = performance.now();
    (function tick(now) {
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;
      scrollBoost = lerp(scrollBoost, 0, 0.06);

      states.forEach(s => {
        if (!s.unitWidth) return;
        const v = (s.speed + scrollBoost) * dt;
        s.offset += s.reverse ? v : -v;
        // Wrap at exactly one unit width — seamless because next unit is identical
        if (s.offset <= -s.unitWidth) s.offset += s.unitWidth;
        if (s.offset >=  s.unitWidth) s.offset -= s.unitWidth;
        s.el.style.transform = `translate3d(${s.offset}px, 0, 0)`;
      });
      requestAnimationFrame(tick);
    })(lastT);
  }

  /* ─────────────────────────────────────────
     12ca. BENEFITS CARD CURSOR GLOW (smooth lerp)
     — Soft champagne/bronze halo follows cursor inside each card
  ───────────────────────────────────────── */
  function initBenefitGlow() {
    if (reduceMotion || isTouch) return;
    const cards = qsa('.benefit-card');
    if (!cards.length) return;

    cards.forEach(card => {
      let tx = 50, ty = 50;
      let cx = 50, cy = 50;
      let active = false;
      let rafId = null;

      function tick() {
        cx = lerp(cx, tx, 0.16);
        cy = lerp(cy, ty, 0.16);
        card.style.setProperty('--mx', cx.toFixed(2) + '%');
        card.style.setProperty('--my', cy.toFixed(2) + '%');
        if (active) {
          rafId = requestAnimationFrame(tick);
        } else if (Math.abs(cx - tx) > 0.2 || Math.abs(cy - ty) > 0.2) {
          // Continue a bit after mouse leaves for trailing-off feel
          rafId = requestAnimationFrame(tick);
        } else {
          rafId = null;
        }
      }

      card.addEventListener('mouseenter', e => {
        const r = card.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width) * 100;
        ty = ((e.clientY - r.top)  / r.height) * 100;
        active = true;
        if (!rafId) rafId = requestAnimationFrame(tick);
      });

      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width) * 100;
        ty = ((e.clientY - r.top)  / r.height) * 100;
      });

      card.addEventListener('mouseleave', () => {
        active = false;
        // tick() will continue until the lerp settles, then stop
      });
    });
  }

  /* ─────────────────────────────────────────
     12cb. BENEFITS STICKY-SCROLL (hencubed-style)
     — tracks active card, drives progress bar
  ───────────────────────────────────────── */
  function initBenefits() {
    const section = qs('#benefits');
    if (!section) return;
    const cards   = qsa('.benefit-card', section);
    if (!cards.length) return;
    const fill    = qs('.bs-progress-fill', section);
    const curLbl  = qs('.bsp-cur', section);
    const totLbl  = qs('.bsp-tot', section);
    if (totLbl) totLbl.textContent = String(cards.length).padStart(2, '0');

    let lastActive = -1;
    let revealedSet = new Set();

    // First-time reveal observer (slide up + fade in)
    // Add pre-reveal class to all cards initially, then remove via observer
    cards.forEach(c => c.classList.add('pre-reveal'));
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.remove('pre-reveal');
          e.target.classList.add('in-view');
          revealedSet.add(e.target);
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    cards.forEach(c => revealObs.observe(c));
    // Safety: reveal all after 3s no matter what
    setTimeout(() => {
      cards.forEach(c => {
        c.classList.remove('pre-reveal');
        c.classList.add('in-view');
      });
    }, 3000);

    // Continuous active-card tracker + progress
    function update() {
      const vh = window.innerHeight;
      // Find which card is closest to the focal line (40% of viewport)
      const focal = vh * 0.4;
      let activeIdx = 0;
      let minDist = Infinity;
      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const dist = Math.abs(center - focal);
        if (dist < minDist) {
          minDist = dist;
          activeIdx = i;
        }
      });
      // Only switch when the focal card is reasonably in view
      const firstR = cards[0].getBoundingClientRect();
      const lastR  = cards[cards.length - 1].getBoundingClientRect();
      const inRange = firstR.top < vh && lastR.bottom > 0;

      if (inRange && activeIdx !== lastActive) {
        cards.forEach((c, i) => c.classList.toggle('active', i === activeIdx));
        if (curLbl) curLbl.textContent = String(activeIdx + 1).padStart(2, '0');
        lastActive = activeIdx;
      } else if (!inRange) {
        cards.forEach(c => c.classList.remove('active'));
        lastActive = -1;
      }

      // Progress bar fill: 0% before first card center, 100% at last card center
      if (fill) {
        const firstCenter = cards[0].getBoundingClientRect().top + cards[0].offsetHeight / 2;
        const lastCenter  = cards[cards.length - 1].getBoundingClientRect().top + cards[cards.length - 1].offsetHeight / 2;
        const span = (lastCenter - firstCenter) || 1;
        const traveled = focal - firstCenter;
        const pct = clamp((traveled / span) * 100, 0, 100);
        fill.style.width = pct + '%';
      }
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  /* ─────────────────────────────────────────
     12cc. LIQUID GLASS TEXT — no-op
     Text has no hover effect; cursor interaction is
     handled entirely by the hero liquid blob layer.
  ───────────────────────────────────────── */
  function initLiquidText() { /* intentionally empty */ }

  /* ─────────────────────────────────────────
     12d. LIQUID CURSOR (hero — goo-filter blobs)
  ───────────────────────────────────────── */
  function initLiquidHero() {
    if (reduceMotion || isTouch || isMobile) return;
    const hero = qs('#hero');
    if (!hero) return;

    // Inject SVG goo filter once
    if (!qs('#liquid-filter')) {
      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg');
      svg.id = 'liquid-filter';
      svg.setAttribute('width', '0');
      svg.setAttribute('height', '0');
      svg.style.cssText = 'position:absolute;width:0;height:0;pointer-events:none;';
      svg.innerHTML = `
        <defs>
          <filter id="liquid-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="22" result="blur"/>
            <feColorMatrix in="blur" type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 22 -11" result="goo"/>
            <feBlend in="SourceGraphic" in2="goo"/>
          </filter>
        </defs>`;
      document.body.appendChild(svg);
    }

    hero.style.position = 'relative';
    hero.style.overflow = 'hidden';

    const goo = document.createElement('div');
    goo.className = 'hero-liquid';
    for (let i = 1; i <= 4; i++) {
      const blob = document.createElement('div');
      blob.className = `liquid-blob lb-${i}`;
      goo.appendChild(blob);
    }
    hero.insertBefore(goo, hero.firstChild);

    const blobs = qsa('.liquid-blob', goo);
    const speeds = [0.13, 0.08, 0.05, 0.10];
    const positions = blobs.map(() => ({ x: hero.offsetWidth / 2, y: hero.offsetHeight / 2 }));
    let mx = hero.offsetWidth / 2;
    let my = hero.offsetHeight / 2;
    let isHovering = false;
    let t = 0;

    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
      isHovering = true;
    });
    hero.addEventListener('mouseleave', () => { isHovering = false; });

    (function tick() {
      t += 0.005;
      if (!isHovering) {
        // Ambient figure-8 motion
        const cx = hero.offsetWidth / 2;
        const cy = hero.offsetHeight / 2;
        mx = cx + Math.cos(t) * hero.offsetWidth * 0.22;
        my = cy + Math.sin(t * 0.65) * hero.offsetHeight * 0.18;
      }
      speeds.forEach((sp, i) => {
        positions[i].x += (mx - positions[i].x) * sp;
        positions[i].y += (my - positions[i].y) * sp;
        const wobbleX = Math.cos(t * (i + 1) * 0.6) * 22;
        const wobbleY = Math.sin(t * (i + 1) * 0.55) * 22;
        // Half-widths matching the new -30% smaller blobs
        const sizes = [126, 105, 77, 91];
        blobs[i].style.transform =
          `translate(${positions[i].x + wobbleX - sizes[i]}px, ${positions[i].y + wobbleY - sizes[i]}px)`;
      });
      requestAnimationFrame(tick);
    })();
  }

  /* ─────────────────────────────────────────
     12e. THEME PANEL (Stack Smiths-style palette switcher)
  ───────────────────────────────────────── */
  // Mix of premium dark and vibrant celebratory palettes
  const THEMES = {
    flexlab: {
      name: 'FlexLab',
      desc: 'Deep Purple · Gold',
      swatch: 'linear-gradient(135deg,#06040d 0%,#6d28d9 50%,#d4af37 100%)',
      vars: {
        '--violet': '#6d28d9',  // deep royal violet (brand)
        '--cyan':   '#d4af37',  // classic gold accent
        '--rose':   '#a78bfa',  // soft lavender
        '--th-blob-1': '#6d28d9',
        '--th-blob-2': '#d4af37',
        '--th-blob-3': '#a78bfa',
        '--th-blob-4': '#9333ea'
      }
    },
    carnival: {
      name: 'Carnival',
      desc: 'Magenta · Marigold',
      swatch: 'linear-gradient(135deg,#ff2d8f 0%,#ffa600 50%,#00d4ff 100%)',
      vars: {
        '--violet': '#ff2d8f',  // hot pink
        '--cyan':   '#ffa600',  // marigold
        '--rose':   '#7c3aed',  // royal violet
        '--th-blob-1': '#ff2d8f',
        '--th-blob-2': '#00d4ff',
        '--th-blob-3': '#ffa600',
        '--th-blob-4': '#7c3aed'
      }
    },
    solar: {
      name: 'Solar',
      desc: 'Saffron · Sunset',
      swatch: 'linear-gradient(135deg,#ff6a00 0%,#ff2d6b 50%,#ffd60a 100%)',
      vars: {
        '--violet': '#ff6a00',  // saffron
        '--cyan':   '#ffd60a',  // gold yellow
        '--rose':   '#ff2d6b',  // hot rose
        '--th-blob-1': '#ff6a00',
        '--th-blob-2': '#ffd60a',
        '--th-blob-3': '#ff2d6b',
        '--th-blob-4': '#ff9500'
      }
    },
    volt: {
      name: 'Volt',
      desc: 'Neon · Electric',
      swatch: 'linear-gradient(135deg,#7c3aed 0%,#06d6ff 45%,#c1ff00 100%)',
      vars: {
        '--violet': '#a855f7',  // electric purple
        '--cyan':   '#06d6ff',  // neon cyan
        '--rose':   '#c1ff00',  // electric lime
        '--th-blob-1': '#a855f7',
        '--th-blob-2': '#06d6ff',
        '--th-blob-3': '#c1ff00',
        '--th-blob-4': '#ec4899'
      }
    },
    obsidian: {
      name: 'Obsidian',
      desc: 'Champagne · Bronze',
      swatch: 'linear-gradient(135deg,#1a1612 0%,#8b7355 45%,#b8a47e 100%)',
      vars: {
        '--violet': '#b8a47e',  // champagne
        '--cyan':   '#8b7355',  // antique bronze
        '--rose':   '#6e5a3e',  // deep cocoa
        '--th-blob-1': '#b8a47e',
        '--th-blob-2': '#8b7355',
        '--th-blob-3': '#5c4530',
        '--th-blob-4': '#a08056'
      }
    },
    midnight: {
      name: 'Midnight',
      desc: 'Steel · Silver',
      swatch: 'linear-gradient(135deg,#0a0e18 0%,#6378a0 45%,#c8d0e0 100%)',
      vars: {
        '--violet': '#7e90b0',  // steel blue
        '--cyan':   '#a8b4c8',  // silver mist
        '--rose':   '#5a6e8e',  // dusk
        '--th-blob-1': '#7e90b0',
        '--th-blob-2': '#4a5670',
        '--th-blob-3': '#a8b4c8',
        '--th-blob-4': '#5a6e8e'
      }
    },
    burgundy: {
      name: 'Burgundy',
      desc: 'Wine · Antique',
      swatch: 'linear-gradient(135deg,#1a0e0e 0%,#7a2e2e 45%,#a89060 100%)',
      vars: {
        '--violet': '#8e3838',  // oxblood
        '--cyan':   '#b89668',  // antique gold
        '--rose':   '#5e2424',  // deep wine
        '--th-blob-1': '#8e3838',
        '--th-blob-2': '#b89668',
        '--th-blob-3': '#5e2424',
        '--th-blob-4': '#8a6840'
      }
    },
    pine: {
      name: 'Pine',
      desc: 'Forest · Warm',
      swatch: 'linear-gradient(135deg,#0e1814 0%,#3e5c4f 45%,#c9a87c 100%)',
      vars: {
        '--violet': '#4d6e60',  // pine
        '--cyan':   '#c9a87c',  // warm tan
        '--rose':   '#5a7a6a',  // jade
        '--th-blob-1': '#4d6e60',
        '--th-blob-2': '#c9a87c',
        '--th-blob-3': '#2a3d34',
        '--th-blob-4': '#8a6b4a'
      }
    },
    pewter: {
      name: 'Pewter',
      desc: 'Stone · Platinum',
      swatch: 'linear-gradient(135deg,#0e1014 0%,#5e6671 45%,#b8bcc4 100%)',
      vars: {
        '--violet': '#7e8794',  // pewter
        '--cyan':   '#b8bcc4',  // platinum
        '--rose':   '#9aa3ad',  // gunmetal
        '--th-blob-1': '#7e8794',
        '--th-blob-2': '#b8bcc4',
        '--th-blob-3': '#4a4f57',
        '--th-blob-4': '#8a93a0'
      }
    },
    cognac: {
      name: 'Cognac',
      desc: 'Whisky · Amber',
      swatch: 'linear-gradient(135deg,#1a1108 0%,#7a5e3a 45%,#d4b896 100%)',
      vars: {
        '--violet': '#9c7e54',  // cognac
        '--cyan':   '#d4b896',  // warm sand
        '--rose':   '#a08056',  // amber
        '--th-blob-1': '#9c7e54',
        '--th-blob-2': '#d4b896',
        '--th-blob-3': '#5c4530',
        '--th-blob-4': '#b09060'
      }
    }
  };

  function initThemePanel() {
    // Build trigger button
    const trigger = document.createElement('button');
    trigger.id = 'theme-trigger';
    trigger.setAttribute('aria-label', 'Open theme palette');
    trigger.innerHTML = `
      <span class="tt-pulse"></span>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.2 0 2.2-1 2.2-2.2 0-.6-.2-1.1-.6-1.5-.3-.4-.5-.9-.5-1.4 0-1.2 1-2.2 2.2-2.2H17c2.8 0 5-2.2 5-5C22 5.6 17.5 2 12 2z" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="6.5"  cy="11.5" r="1.4" fill="#7c3aed"/>
        <circle cx="9.5"  cy="7"    r="1.4" fill="#06b6d4"/>
        <circle cx="14.5" cy="7"    r="1.4" fill="#f43f5e"/>
        <circle cx="17.5" cy="11.5" r="1.4" fill="#f59e0b"/>
      </svg>
    `;
    document.body.appendChild(trigger);

    // Build panel
    const panel = document.createElement('aside');
    panel.id = 'theme-panel';
    panel.setAttribute('aria-hidden', 'true');
    panel.innerHTML = `
      <button class="tp-close" aria-label="Close theme panel">×</button>
      <div class="tp-header">
        <div class="tp-eyebrow">◆ Palette</div>
        <h3>Vibrant &amp; <em>refined</em></h3>
        <p>Nine colour worlds — three high-energy festival palettes up top, six restrained premium ones below. Picks re-paint accents, gradients, hero glow, and buttons in real time.</p>
      </div>
      <div class="tp-divider"></div>
      <div class="tp-themes">
        ${Object.entries(THEMES).map(([key, t]) => `
          <button class="tp-theme" data-theme="${key}" type="button">
            <span class="tp-swatch" style="background:${t.swatch}"></span>
            <span class="tp-info">
              <span class="tp-name">${t.name}</span>
              <span class="tp-desc">${t.desc}</span>
            </span>
            <span class="tp-check">✓</span>
          </button>
        `).join('')}
      </div>
      <div class="tp-footer">
        Each palette swaps <strong>CSS variables</strong> across all pages.<br>
        Your selection is remembered locally.
      </div>
    `;
    document.body.appendChild(panel);

    const closeBtn = qs('.tp-close', panel);

    // Toggle behavior
    function open() {
      panel.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
      trigger.classList.add('active');
    }
    function close() {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      trigger.classList.remove('active');
    }

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      panel.classList.contains('open') ? close() : open();
    });
    closeBtn.addEventListener('click', close);
    document.addEventListener('click', e => {
      if (panel.classList.contains('open')
          && !panel.contains(e.target)
          && !trigger.contains(e.target)) {
        close();
      }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && panel.classList.contains('open')) close();
    });

    // Apply theme
    function applyTheme(key) {
      const theme = THEMES[key];
      if (!theme) return;
      const root = document.documentElement;
      Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
      qsa('.tp-theme', panel).forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === key);
      });
      try { localStorage.setItem('flexlab-theme', key); } catch (_) {}
    }
    qsa('.tp-theme', panel).forEach(btn => {
      btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
    });

    // Restore saved or default — default to FlexLab brand palette
    let saved = 'flexlab';
    try {
      const v = localStorage.getItem('flexlab-theme');
      if (v && THEMES[v]) saved = v;
    } catch (_) {}
    applyTheme(saved);
  }

  /* ─────────────────────────────────────────
     P1. PARTICLE NETWORK (hero canvas)
     Floating dots + connecting lines, mouse-repelled
  ───────────────────────────────────────── */
  function initParticleHero() {
    if (reduceMotion || isMobile) return;
    const hero = qs('#hero');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'hero-particles';
    canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:0;opacity:.55;';
    hero.insertBefore(canvas, hero.firstChild);

    const ctx = canvas.getContext('2d');
    let mouse = { x: -999, y: -999 };
    const COUNT = 70;

    function resize() {
      canvas.width  = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    hero.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

    const pts = Array.from({ length: COUNT }, () => ({
      x: Math.random() * (canvas.width  || 1200),
      y: Math.random() * (canvas.height || 800),
      vx: (Math.random() - .5) * .38,
      vy: (Math.random() - .5) * .38,
      r:  Math.random() * 1.4 + .4,
      o:  Math.random() * .3 + .12
    }));

    const LINK = 130, REPEL = 110;

    (function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pts.forEach(p => {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < REPEL && d > 0) {
          const f = ((REPEL - d) / REPEL) * 0.055;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
        p.vx *= .993; p.vy *= .993;
        p.x  += p.vx; p.y  += p.vy;
        if (p.x < 0) p.x = canvas.width;  if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        // Alternate particle color between violet and gold based on index
        const useGold = (p.o > 0.22);
        ctx.fillStyle = useGold
          ? `rgba(212,175,55,${p.o * 0.85})`
          : `rgba(109,40,217,${p.o})`;
        ctx.fill();
      });

      // Connections
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(109,40,217,${(1 - d / LINK) * .16})`;
            ctx.lineWidth   = .55;
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(frame);
    })();
  }

  /* ─────────────────────────────────────────
     P2. TYPING CURSOR (hero badge)
     Cycles through data-phrases with type/delete
  ───────────────────────────────────────── */
  function initTypingCursor() {
    qsa('.typing-cursor[data-phrases]').forEach(el => {
      let phrases;
      try { phrases = JSON.parse(el.dataset.phrases); } catch { return; }
      if (!phrases.length) return;

      let pi = 0, ci = 0, del = false;
      const cursor = document.createElement('span');
      cursor.className = 'tw-cur';
      el.parentNode.insertBefore(cursor, el.nextSibling);

      function run() {
        const cur = phrases[pi];
        el.textContent = del ? cur.slice(0, ci - 1) : cur.slice(0, ci + 1);
        del ? ci-- : ci++;
        let wait = del ? 42 : 82;
        if (!del && ci > cur.length) { del = true; wait = 2000; }
        else if (del && ci === 0)    { del = false; pi = (pi + 1) % phrases.length; wait = 380; }
        setTimeout(run, wait);
      }
      run();
    });
  }

  /* ─────────────────────────────────────────
     P3. CURSOR TRAIL (fading dot ribbon)
  ───────────────────────────────────────── */
  function initCursorTrail() {
    if (isMobile || isTouch || reduceMotion) return;
    const N = 10;
    const dots = Array.from({ length: N }, (_, i) => {
      const d = document.createElement('div');
      d.className = 'c-trail';
      d.style.setProperty('--ti', i);
      document.body.appendChild(d);
      return { el: d, x: window.innerWidth / 2, y: window.innerHeight / 2 };
    });

    let tx = 0, ty = 0;
    document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });

    (function tick() {
      let px = tx, py = ty;
      dots.forEach((dot, i) => {
        const ease = Math.max(.28 - i * .022, .04);
        dot.x = lerp(dot.x, px, ease);
        dot.y = lerp(dot.y, py, ease);
        dot.el.style.transform = `translate(${dot.x - 3}px,${dot.y - 3}px)`;
        px = dot.x; py = dot.y;
      });
      requestAnimationFrame(tick);
    })();
  }

  /* ─────────────────────────────────────────
     P4. CARD SHIMMER SWEEP (inject + animate)
     A moving light stripe sweeps across cards on hover
  ───────────────────────────────────────── */
  function initCardShimmer() {
    qsa('.lab-card, .feat-card, .h-card, .tcard, .bc-finish, .bc-price-card').forEach(card => {
      if (card.querySelector('.c-shimmer')) return;
      const sh = document.createElement('div');
      sh.className = 'c-shimmer';
      card.style.overflow = 'hidden';
      card.appendChild(sh);
    });
  }

  /* ─────────────────────────────────────────
     P5. GLITCH HOVER on lab numbers / labels
  ───────────────────────────────────────── */
  function initGlitchLabels() {
    if (isMobile || isTouch) return;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%!?░▒▓█';
    qsa('.lab-num, .s-label, .section-index, .bc-lbl, .bs-step-num, .pre-counter').forEach(el => {
      const orig = el.textContent;
      let timer = null;
      el.addEventListener('mouseenter', () => {
        let iter = 0;
        clearInterval(timer);
        timer = setInterval(() => {
          el.textContent = orig.split('').map((c, i) => {
            if (i < iter * .8) return orig[i];
            if (c === ' ' || c === '/' || c === '·') return c;
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('');
          if (++iter > orig.length + 4) { clearInterval(timer); el.textContent = orig; }
        }, 38);
      });
      el.addEventListener('mouseleave', () => { clearInterval(timer); el.textContent = orig; });
    });
  }

  /* ─────────────────────────────────────────
     P6. HOLOGRAPHIC HERO TITLE (hue-shift on scroll)
  ───────────────────────────────────────── */
  function initHoloTitle() {
    if (reduceMotion) return;
    const title = qs('.h-title');
    if (!title) return;
    let hue = 260;
    window.addEventListener('scroll', () => {
      hue = 260 + (window.scrollY / document.body.scrollHeight) * 60;
      title.style.filter = `hue-rotate(${hue - 260}deg)`;
    }, { passive: true });
  }

  /* ─────────────────────────────────────────
     P7. REVEAL ON SCROLL (fast, no-GSAP)
     Adds .rv-in to elements with .rv when they enter view
  ───────────────────────────────────────── */
  function initRevealObserver() {
    if (reduceMotion) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('rv-in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    qsa('.rv').forEach(el => obs.observe(el));
  }

  /* ─────────────────────────────────────────
     P8. AURORA ORBS — extra hero depth layers
  ───────────────────────────────────────── */
  function initAuroraOrbs() {
    if (reduceMotion || isMobile) return;
    const hero = qs('#hero');
    if (!hero) return;
    const existing = qs('.hero-liquid', hero);
    if (existing) return; // liquid hero already running

    const wrap = document.createElement('div');
    wrap.className = 'aurora-wrap';
    hero.insertBefore(wrap, hero.firstChild);

    const configs = [
      { c: 'rgba(124,58,237,.12)',  s: 600, tx: '15%',  ty: '20%', dur: '14s', delay: '0s'   },
      { c: 'rgba(6,182,212,.09)',   s: 500, tx: '78%',  ty: '65%', dur: '18s', delay: '-4s'  },
      { c: 'rgba(244,63,94,.07)',   s: 420, tx: '50%',  ty: '80%', dur: '22s', delay: '-9s'  },
      { c: 'rgba(245,158,11,.06)',  s: 360, tx: '82%',  ty: '15%', dur: '16s', delay: '-6s'  },
    ];
    configs.forEach(cfg => {
      const orb = document.createElement('div');
      orb.className = 'aurora-orb';
      orb.style.cssText = `
        width:${cfg.s}px;height:${cfg.s}px;
        left:${cfg.tx};top:${cfg.ty};
        background:radial-gradient(circle,${cfg.c},transparent 68%);
        animation:aurora-drift ${cfg.dur} ease-in-out infinite;
        animation-delay:${cfg.delay};
      `;
      wrap.appendChild(orb);
    });
  }

  /* ─────────────────────────────────────────
     P9. SPLIT-CHAR COUNT TRAIL
     Animated digit trail on stat counters
  ───────────────────────────────────────── */
  function initCounterGlow() {
    qsa('[data-count]').forEach(el => {
      el.addEventListener('transitionend', () => el.classList.add('count-done'));
      el.classList.add('count-target');
    });
  }

  /* ─────────────────────────────────────────
     P10. SECTION BEAM — spotlight sweeps across
     hero on mouseenter
  ───────────────────────────────────────── */
  function initSectionBeam() {
    if (reduceMotion || isMobile || isTouch) return;
    const hero = qs('#hero');
    if (!hero) return;

    const beam = document.createElement('div');
    beam.id = 'hero-beam';
    hero.appendChild(beam);

    let bx = 50, by = 50, tx2 = 50, ty2 = 50, raf = null;
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      tx2 = ((e.clientX - r.left) / r.width)  * 100;
      ty2 = ((e.clientY - r.top)  / r.height) * 100;
      beam.style.opacity = '1';
      if (!raf) raf = requestAnimationFrame(tick2);
    });
    hero.addEventListener('mouseleave', () => { beam.style.opacity = '0'; raf = null; });

    function tick2() {
      bx = lerp(bx, tx2, .08);
      by = lerp(by, ty2, .08);
      beam.style.background = `radial-gradient(circle 380px at ${bx.toFixed(1)}% ${by.toFixed(1)}%, rgba(109,40,217,.10) 0%, rgba(212,175,55,.05) 40%, transparent 70%)`;
      if (Math.abs(bx - tx2) > .05 || Math.abs(by - ty2) > .05) {
        raf = requestAnimationFrame(tick2);
      } else {
        raf = null;
      }
    }
  }

  /* ─────────────────────────────────────────
     13. CONSOLE BRAND STAMP
  ───────────────────────────────────────── */
  function consoleStamp() {
    if (window.__flexlabStamped) return;
    window.__flexlabStamped = true;
    const styles1 = 'background:linear-gradient(135deg,#6d28d9,#d4af37);color:#fff;padding:18px 28px;font:900 22px/1 "Space Grotesk",sans-serif;border-radius:8px;';
    const styles2 = 'color:#d4af37;font:600 12px/1.6 "Inter",sans-serif;padding:8px 0;';
    console.log('%cFLex LAB', styles1);
    console.log('%cIndia\'s Premium Creative Agency\nEvents · Branding · Gifting · Social · Digital\n\nLike what you see? Let\'s build something together.\n→ hello@flexlab.co.in', styles2);
  }

  /* ─────────────────────────────────────────
     14. AUTO-INJECT data-curtain on key sections
  ───────────────────────────────────────── */
  function autoTagSections() {
    // No-op — leave to manual data-curtain
  }

  /* ─────────────────────────────────────────
     15. PREMIUM INTERACTIVE SLIDER
  ───────────────────────────────────────── */
  function initPremiumSliders() {
    const containers = qsa('.premium-slider-container');
    if (!containers.length) return;

    containers.forEach(container => {
      const slides = qsa('.premium-slide', container);
      if (!slides.length) return;

      const prevBtn = qs('.prev-btn', container);
      const nextBtn = qs('.next-btn', container);
      const currIdxEl = qs('.curr-idx', container);
      const totalCountEl = qs('.total-count', container);
      const progressFill = qs('.slider-progress-fill', container);

      let currentIdx = 0;
      let timer = null;
      const duration = 6000;
      let isAnimating = false;

      if (totalCountEl) {
        totalCountEl.textContent = String(slides.length).padStart(2, '0');
      }

      function showSlide(index) {
        if (isAnimating || index === currentIdx) return;
        isAnimating = true;

        const prevSlide = slides[currentIdx];
        const nextSlide = slides[index];

        if (currIdxEl) {
          currIdxEl.textContent = String(index + 1).padStart(2, '0');
        }

        if (window.gsap) {
          const nextImg = qs('.feat-img', nextSlide);
          const prevImg = qs('.feat-img', prevSlide);

          gsap.set(nextSlide, { display: 'block', zIndex: 2, autoAlpha: 0 });
          if (nextImg) gsap.set(nextImg, { scale: 1.08 });

          gsap.to(prevSlide, { 
            autoAlpha: 0, 
            duration: 0.6, 
            ease: 'power2.inOut',
            onComplete: () => {
              gsap.set(prevSlide, { display: 'none', zIndex: 1 });
            }
          });

          gsap.to(nextSlide, { 
            autoAlpha: 1, 
            duration: 0.6, 
            ease: 'power2.inOut',
            onComplete: () => {
              isAnimating = false;
            }
          });

          if (nextImg) {
            gsap.to(nextImg, { 
              scale: 1, 
              duration: 6, 
              ease: 'power1.out' 
            });
          }
        } else {
          prevSlide.classList.remove('active');
          nextSlide.classList.add('active');
          isAnimating = false;
        }

        currentIdx = index;
        resetProgress();
      }

      function nextSlide() {
        let nextIdx = (currentIdx + 1) % slides.length;
        showSlide(nextIdx);
      }

      function prevSlideFunc() {
        let prevIdx = (currentIdx - 1 + slides.length) % slides.length;
        showSlide(prevIdx);
      }

      function resetProgress() {
        if (timer) clearInterval(timer);
        if (progressFill && window.gsap) {
          gsap.killTweensOf(progressFill);
          gsap.set(progressFill, { width: '0%' });
          gsap.to(progressFill, { 
            width: '100%', 
            duration: duration / 1000, 
            ease: 'none' 
          });
        }
        timer = setInterval(nextSlide, duration);
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', e => {
          e.stopPropagation();
          nextSlide();
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', e => {
          e.stopPropagation();
          prevSlideFunc();
        });
      }

      let startX = 0;
      container.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
      }, { passive: true });

      container.addEventListener('touchend', e => {
        const diffX = e.changedTouches[0].clientX - startX;
        if (Math.abs(diffX) > 50) {
          if (diffX > 0) prevSlideFunc();
          else nextSlide();
        }
      }, { passive: true });

      slides.forEach((slide, idx) => {
        if (idx === 0) {
          slide.classList.add('active');
          if (window.gsap) {
            gsap.set(slide, { display: 'block', autoAlpha: 1, zIndex: 2 });
            const firstImg = qs('.feat-img', slide);
            if (firstImg) gsap.set(firstImg, { scale: 1 });
          }
        } else {
          slide.classList.remove('active');
          if (window.gsap) {
            gsap.set(slide, { display: 'none', autoAlpha: 0, zIndex: 1 });
          }
        }
      });

      resetProgress();
    });
  }

  /* ─────────────────────────────────────────
     INIT ALL
  ───────────────────────────────────────── */
  function init() {
    initSpotlight();
    initSectionCounter();
    initFloatingDock();
    initCTAClick();
    // initLabStackFocus(); // disabled — was dimming other cards on hover
    // initSectionCurtain(); // disabled — was blanking sections when observer missed
    initNavScroll();
    // initBigStatement(); // disabled — overlaying giant text
    // initSectionTint(); // removed — no data-tint elements, was distracting
    // initScrollSkew(); // removed — no data-skew elements in use
    // initImagePeek(); // removed — no data-peek elements, clean up
    initSmoothScroll();
    initGiantMarks();
    initMarqueeBand();
    initBenefits();
    initBenefitGlow();
    initLiquidHero();
    initLiquidText();
    initThemePanel();
    initPremiumSliders();
    consoleStamp();
    // ── PREMIUM ANIMATION LAYER ──

    initParticleHero();
    initTypingCursor();
    // initCursorTrail(); // removed — conflicts with custom cursor dot
    initCardShimmer();
    initGlitchLabels();
    initHoloTitle();
    initRevealObserver();
    // initAuroraOrbs(); // removed — duplicates liquid blobs
    initSectionBeam();
    // Remove any leftover big-statement / peek nodes
    document.querySelectorAll('.big-statement, .peek-img').forEach(el => el.remove());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for external use
  window.FlexPremium = { burstConfetti, clickRipple };
})();
