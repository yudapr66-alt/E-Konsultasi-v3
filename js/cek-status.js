/* ============================================================
   CEK-STATUS.JS — Cek Status Tiket Konsultasi (Publik)
   Klinik Konsultasi APIP · Inspektorat Kab. Empat Lawang
   ============================================================ */

function cekStatus() {
  const input  = document.getElementById('cek-input').value.trim().toUpperCase();
  const result = document.getElementById('cek-result');

  if (!input) {
    alert('⚠️ Masukkan nomor tiket terlebih dahulu.');
    return;
  }

  const t = getTickets().find(x => x.ticket_number === input);

  if (!t) {
    result.style.display = 'block';
    result.innerHTML = `
      <div class="status-card">
        <div class="status-header" style="background:#FEF2F2;border-bottom:1px solid #FECACA;">
          <div>
            <div style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#DC2626;margin-bottom:4px;">Tiket Tidak Ditemukan</div>
            <div style="font-size:14px;font-weight:600;">${input}</div>
          </div>
          <div style="font-size:32px;">❌</div>
        </div>
        <div class="status-body">
          <p style="font-size:14px;color:var(--text-secondary);">Nomor tiket tidak ditemukan. Pastikan format penulisan benar (contoh: <strong>EL-2024-0001</strong>).</p>
          <p style="font-size:13px;color:var(--text-muted);margin-top:8px;">Jika baru saja mengajukan, coba lagi dalam beberapa menit.</p>
        </div>
      </div>`;
    return;
  }

  const isDone       = t.status === 'completed';
  const statusLabel  = isDone ? '✅ Telah Dijawab' : '🕐 Sedang Ditelaah';
  const statusEmoji  = isDone ? '✅' : '⏳';
  const statusClass  = isDone ? 'completed' : 'submitted';
  const statusColor  = isDone ? 'var(--success)' : 'var(--blue-mid)';

  const jawabanHtml = isDone
    ? `
      <hr style="border:none;border-top:1px solid var(--border);margin:16px 0;">
      <div style="margin-bottom:12px;">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--text-muted);margin-bottom:6px;">Dasar Hukum</div>
        <div class="legal-basis">${t.legal_basis}</div>
      </div>
      <div>
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--text-muted);margin-bottom:6px;">Rekomendasi Auditor</div>
        <div style="font-size:14px;color:var(--text-primary);line-height:1.7;">${t.auditor_recommendation}</div>
      </div>
      <div style="margin-top:16px;padding:12px 16px;background:var(--teal-light);border-radius:8px;font-size:13px;color:var(--teal);">
        💬 Untuk diskusi lanjutan, hubungi auditor penelaah langsung via WhatsApp.
        <a href="https://wa.me/6281234567890" target="_blank"
           style="display:inline-block;margin-top:6px;font-weight:700;color:var(--teal);text-decoration:none;">
          → Buka WhatsApp Auditor
        </a>
      </div>`
    : `
      <div style="margin-top:12px;padding:14px 16px;background:#EFF6FF;border-radius:8px;font-size:13px;color:var(--blue-mid);">
        ⏳ Tim auditor sedang menelaah permohonan Anda. Tanggapan akan dikirim ke WhatsApp
        <strong>${t.whatsapp_number}</strong> dalam 1×24 jam kerja.
      </div>`;

  result.style.display = 'block';
  result.innerHTML = `
    <div class="status-card">
      <div class="status-header ${statusClass}">
        <div>
          <div style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${statusColor};margin-bottom:4px;">${statusLabel}</div>
          <div style="font-size:18px;font-weight:800;font-family:'Playfair Display',serif;">${t.ticket_number}</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">Diajukan ${formatDate(t.created_at)}</div>
        </div>
        <div style="font-size:36px;">${statusEmoji}</div>
      </div>
      <div class="status-body">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 20px;margin-bottom:4px;">
          <div>
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--text-muted);">Pemohon</div>
            <div style="font-size:13px;">${t.submitter_name}</div>
          </div>
          <div>
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--text-muted);">Instansi</div>
            <div style="font-size:13px;">${t.institution_name}</div>
          </div>
          <div>
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--text-muted);">Kegiatan</div>
            <div style="font-size:13px;">${t.activity_name}</div>
          </div>
          <div>
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--text-muted);">Tanggapan</div>
            <div style="font-size:13px;">${isDone ? formatDate(t.responded_at) : 'Belum tersedia'}</div>
          </div>
          ${t.attachment && t.attachment.name ? `
          <div style="grid-column:1/-1;">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--text-muted);margin-bottom:4px;">Berkas Lampiran</div>
            <div style="display:inline-flex;align-items:center;gap:6px;font-size:12px;
                        background:#EFF6FF;color:#1B4F8A;padding:5px 10px;border-radius:6px;font-weight:600;">
              📎 ${t.attachment.name}
              <span style="font-weight:400;color:#64748B;">(${t.attachment.size ? (t.attachment.size/1048576).toFixed(2)+' MB' : ''})</span>
            </div>
          </div>` : ''}
        </div>
        ${jawabanHtml}
      </div>
    </div>`;
}
