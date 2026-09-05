/* ============================================================
   REGULASI.JS — Pusat Unduh Regulasi
   Klinik Konsultasi APIP · Inspektorat Kab. Empat Lawang

   ⚙️  KONFIGURASI: Isi file_url dengan path file nyata di server
       misal: file_url: '/regulasi/perbup-standar-harga-2024.pdf'
   ============================================================ */

const REGULASI_DATA = [
  {
    title:    'UU No. 3 Tahun 2024 tentang Perubahan Kedua atas UU Desa',
    category: 'Regulasi Desa',
    year:     2024,
    icon:     '🏛️',
    file_url: 'https://peraturan.bpk.go.id/Details/283617/uu-no-3-tahun-2024'
  },
  {
    title:    'Permendagri No. 20 Tahun 2018 tentang Pengelolaan Keuangan Desa',
    category: 'Keuangan Desa',
    year:     2018,
    icon:     '📊',
    file_url: 'https://peraturan.bpk.go.id/Details/139714/permendagri-no-20-tahun-2018'
  },
  {
    title:    'PMK No. 7 Tahun 2026 tentang Pengelolaan Dana Desa Tahun Anggaran 2026',
    category: 'Dana Desa',
    year:     2026,
    icon:     '🏘️',
    file_url: 'https://jdih.kemenkeu.go.id/dok/pmk-7-tahun-2026'
  },
  {
    title:    'PP No. 60 Tahun 2014 tentang Dana Desa yang Bersumber dari APBN beserta perubahannya',
    category: 'Dana Desa',
    year:     2014,
    icon:     '💵',
    file_url: 'https://peraturan.bpk.go.id/Details/55100/pp-no-60-tahun-2014'
  },
  {
    title:    'PMK No. 54 Tahun 2026 tentang Standar Biaya Masukan',
    category: 'Standar Biaya',
    year:     2026,
    icon:     '💰',
    file_url: 'https://jdih.kemenkeu.go.id/dok/pmk-54-tahun-2026'
  },
  {
    title:    'Portal Peraturan Perpajakan Direktorat Jenderal Pajak',
    category: 'Pajak',
    year:     2026,
    icon:     '🧾',
    file_url: 'https://www.pajak.go.id/id/peraturan-pajak'
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
          ? `<a class="dl-btn" href="${r.file_url}" target="_blank" rel="noopener">⬇ Unduh</a>`
          : `<button class="dl-btn" onclick="alert('⚠️ File belum tersedia. Hubungi admin Inspektorat.')">⬇ Unduh</button>`
        }
      </div>
    </div>
  `).join('');
}
