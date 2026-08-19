/* ============================================================
   LAPORAN.JS — Grafik Rekap & Ekspor CSV
   Klinik Konsultasi APIP · Inspektorat Kab. Empat Lawang
   ============================================================ */

// ─── RENDER GRAFIK LAPORAN ───────────────────────────────────
function renderLaporan() {
  const tickets = getTickets();

  // ── Chart 1: Per Jenis Instansi ──────────────────────────
  const byType = { desa: 0, kecamatan: 0, opd: 0 };
  tickets.forEach(t => {
    if (byType[t.institution_type] !== undefined) byType[t.institution_type]++;
  });
  const maxType      = Math.max(...Object.values(byType), 1);
  const typeLabels   = { desa: '🏘 Desa', kecamatan: '🏢 Kecamatan', opd: '🏛 OPD' };
  const typeColors   = { desa: '#2563EB', kecamatan: '#0E7490', opd: '#D97706' };

  document.getElementById('chart-bars').innerHTML = Object.entries(byType).map(([k, v]) => `
    <div class="chart-bar-row">
      <div class="chart-bar-label">${typeLabels[k]}</div>
      <div class="chart-bar-track">
        <div class="chart-bar-fill"
             style="width:${(v / maxType * 100) || 0}%;background:${typeColors[k]};">
          ${v > 0 ? v : ''}
        </div>
      </div>
      <div class="chart-bar-num">${v}</div>
    </div>
  `).join('');

  // ── Chart 2: Per Kecamatan ───────────────────────────────
  const byKec = {};
  tickets.forEach(t => {
    const k = t.district || 'Tidak diisi';
    byKec[k] = (byKec[k] || 0) + 1;
  });
  const sortedKec = Object.entries(byKec).sort((a, b) => b[1] - a[1]);
  const maxKec    = Math.max(...sortedKec.map(x => x[1]), 1);

  document.getElementById('chart-kec').innerHTML = sortedKec.length
    ? sortedKec.map(([k, v]) => `
        <div class="chart-bar-row">
          <div class="chart-bar-label" style="font-size:11px;">${k}</div>
          <div class="chart-bar-track">
            <div class="chart-bar-fill"
                 style="width:${(v / maxKec * 100) || 0}%;background:#1B4F8A;">
              ${v > 0 ? v : ''}
            </div>
          </div>
          <div class="chart-bar-num">${v}</div>
        </div>
      `).join('')
    : '<div style="font-size:13px;color:var(--text-muted);padding:12px 0;">Belum ada data kecamatan.</div>';
}

// ─── EKSPOR CSV ──────────────────────────────────────────────
function exportCSV() {
  const tickets = getTickets();

  if (tickets.length === 0) {
    alert('ℹ️ Belum ada data tiket untuk diekspor.');
    return;
  }

  const header = [
    'Nomor Tiket', 'Nama Pemohon', 'Instansi', 'Kecamatan',
    'Jabatan', 'WhatsApp', 'Email',
    'Program', 'Kegiatan',
    'Status', 'Tanggal Masuk', 'Tanggal Dijawab',
    'FAQ Publik', 'Dasar Hukum', 'Rekomendasi'
  ];

  const rows = tickets.map(t => [
    t.ticket_number,
    t.submitter_name,
    t.institution_name,
    t.district         || '',
    t.position,
    t.whatsapp_number,
    t.email            || '',
    t.program_name,
    t.activity_name,
    t.status === 'completed' ? 'Selesai' : 'Menunggu',
    formatDate(t.created_at),
    formatDate(t.responded_at),
    t.is_public_faq    ? 'Ya' : 'Tidak',
    t.legal_basis      || '',
    t.auditor_recommendation || ''
  ]);

  const csvContent = [header, ...rows]
    .map(row => row.map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  a.href     = url;
  a.download = `laporan-konsultasi-inspektorat-${date}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
