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
      photo: 'img-undangan/61d0d79a7753b69f3e143795836a8153.jpg',
    },
    bride: {
      name: 'Nadia Putri Maharani',
      title: 'S.I.Kom.',
      parents: 'Putri kedua dari Bapak Agus Salim & Ibu Wulan Sari',
      instagram: 'nadiaputri',
      photo: 'img-undangan/a843abd1f4f511a3b717402a0b48a006.jpg',
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
    photo: 'img-undangan/45c3f0078259ab963014c4d835a8c48e.jpg',
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
      photo: 'img-undangan/a751177140d9a863db5f558a5c12d23a.jpg',
    },
    {
      year: '2022',
      title: 'Partner segala hal',
      text: 'Dari konser kecil, nyasar di jalan tol, sampai merakit lemari bersama. Ternyata semuanya lebih seru kalau berdua.',
      photo: 'img-undangan/d0defbbc7f6b72c5f8f8f7620ad5691a.jpg',
    },
    {
      year: '2026',
      title: 'Iya!',
      text: 'Di tengah piknik sederhana dengan kue berbentuk hati, sebuah cincin keluar dari kotak bekal. Jawabannya: iya, tentu saja!',
      photo: 'img-undangan/0a400eaa1f10a7e4a12e079a7f321df1.jpg',
    },
    {
      year: '2027',
      title: 'Ayo berpesta',
      text: 'Sekarang giliran kami merayakan — dan pesta tidak akan lengkap tanpa kamu. Sampai bertemu di lantai dansa!',
      photo: 'img-undangan/0a2085c735ff185d105bef9eb93f3b47.jpg',
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
    'img-undangan/45c3f0078259ab963014c4d835a8c48e.jpg',
    'img-undangan/6fe3e4aa5d48be2166de719e3831f568.jpg',
    'img-undangan/a751177140d9a863db5f558a5c12d23a.jpg',
    'img-undangan/af8229644236640067d2be790fe9a79a.jpg',
    'img-undangan/0a2085c735ff185d105bef9eb93f3b47.jpg',
    'img-undangan/d0defbbc7f6b72c5f8f8f7620ad5691a.jpg',
    'img-undangan/0a400eaa1f10a7e4a12e079a7f321df1.jpg',
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
    photo: 'img-undangan/a751177140d9a863db5f558a5c12d23a.jpg',
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
