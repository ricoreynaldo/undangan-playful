# undangan-playful

Undangan pernikahan digital bertema **playful doodle** — gambar tinta hitam-putih ala kartu
"We're getting married!" (disco ball, gelas koktail, kue hati, lemon) plus banyak bunga dan animasi.
Arsitektur sama dengan `undangan-lintang`: frontend vanilla di `public/`, server statis Express,
RSVP & ucapan di Firebase Firestore (koleksi `rsvp`).

## Berkas

| Berkas | Isi |
|---|---|
| `public/js/config.js` | **Semua konten** (nama, tanggal, acara, galeri, rekening, efek playful) |
| `public/js/app.js` | Konten, countdown, peta, galeri + lightbox, RSVP/buku tamu, salin rekening |
| `public/js/doodle.js` | Generator ilustrasi doodle (SVG murni, garis "tangan" ber-seed) untuk setiap `[data-doodle]` |
| `public/js/play.js` | Semua gerak dekoratif (lihat di bawah) |
| `public/js/db.js` | Firestore / mode demo localStorage |

Jenis doodle: `scene`, `disco`, `bouquet`, `corner`, `garland`, `meadow`, `stem`, `ring`, `squiggle`,
bunga (`daisy`, `bloom`, `tulip`, `rose`, `bud`), benda (`coupe`, `martini`, `wine`, `bottle`, `lemon`,
`cake`, `heart`, `rings`, `envelope`, `gift`, `cal`, `pin`, `camera`, `note`, `sparkle`).
Contoh: `<div data-doodle="bouquet" data-seed="5" data-boil></div>`.

## Animasi

- Semua garis doodle **tergambar sendiri** saat terlihat (stroke-dash), isian tinta menyusul
- **Line boil**: garis bergetar seperti animasi tangan (filter SVG, hanya saat terlihat)
- Sampul: judul huruf-demi-huruf berjatuhan lalu bergoyang, disco ball berayun & berputar
  (meridian bergeser), kilau berkedip, isi gelas bergoyang, lemon menggelinding, kue memantul;
  "Buka Undangan" → kartu terlempar ke atas + ledakan doodle
- Doodle berjatuhan (canvas): bunga, hati, kilau, coretan — ikut bergeser saat digulir
- Bunga di padang, buket & sulur bergoyang tertiup angin
- Pita teks berjalan, foto hitam-putih → berwarna saat muncul, polaroid miring berselotip
- Cerita: garis tinta ditarik mengikuti gulir
- Ketuk area kosong → bunga tergambar tumbuh dari titik itu lalu layu
- RSVP terkirim → ledakan doodle; ikon pilihan Hadir/Berhalangan tergambar saat dipilih
- Tombol musik = disco ball mini yang berputar saat musik diputar

Reduced motion / play.js gagal dimuat → semua doodle tetap tampil utuh, tanpa gerak.

Efek bisa diatur di `config.js`:

```js
playful: { confetti: true, plant: true, boil: true, cakeText: 'Love Club', marquee: [...] }
```

## Mengedit konten

Semua teks, tanggal, foto, rekening ada di `public/js/config.js`. `?to=Nama` mengisi nama tamu.
Foto ditaruh di `public/images/` — file yang belum ada tampil sebagai placeholder.
Foto & musik saat ini hanya CONTOH (CC0 / domain publik, lihat `CREDITS.md`) — ganti dengan
foto pasangan asli.

## Firebase

1. Buat project Firebase + Firestore, salin config web ke `public/js/firebase-config.js`.
2. Publish `firestore.rules` (`firebase deploy --only firestore:rules`).

Selama `apiKey` masih `ISI_...`, RSVP berjalan dalam **mode demo** (tersimpan di
localStorage perangkat sendiri, tidak terlihat tamu lain).

## Menjalankan

```bash
npm install
npm start
```

Buka http://localhost:3057/?to=Budi+Santoso

`thumbnail/` = gambar katalog 1200×1500 (sumber `thumbnail.html`).
