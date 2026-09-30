/* Deep Core Wells — "The Descent" motion layer
 * GSAP 3.12.5 + ScrollTrigger (CDN). Transform/opacity only.
 * Kill-switch: prefers-reduced-motion / no-GSAP => static, fully visible page.
 */
(function () {
  'use strict';

  /* All motion selectors in one map */
  var S = {
    html: 'html',
    rail: '.depth-rail',
    railMarker: '.depth-rail .marker',
    railReadout: '.depth-rail .readout',
    railTick: '.depth-rail .tick',
    railTrack: '.depth-rail .track',
    washes: ['.wash.w1', '.wash.w2', '.wash.w3', '.wash.w4'],
    head: '.site-head',
    hero: '.hero',
    heroCanvas: '#hero-canvas',
    heroTitle: '#heroTitle',
    heroSub: '.hero-sub',
    heroKicker: '.hero-kicker',
    heroDepth: '.hero-depth',
    heroDepthNum: '#heroDepthNum',
    heroCta: '#heroCta',
    heroCtas: '.hero-ctas .btn',
    scrollCue: '.scroll-cue',
    strata: ['.strata.s1', '.strata.s2', '.strata.s3'],
    titles: '.section-title',
    rules: '.title-rule',
    reveals: '.reveal',
    revealsL: '.reveal-l',
    revealsR: '.reveal-r',
    serviceCards: '.service-card',
    serviceIcons: '.service-card .service-icon',
    whyItems: '.why-us-list li',
    whyPhoto: '.why-photo',
    badges: '.badge',
    badgeTitles: '.badge b',
    stats: '.stats',
    statNums: '.stat-num[data-count]',
    statNumsStatic: '.stat-num.static',
    statLabels: '.stat-label',
    statUnder: '.stat-under',
    shockwaves: '.shockwave',
    drillLine: '.drill-line',
    steps: '.process-step',
    stepRings: '.process-step .ring-fg',
    galleryItems: '.gallery-item',
    strikePhoto: '#strikePhoto',
    shimmer: '#strikePhoto .shimmer',
    quoteCards: '.testimonial-card',
    quoteMarks: '.quote-mark',
    eduCards: '.edu-card',
    facts: '.fact',
    form: '#quoteForm',
    formGroups: '#quoteForm .form-group',
    submitBtn: '#quoteSubmit',
    ctaBand: '.cta-band',
    ctaGlow: '.cta-band .glow',
    ctaBtn: '.cta-band .btn',
    footer: 'footer'
  };

  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------- Master kill-switch ---------- */
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (REDUCED) {
    document.documentElement.classList.add('reduced-motion');
    window.__motionReady = true;
    return;
  }
  var conn = navigator.connection || {};
  var SAVE_DATA = conn.saveData === true;
  var LOW_END = (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 3) ||
                (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4);

  if (!window.gsap || !window.ScrollTrigger) return; /* page stays fully visible */
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('js-motion');
  window.__motionReady = true;

  var DESKTOP_RAIL = window.matchMedia('(min-width: 1024px)').matches;
  var ENTER = 'top 85%'; /* default scroll-enter trigger */

  /* ---------- Tiny shared particle engine (hero cuttings + gusher) ---------- */
  function runParticles(canvas, opts) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return { stop: function () {} };
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var W = 0, H = 0, raf = 0, running = false;
    var parts = [];
    function size() {
      var r = canvas.getBoundingClientRect();
      W = Math.max(1, Math.floor(r.width)); H = Math.max(1, Math.floor(r.height));
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function spawn(initial) {
      var p = opts.spawn(W, H);
      if (initial && opts.scatter) { p.y = Math.random() * H; p.x = Math.random() * W; }
      return p;
    }
    function init() { parts = []; for (var i = 0; i < opts.count; i++) parts.push(spawn(true)); }
    var t = 0;
    function frame() {
      if (!running) return;
      t += 0.016;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        opts.step(p, t, W, H);
        if (opts.dead(p, W, H)) { parts[i] = spawn(false); continue; }
        ctx.globalAlpha = p.a;
        ctx.fillStyle = 'rgb(' + p.color + ')';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }
    function start() { if (running) return; running = true; size(); init(); frame(); }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); }
    window.addEventListener('resize', function () { if (running) size(); });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else if (opts.autoResume !== false && inView) start();
    });
    var inView = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (inView && !document.hidden) start(); else stop();
      }, { threshold: 0 }).observe(canvas);
    }
    start();
    return { stop: stop, start: start };
  }

  /* ================= HERO ================= */
  /* H1 — cuttings particles drifting upward */
  (function heroCanvas() {
    var canvas = qs(S.heroCanvas);
    if (!canvas) return;
    var count = SAVE_DATA ? 20 : (LOW_END ? 30 : 60);
    runParticles(canvas, {
      count: count,
      spawn: function (W, H) {
        var warm = Math.random() < 0.6;
        return {
          x: Math.random() * W, y: H + Math.random() * 40,
          r: 1 + Math.random() * 2,
          vy: 0.25 + Math.random() * 0.75,
          wob: Math.random() * 6.28, wobSpd: 0.4 + Math.random() * 0.9, wobAmp: 8 + Math.random() * 18,
          a: 0.15 + Math.random() * 0.35,
          color: warm ? '232,163,61' : '167,155,138'
        };
      },
      step: function (p, t) {
        p.y -= p.vy; p.wob += p.wobSpd * 0.016;
        p.x += Math.sin(p.wob) * p.wobAmp * 0.016;
      },
      dead: function (p) { return p.y < -20; }
    });
  })();

  /* Strata bands scrubbed at 0.1x / 0.25x / 0.4x (M1) */
  [80, 200, 320].forEach(function (dist, i) {
    var el = qs(S.strata[i]);
    if (!el) return;
    gsap.to(el, {
      y: dist, ease: 'none',
      scrollTrigger: { trigger: S.hero, start: 'top top', end: 'bottom top', scrub: true }
    });
  });

  /* H2 — depth counter 0 -> 47 m on load */
  (function heroCounter() {
    var num = qs(S.heroDepthNum);
    if (!num) return;
    var o = { v: 0 };
    gsap.to(o, {
      v: 47, duration: 2.2, ease: 'power2.inOut', delay: 0.3,
      onUpdate: function () {
        var v = Math.round(o.v);
        num.textContent = (v < 10 ? '00' : v < 100 ? '0' : '') + v;
      }
    });
  })();

  /* H3 — headline words slide up */
  (function splitHeadline() {
    var h1 = qs(S.heroTitle);
    if (!h1) return;
    function wrapWord(text, cls) {
      var ww = document.createElement('span'); ww.className = 'ww';
      var w = document.createElement('span'); w.className = 'w' + (cls ? ' ' + cls : '');
      w.textContent = text; ww.appendChild(w); return ww;
    }
    var nodes = Array.prototype.slice.call(h1.childNodes);
    h1.innerHTML = '';
    nodes.forEach(function (n) {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { h1.appendChild(document.createTextNode(' ')); return; }
          h1.appendChild(wrapWord(part, ''));
        });
      } else if (n.nodeType === 1) {
        h1.appendChild(wrapWord(n.textContent, n.className));
      }
    });
    gsap.from(qsa('.w', h1), {
      yPercent: 110, duration: 0.9, ease: 'power3.out', stagger: 0.06, delay: 0.2
    });
  })();

  /* H4/H5 — sub-copy, kicker, CTAs */
  gsap.from([S.heroKicker, S.heroDepth], { y: 18, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08 });
  gsap.from(S.heroSub, { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 });
  gsap.from(qsa(S.heroCtas), { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1, delay: 0.7 });
  var heroCta = qs(S.heroCta);
  if (heroCta) heroCta.classList.add('btn-pulse'); /* perpetual soft pulse, CSS keyframes */

  /* H6 — scroll cue loop, dies after 120 px */
  (function scrollCue() {
    var cue = qs(S.scrollCue);
    if (!cue) return;
    var bob = gsap.to(qs('svg', cue), { y: 10, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    ScrollTrigger.create({
      start: 120, end: 'max',
      onEnter: function () { bob.kill(); gsap.to(cue, { opacity: 0, duration: 0.3, overwrite: 'auto' }); }
    });
  })();

  /* ================= GLOBAL ================= */
  /* G4 — nav slide-in + hide on scroll down */
  (function navMotion() {
    var head = qs(S.head);
    if (!head) return;
    gsap.from(head, { yPercent: -100, duration: 0.5, ease: 'power2.out', delay: 0.1 });
    var lastY = 0;
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: function (self) {
        var y = self.scroll();
        if (y > 300 && y > lastY + 4) gsap.to(head, { yPercent: -100, duration: 0.3, overwrite: 'auto', ease: 'power2.out' });
        else if (y < lastY - 4 || y <= 300) gsap.to(head, { yPercent: 0, duration: 0.3, overwrite: 'auto', ease: 'power2.out' });
        lastY = y;
      }
    });
  })();

  /* G1 + M2 — fixed depth rail 0 -> 200 m with milestone ticks (desktop only) */
  (function depthRail() {
    if (!DESKTOP_RAIL) return;
    var rail = qs(S.rail), marker = qs(S.railMarker),
        readout = qs(S.railReadout), tick = qs(S.railTick), track = qs(S.railTrack);
    if (!rail || !marker) return;
    var trackH = 150, band = -1;
    var MILES = [
      { at: 0.25, m: 50, label: 'topsoil' },
      { at: 0.5, m: 100, label: 'rock' },
      { at: 0.75, m: 150, label: 'fracture zone' },
      { at: 0.985, m: 200, label: 'aquifer' }
    ];
    function measure() { trackH = track ? track.clientHeight : 150; }
    measure();
    ScrollTrigger.create({
      trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.6,
      onUpdate: function (self) {
        var p = self.progress;
        marker.style.transform = 'translate(-50%,' + (p * trackH).toFixed(1) + 'px)';
        var m = Math.round(p * 200);
        if (readout) readout.textContent = m + ' m';
        var b = -1;
        for (var i = MILES.length - 1; i >= 0; i--) { if (p >= MILES[i].at) { b = i; break; } }
        if (b !== band && tick) {
          band = b;
          if (b >= 0) {
            tick.textContent = MILES[b].m + ' m · ' + MILES[b].label;
            gsap.killTweensOf(tick);
            gsap.fromTo(tick, { opacity: 0, scale: 1 }, { opacity: 1, scale: 1.25, duration: 0.25, ease: 'power2.out' });
            gsap.to(tick, { opacity: 0, duration: 0.5, delay: 1.2, overwrite: false });
          }
        }
      },
      onRefresh: measure
    });
    /* fade in after the hero */
    ScrollTrigger.create({
      trigger: S.hero, start: 'bottom 70%',
      onEnter: function () { gsap.to(rail, { opacity: 1, duration: 0.4 }); },
      onLeaveBack: function () { gsap.to(rail, { opacity: 0, duration: 0.4 }); }
    });
  })();

  /* G2 — ambient wash crossfade (art-direction palette, opacity only) */
  (function wash() {
    var layers = S.washes.map(function (s) { return qs(s); }).filter(Boolean);
    if (!layers.length) return;
    var peaks = [0.08, 0.34, 0.6, 0.86];
    ScrollTrigger.create({
      trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.8,
      onUpdate: function (self) {
        var p = self.progress;
        for (var i = 0; i < layers.length; i++) {
          var d = Math.abs(p - peaks[i]) / 0.28;
          layers[i].style.opacity = Math.max(0, 0.55 * (1 - d)).toFixed(3);
        }
      }
    });
  })();

  /* G3 — section titles + drawing accent rules */
  qsa(S.titles).forEach(function (t) {
    gsap.from(t, {
      y: 40, opacity: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: t, start: ENTER, once: true }
    });
  });
  qsa(S.rules).forEach(function (r) {
    gsap.fromTo(r, { scaleX: 0 }, {
      scaleX: 1, duration: 0.5, ease: 'power2.out', delay: 0.15,
      scrollTrigger: { trigger: r, start: ENTER, once: true }
    });
  });

  /* Generic reveal system (art-direction: 24px -> 0, 0.7s, stagger 90ms) */
  function batchReveal(sel, vars) {
    var els = qsa(sel);
    if (!els.length) return;
    ScrollTrigger.batch(els, {
      start: ENTER, once: true,
      onEnter: function (batch) {
        gsap.to(batch, Object.assign({ y: 0, x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.09, overwrite: true }, vars || {}));
      }
    });
  }
  batchReveal(S.reveals);
  batchReveal(S.eduCards);

  /* G5 — footer */
  var foot = qs(S.footer);
  if (foot) gsap.from(foot, { y: 30, opacity: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: foot, start: ENTER, once: true } });

  /* ================= SERVICES ================= */
  (function services() {
    var cards = qsa(S.serviceCards);
    if (!cards.length) return;
    gsap.set(cards, { y: 50, opacity: 0 });
    var icons = qsa(S.serviceIcons);
    if (icons.length) gsap.set(icons, { scale: 0, transformOrigin: 'center' });
    ScrollTrigger.batch(cards, {
      start: 'top 88%', once: true,
      onEnter: function (batch) {
        gsap.to(batch, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.08, overwrite: true });
        if (icons.length) gsap.to(icons, { scale: 1, duration: 0.9, ease: 'back.out(1.6)', stagger: 0.08, delay: 0.25, overwrite: true });
      }
    });
  })();

  /* ================= WHY US ================= */
  (function whyUs() {
    var items = qsa(S.whyItems);
    if (items.length) {
      gsap.set(items, { x: -30, opacity: 0 });
      ScrollTrigger.batch(items, {
        start: ENTER, once: true,
        onEnter: function (batch) {
          gsap.to(batch, { x: 0, opacity: 1, duration: 0.45, ease: 'power2.out', stagger: 0.07, overwrite: true });
          batch.forEach(function (li, i) {
            setTimeout(function () { li.classList.add('tick-in'); }, i * 70);
          });
        }
      });
    }
    var photo = qs(S.whyPhoto);
    if (photo) {
      gsap.from(photo, {
        x: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: photo, start: ENTER, once: true }
      });
      gsap.fromTo(photo, { y: 30 }, {
        y: -30, ease: 'none',
        scrollTrigger: { trigger: '.why-us', start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }
  })();

  /* ================= TRUST + STATS (the strike) ================= */
  (function trust() {
    var badges = qsa(S.badges);
    if (badges.length) {
      gsap.set(badges, { y: 36, opacity: 0 });
      ScrollTrigger.batch(badges, {
        start: ENTER, once: true,
        onEnter: function (batch) {
          gsap.to(batch, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', stagger: 0.1, overwrite: true });
          gsap.fromTo(qsa(S.badgeTitles), { scale: 1.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.in', stagger: 0.1, delay: 0.1, overwrite: true });
        }
      });
    }
  })();

  (function stats() {
    var section = qs(S.stats);
    if (!section) return;
    var nums = qsa(S.statNums), staticNum = qsa(S.statNumsStatic),
        labels = qsa(S.statLabels), unders = qsa(S.statUnder);
    gsap.set(nums.concat(staticNum), { y: 20, opacity: 0 });
    gsap.set(labels, { y: 10, opacity: 0 });
    gsap.set(unders, { scaleX: 0 });
    var fired = false;
    ScrollTrigger.create({
      trigger: section, start: 'top 70%', once: true,
      onEnter: function () {
        if (fired) return; fired = true;
        /* ST1 — shockwave rings */
        qsa(S.shockwaves).forEach(function (ring, i) {
          gsap.fromTo(ring, { scale: 0, opacity: 0.6 }, {
            scale: 3, opacity: 0, duration: 1.1, ease: 'power2.out', delay: i * 0.18
          });
        });
        /* ST2 — numbers rise, then count up */
        gsap.to(nums.concat(staticNum), { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
        nums.forEach(function (el) {
          var target = parseFloat(el.getAttribute('data-count')) || 0;
          var suffix = el.getAttribute('data-suffix') || '';
          var o = { v: 0 };
          gsap.to(o, {
            v: target, duration: 1.6, ease: 'power2.out', delay: 0.35,
            onUpdate: function () { el.textContent = Math.round(o.v) + suffix; }
          });
        });
        /* teal underlines draw themselves */
        gsap.to(unders, { scaleX: 1, duration: 0.6, ease: 'power2.out', stagger: 0.12, delay: 0.5 });
        /* ST3 — labels */
        gsap.to(labels, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.1, delay: 0.9 });
        /* ST4 — gusher burst (skipped on save-data / low-end) */
        if (!SAVE_DATA && !LOW_END) gusher(section);
      }
    });
  })();

  /* ST4 — vanilla canvas gusher, created lazily, removed after */
  function gusher(section) {
    var host = qs('.stats-grid', section) || section;
    var canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:absolute;inset:0;z-index:5;pointer-events:none';
    host.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    if (!ctx) { canvas.remove(); return; }
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var r = host.getBoundingClientRect();
    var W = r.width, H = r.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var cx = W / 2, cy = H * 0.42, parts = [];
    for (var i = 0; i < 80; i++) {
      parts.push({
        x: cx + (Math.random() - 0.5) * 30,
        y: cy,
        vx: (Math.random() - 0.5) * 3.2,
        vy: -(4 + Math.random() * 6),
        r: 1.5 + Math.random() * 2.5,
        a: 0.5 + Math.random() * 0.5,
        teal: Math.random() < 0.7
      });
    }
    var start = performance.now(), alive = true;
    function frame(now) {
      if (!alive) return;
      var t = (now - start) / 1000;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.vy += 0.22; p.x += p.vx; p.y += p.vy;
        var fade = Math.max(0, 1 - t / 1.4);
        ctx.globalAlpha = p.a * fade;
        ctx.fillStyle = p.teal ? 'rgb(111,191,168)' : 'rgb(234,243,236)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (t < 1.4) requestAnimationFrame(frame);
      else { alive = false; setTimeout(function () { canvas.remove(); }, 600); }
    }
    requestAnimationFrame(frame);
  }

  /* ================= PROCESS ================= */
  (function process() {
    var steps = qsa(S.steps);
    if (!steps.length) return;
    gsap.set(steps, { y: 44, opacity: 0 });
    ScrollTrigger.batch(steps, {
      start: ENTER, once: true,
      onEnter: function (batch) {
        gsap.to(batch, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.12, overwrite: true });
      }
    });
    /* P2 — rings draw in */
    var rings = qsa(S.stepRings);
    if (rings.length) {
      gsap.to(rings, {
        strokeDashoffset: 0, duration: 0.7, ease: 'power2.out', stagger: 0.12, delay: 0.2,
        scrollTrigger: { trigger: S.drillLine, start: ENTER, once: true }
      });
    }
    /* P3 — drill-string connector draws via CSS var (transform/opacity only) */
    var line = qs(S.drillLine);
    if (line) {
      gsap.to(line, {
        '--dl': 1, duration: 1.0, ease: 'power2.inOut', delay: 0.4,
        scrollTrigger: { trigger: line, start: ENTER, once: true }
      });
    }
  })();

  /* ================= GALLERY ================= */
  (function gallery() {
    var items = qsa(S.galleryItems);
    if (items.length) {
      gsap.set(items, { y: 60, opacity: 0, rotation: 2, transformOrigin: 'center' });
      ScrollTrigger.batch(items, {
        start: ENTER, once: true,
        onEnter: function (batch) {
          gsap.to(batch, { y: 0, opacity: 1, rotation: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1, overwrite: true });
        }
      });
    }
    /* M3 — ripple rings + shimmer sweep on the strike photo, once */
    var strike = qs(S.strikePhoto);
    if (strike) {
      ScrollTrigger.create({
        trigger: strike, start: ENTER, once: true,
        onEnter: function () {
          for (var i = 0; i < 3; i++) {
            var ring = document.createElement('span');
            ring.className = 'ripple'; ring.setAttribute('aria-hidden', 'true');
            strike.appendChild(ring);
            gsap.fromTo(ring, { scale: 0.2, opacity: 0.7 }, {
              scale: 1.6, opacity: 0, duration: 1.6, ease: 'power1.out', delay: i * 0.35,
              onComplete: (function (el) { return function () { el.remove(); }; })(ring)
            });
          }
          var shimmer = qs(S.shimmer);
          if (shimmer) gsap.fromTo(shimmer, { x: '-150%' }, { x: '150%', duration: 1.2, ease: 'power2.inOut', delay: 0.2 });
        }
      });
    }
  })();

  /* ================= TESTIMONIALS / WHY-BOREHOLE ================= */
  (function quotes() {
    var cards = qsa(S.quoteCards);
    if (cards.length) {
      cards.forEach(function (c, i) {
        gsap.set(c, { x: i % 2 ? 40 : -40, opacity: 0 });
      });
      ScrollTrigger.batch(cards, {
        start: ENTER, once: true,
        onEnter: function (batch) {
          gsap.to(batch, { x: 0, opacity: 1, duration: 0.65, ease: 'power3.out', stagger: 0.12, overwrite: true });
        }
      });
      var marks = qsa(S.quoteMarks);
      if (marks.length) gsap.from(marks, { scale: 0, duration: 0.5, ease: 'back.out(1.8)', stagger: 0.12, scrollTrigger: { trigger: cards[0], start: ENTER, once: true } });
    }
  })();

  /* ================= CONTACT ================= */
  (function contact() {
    var facts = qsa(S.facts);
    if (facts.length) {
      gsap.set(facts, { x: -24, opacity: 0 });
      ScrollTrigger.batch(facts, {
        start: ENTER, once: true,
        onEnter: function (batch) {
          gsap.to(batch, { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.08, overwrite: true });
        }
      });
    }
    var form = qs(S.form);
    if (form) {
      gsap.from(form, {
        y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.15,
        scrollTrigger: { trigger: form, start: ENTER, once: true }
      });
      var groups = qsa(S.formGroups);
      if (groups.length) {
        gsap.from(groups, {
          y: 16, opacity: 0, duration: 0.5, ease: 'power2.out', stagger: 0.06, delay: 0.35,
          scrollTrigger: { trigger: form, start: ENTER, once: true }
        });
      }
      var submit = qs(S.submitBtn);
      if (submit) {
        gsap.from(submit, {
          scale: 0.9, opacity: 0, duration: 0.6, delay: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: form, start: ENTER, once: true }
        });
      }
    }
  })();

  /* ================= FINAL CTA ================= */
  (function cta() {
    var band = qs(S.ctaBand);
    if (!band) return;
    var panel = qs('.container', band);
    if (panel) gsap.from(panel, { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: band, start: ENTER, once: true } });
    var glow = qs(S.ctaGlow);
    if (glow) gsap.to(glow, { opacity: 0.45, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1 });
    var btn = qs(S.ctaBtn);
    if (btn) {
      gsap.fromTo(btn, { scale: 0.8, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)', delay: 0.3,
        scrollTrigger: { trigger: band, start: ENTER, once: true }
      });
    }
  })();

  /* Refresh after full load (fonts/images shift layout) */
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
