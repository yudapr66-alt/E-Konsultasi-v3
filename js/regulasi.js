/* ============================================================
     REGULASI.JS — Pusat Unduh Regulasi
  Klinik Pertanyaan APIP · Inspektorat Kab. Empat Lawang

     Dokumen PDF disimpan di folder regulasi/ pada repository.
   ============================================================ */

const REGULASI_DATA = [
  {
    title:    'UU No. 6 Tahun 2014 tentang Desa',
    category: 'Regulasi Desa',
    year:     2014,
    icon:     '🏛️',
    file_url: 'regulasi/Tentang Desa UU Nomor 06 Tahun 2014.pdf'
  },
  {
    title:    'UU No. 5 Tahun 2024 tentang Aparatur Sipil Negara',
    category: 'Kepegawaian',
    year:     2024,
    icon:     '👥',
    file_url: 'regulasi/UU nomor 05 tahun 2024 tentang ASN.pdf'
  },
  {
    title:    'Permendagri No. 77 Tahun 2020 tentang Pedoman Teknis Pengelolaan Keuangan Daerah',
    category: 'Keuangan Daerah',
    year:     2020,
    icon:     '📊',
    file_url: 'regulasi/Permendagri Nomor 77 Tahun 2020.pdf'
  },
  {
    title:    'Permendagri No. 7 Tahun 2024 tentang Aset',
    category: 'Aset Daerah',
    year:     2024,
    icon:     '🏢',
    file_url: 'regulasi/Permendagri No 7 Tahun 2024_aset.pdf'
  },
  {
    title:    'Permendesa No. 2 Tahun 2024 tentang Tata Naskah Desa',
    category: 'Administrasi Desa',
    year:     2024,
    icon:     '📄',
    file_url: 'regulasi/Tata naska Desa permendesa no 2 tahun 2024.pdf'
  },
  {
    title:    'Permendesa No. 7 Tahun 2023 tentang Prioritas Penggunaan Dana Desa',
    category: 'Dana Desa',
    year:     2023,
    icon:     '🏘️',
    file_url: 'regulasi/Prioritas Dana Desa Permendesa Nomor 7 Tahun 2023.pdf'
  },
  {
    title:    'PermendesaPDT No. 3 Tahun 2025 tentang Pendamping Desa',
    category: 'Pemberdayaan Desa',
    year:     2025,
    icon:     '🤝',
    file_url: 'regulasi/Pedoman pendamping desa PermendesPDT_Nomor_3_Tahun_2025.pdf'
  },
  {
    title:    'Permendesa No. 6 Tahun 2023 tentang Pemberdayaan Desa',
    category: 'Pemberdayaan Desa',
    year:     2023,
    icon:     '🌱',
    file_url: 'regulasi/Pemberdayaan Desa 6 th 2023.pdf'
  },
  {
    title:    'Perpres No. 46 Tahun 2025',
    category: 'Regulasi Nasional',
    year:     2025,
    icon:     '⚖️',
    file_url: 'regulasi/Peraturan Presiden Nomor 46 Tahun 2025.pdf'
  },
  {
    title:    'Perpres No. 46 Tahun 2021',
    category: 'Regulasi Nasional',
    year:     2021,
    icon:     '⚖️',
    file_url: 'regulasi/Perpres Nomor 46 Tahun 2021.pdf'
  },
  {
    title:    'Perpres No. 38 Tahun 2020',
    category: 'Regulasi Nasional',
    year:     2020,
    icon:     '⚖️',
    file_url: 'regulasi/Perpres Nomor 38 Tahun 2020.pdf'
  },
  {
    title:    'Permenkes No. 6 Tahun 2022',
    category: 'Kesehatan',
    year:     2022,
    icon:     '🏥',
    file_url: 'regulasi/Permenkes Nomor 6 Tahun 2022.pdf'
  },
  {
    title:    'Permenkes No. 3 Tahun 2023',
    category: 'Kesehatan',
    year:     2023,
    icon:     '🏥',
    file_url: 'regulasi/Permenkes Nomor 3 Tahun 2023.pdf'
  },
  {
    title:    'Perbup No. 16 Tahun 2021 tentang Dana Kapitasi dan Non-Kapitasi Jaminan Kesehatan',
    category: 'Kesehatan',
    year:     2021,
    icon:     '🩺',
    file_url: 'regulasi/PERBUP NO. 16 TAHUN 2021 - ALOKASI DAN PEMANFAATAN DANA KAPITASI DAN NON KAPITASI JAMINAN KESEHATAN.pdf'
  },
  {
    title:    'Permen No. 61 Tahun 2007',
    category: 'Regulasi Teknis',
    year:     2007,
    icon:     '📚',
    file_url: 'regulasi/Permen No.61-2007.pdf'
  },
  {
    title:    'PP No. 94 Tahun 2021 tentang Disiplin PNS',
    category: 'Kepegawaian',
    year:     2021,
    icon:     '🛡️',
    file_url: 'regulasi/PP-Nomor-94-Tahun-2021 tentang disiplin pns.pdf'
  },
  {
    title:    'Surat Edaran Hukuman Disiplin',
    category: 'Kepegawaian',
    year:     2021,
    icon:     '📌',
    file_url: 'regulasi/SE Hukuman Disiplin.pdf'
  },
  {
    title:    'Petunjuk Teknis Pengelolaan Dana Bantuan Operasional Satuan Pendidikan Tahun 2026',
    category: 'Pendidikan',
    year:     2026,
    icon:     '🎓',
    file_url: 'regulasi/Petunjuk Teknis Pengelolaan Dana Bantuan Operasional Satuan Pendidikan Tahun 2026.pdf'
  },
  {
    title:    'Pengadaan Barang Bumdes No. 3 Tahun 2021',
    category: 'BUM Desa',
    year:     2021,
    icon:     '🏪',
    file_url: 'regulasi/Pengadaan barang BumDes Nomor 3 Tahun 2021.pdf'
  },
  {
    title:    'Musdes No. 16 Tahun 2019',
    category: 'Desa',
    year:     2019,
    icon:     '👨‍👩‍👧‍👦',
    file_url: 'regulasi/Musdes No. 16 Tahun 2019.pdf'
  },
  {
    title:    'P3K PW',
    category: 'Kepegawaian',
    year: 2024,
    icon: '📋',
    file_url: 'regulasi/P3K PW.pdf'
  }
];

// ─── RENDER ──────────────────────────────────────────────────
function renderRegulasi() {
  document.getElementById('reg-grid').innerHTML = REGULASI_DATA.map(r => `
    <div class="reg-card">
      <div class="reg-icon">${r.icon}</div>
      <div>
        <h4>${r.title}</h4>
        <div class="reg-meta">${r.category} · Tahun ${r.year}</div>
        ${r.file_url !== '#'
          ? `<a class="dl-btn" href="${r.file_url}" download>⬇ Unduh PDF</a>`
          : `<button class="dl-btn" onclick="alert('⚠️ File belum tersedia. Hubungi admin Inspektorat.')">⬇ Unduh PDF</button>`
        }
      </div>
    </div>
  `).join('');
}
