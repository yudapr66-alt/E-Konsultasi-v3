/* ============================================================
   DATA.JS — LocalStorage Store, Seed Data, Utilitas
   Klinik Konsultasi APIP · Inspektorat Kab. Empat Lawang

   ⚙️  KONFIGURASI: Ganti nomor WA auditor default di AUDITORS_DEFAULT
   ============================================================ */

// ─── DEFAULT AUDITOR (edit sesuai data nyata) ───────────────
const AUDITORS_DEFAULT = [
  {
    id: '1',
    name: 'Budi Santoso, SE., Ak.',
    nip: '19820515 200312 1 001',
    whatsapp: '6281234567890',       // ← ganti nomor WA
    region_scope: 'Wilayah 1'
  },
  {
    id: '2',
    name: 'Dewi Rahmawati, S.H.',
    nip: '19870301 201001 2 002',
    whatsapp: '6289876543210',       // ← ganti nomor WA
    region_scope: 'All'
  }
];

// ─── STORE ──────────────────────────────────────────────────
function getTickets() {
  return JSON.parse(localStorage.getItem('el_tickets') || '[]');
}
function saveTickets(data) {
  localStorage.setItem('el_tickets', JSON.stringify(data));
}

function getAuditors() {
  return JSON.parse(
    localStorage.getItem('el_auditors') || JSON.stringify(AUDITORS_DEFAULT)
  );
}
function saveAuditors(data) {
  localStorage.setItem('el_auditors', JSON.stringify(data));
}

// ─── SEED DATA CONTOH ───────────────────────────────────────
// Hanya berjalan sekali; hapus localStorage 'el_seeded' untuk reset
function seedData() {
  if (localStorage.getItem('el_seeded')) return;

  const tickets = [
    {
      id: 't1',
      ticket_number: 'EL-2024-0001',
      submitter_name: 'Ahmad Fauzi',
      submitter_username: 'Pak Fauzi',
      institution_type: 'desa',
      institution_name: 'Desa Muara Lintang Baru',
      district: 'Muara Pinang',
      position: 'Kaur Keuangan',
      whatsapp_number: '6281234567890',
      email: '',
      program_name: 'Program Infrastruktur Desa',
      activity_name: 'Pavingisasi Jalan RT 01',
      issue_description:
        'Kami hendak mengadakan material batu bata untuk paving blok senilai Rp 45 juta. ' +
        'Bagaimana ketentuan pajak PPN dan PPh 22 untuk pengadaan ini? ' +
        'Apakah vendor perlu dikukuhkan sebagai PKP? Mohon pencerahan dasar hukumnya.',
      status: 'submitted',
      attachment:     null,
      assigned_auditor_id: null,
      legal_basis: null,
      auditor_recommendation: null,
      responded_at: null,
      is_public_faq: false,
      created_at: '2024-11-20T09:15:00'
    },
    {
      id: 't2',
      ticket_number: 'EL-2024-0002',
      submitter_name: 'Siti Aminah',
      submitter_username: 'Bu Siti',
      institution_type: 'desa',
      institution_name: 'Desa Talang Ubi',
      district: 'Pendopo',
      position: 'Kades',
      whatsapp_number: '6289876543210',
      email: 'siti@desa.go.id',
      program_name: 'Dana Desa 2024',
      activity_name: 'Pembangunan Posyandu',
      issue_description:
        'Bagaimana standar harga untuk honorarium kader posyandu dan biaya operasional ' +
        'kegiatan pemberdayaan masyarakat? Kami kesulitan menentukan satuan biaya yang ' +
        'tepat sesuai Perbup Standar Harga.',
      status: 'completed',
      attachment:     null,
      assigned_auditor_id: '1',
      legal_basis:
        'Peraturan Bupati Empat Lawang Nomor 32 Tahun 2024 tentang Standar Satuan Harga, ' +
        'Lampiran III Bidang Pemberdayaan Masyarakat; PMK No. 193/PMK.07/2018 tentang ' +
        'Pengelolaan Dana Desa.',
      auditor_recommendation:
        'Berdasarkan Perbup Standar Harga 2024, honorarium kader posyandu ditetapkan ' +
        'sebesar Rp 150.000/orang/bulan untuk kader aktif. Biaya operasional kegiatan ' +
        'pemberdayaan maksimal 10% dari total anggaran kegiatan. Pastikan pelaksana ' +
        'membuat berita acara dan daftar hadir yang ditandatangani Kades.',
      responded_at: '2024-11-21T14:30:00',
      is_public_faq: true,
      created_at: '2024-11-19T10:00:00'
    },
    {
      id: 't3',
      ticket_number: 'EL-2024-0003',
      submitter_name: 'Hendra Wijaya',
      submitter_username: 'Pak Hendra',
      institution_type: 'opd',
      institution_name: 'Dinas PUPR',
      district: 'Pendopo',
      position: 'PPK',
      whatsapp_number: '6281122334455',
      email: '',
      program_name: 'APBD 2024',
      activity_name: 'Rehabilitasi Gedung Kantor',
      issue_description:
        'Kami memiliki kontrak rehabilitasi gedung senilai Rp 350 juta dengan PT Karya Maju. ' +
        'Bagaimana ketentuan pemungutan PPN dan PPh pasal 4 ayat 2 (jasa konstruksi)? ' +
        'Berapa tarif yang berlaku dan dokumen apa saja yang harus disiapkan untuk SPJ?',
      status: 'submitted',
      attachment:     null,
      assigned_auditor_id: null,
      legal_basis: null,
      auditor_recommendation: null,
      responded_at: null,
      is_public_faq: false,
      created_at: '2024-11-21T08:00:00'
    }
  ];

  saveTickets(tickets);
  localStorage.setItem('el_seeded', '1');
}

// ─── UTILITAS ────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

function genTicketNumber() {
  const count = getTickets().length + 1;
  const year  = new Date().getFullYear();
  return `EL-${year}-${String(count).padStart(4, '0')}`;
}

// ─── INIT ───────────────────────────────────────────────────
seedData();
