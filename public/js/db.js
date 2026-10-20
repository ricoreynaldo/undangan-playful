// Penyimpanan RSVP & ucapan di Cloud Firestore (koleksi `rsvp`).
// Dimuat sebagai ES module; app.js menunggu event `db-ready`.
// Bila firebase-config.js belum diisi → mode demo (localStorage perangkat ini).
import { firebaseConfig } from './firebase-config.js';

const configured = !String(firebaseConfig.apiKey || '').startsWith('ISI_');

// Normalisasi input — sama untuk Firestore maupun mode demo (cocok dengan firestore.rules)
function clean({ name, attendance, guests, message }) {
  const msg = String(message || '').replace(/\s+/g, ' ').trim().slice(0, 500);
  return {
    name: String(name).replace(/\s+/g, ' ').trim().slice(0, 60),
    attendance,
    guests: attendance === 'hadir' ? Math.min(Math.max(parseInt(guests, 10) || 1, 1), 10) : 0,
    message: msg,
    hasMessage: msg.length > 0,
  };
}

let api;
if (!configured) {
  const KEY = 'undangan-playful:rsvp';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
  const write = (rows) => { try { localStorage.setItem(KEY, JSON.stringify(rows)); } catch { /* storage diblokir */ } };

  api = {
    configured,
    demo: true,

    async page(size, cursor) {
      const all = read().filter((w) => w.hasMessage).sort((a, b) => b.createdAt - a.createdAt);
      const start = cursor || 0;
      const items = all.slice(start, start + size).map((w) => ({ ...w, createdAt: new Date(w.createdAt) }));
      return { items, cursor: start + items.length, done: start + size >= all.length };
    },

    async stats() {
      const rows = read();
      return {
        hadir: rows.filter((w) => w.attendance === 'hadir').length,
        tidak: rows.filter((w) => w.attendance === 'tidak').length,
        ucapan: rows.filter((w) => w.hasMessage).length,
      };
    },

    async add(data) {
      const rows = read();
      rows.push({ id: Date.now().toString(36), ...clean(data), createdAt: Date.now() });
      write(rows);
    },
  };
} else {
  const { initializeApp } = await import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js');
  const {
    getFirestore, collection, addDoc, query, where, orderBy, limit, startAfter,
    getDocs, getCountFromServer, serverTimestamp,
  } = await import('https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js');

  const db = getFirestore(initializeApp(firebaseConfig));
  const col = collection(db, 'rsvp');

  api = {
    configured,

    // Satu halaman ucapan, terbaru dulu. `cursor` = dokumen terakhir halaman sebelumnya.
    async page(size, cursor) {
      const parts = [col, orderBy('createdAt', 'desc'), limit(size)];
      if (cursor) parts.push(startAfter(cursor));
      const snap = await getDocs(query(...parts));
      const items = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((w) => w.hasMessage)
        .map((w) => ({ ...w, createdAt: w.createdAt?.toDate?.() ?? null }));
      return { items, cursor: snap.docs[snap.docs.length - 1] || null, done: snap.docs.length < size };
    },

    async stats() {
      const count = async (...q) => (await getCountFromServer(query(col, ...q))).data().count;
      const [hadir, tidak, ucapan] = await Promise.all([
        count(where('attendance', '==', 'hadir')),
        count(where('attendance', '==', 'tidak')),
        count(where('hasMessage', '==', true)),
      ]);
      return { hadir, tidak, ucapan };
    },

    async add(data) {
      await addDoc(col, { ...clean(data), createdAt: serverTimestamp() });
    },
  };
}

window.RSVP_DB = api;
window.dispatchEvent(new Event('db-ready'));
