/* ============================================================
   ROUTER.JS — Navigasi Halaman & Counter Statistik
   Klinik Konsultasi APIP · Inspektorat Kab. Empat Lawang
   ============================================================ */

function showPage(name) {
  // Sembunyikan semua halaman
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Non-aktifkan semua nav button
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  // Tampilkan halaman yang diminta
  const pageEl = document.getElementById('page-' + name);
  if (pageEl) pageEl.classList.add('active');

  // Aktifkan nav button yang sesuai (admin tidak punya nav-btn)
  const navEl = document.getElementById('nav-' + name);
  if (navEl) navEl.classList.add('active');

  // Aksi khusus per halaman
  switch (name) {
    case 'home':
      updateStats();
      break;

    case 'cek':
      // Reset form cek status setiap kali dibuka
      document.getElementById('cek-result').style.display = 'none';
      document.getElementById('cek-input').value = '';
      break;

    case 'faq':
      renderFaq();
      break;

    case 'regulasi':
      renderRegulasi();
      break;

    case 'admin':
      // Cek apakah sudah login, langsung tampil dashboard
      if (localStorage.getItem('el_admin_logged')) {
        showDashboard();
      }
      break;
  }

  window.scrollTo(0, 0);
}

// ─── STATISTIK BERANDA ──────────────────────────────────────
function updateStats() {
  const tickets = getTickets();
  document.getElementById('stat-tiket').textContent   = tickets.length;
  document.getElementById('stat-selesai').textContent = tickets.filter(t => t.status === 'completed').length;
  document.getElementById('stat-faq').textContent     = tickets.filter(t => t.is_public_faq).length;
}
