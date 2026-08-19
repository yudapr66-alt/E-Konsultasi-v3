# Klinik Konsultasi APIP
**Sistem E-Konsultasi Inspektorat Daerah Kabupaten Empat Lawang**

Aplikasi web ringan untuk memfasilitasi konsultasi standar harga, pajak, dan SPJ kegiatan
antara perangkat Desa/Kecamatan/OPD dengan Tim Auditor Inspektorat — tanpa login, tanpa antri.

---

## Struktur File

```
klinik-konsultasi-apip/
│
├── index.html              ← Halaman utama (shell + semua page HTML + modals)
│
├── css/
│   ├── base.css            ← Variabel warna, reset, header, nav, layout, responsif
│   ├── components.css      ← Tombol, form, FAQ, regulasi, cek status, modal sukses
│   └── admin.css           ← Dashboard, tab admin, tiket, telaah modal, auditor, chart
│
├── js/
│   ├── data.js             ← LocalStorage store, seed data, utilitas (formatDate, dll)
│   ├── router.js           ← Navigasi halaman (showPage) + counter statistik beranda
│   ├── form.js             ← Formulir pengajuan konsultasi publik + validasi
│   ├── cek-status.js       ← Cek status tiket berdasarkan nomor tiket
│   ├── faq.js              ← Render & filter FAQ publik
│   ├── regulasi.js         ← Data & render daftar regulasi (download center)
│   ├── admin.js            ← Login, dashboard, filter tiket, manajemen auditor
│   ├── telaah.js           ← Modal telaah auditor, AI auto-draft, kirim WA
│   └── laporan.js          ← Grafik bar chart + ekspor CSV
│
└── README.md               ← Dokumen ini
```

---

## Cara Hosting

### Opsi 1 — File Statis (Paling Mudah)
Unggah seluruh folder ke hosting statis manapun:
- **cPanel Shared Hosting** → unggah ke `public_html/klinik-apip/`
- **Netlify** → drag & drop folder ke netlify.com/drop
- **GitHub Pages** → push ke repo, aktifkan Pages di Settings
- **VPS/Server** → letakkan di folder nginx/apache (`/var/www/html/klinik-apip/`)

> **Penting:** Seluruh file harus dalam satu folder yang sama agar path relatif (`css/`, `js/`) berfungsi.

### Opsi 2 — Nginx (VPS)
```nginx
server {
    listen 80;
    server_name konsultasi.empatlawang.go.id;
    root /var/www/klinik-apip;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
}
```

### Opsi 3 — Apache (.htaccess)
```apache
Options -Indexes
DirectoryIndex index.html
```

---

## Konfigurasi Wajib Sebelum Deploy

Buka file-file berikut dan ganti nilai placeholder:

### 1. `js/data.js` — Nomor WA Auditor Default
```js
const AUDITORS_DEFAULT = [
  {
    name: 'Nama Auditor Asli',
    nip:  '19820515 200312 1 001',
    whatsapp: '628XXXXXXXXXX',   // ← Ganti nomor WA nyata
    region_scope: 'Wilayah 1'
  },
  // tambah auditor lainnya...
];
```

### 2. `js/telaah.js` — Nomor WA Auditor Penelaah
```js
const WA_AUDITOR_NUMBER = '628XXXXXXXXXX';  // ← Ganti nomor WA auditor utama
```

### 3. `js/admin.js` — Password Admin
```js
const ADMIN_PASSWORD = 'ganti_password_kuat_di_sini';  // ← Wajib diganti!
```
> **Catatan:** Password ini hanya untuk demo/prototype. Untuk produksi,
> autentikasi wajib diimplementasikan di sisi backend (PHP/Node.js/dll).

### 4. `js/regulasi.js` — URL File Regulasi
```js
{ title: 'Perbup Standar Harga 2024', file_url: '/regulasi/perbup-32-2024.pdf' }
```
Upload file PDF ke server dan isi `file_url` dengan path yang benar.

### 5. `index.html` — Informasi Kontak Footer
Cari bagian `<!-- FOOTER -->` dan sesuaikan:
```html
📍 Jl. Lintas Sumatera No. 1, Pendopo   ← ganti alamat
📞 (0731) 123456                          ← ganti nomor telepon
📧 inspektorat@empatlawang.go.id          ← ganti email
```

---

## Fitur & Halaman

| Halaman | Akses | Deskripsi |
|---|---|---|
| Beranda | Publik | Statistik, cara pakai, tombol CTA |
| Ajukan Konsultasi | Publik | Form input + upload berkas, generate nomor tiket |
| Cek Status Tiket | Publik | Cari tiket berdasarkan nomor, tampilkan tanggapan |
| FAQ Publik | Publik | Arsip tanya-jawab yang disetujui auditor |
| Regulasi | Publik | Download center dokumen aturan |
| Dashboard Admin | Internal | Login auditor, telaah tiket, manajemen auditor, laporan |

### Fitur Khusus Dashboard Admin
- **Filter tiket** per kecamatan, status, dan kata kunci
- **Modal telaah** lengkap dengan info pemohon dan isian rekomendasi
- **AI Auto-Draft** — tombol ungu yang memanggil Claude API untuk menyusun draft dasar hukum & rekomendasi otomatis
- **Preview WA** — lihat pesan WhatsApp sebelum dikirim
- **Tandai FAQ** — tanggapan bisa dipublikasikan ke FAQ Publik (nama pemohon disamarkan)
- **Manajemen Auditor** — tambah/hapus auditor, lihat jumlah tiket ditangani
- **Laporan & Grafik** — bar chart tiket per instansi & per kecamatan
- **Ekspor CSV** — unduh seluruh data tiket ke Excel-compatible CSV

---

## Penyimpanan Data

Saat ini data tersimpan di **localStorage browser** (untuk demo/prototype).

Untuk **produksi**, data harus dipindahkan ke database nyata. Skema SQL tersedia di dokumen spesifikasi sistem (`MASTER PROMPT`). Fungsi yang perlu diganti ada di `js/data.js`:

```js
// Ganti fungsi-fungsi ini dengan fetch() ke REST API backend:
function getTickets()      { /* GET /api/tickets */ }
function saveTickets(data) { /* POST/PUT /api/tickets */ }
function getAuditors()     { /* GET /api/auditors */ }
function saveAuditors(data){ /* POST/PUT /api/auditors */ }
```

---

## Pengembangan Lanjutan

### Menambah Kecamatan Baru
Cari semua kemunculan `<option>Pendopo</option>` di `index.html` (ada 2 tempat: form pengajuan dan filter admin) dan tambahkan option baru.

### Mengubah Warna Tema
Edit variabel CSS di `css/base.css` bagian `:root`:
```css
:root {
  --blue-deep: #1B4F8A;   /* warna utama header & aksen */
  --teal:      #0E7490;   /* warna sekunder */
  --gold:      #B45309;   /* warna dasar hukum */
}
```

### Menambah Kategori Tag FAQ
Edit fungsi `faqTagMap()` di `js/faq.js` dan tambahkan `<span class="tag-chip">` di `index.html`.

### Mengganti Model AI
Di `js/telaah.js`, ganti nilai `model`:
```js
model: 'claude-opus-4-6'   // lebih canggih, lebih lambat
model: 'claude-haiku-4-5-20251001'  // lebih cepat, lebih hemat
```

### Mereset Data Demo
Buka browser Console (`F12 → Console`) dan jalankan:
```js
localStorage.clear(); location.reload();
```

---

## Catatan Keamanan

1. **Ganti password admin** sebelum deploy ke server publik
2. **Jangan simpan API key** Claude di kode frontend yang bisa dilihat publik — gunakan proxy backend
3. Untuk produksi, gunakan **HTTPS** (Let's Encrypt gratis)
4. Pertimbangkan menambahkan **rate limiting** di sisi server untuk endpoint form
5. File upload (berkas lampiran) perlu **backend handler** terpisah dengan validasi tipe & ukuran file

---

## Dukungan

Pertanyaan teknis: hubungi pengembang sistem.
Pertanyaan konten regulasi: hubungi Tim Auditor Inspektorat Kab. Empat Lawang.

---

*Sistem Klinik Konsultasi APIP v1.1 · Inspektorat Daerah Kabupaten Empat Lawang*
