/* ============================================================
   FAQ.JS — Ruang Tanya Jawab Umum (Publik)
   Klinik Konsultasi APIP · Inspektorat Kab. Empat Lawang
   ============================================================ */

let activeFaqTag = 'all';

// ─── TAG OTOMATIS DARI KONTEN ────────────────────────────────
function faqTagMap(ticket) {
  const text = [
    ticket.issue_description,
    ticket.auditor_recommendation,
    ticket.legal_basis
  ].join(' ').toLowerCase();

  if (text.includes('ppn') || text.includes('pph') || text.includes('pajak'))
    return 'pajak';
  if (text.includes('standar harga') || text.includes('perbup'))
    return 'standar-harga';
  if (text.includes('spj') || text.includes('pertanggungjawaban'))
    return 'spj';
  if (text.includes('rab') || text.includes('rencana anggaran'))
    return 'rab';
  if (text.includes('dana desa') || text.includes('add '))
    return 'dana-desa';
  return 'lainnya';
}

// ─── RENDER DAFTAR FAQ ──────────────────────────────────────
function renderFaq() {
  const search  = (document.getElementById('faq-search').value || '').toLowerCase();
  const tickets = getTickets().filter(t => t.is_public_faq && t.status === 'completed');

  const filtered = tickets.filter(t => {
    const matchTag    = activeFaqTag === 'all' || faqTagMap(t) === activeFaqTag;
    const matchSearch = !search
      || t.issue_description.toLowerCase().includes(search)
      || t.activity_name.toLowerCase().includes(search)
      || (t.auditor_recommendation || '').toLowerCase().includes(search);
    return matchTag && matchSearch;
  });

  const list = document.getElementById('faq-list');

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="es-icon">🔍</div>
        <p>Tidak ada hasil yang cocok. Coba kata kunci lain.</p>
      </div>`;
    return;
  }

  list.innerHTML = filtered.map((t, i) => {
    const tagLabel = faqTagMap(t).replace('-', ' ').toUpperCase();
    return `
      <div class="faq-item" id="faq-${i}">
        <div class="faq-q" onclick="toggleFaq(${i})">
          <div class="faq-q-text">
            <div style="margin-bottom:6px;">
              <span class="faq-tag">${tagLabel}</span>
              <span style="font-size:11px;color:var(--text-muted);">${t.ticket_number}</span>
            </div>
            <h4>${t.activity_name}</h4>
            <div class="meta">
              Perangkat ${t.institution_type === 'opd' ? 'OPD' : 'Desa/Kecamatan'} ·
              ${formatDate(t.responded_at)}
            </div>
          </div>
          <div class="faq-toggle">+</div>
        </div>
        <div class="faq-ans">
          <p style="font-style:italic;color:var(--text-muted);margin-bottom:12px;font-size:13px;">
            ❓ "${t.issue_description}"
          </p>
          <div class="legal-basis">📜 ${t.legal_basis}</div>
          <p>${t.auditor_recommendation}</p>
        </div>
      </div>`;
  }).join('');
}

// ─── TOGGLE ITEM ─────────────────────────────────────────────
function toggleFaq(i) {
  document.getElementById('faq-' + i).classList.toggle('open');
}

// ─── FILTER TAG ──────────────────────────────────────────────
function setFaqTag(el, tag) {
  document.querySelectorAll('.tag-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  activeFaqTag = tag;
  renderFaq();
}

// ─── SEARCH ─────────────────────────────────────────────────
function filterFaq() {
  renderFaq();
}
