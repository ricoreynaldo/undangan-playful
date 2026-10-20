// Generator ilustrasi doodle tinta (SVG murni, tanpa file gambar) untuk setiap [data-doodle].
// Garis dibuat sedikit "goyang" seperti digambar tangan (acak ber-seed → hasil selalu sama).
// Kelas: .ln garis (digambar ulang saat terlihat), .fl isian tinta, .pf isian kertas,
// .sway/.jig/.bob/.twk/.ray/.mer/.slosh/.bow = grup yang digerakkan CSS.
(() => {
  // ---------- acak ber-seed ----------
  let s = 1;
  const seed = (n) => { s = (Math.abs(Math.round(n)) % 2147483646) + 1; };
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const j = (a) => (rnd() - 0.5) * 2 * a;
  const rr = (a, b) => a + rnd() * (b - a);
  const f = (n) => Math.round(n * 10) / 10;
  const TAU = Math.PI * 2;

  // ---------- kurva ----------
  // Catmull-Rom → kubik Bézier melalui semua titik
  function smooth(pts, closed) {
    const n = pts.length;
    if (n < 2) return '';
    const P = closed ? [pts[n - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[n - 1]];
    let d = `M${f(P[1][0])} ${f(P[1][1])}`;
    for (let i = 1; i < P.length - 2; i++) {
      const p0 = P[i - 1], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2];
      d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} `
        + `${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
    }
    return closed ? `${d}Z` : d;
  }
  const shake = (pts, a) => pts.map(([x, y]) => [x + j(a), y + j(a)]);
  const wl = (pts, a = 0.6) => smooth(shake(pts, a), false); // garis goyang
  const cl = (pts, a = 0.5) => smooth(shake(pts, a), true); // bentuk tertutup
  const line = (x1, y1, x2, y2, a = 0.5, n = 3) => wl(Array.from({ length: n + 1 }, (_, i) => [x1 + ((x2 - x1) * i) / n, y1 + ((y2 - y1) * i) / n]), a);

  // lingkaran tangan: ujung saling menimpa sedikit (khas coretan pena)
  function loop(cx, cy, rx, ry = rx, o = {}) {
    const n = o.n || Math.max(9, Math.round((rx + ry) / 3.2));
    const a0 = o.a0 ?? rnd() * TAU;
    const over = o.over ?? 0.45;
    const rot = o.rot || 0;
    const drift = o.drift ?? 0.05;
    const jit = o.jit ?? 0.025;
    const cr = Math.cos(rot), sr = Math.sin(rot);
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const a = a0 + t * (TAU + over);
      const k = 1 + drift * (t - 0.5) + j(jit);
      const x = Math.cos(a) * rx * k, y = Math.sin(a) * ry * k;
      pts.push([cx + x * cr - y * sr, cy + x * sr + y * cr]);
    }
    return smooth(pts, false);
  }
  // elips tertutup (untuk isian)
  function blob(cx, cy, rx, ry = rx, o = {}) {
    const n = o.n || Math.max(8, Math.round((rx + ry) / 3));
    const rot = o.rot || 0, jit = o.jit ?? 0.03;
    const cr = Math.cos(rot), sr = Math.sin(rot);
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU, k = 1 + j(jit);
      const x = Math.cos(a) * rx * k, y = Math.sin(a) * ry * k;
      pts.push([cx + x * cr - y * sr, cy + x * sr + y * cr]);
    }
    return smooth(pts, true);
  }
  const rotPts = (pts, a, cx = 0, cy = 0) => {
    const c = Math.cos(a), sn = Math.sin(a);
    return pts.map(([x, y]) => [cx + x * c - y * sn, cy + x * sn + y * c]);
  };
  // bintang 4 sudut (kilau)
  const star = (cx, cy, r) => cl([[0, -r], [r * 0.22, -r * 0.22], [r, 0], [r * 0.22, r * 0.22], [0, r], [-r * 0.22, r * 0.22], [-r, 0], [-r * 0.22, -r * 0.22]].map(([x, y]) => [cx + x, cy + y]), r * 0.03);

  // ---------- pena: mengumpulkan elemen berurutan (urutan = urutan digambar) ----------
  function Pen() {
    const out = [];
    let i = 0;
    const p = {
      ln(d, w = 2, cls = '') { out.push(`<path class="ln${cls ? ` ${cls}` : ''}" d="${d}" pathLength="1" stroke-width="${w}" style="--i:${i++}"/>`); return p; },
      fl(d, cls = '') { out.push(`<path class="fl${cls ? ` ${cls}` : ''}" d="${d}" style="--i:${i}"/>`); return p; },
      pf(d) { out.push(`<path class="pf" d="${d}" style="--i:${i}"/>`); return p; },
      raw(m) { out.push(m); return p; },
      g(cls, fn, tr = '', style = '') {
        const t = tr ? ` transform="${tr}"` : '';
        const st = style ? ` style="${style}"` : '';
        if (cls && tr) out.push(`<g${t}><g class="${cls}"${st}>`); // transform atribut di luar, CSS di dalam
        else out.push(`<g${cls ? ` class="${cls}"` : ''}${t}${st}>`);
        fn();
        out.push(cls && tr ? '</g></g>' : '</g>');
        return p;
      },
      get html() { return out.join(''); },
      get count() { return i; },
    };
    return p;
  }
  const T = (x, y, k = 1, r = 0) => `translate(${f(x)} ${f(y)})${r ? ` rotate(${f(r)})` : ''}${k !== 1 ? ` scale(${f(k * 100) / 100})` : ''}`;
  const swayStyle = (a = 4) => `--sw:${rr(2.4, 4.2).toFixed(2)}s;--sd:${(-rr(0, 4)).toFixed(2)}s;--sa:${(a * rr(0.6, 1.2)).toFixed(1)}deg`;

  // ============================================================
  //  BUNGA (kepala bunga di titik 0,0)
  // ============================================================
  function petalPts(r0, len, w) {
    return [[r0, -w * 0.45], [r0 + len * 0.45, -w], [r0 + len * 0.88, -w * 0.62], [r0 + len, 0], [r0 + len * 0.88, w * 0.62], [r0 + len * 0.45, w], [r0, w * 0.45]];
  }
  const head = {
    daisy(p, r, o = {}) {
      const n = o.n || 8 + Math.round(rnd() * 3);
      const a0 = rnd() * TAU;
      p.pf(blob(0, 0, r * 1.02, r * 1.02));
      for (let k = 0; k < n; k++) {
        const a = a0 + (k / n) * TAU + j(0.08);
        p.ln(cl(rotPts(petalPts(r * 0.3, r * rr(0.66, 0.74), r * 0.2), a), r * 0.015), o.w || 1.6);
      }
      p.pf(blob(0, 0, r * 0.3));
      if (o.dark) p.fl(blob(0, 0, r * 0.3, r * 0.3, { jit: 0.06 }));
      else {
        p.ln(loop(0, 0, r * 0.3, r * 0.3, { over: 0.3 }), o.w || 1.6);
        for (let k = 0; k < 3; k++) p.fl(blob(j(r * 0.12), j(r * 0.12), r * 0.045));
      }
    },
    bloom(p, r, o = {}) { // 5 kelopak bulat
      const a0 = rnd() * TAU;
      for (let k = 0; k < 5; k++) {
        const a = a0 + (k / 5) * TAU;
        const cx = Math.cos(a) * r * 0.52, cy = Math.sin(a) * r * 0.52;
        p.pf(blob(cx, cy, r * 0.48));
        p.ln(loop(cx, cy, r * 0.48, r * 0.46, { rot: a, over: 0.25 }), o.w || 1.6);
      }
      p.fl(blob(0, 0, r * 0.24, r * 0.24, { jit: 0.08 }));
    },
    tulip(p, r, o = {}) {
      const w = r * 0.9, h = r * 1.5;
      p.pf(cl([[-w, -h * 0.15], [-w * 0.95, -h * 0.75], [-w * 0.45, -h * 0.95], [0, -h * 0.62], [w * 0.45, -h * 0.95], [w * 0.95, -h * 0.75], [w, -h * 0.15], [0, h * 0.18]], 0));
      p.ln(wl([[-w * 0.15, h * 0.16], [-w * 0.85, -h * 0.05], [-w, -h * 0.5], [-w * 0.6, -h], [-w * 0.2, -h * 0.68], [0, -h * 1.05], [w * 0.2, -h * 0.68], [w * 0.6, -h], [w, -h * 0.5], [w * 0.85, -h * 0.05], [w * 0.15, h * 0.16], [-w * 0.15, h * 0.16]], r * 0.03), o.w || 1.7);
      p.ln(wl([[-w * 0.2, -h * 0.66], [-w * 0.05, -h * 0.25], [0, h * 0.1]], r * 0.03), (o.w || 1.7) * 0.8);
    },
    rose(p, r, o = {}) {
      p.pf(blob(0, 0, r, r * 0.92));
      const pts = [];
      const turns = 2.6;
      const a0 = rnd() * TAU;
      for (let i = 0; i <= 26; i++) {
        const t = i / 26;
        const a = a0 + t * turns * TAU;
        const rad = r * (0.08 + t * 0.78);
        pts.push([Math.cos(a) * rad, Math.sin(a) * rad * 0.9]);
      }
      p.ln(wl(pts, r * 0.02), o.w || 1.6);
      p.ln(loop(0, 0, r, r * 0.92, { over: -0.6 }), o.w || 1.6);
    },
    bud(p, r, o = {}) {
      p.pf(blob(0, -r * 0.4, r * 0.55, r * 0.8));
      p.ln(cl([[0, -r * 1.25], [r * 0.5, -r * 0.7], [r * 0.45, 0], [0, r * 0.12], [-r * 0.45, 0], [-r * 0.5, -r * 0.7]], r * 0.03), o.w || 1.6);
      p.ln(wl([[-r * 0.55, r * 0.1], [-r * 0.15, -r * 0.35], [0, -r * 0.9]], r * 0.03), (o.w || 1.6) * 0.8);
    },
    berry(p, r) { // kelompok bunga kecil (baby's breath)
      for (let k = 0; k < 4; k++) {
        const a = rnd() * TAU, d = rr(0, r * 0.6);
        p.fl(blob(Math.cos(a) * d, Math.sin(a) * d, r * rr(0.16, 0.24)));
      }
    },
  };
  const KINDS = ['daisy', 'bloom', 'tulip', 'rose', 'daisy', 'bud', 'bloom'];

  function leaf(p, x, y, len, ang, w = 1.5) {
    const wd = len * 0.32;
    const pts = rotPts([[0, 0], [len * 0.3, -wd * 0.9], [len * 0.75, -wd * 0.6], [len, 0], [len * 0.7, wd * 0.6], [len * 0.3, wd * 0.8]], ang, x, y);
    p.pf(smooth(pts, true));
    p.ln(cl(pts, len * 0.02), w);
    p.ln(wl(rotPts([[len * 0.08, 0], [len * 0.55, -wd * 0.05], [len * 0.85, 0]], ang, x, y), len * 0.02), w * 0.7);
  }

  // bunga bertangkai: dari (x,y) tumbuh setinggi h, condong `lean`
  function stemFlower(p, x, y, h, lean, kind, r, o = {}) {
    const tx = x + lean, ty = y - h;
    const mid = [x + lean * 0.35 + j(3), y - h * 0.5];
    p.g(o.sway === false ? '' : 'sway', () => {
      p.ln(wl([[x, y], mid, [tx, ty + r * 0.4]], 0.8), o.w || 1.6);
      if (h > 36 && o.leaf !== false) {
        const side = rnd() > 0.5 ? 1 : -1;
        const ly = y - h * rr(0.25, 0.5);
        const lx = x + lean * ((y - ly) / h) * 0.7;
        leaf(p, lx, ly, Math.min(h * 0.36, 26), side > 0 ? -0.5 : Math.PI + 0.5, (o.w || 1.6) * 0.9);
      }
      p.g('', () => head[kind](p, r, o), T(tx, ty, 1, lean * 0.4));
    }, '', o.sway === false ? '' : swayStyle(o.sa || 4));
  }

  // ============================================================
  //  BENDA-BENDA (dasar benda di y = 0)
  // ============================================================
  const thing = {
    coupe(p) {
      p.ln(loop(0, -3, 17, 3.6, { over: 0.5 }), 2);
      p.ln(wl([[0, -6], [0.6, -28], [0, -50]], 0.4), 2.2);
      p.pf(cl([[-31, -77], [-27, -64], [-16, -55], [0, -51], [16, -55], [27, -64], [31, -77]], 0));
      p.ln(wl([[-31, -77], [-27, -64], [-16, -55], [0, -51], [16, -55], [27, -64], [31, -77]], 0.5), 2.2);
      p.ln(loop(0, -77, 31, 5.5, { over: 0.3 }), 2);
      p.g('slosh', () => p.fl(cl([[-26, -71], [-19, -61], [-8, -56], [8, -56], [19, -61], [26, -71], [12, -73.5], [-12, -73.5]], 0.4)));
      p.g('bob', () => {
        p.ln(wl([[18, -86], [23, -97], [31, -106]], 0.3), 1.8);
        p.fl(blob(17, -83, 4.8, 4.5));
      });
    },
    martini(p) {
      p.ln(loop(0, -3, 18, 4, { over: 0.5 }), 2);
      p.ln(wl([[0, -6], [-0.6, -30], [0, -54]], 0.4), 2.2);
      p.pf(cl([[-34, -104], [34, -104], [0, -54]], 0));
      p.ln(wl([[-34, -104], [-17, -79], [0, -54]], 0.4), 2.2);
      p.ln(wl([[0, -54], [17, -79], [34, -104]], 0.4), 2.2);
      p.ln(loop(0, -104, 34, 5, { over: 0.3 }), 2);
      p.g('slosh', () => p.fl(cl([[-27, -97], [-8, -97.5], [8, -97.5], [27, -97], [13, -79], [0, -62], [-13, -79]], 0.4)));
      p.g('bob', () => {
        p.ln(wl([[-14, -71], [16, -109]], 0.3), 1.6);
        p.pf(blob(-4, -80, 4.8)); p.ln(loop(-4, -80, 4.8, 4.6), 1.6);
        p.pf(blob(3, -89, 4.8)); p.ln(loop(3, -89, 4.8, 4.6), 1.6);
      });
    },
    wine(p) {
      p.ln(loop(0, -3, 15, 3.4, { over: 0.5 }), 2);
      p.ln(wl([[0, -6], [0.4, -24], [0, -42]], 0.3), 2.2);
      const bowl = [[-17, -86], [-21, -70], [-17, -53], [-8, -44], [0, -42], [8, -44], [17, -53], [21, -70], [17, -86]];
      p.pf(smooth(bowl, true));
      p.ln(wl(bowl, 0.4), 2.2);
      p.ln(loop(0, -86, 17, 3.6, { over: 0.3 }), 1.8);
      p.g('slosh', () => p.fl(cl([[-20, -68], [-16, -53], [-8, -46], [8, -46], [16, -53], [20, -68], [8, -70.5], [-8, -69.5]], 0.4)));
      p.g('bow', () => {
        p.pf(blob(-8, -27, 7, 4.2, { rot: -0.4 })); p.ln(loop(-8, -27, 7, 4.2, { rot: -0.4 }), 1.8);
        p.pf(blob(8, -27, 7, 4.2, { rot: 0.4 })); p.ln(loop(8, -27, 7, 4.2, { rot: 0.4 }), 1.8);
        p.fl(blob(0, -26.5, 2.8, 2.6));
        p.ln(wl([[1, -24], [6, -15], [4, -7]], 0.4), 1.8);
        p.ln(wl([[-1, -24], [-9, -12], [-22, -4], [-34, -11], [-46, -2], [-58, -8], [-70, -1]], 0.8), 3.4);
      });
    },
    bottle(p) {
      const side = (sx) => [[15 * sx, 0], [16 * sx, -30], [16 * sx, -62], [14.5 * sx, -80], [9 * sx, -94], [6 * sx, -104], [6 * sx, -122], [6 * sx, -138]];
      const L = side(-1), R = side(1).reverse();
      p.pf(smooth([...L, ...R], true));
      p.ln(wl([...L, ...R, L[0]], 0.4), 2.2);
      p.ln(loop(0, -138, 6, 1.6, { over: 0.2 }), 1.8);
      const ins = (sx) => [[11 * sx, -5], [12 * sx, -32], [12 * sx, -62], [10.5 * sx, -78], [5.5 * sx, -92], [3 * sx, -103], [3 * sx, -126]];
      p.fl(cl([...ins(-1), ...ins(1).reverse()], 0.3));
      p.g('wig', () => { // irisan jeruk nipis
        const a = [];
        for (let k = 0; k <= 8; k++) a.push([Math.cos(Math.PI + (k / 8) * Math.PI) * 12, Math.sin(Math.PI + (k / 8) * Math.PI) * 12]);
        p.pf(smooth(a, true));
        p.ln(wl([...a, [12, 0], [-12, 0]], 0.3), 1.8);
        p.ln(wl(a.map(([x, y]) => [x * 0.75, y * 0.75]), 0.2), 1.2);
        for (let k = 1; k < 4; k++) p.ln(line(0, 0, Math.cos(Math.PI + (k / 4) * Math.PI) * 8.5, Math.sin(Math.PI + (k / 4) * Math.PI) * 8.5, 0.2, 1), 1.1);
      }, T(4, -139, 1, -28));
    },
    lemon(p, o = {}) {
      const pts = [[-17, 0], [-13, -6], [-4, -10], [7, -9], [14, -4], [18, -1], [14, 4], [5, 9], [-6, 9], [-14, 5]];
      p.pf(smooth(pts, true));
      p.ln(cl(pts, 0.5), 1.8);
      p.ln(wl([[-17, 0], [-19.5, -0.8]], 0.2), 1.8);
      p.ln(wl([[18, -1], [20.5, -1.5]], 0.2), 1.8);
      for (let k = 0; k < 4; k++) p.fl(blob(rr(-9, 9), rr(-4, 4), 0.7));
      if (o.leaf) leaf(p, -18, -1, 15, Math.PI + 0.55, 1.4);
    },
    cake(p, o = {}) {
      const H = (t) => [16 * Math.sin(t) ** 3, -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))];
      const sx = 3.5, sy = 2.05, cy = -96, body = 52;
      const at = (t, k = 1, dy = 0, frill = 0) => {
        const [hx, hy] = H(t);
        const x = hx * sx * k, y = cy + hy * sy * k + dy;
        if (!frill) return [x, y];
        const nx = x, ny = y - (cy + dy - 6), len = Math.hypot(nx, ny) || 1;
        const b = frill * Math.abs(Math.sin(t * 13));
        return [x + (nx / len) * b, y + (ny / len) * b];
      };
      const ring = (k, dy, fr, n = 96, t0 = 0, t1 = TAU) => Array.from({ length: n + 1 }, (_, i) => at(t0 + ((t1 - t0) * i) / n, k, dy, fr));
      const front = (dy, fr, n = 60) => ring(1, dy, fr, n, Math.PI / 2, (3 * Math.PI) / 2);
      // isian kertas: atas + badan
      p.pf(smooth([...ring(1.02, 0, 0, 40, -Math.PI / 2, Math.PI / 2), ...front(body, 0, 30)].concat(), true));
      p.pf(smooth(ring(1.03, 0, 0, 48), true));
      p.g('cakebody', () => {
        // sisi kiri & kanan
        const L = at((3 * Math.PI) / 2), R = at(Math.PI / 2);
        p.ln(wl([L, [L[0] + 1, L[1] + body * 0.5], [L[0] + 3, L[1] + body]], 0.5), 2);
        p.ln(wl([R, [R[0] - 1, R[1] + body * 0.5], [R[0] - 3, R[1] + body]], 0.5), 2);
        // renda bawah
        p.ln(wl(front(body, 3.2, 84).map(([x, y]) => [x * 0.95, y]), 0.25), 2);
        // untaian (swag) + manik
        const sw = front(17, 0, 10);
        for (let k = 0; k < sw.length - 1; k++) {
          const a = sw[k], b = sw[k + 1];
          p.ln(wl([a, [(a[0] * 3 + b[0]) / 4, (a[1] * 3 + b[1]) / 4 + 7], [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 9.5], [(a[0] + b[0] * 3) / 4, (a[1] + b[1] * 3) / 4 + 7], b], 0.3), 1.8);
        }
        sw.forEach(([x, y], k) => { if (k && k < sw.length - 1) { p.fl(blob(x, y, 2.6, 2.6)); p.ln(line(x, y + 2, x + j(1), y + 12, 0.3, 2), 1.5); } });
        // renda atas
        p.ln(smooth(shake(ring(1, 0, 2.6, 110), 0.15), true), 2);
        // plakat hati
        p.ln(smooth(shake(ring(0.6, -3, 0, 48), 0.2), true), 2.6);
        p.ln(smooth(shake(ring(0.53, -3, 0, 44), 0.2), true), 1.2);
        p.raw(`<text class="txt" x="0" y="${f(cy - 2)}" text-anchor="middle" font-size="15" transform="rotate(-14 0 ${cy})" style="--i:${p.count}">${o.text || 'Love Club'}</text>`);
      });
    },
    disco(p, o = {}) {
      const R = o.r || 40;
      if (!o.mini) p.ln(line(-26, -118, 26, -118, 0.5, 4), 1.6);
      p.g('swing', () => {
        if (!o.mini) p.ln(line(0, -118, 0, -R - 1, 0.3, 3), 1.6);
        p.pf(blob(0, 0, R));
        p.ln(loop(0, 0, R, R, { over: 0.25, drift: 0.02 }), 2.2);
        for (const y of [-0.72, -0.4, -0.08, 0.26, 0.58]) {
          const yy = y * R, rx = Math.sqrt(R * R - yy * yy), ry = rx * 0.12;
          p.ln(wl([[-rx, yy], [-rx * 0.7, yy + ry * 0.7], [0, yy + ry], [rx * 0.7, yy + ry * 0.7], [rx, yy]], 0.25), 1.4);
        }
        const mer = [];
        for (let k = 0; k <= 8; k++) { const a = -Math.PI / 2 + (k / 8) * Math.PI; mer.push([Math.cos(a) * R, Math.sin(a) * R]); }
        for (let k = 0; k < 4; k++) {
          p.g('mer', () => {
            p.raw(`<circle r="${R}" fill="none" stroke="none"/>`);
            p.ln(smooth(mer, false), 1.4);
          }, '', `--k:${k};transform-box:fill-box;transform-origin:center;transform:scaleX(${f(-Math.cos((Math.PI * k) / 4) * 100) / 100})`); // posisi diam = fase animasi
        }
        p.raw(`<g class="twk" style="--k:1">`); p.fl(star(-R * 0.42, -R * 0.42, R * 0.16)); p.raw('</g>');
      });
      if (o.mini) return;
      // kilau & sinar
      [[-48, -40, 7, 0], [46, -64, 6, 1], [58, -44, 5, 2], [-46, 28, 6, 3]].forEach(([x, y, r, k]) => {
        p.raw(`<g class="twk" style="--k:${k}">`); p.ln(star(x, y, r), 1.4); p.raw('</g>');
      });
      [-150, -110, -30, 10, 40, 75, 110, 140, 170].forEach((deg, k) => {
        const a = (deg * Math.PI) / 180;
        p.raw(`<g class="ray" style="--k:${k % 4}">`);
        p.ln(line(Math.cos(a) * (R + 12), Math.sin(a) * (R + 12), Math.cos(a) * (R + 21), Math.sin(a) * (R + 21), 0.4, 1), 1.8);
        p.raw('</g>');
      });
    },
    heart(p, o = {}) {
      const pts = [];
      for (let i = 0; i <= 30; i++) {
        const t = (i / 30) * (TAU + 0.35);
        pts.push([16 * Math.sin(t) ** 3, -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))]);
      }
      if (o.fill) p.fl(smooth(pts.slice(0, 30), true));
      else p.pf(smooth(pts.slice(0, 30), true));
      p.ln(wl(pts, 0.4), o.w || 2);
    },
    rings(p) {
      p.pf(blob(-9, 6, 15)); p.ln(loop(-9, 6, 15, 14, { over: 0.4 }), 2);
      p.ln(loop(-9, 6, 11.5, 10.5, { over: -0.3 }), 1.2);
      p.ln(loop(10, 4, 15, 14, { over: 0.4 }), 2);
      p.pf(cl([[4, -10], [16, -10], [19, -15], [10, -24], [1, -15]], 0));
      p.ln(cl([[4, -10], [16, -10], [19, -15], [10, -24], [1, -15]], 0.3), 1.8);
      p.ln(wl([[1, -15], [19, -15]], 0.2), 1.2);
      p.raw('<g class="twk" style="--k:2">'); p.ln(star(24, -28, 4.5), 1.3); p.raw('</g>');
    },
    envelope(p) {
      p.pf(cl([[-24, -16], [24, -16], [24, 16], [-24, 16]], 0));
      p.ln(cl([[-24, -16], [0, -16.5], [24, -16], [24.5, 0], [24, 16], [0, 16.5], [-24, 16], [-24.5, 0]], 0.4), 2);
      p.ln(wl([[-24, -16], [-8, -2], [0, 3], [8, -2], [24, -16]], 0.4), 1.8);
      p.g('bob', () => thing.heart(p, { fill: true, w: 1 }), T(0, 3, 0.3));
    },
    gift(p) {
      p.pf(cl([[-19, -12], [19, -12], [19, 18], [-19, 18]], 0));
      p.ln(cl([[-19, -12], [0, -12.4], [19, -12], [19.4, 3], [19, 18], [0, 18.4], [-19, 18], [-19.4, 3]], 0.4), 2);
      p.ln(cl([[-22, -21], [0, -21.5], [22, -21], [22.4, -16], [22, -12], [0, -12.3], [-22, -12], [-22.4, -16]], 0.3), 2);
      p.ln(line(-1, -21, -1, 18, 0.3, 3), 1.6); p.ln(line(3, -21, 3, 18, 0.3, 3), 1.6);
      p.g('bow', () => {
        p.ln(loop(-7, -26, 7, 4.2, { rot: -0.5 }), 1.8);
        p.ln(loop(9, -26, 7, 4.2, { rot: 0.5 }), 1.8);
        p.fl(blob(1, -23, 2.4));
      });
    },
    cal(p) {
      p.pf(cl([[-20, -16], [20, -16], [20, 20], [-20, 20]], 0));
      p.ln(cl([[-20, -16], [20, -16], [20.4, 2], [20, 20], [-20, 20], [-20.4, 2]], 0.4), 2);
      p.ln(line(-20, -6, 20, -6, 0.3, 3), 1.6);
      p.ln(line(-10, -21, -10, -12, 0.2, 1), 2.2); p.ln(line(10, -21, 10, -12, 0.2, 1), 2.2);
      p.g('bob', () => thing.heart(p, { fill: true, w: 1 }), T(0, 7, 0.36));
    },
    pin(p) {
      const pts = [[0, 22], [-8, 8], [-14, -4], [-12, -14], [-5, -20], [5, -20], [12, -14], [14, -4], [8, 8]];
      p.pf(smooth(pts, true));
      p.ln(cl(pts, 0.4), 2);
      p.ln(loop(0, -7, 5, 5), 1.8);
      p.ln(loop(0, 23, 10, 2.5, { over: 0.2 }), 1.3);
    },
    camera(p) {
      p.pf(cl([[-22, -11], [22, -11], [22, 15], [-22, 15]], 0));
      p.ln(cl([[-22, -11], [-9, -11], [-5, -17], [6, -17], [10, -11], [22, -11], [22.4, 2], [22, 15], [-22, 15], [-22.4, 2]], 0.4), 2);
      p.ln(loop(0, 2, 8.5, 8.5), 2);
      p.ln(loop(0, 2, 4, 4, { over: -0.4 }), 1.2);
      p.raw('<g class="twk" style="--k:1">'); p.fl(blob(15, -5, 1.8)); p.raw('</g>');
    },
    note(p) {
      p.fl(blob(-9, 12, 6, 4.6, { rot: -0.4 }));
      p.fl(blob(11, 8, 6, 4.6, { rot: -0.4 }));
      p.ln(line(-4, 11, -4, -16, 0.3, 3), 2);
      p.ln(line(16, 7, 16, -20, 0.3, 3), 2);
      p.ln(wl([[-4, -16], [6, -18.5], [16, -20]], 0.3), 4.2);
    },
    sparkle(p) { p.ln(star(0, 0, 14), 1.8); p.raw('<g class="twk" style="--k:2">'); p.ln(star(15, -12, 5), 1.4); p.raw('</g>'); },
  };

  // ============================================================
  //  KOMPOSISI
  // ============================================================
  const comp = {
    // meja pesta di sampul (seperti referensi)
    scene(p) {
      const txt = (window.INVITATION?.playful?.cakeText) || 'Love Club';
      p.g('pop', () => thing.coupe(p), T(42, 0, 1, 2), '--n:0');
      p.g('pop', () => thing.martini(p), T(108, -8), '--n:1');
      p.g('pop', () => thing.cake(p, { text: txt }), T(206, 6), '--n:2');
      p.g('pop', () => thing.wine(p), T(298, -6, 1, -1), '--n:3');
      p.g('pop', () => thing.bottle(p), T(364, 4), '--n:4');
      p.g('roll', () => thing.lemon(p, { leaf: true }), T(160, -6, 1, 8), '--n:5');
      p.g('roll', () => thing.lemon(p), T(190, 28, 1, -10), '--n:6');
      p.g('pop', () => head.daisy(p, 9, { w: 1.4 }), T(78, 20, 1, 0), '--n:7');
      p.g('pop', () => head.bloom(p, 7, { w: 1.3 }), T(334, 26), '--n:8');
      p.g('pop', () => head.daisy(p, 6.5, { w: 1.2 }), T(255, 30), '--n:9');
    },
    disco(p, el) { thing.disco(p, { mini: el.dataset.mini != null }); },
    // buket diikat pita
    bouquet(p) {
      const set = [['rose', 16, -58, -112], ['daisy', 17, -20, -138], ['tulip', 13, 22, -128], ['bloom', 14, 56, -100], ['daisy', 12, -62, -70], ['bud', 10, 38, -152], ['berry', 10, -40, -150], ['bloom', 10, 66, -60], ['berry', 9, 4, -160]];
      set.forEach(([k, r, x, y], i) => {
        const bx = (i % 3) - 1;
        p.g('sway', () => {
          p.ln(wl([[bx * 2, 0], [x * 0.35, y * 0.4], [x, y + r * 0.5]], 0.8), 1.6);
          if (i % 2 === 0) leaf(p, x * 0.45, y * 0.5, 22, x < 0 ? Math.PI + 0.7 : -0.7, 1.4);
          p.g('', () => head[k](p, r), T(x, y));
        }, '', `${swayStyle(3)};transform-origin:50% 100%`);
      });
      p.g('bow', () => {
        p.pf(blob(-11, -28, 10, 6, { rot: -0.4 })); p.ln(loop(-11, -28, 10, 6, { rot: -0.4 }), 2);
        p.pf(blob(11, -28, 10, 6, { rot: 0.4 })); p.ln(loop(11, -28, 10, 6, { rot: 0.4 }), 2);
        p.fl(blob(0, -27, 3.6, 3.4));
        p.ln(wl([[-1, -24], [-8, -12], [-4, 0], [-10, 8]], 0.4), 2.6);
        p.ln(wl([[1, -24], [9, -12], [6, 2]], 0.4), 2.6);
      });
    },
    // semprotan bunga dari pojok (0,0) ke kanan-bawah
    corner(p) {
      const n = 6;
      for (let i = 0; i < n; i++) {
        const a = (0.12 + (i / (n - 1)) * 0.76) * (Math.PI / 2) + j(0.05);
        const len = rr(70, 130) * (i % 2 ? 0.78 : 1);
        const ex = Math.cos(a) * len, ey = Math.sin(a) * len;
        const kind = KINDS[(i * 3 + Math.floor(rnd() * 3)) % KINDS.length];
        p.g('sway', () => {
          p.ln(wl([[0, 0], [ex * 0.5 + j(5), ey * 0.5 + j(5)], [ex, ey]], 0.6), 1.6);
          leaf(p, ex * 0.42, ey * 0.42, rr(14, 20), a + (i % 2 ? 0.8 : -0.8), 1.3);
          p.g('', () => head[kind](p, rr(10, 15)), T(ex, ey, 1, (a * 180) / Math.PI - 90));
        }, '', `${swayStyle(2.5)};transform-origin:0 0`);
      }
      p.g('twk', () => p.ln(star(118, 30, 6), 1.3), '', '--k:1');
      p.g('twk', () => p.ln(star(28, 120, 5), 1.3), '', '--k:3');
    },
    // sulur pembatas dengan bunga
    garland(p) {
      const pts = [];
      for (let x = 10; x <= 590; x += 20) pts.push([x, Math.sin(x / 46) * 7]);
      p.ln(wl(pts, 0.8), 1.6);
      for (let x = 40; x < 580; x += 34) {
        const y = Math.sin(x / 46) * 7;
        const up = (x / 34) % 2 < 1 ? -1 : 1;
        leaf(p, x, y, rr(11, 15), up < 0 ? -1.1 + j(0.2) : 1.1 + j(0.2), 1.2);
      }
      [[90, 'bloom', 9], [190, 'daisy', 10], [300, 'rose', 13], [410, 'daisy', 10], [510, 'bloom', 9]].forEach(([x, k, r], i) => {
        p.g('wig', () => head[k](p, r), T(x, Math.sin(x / 46) * 7), `--jt:${(0.7 + i * 0.07).toFixed(2)}s`);
      });
      p.g('twk', () => p.ln(star(245, -20, 4.5), 1.2), '', '--k:0');
      p.g('twk', () => p.ln(star(358, 22, 4), 1.2), '', '--k:2');
    },
    // padang bunga (dasar di y = 0)
    meadow(p, el) {
      const w = Number(el.dataset.w) || 800;
      p.ln(wl(Array.from({ length: 21 }, (_, i) => [-10 + (i * (w + 20)) / 20, j(1.2)]), 0.4), 1.8);
      let x = 6;
      let k = 0;
      while (x < w) {
        const tall = rnd();
        const h = 34 + tall * 78;
        if (rnd() < 0.28) { // rumput
          p.g('sway', () => {
            p.ln(wl([[x, 0], [x - 4, -h * 0.25], [x - 8, -h * 0.4]], 0.4), 1.3);
            p.ln(wl([[x + 2, 0], [x + 3, -h * 0.3], [x + 6, -h * 0.48]], 0.4), 1.3);
            p.ln(wl([[x + 4, 0], [x + 9, -h * 0.2], [x + 13, -h * 0.3]], 0.4), 1.3);
          }, '', swayStyle(6));
        } else {
          const kind = KINDS[(k++ + Math.floor(rnd() * 2)) % KINDS.length];
          stemFlower(p, x, 0, h, j(10), kind, 8 + tall * 8, { sa: 4 });
        }
        x += rr(20, 36);
      }
    },
    // bunga tunggal bertangkai
    stem(p, el) { stemFlower(p, 0, 0, Number(el.dataset.h) || 70, 4, el.dataset.k || 'daisy', 14, { sa: 5 }); },
    // garis gelombang vertikal (cerita) — ditarik mengikuti gulir
    vline(p) {
      const pts = [];
      for (let y = 0; y <= 1000; y += 25) pts.push([10 + Math.sin(y / 38) * 5, y]);
      p.raw(`<path class="ln scrub" d="${smooth(pts, false)}" pathLength="1" vector-effect="non-scaling-stroke"/>`);
    },
    // lingkaran tangan (countdown)
    ring(p) {
      p.ln(loop(0, 0, 46, 44, { over: 0.55, drift: 0.07 }), 2);
      p.ln(loop(0, 0, 41, 40, { over: -1.6, drift: 0.04, jit: 0.04 }), 1);
    },
    squiggle(p) {
      const pts = [];
      for (let x = 0; x <= 200; x += 8) pts.push([x, Math.sin(x / 9) * 3.2 + (x / 200) * 1.5]);
      p.ln(wl(pts, 0.3), 2.2);
    },
  };

  // viewBox per jenis
  const BOX = {
    scene: '2 -162 390 205', disco: '-72 -124 144 188', discomini: '-46 -46 92 92', bouquet: '-90 -178 180 192', corner: '-6 -6 160 160',
    garland: '0 -32 600 64', meadow: '0 -125 800 128', stem: '-28 -100 56 104', vline: '0 0 20 1000', ring: '-50 -50 100 100', squiggle: '-4 -8 208 16',
    daisy: '-22 -22 44 44', bloom: '-22 -22 44 44', tulip: '-19 -30 38 36', rose: '-20 -20 40 40', bud: '-12 -24 24 28',
    coupe: '-36 -110 76 118', martini: '-38 -114 76 120', wine: '-74 -92 100 98', bottle: '-20 -158 46 162', lemon: '-37 -16 60 28', cake: '-64 -128 128 136',
    heart: '-19 -16 38 37', rings: '-28 -36 56 60', envelope: '-28 -21 56 42', gift: '-26 -34 52 56', cal: '-24 -25 48 49', pin: '-17 -23 34 52',
    camera: '-26 -21 52 40', note: '-17 -24 36 44', sparkle: '-17 -20 40 36',
  };

  function make(type, o = {}) {
    const p = Pen();
    seed(o.seed ?? 7);
    const el = o.el || { dataset: {} };
    if (comp[type]) comp[type](p, el);
    else if (head[type]) head[type](p, Number(o.r) || 18);
    else if (thing[type]) thing[type](p);
    else return '';
    let box = BOX[type === 'disco' && el.dataset.mini != null ? 'discomini' : type];
    if (type === 'meadow' && el.dataset.w) box = `0 -125 ${el.dataset.w} 128`;
    const ratio = type === 'meadow' ? ' preserveAspectRatio="xMidYMax slice"' : type === 'vline' ? ' preserveAspectRatio="none"' : '';
    const st = Math.min(0.07, 1.5 / Math.max(p.count, 1));
    return `<svg class="doodle doodle-${type}" viewBox="${box}"${ratio} style="--st:${st.toFixed(3)}s" aria-hidden="true" focusable="false">${p.html}</svg>`;
  }

  let auto = 1;
  function render(scope = document) {
    scope.querySelectorAll('[data-doodle]:not([data-drawn])').forEach((el) => {
      el.dataset.drawn = '';
      const html = make(el.dataset.doodle, { seed: el.dataset.seed ?? (auto++ * 97), el, r: el.dataset.r });
      if (!html) return;
      el.insertAdjacentHTML('beforeend', html);
      const svg = el.lastElementChild;
      if (el.hasAttribute('data-manual')) svg.classList.add('manual');
      if (el.hasAttribute('data-boil')) svg.classList.add('boil');
      if (el.dataset.b) svg.style.setProperty('--b', el.dataset.b);
    });
  }

  window.DOODLE = { make, render };
  render();
})();
