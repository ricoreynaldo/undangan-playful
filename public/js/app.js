// Konten, state & interaksi dasar. Semua gerak dekoratif ada di play.js,
// ilustrasi doodle dibuat doodle.js (app.js tetap berfungsi penuh tanpa keduanya).
(() => {
  const C = window.INVITATION;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const get = (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), C);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fx = () => window.__play; // diisi play.js bila animasi aktif

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; // selalu mulai dari sampul
  const [nameA, nameB] = C.couple.short;
  document.title = `The Wedding of ${nameA} & ${nameB}`;

  // ---------- teks & nama ----------
  $$('[data-text]').forEach((el) => {
    const v = get(el.dataset.text);
    if (v) el.textContent = v; else el.hidden = true;
  });
  $$('[data-names]').forEach((el) => { el.innerHTML = `<span>${esc(nameA)}</span> <em class="amp">+</em> <span>${esc(nameB)}</span>`; });

  // judul sampul (dua baris)
  const [t1, t2] = C.cover.title || ['Kami akan', 'menikah!'];
  const tl = $$('#coverTitle span');
  tl[0].textContent = t1 || '';
  tl[1].textContent = t2 || '';

  // pita teks berjalan
  const mq = (C.playful?.marquee || []).filter(Boolean);
  if (mq.length) {
    const run = mq.map((t, i) => `<span>${esc(t)}</span><i class="mq-ico" data-doodle="${['daisy', 'heart', 'bloom', 'sparkle'][i % 4]}" data-r="16"></i>`).join('');
    $('#marquee').innerHTML = `<div class="mq-run">${run}${run}</div><div class="mq-run">${run}${run}</div>`;
  } else $('.marquee').hidden = true;

  // ---------- foto (dengan placeholder bila file belum ada) ----------
  const phLabel = (src) => (src || '').split('/').pop() || 'foto';
  function setPhoto(img, src) {
    const holder = img.parentElement;
    const fail = () => {
      img.classList.add('ph-img');
      holder.classList.add('ph');
      holder.dataset.ph = phLabel(src);
    };
    if (!src) return fail();
    img.addEventListener('error', fail, { once: true });
    img.src = src;
  }
  $$('[data-photo]').forEach((el) => setPhoto(el, get(el.dataset.photo)));

  // ---------- nama tamu (?to=Nama) ----------
  const guest = new URLSearchParams(location.search).get('to');
  $('#guestName').textContent = guest ? guest.slice(0, 60) : C.cover.defaultGuest;
  if (guest) $('#rsvpName').value = guest.slice(0, 60);

  // ---------- instagram ----------
  ['groom', 'bride'].forEach((who) => {
    const a = $(`[data-ig="${who}"]`);
    const ig = String(C.couple[who].instagram || '').replace(/^@/, '');
    if (!a || !ig) return;
    a.href = `https://instagram.com/${encodeURIComponent(ig)}`;
    a.textContent = `@${ig}`;
    a.hidden = false;
  });

  // ---------- musik ----------
  const audio = $('#bgm');
  const musicBtn = $('#musicBtn');
  if (C.music) {
    audio.src = C.music;
    audio.addEventListener('error', () => { musicBtn.hidden = true; });
    audio.addEventListener('play', () => musicBtn.classList.add('playing'));
    audio.addEventListener('pause', () => musicBtn.classList.remove('playing'));
    musicBtn.addEventListener('click', () => (audio.paused ? audio.play().catch(() => {}) : audio.pause()));
  }

  // ---------- buka undangan ----------
  const cover = $('#cover');
  $('#openBtn').addEventListener('click', () => {
    cover.classList.add('opened'); // kartu sampul terlempar ke atas (transisi CSS)
    document.body.classList.remove('locked');
    document.documentElement.classList.add('started');
    window.scrollTo(0, 0);
    if (C.music) {
      musicBtn.hidden = false;
      audio.play().catch(() => {});
    }
    window.dispatchEvent(new Event('invite-open'));
    setTimeout(() => { cover.style.display = 'none'; }, 1500);
  });

  // ---------- countdown ----------
  const target = new Date(C.date).getTime();
  const cd = Object.fromEntries($$('[data-cd]').map((el) => [el.dataset.cd, el]));
  const pad = (n) => String(n).padStart(2, '0');
  function setUnit(el, v) {
    if (el.dataset.v === v) return;
    const first = el.dataset.v === undefined;
    el.dataset.v = v;
    if (!first && fx()?.roll) fx().roll(el, v);
    else el.innerHTML = `<span>${v}</span>`;
  }
  function tick() {
    const diff = Math.max(target - Date.now(), 0);
    const s = Math.floor(diff / 1000);
    setUnit(cd.d, pad(Math.floor(s / 86400)));
    setUnit(cd.h, pad(Math.floor((s % 86400) / 3600)));
    setUnit(cd.m, pad(Math.floor((s % 3600) / 60)));
    setUnit(cd.s, pad(s % 60));
  }
  tick();
  setInterval(tick, 1000);

  // Simpan ke Google Calendar (acara pertama, durasi 4 jam dari `date`)
  const stamp = (t) => new Date(t).toISOString().replace(/[-:]|\.\d{3}/g, '');
  const ev0 = (C.events || [])[0] || {};
  $('#calLink').href = 'https://calendar.google.com/calendar/render?' + new URLSearchParams({
    action: 'TEMPLATE',
    text: `Pernikahan ${nameA} & ${nameB}`,
    dates: `${stamp(target)}/${stamp(target + 4 * 3600e3)}`,
    location: [ev0.venue, ev0.address].filter(Boolean).join(', '),
  });

  // ---------- cerita (sulur vertikal) ----------
  const NODES = ['daisy', 'bloom', 'rose', 'tulip', 'heart', 'daisy'];
  $('#story').innerHTML = (C.story || []).map((s, i) => `
    <li class="story-item">
      <span class="story-node" data-doodle="${NODES[i % NODES.length]}" data-r="16"></span>
      <div class="story-card sketch" data-reveal>
        ${s.photo ? '<div class="story-photo photo tape"><img alt="" loading="lazy" /></div>' : ''}
        <div class="story-body">
          <span class="story-year">${esc(s.year)}</span>
          <h3>${esc(s.title)}</h3>
          <p>${esc(s.text)}</p>
        </div>
      </div>
    </li>`).join('');
  $$('#story .story-item').forEach((li, i) => {
    const img = $('img', li);
    if (img) setPhoto(img, C.story[i].photo);
  });
  if (!(C.story || []).length) $('#story-sec').hidden = true;

  // ---------- acara (peta dibuka seperti akordeon) ----------
  const ico = {
    cal: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  };
  const mapQ = (e) => e.mapQuery || [e.venue, e.address].filter(Boolean).join(', ');
  $('#eventList').innerHTML = (C.events || []).map((e, i) => `
    <article class="card sketch event" data-reveal>
      <span class="ev-ico" data-doodle="${esc(e.icon || (i ? 'coupe' : 'rings'))}" data-boil></span>
      <p class="label">Acara ${pad(i + 1)}</p>
      <h3 class="ev-label">${esc(e.label)}</h3>
      <div class="ev-info">
        <p>${ico.cal}<span><b>${esc(e.date)}</b>${esc(e.time)}</span></p>
        <p>${ico.pin}<span><b>${esc(e.venue)}</b>${esc(e.address)}</span></p>
      </div>
      <div class="ev-actions">
        <button class="btn btn-line ev-toggle" type="button" aria-expanded="false" aria-controls="map${i}">Lihat peta</button>
        <a class="btn" href="${esc(e.map || 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(mapQ(e)))}" target="_blank" rel="noopener">Buka Maps ↗</a>
      </div>
      <div class="ev-map" id="map${i}"><div><iframe data-src="https://maps.google.com/maps?q=${encodeURIComponent(mapQ(e))}&z=15&output=embed"
        title="Peta lokasi ${esc(e.label)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div></div>
    </article>`).join('');
  $('#eventList').addEventListener('click', (e) => {
    const btn = e.target.closest('.ev-toggle');
    if (!btn) return;
    const card = btn.closest('.event');
    const frame = $('iframe', card);
    if (!frame.src) frame.src = frame.dataset.src; // muat peta saat pertama dibuka
    const open = card.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? 'Tutup peta' : 'Lihat peta';
  });

  // ---------- galeri + lightbox ----------
  const gal = $('#gallery');
  const shots = C.gallery || [];
  if (!shots.length) $('#gallery-sec').hidden = true;
  $('#frameCount').textContent = `${pad(shots.length)} kenangan`;
  gal.innerHTML = shots.map((_, i) => `<button type="button" data-i="${i}" data-reveal aria-label="Buka foto ${i + 1}"><span class="photo"><img alt="Galeri ${i + 1}" loading="lazy" /></span><span class="cap hand">#${pad(i + 1)}</span></button>`).join('');
  $$('img', gal).forEach((img, i) => setPhoto(img, shots[i]));

  const lb = $('#lightbox');
  const lbImg = $('img', lb);
  const lbCount = $('#lbCount');
  let cur = 0;
  const available = () => $$('button', gal).filter((b) => !b.classList.contains('ph')).map((b) => Number(b.dataset.i));
  const showAt = (i) => {
    cur = i;
    lbImg.src = shots[cur];
    lbCount.textContent = `${pad(available().indexOf(cur) + 1)} / ${pad(available().length)}`;
  };
  function open(i) {
    if (!available().includes(i)) return;
    showAt(i);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => lb.classList.add('show')));
  }
  function close() {
    lb.classList.remove('show');
    setTimeout(() => { lb.hidden = true; document.body.style.overflow = ''; }, 350);
  }
  function step(d) {
    const list = available();
    showAt(list[(list.indexOf(cur) + d + list.length) % list.length]);
    lbImg.classList.remove('swap');
    void lbImg.offsetWidth; // ulang animasi
    lbImg.classList.add('swap');
  }
  gal.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b && !b.classList.contains('ph')) open(Number(b.dataset.i));
  });
  $('.lb-close', lb).addEventListener('click', close);
  $('.lb-nav.prev', lb).addEventListener('click', () => step(-1));
  $('.lb-nav.next', lb).addEventListener('click', () => step(1));
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  // ---------- hadiah ----------
  const g = C.gift || {};
  const cards = [];
  const ART = ['gift', 'heart', 'envelope', 'sparkle', 'rings'];
  const art = (k, t) => `<div class="gift-art"><span data-doodle="${t || ART[k % ART.length]}" data-boil></span></div>`;
  // Logo diatur lewat `logo` di config.js (file di public/images/).
  // File kosong / tidak ditemukan → kotak logo disembunyikan.
  const logoHTML = (src, alt) => (src
    ? `<span class="gift-logo"><img src="${esc(src)}" alt="${esc(alt)}" onerror="this.parentNode.remove()" /></span>`
    : '');
  const copyBtn = (value, label) => `<button class="btn btn-line copy" type="button" data-copy="${esc(value)}"><span class="c1">${label}</span><span class="c2">Tersalin ✓</span></button>`;
  (g.accounts || []).forEach((a) => {
    const wallet = a.type === 'ewallet';
    cards.push(`
    <article class="gift sketch" data-reveal>
      ${art(cards.length, wallet ? 'heart' : 'gift')}
      <div class="gift-head">
        <p class="label">No. ${pad(cards.length + 1)} · ${wallet ? 'E-wallet' : 'Transfer bank'}</p>
        ${logoHTML(a.logo, 'Logo ' + a.name)}
      </div>
      <h3>${esc(a.name)}</h3>
      <p class="acc">${esc(a.number)}</p>
      <p class="holder">a.n. ${esc(a.holder)}</p>
      ${copyBtn(String(a.number).replace(/[\s-]/g, ''), 'Salin nomor')}
    </article>`);
  });
  if (g.qris) cards.push(`
    <article class="gift sketch" data-reveal>
      ${art(cards.length, 'camera')}
      <p class="label">No. ${pad(cards.length + 1)} · Pembayaran digital</p>
      <h3>QRIS</h3>
      <div class="qris-wrap"><img class="qris" alt="Kode QRIS" data-qris /></div>
    </article>`);
  if (g.address) cards.push(`
    <article class="gift sketch" data-reveal>
      ${art(cards.length, 'envelope')}
      <p class="label">No. ${pad(cards.length + 1)} · Kirim kado</p>
      <h3>Alamat</h3>
      <address>${esc(g.addressRecipient ? g.addressRecipient + ' — ' : '')}${esc(g.address)}</address>
      ${copyBtn(g.address, 'Salin alamat')}
    </article>`);
  $('#gifts').innerHTML = cards.join('');
  const qris = $('[data-qris]');
  if (qris) setPhoto(qris, g.qris);

  const toast = $('#toast');
  let toastT;
  function notify(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove('show'), 2200);
  }
  document.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    try {
      await navigator.clipboard.writeText(b.dataset.copy);
      b.classList.add('copied');
      setTimeout(() => b.classList.remove('copied'), 1800);
    } catch {
      notify('Gagal menyalin — salin manual ya');
    }
  });

  // ---------- RSVP & buku tamu ----------
  const form = $('#rsvpForm');
  const msg = $('#rsvpMsg');
  const guestsField = $('#guestsField');
  form.addEventListener('change', (e) => {
    if (e.target.name === 'attendance') guestsField.hidden = e.target.value === 'tidak';
  });

  const list = $('#wishes');
  const more = $('#moreWishes');
  const PAGE = 10;
  let cursor = null;
  const fmtTime = (d) => (d ? d.toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '');
  const wishHTML = (w) => `
    <li>
      <div class="wish-top">
        <span class="wish-name">${esc(w.name)}</span>
        <span class="wish-tag ${w.attendance === 'hadir' ? 'yes' : ''}">${w.attendance === 'hadir' ? 'Hadir' : 'Berhalangan'}</span>
      </div>
      <p class="wish-msg">${esc(w.message)}</p>
      <p class="wish-time">${esc(fmtTime(w.createdAt))}</p>
    </li>`;

  // db.js (ES module, Firebase) memasang window.RSVP_DB lalu memicu 'db-ready'
  const dbReady = new Promise((resolve, reject) => {
    if (window.RSVP_DB) return resolve(window.RSVP_DB);
    window.addEventListener('db-ready', () => resolve(window.RSVP_DB), { once: true });
    setTimeout(() => reject(new Error('Koneksi database gagal dimuat.')), 15000);
  });

  // Firestore bisa "menggantung" (mis. database belum dibuat / offline) — beri batas waktu
  const withTimeout = (p, ms = 12000) => Promise.race([
    p, new Promise((_, rej) => setTimeout(() => rej(new Error('Buku tamu belum dapat dimuat.')), ms)),
  ]);

  async function loadStats() {
    try {
      const db = await dbReady;
      const { hadir, tidak, ucapan } = await withTimeout(db.stats());
      $('#gbStats').textContent = `${hadir} hadir · ${tidak} berhalangan · ${ucapan} ucapan${db.demo ? ' · mode demo' : ''}`;
    } catch { $('#gbStats').textContent = ''; }
  }

  async function loadWishes(reset) {
    if (reset) { cursor = null; list.innerHTML = '<li class="empty">Memuat ucapan…</li>'; }
    more.disabled = true;
    try {
      const db = await dbReady;
      const res = await withTimeout(db.page(PAGE, cursor));
      cursor = res.cursor;
      list.querySelector('.empty')?.remove();
      const before = list.children.length;
      list.insertAdjacentHTML('beforeend', res.items.map(wishHTML).join(''));
      fx()?.stagger?.([...list.children].slice(before));
      more.hidden = res.done;
      if (!list.children.length) list.innerHTML = '<li class="empty">Belum ada ucapan. Jadilah yang pertama mengirim doa!</li>';
    } catch (err) {
      console.error(err);
      if (reset) list.innerHTML = `<li class="empty">${esc(err.message || 'Buku tamu belum dapat dimuat.')}</li>`;
      more.hidden = true;
    } finally {
      more.disabled = false;
    }
  }
  more.addEventListener('click', () => loadWishes(false));
  loadWishes(true);
  loadStats();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    msg.className = 'form-msg';
    if (!data.name?.trim()) { msg.textContent = 'Mohon isi nama Anda.'; return; }
    if (!data.attendance) { msg.textContent = 'Mohon pilih konfirmasi kehadiran.'; return; }
    const btn = $('button[type=submit]', form);
    btn.disabled = true;
    try {
      await withTimeout((await dbReady).add(data), 15000);
      msg.textContent = 'Terima kasih — konfirmasi Anda sudah kami terima.';
      msg.classList.add('ok');
      form.message.value = '';
      const r = btn.getBoundingClientRect();
      fx()?.burst?.(r.left + r.width / 2, r.top + r.height / 2, 40);
      loadWishes(true);
      loadStats();
    } catch (err) {
      console.error(err);
      msg.textContent = 'Gagal mengirim, coba lagi.';
    } finally {
      btn.disabled = false;
    }
  });

  // ---------- tag WhatsApp (footer) ----------
  (() => {
    const tag = $('#waTag');
    const raw = String(C.contact?.whatsapp ?? '').replace(/\D/g, '');
    if (!tag || !raw) return;
    const num = raw.startsWith('62') ? raw : raw.startsWith('0') ? `62${raw.slice(1)}` : `62${raw}`;
    const text = C.contact.message ? `?text=${encodeURIComponent(C.contact.message)}` : '';
    tag.href = `https://wa.me/${num}${text}`;
    const loc = `0${num.slice(2)}`;
    $('span', tag).textContent = loc.replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3');
    tag.setAttribute('aria-label', `Hubungi via WhatsApp ${loc}`);
    tag.hidden = false;
  })();

  if (C.playful?.plant === false) $('#plantHint').hidden = true;
})();
