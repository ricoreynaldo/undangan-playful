// Semua gerak dekoratif: doodle tergambar saat terlihat (dan dijeda di luar layar),
// huruf judul bergoyang, doodle berjatuhan (canvas), garis cerita mengikuti gulir,
// dan "gambar bunga" saat area kosong diketuk. app.js tetap jalan tanpa file ini.
(() => {
  const root = document.documentElement;
  if (!root.classList.contains('motion')) return;

  const C = window.INVITATION || {};
  const OPT = { confetti: true, plant: true, boil: true, ...(C.playful || {}) };
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const small = matchMedia('(max-width: 640px)').matches;
  const INK = '#161616';
  if (!OPT.boil) root.classList.add('no-boil');

  // ---------- huruf bergoyang ----------
  let n = 0;
  function split(el) {
    if (el.dataset.split) return;
    el.dataset.split = '1';
    const label = el.textContent.trim();
    const walk = (node) => {
      [...node.childNodes].forEach((c) => {
        if (c.nodeType === 1) return walk(c);
        if (c.nodeType !== 3) return;
        const frag = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) return frag.append(part);
          const w = document.createElement('span');
          w.className = 'w';
          w.setAttribute('aria-hidden', 'true');
          [...part].forEach((ch) => {
            const s = document.createElement('span');
            s.className = 'ch';
            s.textContent = ch;
            s.style.cssText = `--r:${rand(-6, 6).toFixed(1)}deg;--y:${rand(-2.4, 2.4).toFixed(1)}px;--n:${n++};--jd:${(-rand(0, 0.9)).toFixed(2)}s;--jt:${rand(0.75, 1.05).toFixed(2)}s`;
            w.append(s);
          });
          frag.append(w);
        });
        c.replaceWith(frag);
      });
    };
    walk(el);
    if (label) el.setAttribute('aria-label', label);
  }
  $$('.jig').forEach((el) => { n = 0; split(el); });

  // ---------- doodle tergambar saat terlihat ----------
  const reveal = new IntersectionObserver((entries) => {
    let k = 0;
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.style.setProperty('--rd', `${(k++ * 0.08).toFixed(2)}s`);
      e.target.classList.add('in');
      reveal.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  const draw = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      e.target.classList.toggle('live', e.isIntersecting); // animasi dijeda di luar layar
      if (e.isIntersecting) e.target.classList.add('drawn');
    });
  }, { rootMargin: '0px 0px -5% 0px', threshold: 0.1 });

  // Sampul langsung tergambar
  const coverDoodles = $$('#cover .doodle');
  requestAnimationFrame(() => setTimeout(() => coverDoodles.forEach((d) => d.classList.add('drawn', 'live')), 60));

  function start() {
    $$('main [data-reveal]').forEach((el) => reveal.observe(el));
    $$('.doodle').forEach((d) => { if (!d.closest('#cover, .pill')) draw.observe(d); });
    $$('.pill .doodle').forEach((d) => d.classList.add('live')); // tergambar saat dipilih (CSS)
  }

  // ---------- doodle berjatuhan (canvas) ----------
  const cv = $('#confetti');
  const ctx = cv.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0, H = 0;
  function resize() {
    W = innerWidth; H = innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  addEventListener('resize', resize);

  // sprite tinta digambar sekali, dipakai ulang (hemat)
  const S = 34;
  function sprite(fn) {
    const c = document.createElement('canvas');
    c.width = c.height = S * dpr;
    const g = c.getContext('2d');
    g.scale(dpr, dpr);
    g.translate(S / 2, S / 2);
    g.lineWidth = 1.6; g.lineCap = 'round'; g.lineJoin = 'round';
    g.strokeStyle = INK; g.fillStyle = INK;
    fn(g);
    return c;
  }
  const heartPath = (g, k) => {
    g.beginPath();
    g.moveTo(0, 9 * k);
    g.bezierCurveTo(-6 * k, 4 * k, -11 * k, 0, -10 * k, -5 * k);
    g.bezierCurveTo(-9 * k, -10 * k, -3 * k, -10 * k, 0, -5 * k);
    g.bezierCurveTo(3 * k, -10 * k, 9 * k, -10 * k, 10 * k, -5 * k);
    g.bezierCurveTo(11 * k, 0, 6 * k, 4 * k, 0, 9 * k);
  };
  const SPRITES = [
    sprite((g) => { // aster
      for (let i = 0; i < 7; i++) {
        g.save(); g.rotate((i / 7) * Math.PI * 2);
        g.beginPath(); g.ellipse(0, -8, 3.6, 6, 0, 0, Math.PI * 2);
        g.fillStyle = '#fff'; g.fill(); g.stroke(); g.restore();
      }
      g.beginPath(); g.arc(0, 0, 3.4, 0, Math.PI * 2); g.fillStyle = '#fff'; g.fill(); g.stroke();
    }),
    sprite((g) => { heartPath(g, 1); g.fillStyle = '#fff'; g.fill(); g.stroke(); }),
    sprite((g) => { heartPath(g, 0.7); g.fill(); }),
    sprite((g) => { // kilau
      g.beginPath();
      g.moveTo(0, -11); g.quadraticCurveTo(1.5, -1.5, 11, 0); g.quadraticCurveTo(1.5, 1.5, 0, 11);
      g.quadraticCurveTo(-1.5, 1.5, -11, 0); g.quadraticCurveTo(-1.5, -1.5, 0, -11);
      g.fillStyle = '#fff'; g.fill(); g.stroke();
    }),
    sprite((g) => { // coretan
      g.beginPath(); g.moveTo(-11, 2);
      for (let x = -11; x <= 11; x += 1) g.lineTo(x, Math.sin(x * 0.75) * 3.5);
      g.stroke();
    }),
    sprite((g) => { // bunga 5 kelopak bulat
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        g.beginPath(); g.arc(Math.cos(a) * 5.5, Math.sin(a) * 5.5, 4.6, 0, Math.PI * 2);
        g.fillStyle = '#fff'; g.fill(); g.stroke();
      }
      g.beginPath(); g.arc(0, 0, 2.8, 0, Math.PI * 2); g.fillStyle = INK; g.fill();
    }),
    sprite((g) => { g.beginPath(); g.arc(0, 0, 6.5, 0.3, Math.PI * 2 + 0.7); g.stroke(); }),
  ];

  const makeBit = (top) => ({
    x: Math.random() * W,
    y: top ? rand(-60, -20) : Math.random() * H,
    k: rand(0.8, 1.2),
    vy: rand(0.3, 0.8),
    vx: rand(-0.15, 0.15),
    sw: Math.random() * 6.28, swS: rand(0.008, 0.02),
    rot: Math.random() * 6.28, vr: rand(-0.025, 0.025),
    flip: Math.random() * 6.28, vf: rand(0.015, 0.045),
    depth: rand(0.3, 1),
    img: pick(SPRITES), a: rand(0.55, 0.95),
  });
  const bits = OPT.confetti ? Array.from({ length: small ? 12 : 20 }, () => makeBit(false)) : [];
  const sparks = []; // ledakan (bergravitasi, memudar)

  function drawBit(b, alpha) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.rot);
    ctx.scale(b.k * (Math.cos(b.flip) * 0.6 + 0.4), b.k);
    ctx.globalAlpha = alpha;
    ctx.drawImage(b.img, -S / 2, -S / 2, S, S);
    ctx.restore();
  }

  function burst(x, y, count = 24) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2, sp = rand(1.5, 6);
      sparks.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2.4,
        k: rand(0.5, 1), rot: Math.random() * 6.28, vr: rand(-0.12, 0.12),
        flip: Math.random() * 6.28, vf: rand(0.06, 0.14), img: pick(SPRITES), life: 1,
      });
    }
    if (sparks.length > 150) sparks.splice(0, sparks.length - 150);
  }

  let last = performance.now(), t = 0, lastY = scrollY;
  function frame(now) {
    const dt = Math.min((now - last) / 16.67, 3);
    last = now; t += dt;
    const dy = scrollY - lastY; lastY = scrollY;
    const wind = Math.sin(t * 0.004) * 0.3 + Math.sin(t * 0.0013) * 0.2;
    ctx.clearRect(0, 0, W, H);

    for (const b of bits) {
      b.sw += b.swS * dt;
      b.x += (b.vx + wind + Math.sin(b.sw) * 0.5) * dt;
      b.y += b.vy * dt - dy * b.depth * 0.25; // ikut bergeser saat digulir (kesan kedalaman)
      b.rot += b.vr * dt;
      b.flip += b.vf * dt;
      if (b.y < -40) b.y += H + 60;
      if (b.y > H + 30 || b.x < -40 || b.x > W + 40) Object.assign(b, makeBit(true));
      drawBit(b, b.a);
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const sp = sparks[i];
      sp.vy += 0.08 * dt; sp.vx *= 0.985;
      sp.x += sp.vx * dt; sp.y += sp.vy * dt;
      sp.rot += sp.vr * dt; sp.flip += sp.vf * dt;
      sp.life -= 0.012 * dt;
      if (sp.life <= 0 || sp.y > H + 30) { sparks.splice(i, 1); continue; }
      drawBit(sp, Math.min(1, sp.life * 1.6));
    }
    requestAnimationFrame(frame);
  }

  // ---------- gulir: garis cerita ditarik mengikuti gulir ----------
  const storyWrap = $('#storyWrap');
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const vh = innerHeight;
      if (storyWrap) {
        const r = storyWrap.getBoundingClientRect();
        const p = Math.min(Math.max((vh * 0.62 - r.top) / r.height, 0), 1);
        storyWrap.style.setProperty('--p', p.toFixed(4));
      }
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);

  // ---------- ketuk untuk menggambar bunga ----------
  const planted = $('#planted');
  const KINDS = ['daisy', 'bloom', 'tulip', 'rose', 'daisy', 'bud'];
  let pseed = 300;
  function plant(e) {
    if (!OPT.plant || !root.classList.contains('started') || !window.DOODLE) return;
    if (e.target.closest('a, button, input, select, textarea, label, iframe, img, .lightbox, .sketch, .photo, .gallery, .music, .marquee')) return;
    const el = document.createElement('div');
    el.className = 'plant';
    el.style.left = `${e.pageX}px`;
    el.style.top = `${e.pageY}px`;
    el.style.rotate = `${rand(-14, 14).toFixed(1)}deg`;
    el.innerHTML = window.DOODLE.make('stem', { seed: pseed++, el: { dataset: { k: pick(KINDS), h: String(Math.round(rand(56, 84))) } } });
    planted.append(el);
    while (planted.children.length > 14) planted.firstElementChild.remove();
    requestAnimationFrame(() => requestAnimationFrame(() => el.firstElementChild.classList.add('drawn', 'live')));
    burst(e.clientX, e.clientY, 7);
    setTimeout(() => el.classList.add('wilt'), 2900);
    setTimeout(() => el.remove(), 3700);
  }
  addEventListener('click', plant);

  // ---------- API untuk app.js ----------
  window.__play = {
    burst,
    roll(el, v) {
      el.innerHTML = `<span class="tick">${v}</span>`;
    },
    stagger(els) {
      els.forEach((el, i) => { el.style.setProperty('--rd', `${(i * 0.07).toFixed(2)}s`); el.classList.add('pop'); });
    },
  };

  window.addEventListener('invite-open', () => {
    burst(W / 2, H * 0.55, small ? 34 : 50);
    start();
    onScroll();
  }, { once: true });

  requestAnimationFrame(frame);
})();
