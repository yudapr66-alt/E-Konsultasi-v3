/* ============================================================
   ADMIN.JS — Login, Dashboard, Manajemen Auditor, Tab Admin
  Klinik Pertanyaan APIP · Inspektorat Kab. Empat Lawang

   ⚙️  KONFIGURASI: Ganti ADMIN_PASSWORD dengan password nyata
       Untuk produksi, autentikasi harus dilakukan di backend.
   ============================================================ */

const ADMIN_PASSWORD = 'auditor123';   // ← ganti sebelum deploy

// ─── LOGIN ───────────────────────────────────────────────────
function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;

  if (!email || pass !== ADMIN_PASSWORD) {
    alert('⚠️ Email atau password tidak valid.\nDemo: gunakan password "auditor123"');
    return;
  }

  localStorage.setItem('el_admin_logged', email);

  // Tentukan nama auditor dari email (produksi: ambil dari DB)
  const auditors  = getAuditors();
  const matched   = auditors.find(a => a.email === email);
  const adminName = matched ? matched.name : email.split('@')[0];
  localStorage.setItem('el_admin_name', adminName);

  showDashboard();
}

// ─── TAMPILKAN DASHBOARD ─────────────────────────────────────
function showDashboard() {
  document.getElementById('admin-login-section').style.display  = 'none';
  document.getElementById('admin-dashboard').style.display      = 'block';
  document.getElementById('auditor-name').textContent           =
    localStorage.getItem('el_admin_name') || 'Auditor';
  renderTickets();
}

// ─── LOGOUT ──────────────────────────────────────────────────
function doLogout() {
  localStorage.removeItem('el_admin_logged');
  localStorage.removeItem('el_admin_name');
  document.getElementById('admin-login-section').style.display = 'block';
  document.getElementById('admin-dashboard').style.display     = 'none';
  document.getElementById('login-email').value = '';
  document.getElementById('login-pass').value  = '';
}

// ─── SUB-TAB ADMIN ───────────────────────────────────────────
function switchAdminTab(tab) {
  ['tiket', 'auditor', 'laporan'].forEach(t => {
    document.getElementById('atab-' + t).classList.remove('active');
    document.getElementById('atab-content-' + t).style.display = 'none';
  });
  document.getElementById('atab-' + tab).classList.add('active');
  document.getElementById('atab-content-' + tab).style.display = 'block';

  if (tab === 'auditor') renderAuditors();
  if (tab === 'laporan') renderLaporan();
}

// ─── RENDER DAFTAR TIKET ─────────────────────────────────────
function renderTickets() {
  const tickets  = getTickets();
  const kec      = document.getElementById('filter-kec').value;
  const status   = document.getElementById('filter-status').value;
  const search   = (document.getElementById('filter-search').value || '').toLowerCase();

  const filtered = tickets.filter(t => {
    const matchKec    = kec    === 'all' || t.district === kec;
    const matchStatus = status === 'all' || t.status   === status;
    const matchSearch = !search
      || t.submitter_name.toLowerCase().includes(search)
      || t.institution_name.toLowerCase().includes(search)
      || t.activity_name.toLowerCase().includes(search)
      || t.ticket_number.toLowerCase().includes(search);
    return matchKec && matchStatus && matchSearch;
  });

  // Update counter
  document.getElementById('adm-total').textContent   = tickets.length;
  document.getElementById('adm-pending').textContent = tickets.filter(t => t.status === 'submitted').length;
  document.getElementById('adm-done').textContent    = tickets.filter(t => t.status === 'completed').length;

  const list = document.getElementById('ticket-list');
  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="es-icon">📭</div>
        <p>Tidak ada tiket yang sesuai filter.</p>
      </div>`;
    return;
  }

  const sorted = [...filtered].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  list.innerHTML = sorted.map(t => `
    <div class="ticket-card ${t.status === 'submitted' ? 'new' : 'done'}"
         onclick="openTelaah('${t.id}')">
      <div style="flex:1;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap;">
          <span style="font-size:12px;font-weight:700;color:var(--text-muted);">${t.ticket_number}</span>
          <span class="tc-badge ${t.status === 'submitted' ? 'badge-new' : 'badge-done'}">
            ${t.status === 'submitted' ? '🕐 Menunggu Telaah' : '✅ Selesai'}
          </span>
          ${t.is_public_faq
            ? '<span style="font-size:11px;background:#FFF7ED;color:#D97706;padding:3px 8px;border-radius:4px;font-weight:600;">⭐ FAQ</span>'
            : ''}
        </div>
        <h4 style="font-size:14px;font-weight:600;margin-bottom:3px;">${t.activity_name}</h4>
        <div class="tc-inst">${t.institution_name} · ${t.position}</div>
        <div class="tc-meta" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:3px;">
          <span>${t.district ? t.district + ' · ' : ''}${formatDate(t.created_at)}</span>
          ${t.attachment && t.attachment.name
            ? `<span style="display:inline-flex;align-items:center;gap:3px;font-size:11px;
                            background:#EFF6FF;color:#2563EB;padding:2px 7px;border-radius:4px;font-weight:600;">
                 📎 ${t.attachment.name.length > 22 ? t.attachment.name.substring(0,22)+'…' : t.attachment.name}
               </span>`
            : ''
          }
        </div>
      </div>
      <div style="font-size:12px;color:var(--text-muted);">▶</div>
    </div>
  `).join('');
}

// ─── MANAJEMEN AUDITOR ───────────────────────────────────────
function renderAuditors() {
  const auditors = getAuditors();
  const tickets  = getTickets();
  const list     = document.getElementById('auditor-list');

  list.innerHTML = auditors.map((a, i) => {
    const handled  = tickets.filter(t => t.assigned_auditor_id === a.id && t.status === 'completed').length;
    const initials = a.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
    return `
      <div class="auditor-card">
        <div class="auditor-avatar">${initials}</div>
        <div style="flex:1;">
          <h4>${a.name}</h4>
          <div class="au-meta">NIP: ${a.nip || '—'} · ${a.region_scope}</div>
          <div class="au-meta" style="margin-top:2px;">📊 ${handled} tiket ditangani</div>
        </div>
        <button class="au-wa-btn"
                onclick="window.open('https://wa.me/${a.whatsapp}','_blank')">💬 WA</button>
        <span class="au-badge">${a.region_scope}</span>
        <button onclick="removeAuditor(${i})"
                style="background:none;border:none;color:#DC2626;cursor:pointer;font-size:16px;padding:4px;"
                title="Hapus auditor">🗑</button>
      </div>`;
  }).join('') || '<div class="empty-state"><div class="es-icon">👥</div><p>Belum ada auditor terdaftar.</p></div>';
}

function showAddAuditorForm() {
  document.getElementById('add-auditor-form').style.display = 'block';
  document.getElementById('au-nama').focus();
}

function saveAuditor() {
  const nama  = document.getElementById('au-nama').value.trim();
  const email = document.getElementById('au-email').value.trim();
  const wa    = document.getElementById('au-wa').value.trim();

  if (!nama || !email || !wa) {
    alert('⚠️ Nama, Email, dan WhatsApp wajib diisi.');
    return;
  }

  const auditors = getAuditors();
  auditors.push({
    id:           'a' + Date.now(),
    name:         nama,
    nip:          document.getElementById('au-nip').value.trim(),
    email,
    whatsapp:     wa,
    region_scope: document.getElementById('au-region').value
  });
  saveAuditors(auditors);

  // Reset form
  document.getElementById('add-auditor-form').style.display = 'none';
  ['au-nama', 'au-nip', 'au-email', 'au-wa'].forEach(id => {
    document.getElementById(id).value = '';
  });

  renderAuditors();
}

function removeAuditor(idx) {
  if (!confirm('Hapus auditor ini dari sistem?')) return;
  const auditors = getAuditors();
  auditors.splice(idx, 1);
  saveAuditors(auditors);
  renderAuditors();
}
