// ============================================================
//  SEMUA KONTEN UNDANGAN ADA DI SINI — cukup edit file ini.
//  Foto: taruh di public/images/ lalu sesuaikan path-nya.
//  Foto yang belum ada otomatis tampil sebagai placeholder.
//  (Isi di bawah adalah data CONTOH — ganti dengan data asli.)
// ============================================================
window.INVITATION = {
  couple: {
    short: ['Raka', 'Nadia'], // tampil besar di sampul, hero & penutup
    intro: 'Dengan memohon rahmat dan ridho Allah SWT, kami dengan gembira mengundang Bapak/Ibu/Saudara/i ke pernikahan kami:',
    groom: {
      name: 'Raka Aditya Pratama',
      title: 'S.Ds.',
      parents: 'Putra pertama dari Bapak Hendra Gunawan & Ibu Ratna Dewi',
      instagram: 'rakaaditya', // tanpa @ — kosongkan untuk menyembunyikan
      photo: 'images/groom.jpg',
    },
    bride: {
      name: 'Nadia Putri Maharani',
      title: 'S.I.Kom.',
      parents: 'Putri kedua dari Bapak Agus Salim & Ibu Wulan Sari',
      instagram: 'nadiaputri',
      photo: 'images/bride.jpg',
    },
  },

  // Tanggal utama (dipakai countdown) — format ISO lokal
  date: '2027-05-22T08:00:00+07:00',
  dateShort: '22 · 5 · 27',
  dateLong: 'Sabtu, 22 Mei 2027',
  timeShort: '08.00 WIB', // tampil di sampul di samping tanggal

  cover: {
    title: ['Kami akan', 'menikah!'], // dua baris judul sampul
    invite: 'dengan gembira mengundang anda ke pesta pernikahan kami',
    defaultGuest: 'Tamu Undangan', // dipakai bila tidak ada ?to=Nama di URL
  },

  hero: {
    photo: 'images/hero.jpg',
    kicker: 'Yeay, kami menikah!',
  },

  quote: {
    text: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.',
    source: 'QS. Ar-Rum: 21',
  },

  story: [
    {
      year: '2019',
      title: 'Kopi yang tertukar',
      text: 'Pesanan kami tertukar di sebuah kedai kopi di Kemang — ia dapat es kopi susu saya, saya dapat americano-nya. Kami tertawa, lalu duduk satu meja.',
      photo: 'images/gallery-hands.jpg',
    },
    {
      year: '2022',
      title: 'Partner segala hal',
      text: 'Dari konser kecil, nyasar di jalan tol, sampai merakit lemari bersama. Ternyata semuanya lebih seru kalau berdua.',
      photo: 'images/gallery-forest.jpg',
    },
    {
      year: '2026',
      title: 'Iya!',
      text: 'Di tengah piknik sederhana dengan kue berbentuk hati, sebuah cincin keluar dari kotak bekal. Jawabannya: iya, tentu saja!',
      photo: 'images/gallery-rings.jpg',
    },
    {
      year: '2027',
      title: 'Ayo berpesta',
      text: 'Sekarang giliran kami merayakan — dan pesta tidak akan lengkap tanpa kamu. Sampai bertemu di lantai dansa!',
      photo: 'images/gallery-aisle.jpg',
    },
  ],

  events: [
    {
      label: 'Akad Nikah',
      icon: 'rings', // doodle ikon: rings, coupe, martini, wine, cake, heart
      date: 'Sabtu, 22 Mei 2027',
      time: '08.00 — 10.00 WIB',
      venue: 'Masjid Cut Meutia',
      address: 'Jl. Cut Meutia No. 1, Menteng, Jakarta Pusat',
      // Lokasi untuk preview peta: alamat, nama tempat, atau koordinat "lat,lng"
      mapQuery: 'Masjid Cut Meutia Jakarta',
      // Link tombol "Buka Maps" (opsional — kosongkan agar otomatis dari mapQuery)
      map: '',
    },
    {
      label: 'Resepsi & Pesta',
      icon: 'coupe',
      date: 'Sabtu, 22 Mei 2027',
      time: '11.00 — 15.00 WIB',
      venue: 'Hutan Kota by Plataran',
      address: 'Jl. Jenderal Sudirman Pintu 10, Gelora, Senayan, Jakarta Pusat',
      mapQuery: 'Hutan Kota by Plataran',
      map: '',
    },
  ],

  gallery: [
    'images/gallery-smile.jpg',
    'images/gallery-veil.jpg',
    'images/gallery-hands.jpg',
    'images/gallery-shoes.jpg',
    'images/gallery-aisle.jpg',
    'images/gallery-forest.jpg',
    'images/gallery-rings.jpg',
  ],

  gift: {
    // Rekening & e-wallet — tambah / hapus baris sesuai kebutuhan.
    // type: 'bank' (Transfer bank) atau 'ewallet' (E-wallet)
    // logo: gambar di public/images/ (png/jpg/svg) — kosongkan untuk tanpa logo
    accounts: [
      { type: 'bank', name: 'BCA', number: '5270 8811 22', holder: 'Raka Aditya Pratama', logo: '' },
      { type: 'bank', name: 'Mandiri', number: '1230 0045 6789', holder: 'Nadia Putri Maharani', logo: '' },
      { type: 'ewallet', name: 'GoPay', number: '0812 3456 7788', holder: 'Nadia Putri Maharani', logo: '' },
    ],
    qris: '', // isi 'images/qris.png' bila sudah ada gambar QRIS
    address: 'Jl. Kemang Raya No. 21, Bangka, Mampang Prapatan, Jakarta Selatan 12730',
    addressRecipient: 'Nadia Putri Maharani',
  },

  closing: {
    photo: 'images/closing.jpg',
    title: 'Sampai jumpa di pesta!',
    text: 'Kehadiran dan doa restu Anda adalah hadiah paling manis untuk kami. Siapkan sepatu dansamu ya!',
  },

  // Efek playful — matikan yang tidak diinginkan
  playful: {
    confetti: true,       // doodle bunga / hati / kilau berjatuhan
    plant: true,          // ketuk area kosong untuk menggambar bunga
    boil: true,           // garis doodle "bergetar" seperti animasi tangan
    cakeText: 'Love Club', // tulisan di kue hati sampul
    marquee: ['Save the date', 'Raka + Nadia', '22 · 05 · 2027', 'Jakarta'], // pita teks berjalan
  },

  // Tag WhatsApp di footer — nomor format bebas (0812…, +62 812…, 62812…).
  // Kosongkan whatsapp ('') untuk menyembunyikan tag.
  contact: {
    whatsapp: '085920063749',
    message: 'Halo HEAVEN, saya tertarik membuat undangan digital.',
  },

  // Taruh file musik di public/audio/ — '' untuk menonaktifkan
  music: 'audio/gymnopedie.mp3',
};
