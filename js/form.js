/* ============================================================
   FORM.JS — Formulir Pengajuan Konsultasi Publik
   Klinik Konsultasi APIP · Inspektorat Kab. Empat Lawang
   ============================================================ */

// ─── DATA MASTER INSTANSI ────────────────────────────────────
const INSTANSI_DATA = {

 /* opd: {
    label: 'OPD',
    unitLabel: 'Nama OPD',
    units: [
      'Dinas Pendidikan dan Kebudayaan',
      'Dinas Kesehatan',
      'Dinas Pekerjaan Umum dan Penataan Ruang',
      'Dinas Perumahan Rakyat dan Kawasan Permukiman',
      'Dinas Sosial',
      'Dinas Pemberdayaan Masyarakat dan Desa',
      'Dinas Kependudukan dan Pencatatan Sipil',
      'Dinas Pengendalian Penduduk dan KB',
      'Dinas Pertanian',
      'Dinas Perikanan',
      'Dinas Perdagangan, Koperasi dan UKM',
      'Dinas Lingkungan Hidup',
      'Dinas Komunikasi dan Informatika',
      'Dinas Penanaman Modal dan PTSP',
      'Dinas Kepemudaan dan Olahraga',
      'Dinas Perpustakaan dan Kearsipan',
      'Dinas Pariwisata',
      'Badan Perencanaan Pembangunan Daerah',
      'Badan Pengelolaan Keuangan dan Aset Daerah',
      'Badan Kepegawaian dan Pengembangan SDM',
      'Badan Penanggulangan Bencana Daerah',
      'Badan Kesatuan Bangsa dan Politik',
      'Inspektorat Daerah',
      'Sekretariat Daerah',
      'Sekretariat DPRD',
      'Satuan Polisi Pamong Praja',
      'Kantor Kecamatan Pendopo',
      'Kantor Kecamatan Pendopo Barat',
      'Kantor Kecamatan Pasemah Air Keruh',
      'Kantor Kecamatan Muara Pinang',
      'Kantor Kecamatan Lintang Kanan',
      'Kantor Kecamatan Saling',
      'Kantor Kecamatan Ulu Musi',
      'Kantor Kecamatan Talang Padang',
    ]
  },
*/

  kecamatan: {
    label: 'Kecamatan',
    unitLabel: 'Unit / Desa / Sekolah',
    units: {
      'Kecamatan Pasemah Air Keruh': [
        'Desa Air Mayam','Desa Bandar Agung','Desa Kebon Jati',
        'Desa Lawang Agung','Desa Muara Aman','Desa Muara Rungga',
        'Desa Muara Sindang','Desa Nanjungan','Desa Padang Bindu',
        'Desa Padang Gelai','Desa Pagar Jati','Desa Penantian',
        'Desa Talang Padang','Desa Talang Randai','Desa Tanjung Beringin',
        'SDN 01 Pasemah Air Keruh','SDN 02 Pasemah Air Keruh',
        'SDN 03 Pasemah Air Keruh','SDN 04 Pasemah Air Keruh',
        'SDN 05 Pasemah Air Keruh','SDN 06 Pasemah Air Keruh',
        'SDN 07 Pasemah Air Keruh','SDN 08 Pasemah Air Keruh',
        'SDN 09 Pasemah Air Keruh','SDN 10 Pasemah Air Keruh',
        'SDN 11 Pasemah Air Keruh','SDN 12 Pasemah Air Keruh',
        'SDN 13 Pasemah Air Keruh','SDN 14 Pasemah Air Keruh',
        'SDN 15 Pasemah Air Keruh','SDN 16 Pasemah Air Keruh',
        'SDN 17 Pasemah Air Keruh',
        'SMPN 01 Pasemah Air Keruh','SMPN 02 Pasemah Air Keruh',
        'SMPN 03 Pasemah Air Keruh','SMPN 04 Pasemah Air Keruh',
      ],
    }
  },

  puskesmas: {
    label: 'Puskesmas',
    unitLabel: 'Nama Puskesmas',
    units: [
      'Puskesmas Pasemah Air Keruh',
    ]
  },
};

// ─── TOGGLE DROPDOWN INSTANSI ────────────────────────────────
function toggleInstName() {
  const type      = document.getElementById('f-inst-type').value;
  const unitGroup = document.getElementById('f-unit-group');
  const unitLabel = document.getElementById('f-unit-label');
  const unitSel   = document.getElementById('f-unit');

  // Hapus sub-unit lama jika ada
  const oldSub = document.getElementById('f-subunit-group');
  if (oldSub) oldSub.remove();

  // Reset unit
  unitSel.innerHTML = '<option value="">— Pilih Unit —</option>';
  unitSel.onchange  = null;

  if (!type) {
    unitGroup.style.display = 'none';
    return;
  }

  unitGroup.style.display = 'block';
  const data = INSTANSI_DATA[type];
  unitLabel.innerHTML = `${data.unitLabel} <span class="req">*</span>`;

  if (type === 'kecamatan') {
    // Level 1: pilih kecamatan
    Object.keys(data.units).forEach(kec => {
      const opt = document.createElement('option');
      opt.value = kec;
      opt.textContent = kec;
      unitSel.appendChild(opt);
    });
    unitLabel.innerHTML = 'Kecamatan <span class="req">*</span>';
    unitSel.onchange = showSubUnit;
  } else {
    // Langsung tampil daftar unit
    data.units.forEach(u => {
      const opt = document.createElement('option');
      opt.value = u;
      opt.textContent = u;
      unitSel.appendChild(opt);
    });
  }
}

// ─── TAMPILKAN SUB-UNIT (DESA/SEKOLAH) SETELAH PILIH KECAMATAN
function showSubUnit() {
  const kec  = document.getElementById('f-unit').value;
  const data = INSTANSI_DATA.kecamatan.units[kec] || [];

  // Hapus sub-unit lama
  const old = document.getElementById('f-subunit-group');
  if (old) old.remove();
  if (!kec || data.length === 0) return;

  const group = document.createElement('div');
  group.className = 'form-group';
  group.id        = 'f-subunit-group';
  group.innerHTML = `
    <label>Desa / Sekolah <span class="req">*</span></label>
    <select id="f-subunit">
      <option value="">— Pilih Desa / Sekolah —</option>
      ${data.map(u => `<option value="${u}">${u}</option>`).join('')}
    </select>`;

  const unitGroup = document.getElementById('f-unit-group');
  unitGroup.parentNode.insertBefore(group, unitGroup.nextSibling);
}

// Helper: nama instansi lengkap
function getInstansiName() {
  const type = document.getElementById('f-inst-type').value;
  if (!type) return '';
  if (type === 'kecamatan') {
    const kec = document.getElementById('f-unit').value;
    const sub = document.getElementById('f-subunit');
    if (sub && sub.value) return sub.value + ' — ' + kec;
    return kec;
  }
  return document.getElementById('f-unit').value;
}

function getKecamatan() {
  const type = document.getElementById('f-inst-type').value;
  if (type === 'kecamatan') return document.getElementById('f-unit').value;
  return '';
}

function normalizeWhatsAppNumber(value) {
  const digits = value.replace(/[^\d+]/g, '');
  if (digits.startsWith('+62')) return '62' + digits.slice(3);
  if (digits.startsWith('62')) return digits;
  if (digits.startsWith('08')) return '628' + digits.slice(2);
  return digits;
}

// ─── PENYIMPANAN FILE (base64 → localStorage) ────────────────
// File disimpan terpisah dengan key 'el_file_{ticketId}'
// agar tidak membebani data tiket utama

function saveFileToStorage(ticketId, file) {
  return new Promise((resolve, reject) => {
    if (!file) { resolve(null); return; }

    // Cek ukuran: max 5MB setelah base64 (~3.75MB file asli)
    if (file.size > 3900000) {
      alert('⚠️ Ukuran file terlalu besar untuk disimpan lokal.\nMaks. ~3.5 MB. File tidak dilampirkan.');
      resolve(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const payload = {
          name:     file.name,
          type:     file.type,
          size:     file.size,
          data:     e.target.result,   // format: "data:application/pdf;base64,..."
          savedAt:  new Date().toISOString()
        };
        localStorage.setItem('el_file_' + ticketId, JSON.stringify(payload));
        resolve({
          name: file.name,
          type: file.type,
          size: file.size,
          key:  'el_file_' + ticketId   // referensi ke localStorage
        });
      } catch(err) {
        // localStorage penuh
        console.error('File save error:', err);
        alert('⚠️ Penyimpanan penuh, file tidak bisa disimpan. Coba hapus data lama atau kurangi ukuran file.');
        resolve(null);
      }
    };
    reader.onerror = () => { reject(new Error('Gagal membaca file')); };
    reader.readAsDataURL(file);
  });
}

function getFileFromStorage(ticketId) {
  try {
    const raw = localStorage.getItem('el_file_' + ticketId);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function deleteFileFromStorage(ticketId) {
  localStorage.removeItem('el_file_' + ticketId);
}

// ─── UPLOAD LABEL & PREVIEW ──────────────────────────────────
function updateUploadLabel() {
  const fileInput = document.getElementById('f-file');
  const file      = fileInput.files[0];
  const label     = document.getElementById('upload-label');
  const preview   = document.getElementById('upload-preview');

  if (!file) return;

  // Tampilkan nama + ukuran
  const sizeMB = (file.size / 1048576).toFixed(2);
  label.innerHTML = `✅ <strong>${file.name}</strong>`;

  // Tampilkan info ukuran di preview area
  if (preview) {
    const icon = file.type.includes('pdf') ? '📄' :
                 file.type.includes('word') || file.name.endsWith('.docx') ? '📝' :
                 file.type.includes('sheet') || file.name.endsWith('.xlsx') ? '📊' : '📎';
    preview.style.display = 'block';
    preview.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;
                  background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;margin-top:8px;">
        <span style="font-size:24px;">${icon}</span>
        <div style="flex:1;">
          <div style="font-size:13px;font-weight:600;color:#1E3A5F;">${file.name}</div>
          <div style="font-size:11px;color:#64748B;">${sizeMB} MB · Siap dilampirkan</div>
        </div>
        <button type="button" onclick="clearFileInput()"
                style="background:none;border:none;color:#94A3B8;cursor:pointer;font-size:18px;"
                title="Hapus file">✕</button>
      </div>`;
  }
}

function clearFileInput() {
  document.getElementById('f-file').value = '';
  document.getElementById('upload-label').textContent = 'Klik untuk upload DPA, RAB, atau draf SPJ';
  const preview = document.getElementById('upload-preview');
  if (preview) { preview.style.display = 'none'; preview.innerHTML = ''; }
}

// ─── VALIDASI & SUBMIT (async karena baca file) ──────────────
async function submitForm() {
  const nama     = document.getElementById('f-nama').value.trim();
  const instType = document.getElementById('f-inst-type').value;
  const instName = getInstansiName();
  const jabatan  = document.getElementById('f-jabatan').value;
  const wa       = normalizeWhatsAppNumber(document.getElementById('f-wa').value.trim());
  const program  = document.getElementById('f-program').value.trim();
  const kegiatan = document.getElementById('f-kegiatan').value.trim();
  const uraian   = document.getElementById('f-uraian').value.trim();

  if (!nama || !instType || !instName || !jabatan || !wa || !program || !kegiatan || !uraian) {
    alert('⚠️ Mohon lengkapi semua field yang wajib diisi (bertanda *).');
    return;
  }
  if (!/^628\d{8,12}$/.test(wa)) {
    alert('⚠️ Format WhatsApp tidak valid.\nGunakan format 08xxx atau 628xxx, contoh: 081234567890.');
    return;
  }

  // Disable tombol kirim sementara
  const btn = document.querySelector('.submit-btn');
  btn.disabled = true;
  btn.textContent = '⏳ Menyimpan...';

  const ticketId  = 't' + Date.now();
  const ticketNum = genTicketNumber();

  // ── Proses file lampiran ──────────────────────────────────
  const fileInput  = document.getElementById('f-file');
  const file       = fileInput.files[0] || null;
  let   attachment = null;

  if (file) {
    try {
      attachment = await saveFileToStorage(ticketId, file);
    } catch(err) {
      console.error('Upload error:', err);
      attachment = null;
    }
  }

  // ── Buat tiket ──────────────────────────────────────────
  const newTicket = {
    id:                     ticketId,
    ticket_number:          ticketNum,
    submitter_name:         nama,
    submitter_username:     document.getElementById('f-username').value.trim() || nama.split(' ')[0],
    institution_type:       instType,
    institution_name:       instName,
    district:               getKecamatan(),
    position:               jabatan,
    whatsapp_number:        wa,
    email:                  document.getElementById('f-email').value.trim(),
    program_name:           program,
    activity_name:          kegiatan,
    issue_description:      uraian,
    // Simpan metadata file (bukan datanya — data ada di localStorage terpisah)
    attachment:             attachment,   // { name, type, size, key } atau null
    status:                 'submitted',
    assigned_auditor_id:    null,
    legal_basis:            null,
    auditor_recommendation: null,
    responded_at:           null,
    is_public_faq:          false,
    created_at:             new Date().toISOString()
  };

  const tickets = getTickets();
  tickets.push(newTicket);
  saveTickets(tickets);

  // Tampilkan modal sukses
  document.getElementById('modal-ticket-num').textContent = ticketNum;
  document.getElementById('success-modal').classList.add('open');

  clearForm();
  updateStats();

  btn.disabled = false;
  btn.textContent = '✉️ Kirim Permohonan Pertanyaan';
}

// ─── RESET FORM ─────────────────────────────────────────────
function clearForm() {
  ['f-nama','f-username','f-wa','f-email','f-program','f-kegiatan','f-uraian']
    .forEach(id => { document.getElementById(id).value = ''; });
  document.getElementById('f-inst-type').value = '';
  document.getElementById('f-jabatan').value   = '';
  document.getElementById('f-unit-group').style.display = 'none';
  document.getElementById('f-unit').innerHTML  = '<option value="">— Pilih Unit —</option>';
  const sub = document.getElementById('f-subunit-group');
  if (sub) sub.remove();
  clearFileInput();
}

// ─── TUTUP MODAL SUKSES ─────────────────────────────────────
function closeModal() {
  document.getElementById('success-modal').classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('success-modal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
});
