/* ============================================================
   TELAAH.JS — Modal Telaah Auditor, AI Auto-Draft, WA Send
   Klinik Konsultasi APIP · Inspektorat Kab. Empat Lawang

   ⚙️  KONFIGURASI:
       - WA_AUDITOR_NUMBER → nomor WA default auditor penelaah
       - Model Claude dapat diganti di aiDraftTelaah()
   ============================================================ */

const WA_AUDITOR_NUMBER = '6281234567890';  // ← ganti nomor WA auditor utama

let currentTicketId = null;

// ─── BUKA MODAL TELAAH ───────────────────────────────────────
function openTelaah(id) {
  currentTicketId = id;
  const t = getTickets().find(x => x.id === id);
  if (!t) return;

  // Isi header & nomor tiket
  document.getElementById('tm-ticket-num').textContent = t.ticket_number;

  // Isi grid info pemohon
  document.getElementById('tm-info').innerHTML = `
    <div class="info-item"><label>Pemohon</label><span>${t.submitter_name}</span></div>
    <div class="info-item"><label>Instansi</label><span>${t.institution_name}</span></div>
    <div class="info-item"><label>Jabatan</label><span>${t.position}</span></div>
    <div class="info-item"><label>Kecamatan</label><span>${t.district || '-'}</span></div>
    <div class="info-item"><label>WhatsApp</label><span>${t.whatsapp_number}</span></div>
    <div class="info-item"><label>Program</label><span>${t.program_name}</span></div>
    <div class="info-item"><label>Kegiatan</label><span>${t.activity_name}</span></div>
    <div class="info-item"><label>Tanggal Masuk</label><span>${formatDate(t.created_at)}</span></div>
  `;

  // Uraian pertanyaan
  document.getElementById('tm-uraian').textContent = t.issue_description;

  // ── Lampiran ───────────────────────────────────────────
  const lampiranEl = document.getElementById('tm-lampiran');
  const fileData   = getFileFromStorage(t.id);

  if (t.attachment && t.attachment.name) {
    // Ada metadata file
    lampiranEl.style.display = 'block';

    if (fileData && fileData.data) {
      // File ada di localStorage → bisa diunduh & preview
      const icon    = fileData.type && fileData.type.includes('pdf') ? '📄' :
                      fileData.name.endsWith('.xlsx') || fileData.name.endsWith('.xls') ? '📊' :
                      fileData.name.endsWith('.docx') || fileData.name.endsWith('.doc') ? '📝' : '📎';
      const sizeMB  = fileData.size ? (fileData.size / 1048576).toFixed(2) + ' MB' : '';

      lampiranEl.innerHTML = `
        <div style="border:1px solid #BFDBFE;border-radius:10px;overflow:hidden;">
          <div style="background:#EFF6FF;padding:12px 16px;display:flex;align-items:center;gap:12px;">
            <span style="font-size:28px;">${icon}</span>
            <div style="flex:1;">
              <div style="font-size:13px;font-weight:700;color:#1B4F8A;">${fileData.name}</div>
              <div style="font-size:11px;color:#64748B;">${sizeMB} · Tersimpan di sistem</div>
            </div>
            <button onclick="downloadAttachment('${t.id}')"
                    style="background:#1B4F8A;color:#fff;border:none;border-radius:6px;
                           padding:7px 14px;font-size:12px;font-weight:600;
                           cursor:pointer;font-family:Inter,sans-serif;">
              ⬇ Unduh
            </button>
          </div>
          ${fileData.type && fileData.type.includes('pdf')
            ? `<div style="padding:0;">
                 <iframe src="${fileData.data}" style="width:100%;height:340px;border:none;display:block;"
                         title="Preview: ${fileData.name}"></iframe>
               </div>`
            : `<div style="padding:12px 16px;font-size:12px;color:#64748B;background:#F8FAFC;">
                 📋 Preview tidak tersedia untuk format ini. Klik <strong>Unduh</strong> untuk membuka file.
               </div>`
          }
        </div>`;
    } else {
      // Metadata ada tapi data file tidak ditemukan di localStorage
      lampiranEl.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;
                    background:#FEF9C3;border:1px solid #FDE047;border-radius:8px;">
          <span style="font-size:20px;">⚠️</span>
          <div>
            <div style="font-size:13px;font-weight:600;color:#854D0E;">
              File "${t.attachment.name}" tidak dapat ditemukan
            </div>
            <div style="font-size:12px;color:#92400E;margin-top:2px;">
              File mungkin terhapus dari penyimpanan browser atau dikirim dari perangkat lain.
            </div>
          </div>
        </div>`;
    }
  } else {
    lampiranEl.style.display = 'none';
    lampiranEl.innerHTML = '';
  }

  // Mode: sudah dijawab vs belum
  if (t.status === 'completed') {
    document.getElementById('tm-input-section').style.display  = 'none';
    document.getElementById('tm-jawaban-view').style.display   = 'block';
    document.getElementById('tm-lb-view').textContent          = '📜 ' + t.legal_basis;
    document.getElementById('tm-rek-view').textContent         = t.auditor_recommendation;
  } else {
    document.getElementById('tm-input-section').style.display  = 'block';
    document.getElementById('tm-jawaban-view').style.display   = 'none';
    document.getElementById('tm-legal').value                  = '';
    document.getElementById('tm-rek').value                    = '';
    document.getElementById('tm-public').checked               = false;
    document.getElementById('tm-wa-preview').style.display     = 'none';
  }

  document.getElementById('telaah-modal').classList.add('open');
}

// ─── TUTUP MODAL TELAAH ──────────────────────────────────────
function closeTelaah() {
  document.getElementById('telaah-modal').classList.remove('open');
  currentTicketId = null;
}

// ─── UNDUH FILE LAMPIRAN ─────────────────────────────────────
function downloadAttachment(ticketId) {
  const fileData = getFileFromStorage(ticketId);
  if (!fileData || !fileData.data) {
    alert('⚠️ File tidak ditemukan di penyimpanan browser.');
    return;
  }
  const a = document.createElement('a');
  a.href     = fileData.data;
  a.download = fileData.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ─── PREVIEW PESAN WHATSAPP ──────────────────────────────────
function previewWA() {
  const t   = getTickets().find(x => x.id === currentTicketId);
  const rek = document.getElementById('tm-rek').value.trim();
  if (!rek) { alert('Isi kolom Rekomendasi terlebih dahulu sebelum preview.'); return; }

  const rekSingkat = rek.length > 150 ? rek.substring(0, 150) + '...' : rek;
  const waText = `Halo Bapak/Ibu ${t.submitter_name} (${t.institution_name}), permohonan konsultasi Anda terkait "${t.activity_name}" telah ditelaah oleh Tim Auditor Inspektorat.

Ringkasan Rekomendasi:
${rekSingkat}

Untuk diskusi lebih lanjut secara langsung, silakan hubungi Auditor Penelaah via WhatsApp di tautan berikut:
https://wa.me/${WA_AUDITOR_NUMBER}`;

  document.getElementById('tm-wa-text').textContent   = waText;
  document.getElementById('tm-wa-preview').style.display = 'block';
}

function togglePublicCheck() {
  // Placeholder — logika dijalankan saat sendTelaah()
}

// ─── KIRIM TANGGAPAN ─────────────────────────────────────────
function sendTelaah() {
  const legal = document.getElementById('tm-legal').value.trim();
  const rek   = document.getElementById('tm-rek').value.trim();

  if (!legal || !rek) {
    alert('⚠️ Dasar Hukum dan Rekomendasi wajib diisi sebelum mengirim tanggapan.');
    return;
  }

  const isPublic = document.getElementById('tm-public').checked;
  const tickets  = getTickets();
  const idx      = tickets.findIndex(x => x.id === currentTicketId);
  if (idx === -1) return;

  const t = tickets[idx];

  // Simpan tanggapan
  tickets[idx] = {
    ...t,
    status:                 'completed',
    legal_basis:            legal,
    auditor_recommendation: rek,
    is_public_faq:          isPublic,
    responded_at:           new Date().toISOString(),
    assigned_auditor_id:    localStorage.getItem('el_admin_logged') || '1'
  };
  saveTickets(tickets);

  // Bangun link WA
  const waMessage = encodeURIComponent(
    `Halo Bapak/Ibu ${t.submitter_name} (${t.institution_name}), ` +
    `permohonan konsultasi Anda terkait "${t.activity_name}" telah ditelaah oleh Tim Auditor Inspektorat.\n\n` +
    `Ringkasan Rekomendasi:\n${rek.substring(0, 200)}...\n\n` +
    `Untuk diskusi lebih lanjut, hubungi Auditor Penelaah: https://wa.me/${WA_AUDITOR_NUMBER}`
  );
  const waLink = `https://wa.me/${t.whatsapp_number}?text=${waMessage}`;

  closeTelaah();
  renderTickets();
  updateStats();

  setTimeout(() => {
    const ok = confirm(
      `✅ Tanggapan berhasil disimpan!\n\n` +
      `📱 Klik OK untuk membuka WhatsApp dan kirim notifikasi ke pemohon (${t.whatsapp_number}).`
    );
    if (ok) window.open(waLink, '_blank');
  }, 200);
}

// ─── AI AUTO-DRAFT TELAAH (Claude API) ──────────────────────
async function aiDraftTelaah() {
  const t = getTickets().find(x => x.id === currentTicketId);
  if (!t) return;

  const btn = document.getElementById('ai-draft-btn');
  btn.disabled  = true;
  btn.innerHTML = '<span class="ai-loading"></span> AI sedang menyusun draft...';

  const prompt = `Anda adalah Auditor Inspektorat Daerah Kabupaten Empat Lawang, Sumatera Selatan. \
Anda ahli dalam peraturan keuangan desa, pajak Dana Desa, pengadaan barang/jasa pemerintah daerah, dan SPJ kegiatan.

Seorang perangkat ${t.institution_type === 'opd' ? 'OPD' : 'Desa/Kecamatan'} dari ${t.institution_name} \
(jabatan: ${t.position}) mengajukan pertanyaan konsultasi sebagai berikut:

Program/Kegiatan: "${t.program_name} — ${t.activity_name}"

Pertanyaan:
"${t.issue_description}"

Tugas Anda: Berikan telaah profesional. Respons HANYA berupa JSON murni tanpa markdown/backtick:
{
  "dasar_hukum": "Sebutkan 2-3 peraturan perundang-undangan yang relevan secara spesifik (nomor, pasal, ayat)",
  "rekomendasi": "Telaah komprehensif dan rekomendasi tindakan konkret dalam 3-4 kalimat. Gunakan bahasa Indonesia formal namun mudah dipahami oleh perangkat desa."
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model:      'claude-sonnet-4-6',
        max_tokens: 1000,
        messages:   [{ role: 'user', content: prompt }]
      })
    });

    const data    = await response.json();
    const raw     = data.content.map(c => c.text || '').join('');
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed  = JSON.parse(cleaned);

    document.getElementById('tm-legal').value = parsed.dasar_hukum || '';
    document.getElementById('tm-rek').value   = parsed.rekomendasi  || '';

    btn.innerHTML = '✅ Draft AI berhasil — periksa & edit sebelum kirim';
    btn.style.background = 'linear-gradient(135deg,#059669,#0D9488)';

  } catch (err) {
    console.error('AI Draft error:', err);
    btn.innerHTML = '⚠️ Gagal terhubung ke AI — coba lagi';
    btn.style.background = 'linear-gradient(135deg,#DC2626,#B91C1C)';
  }

  // Reset tombol setelah 4 detik
  setTimeout(() => {
    btn.innerHTML        = '✨ Draft Otomatis dengan AI (Claude)';
    btn.style.background = '';
    btn.disabled         = false;
  }, 4000);
}

// ─── TUTUP MODAL JIKA KLIK DI LUAR ─────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('telaah-modal').addEventListener('click', function (e) {
    if (e.target === this) closeTelaah();
  });
});
