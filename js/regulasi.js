/* ============================================================
   REGULASI.JS — Pusat Unduh Regulasi
   Klinik Konsultasi APIP · Inspektorat Kab. Empat Lawang

   ⚙️  KONFIGURASI: Isi file_url dengan path file nyata di server
       misal: file_url: '/regulasi/perbup-standar-harga-2024.pdf'
   ============================================================ */

const REGULASI_DATA = [
  {
    title:    'Peraturan Bupati Empat Lawang No. 32 Tahun 2024 tentang Standar Satuan Harga',
    category: 'Standar Harga',
    year:     2024,
    icon:     '💰',
    file_url: '#'     // ← ganti dengan path file nyata
  },
  {
    title:    'PMK No. 193/PMK.07/2018 tentang Pengelolaan Dana Desa',
    category: 'Dana Desa',
    year:     2018,
    icon:     '🏘️',
    file_url: 'https://jdih.kemenkeu.go.id/fullText/2018/193~PMK.07~2018Per.pdf'
  },
  {
    title:    'Permendagri No. 20 Tahun 2018 tentang Pengelolaan Keuangan Desa',
    category: 'Keuangan Desa',
    year:     2018,
    icon:     '📊',
    file_url: '#'
  },
  {
    title:    'PMK No. 85/PMK.05/2018 tentang Tata Cara Pemungutan Pajak Dana Desa',
    category: 'Pajak',
    year:     2018,
    icon:     '🧾',
    file_url: '#'
  },
  {
    title:    'UU No. 6 Tahun 2014 tentang Desa',
    category: 'Regulasi Desa',
    year:     2014,
    icon:     '🏛️',
    file_url: 'https://peraturan.bpk.go.id/Details/38582/uu-no-6-tahun-2014'
  },
  {
    title:    'PP No. 60 Tahun 2014 tentang Dana Desa yang Bersumber dari APBN',
    category: 'Dana Desa',
    year:     2014,
    icon:     '💵',
    file_url: '#'
  },
  {
    title:    'PMK No. 199/PMK.07/2021 tentang Pengelolaan Dana Desa',
    category: 'Dana Desa',
    year:     2021,
    icon:     '🏘️',
    file_url: '#'
  },
  {
    title:    'Pedoman Teknis Penyusunan SPJ Dana Desa — Inspektorat Kab. Empat Lawang 2024',
    category: 'Pedoman Teknis',
    year:     2024,
    icon:     '📋',
    file_url: '#'     // ← upload ke server dan isi path-nya
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
