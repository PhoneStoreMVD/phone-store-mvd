(() => {
  const db = window.supabase.createClient('https://lcycxklnvtccervyuoee.supabase.co', 'sb_publishable_GwKb4zzZQlLeLCbo_DjqNg_7V0n4v_l');
  const sidebar = document.querySelector('.sidebar nav');
  const content = document.querySelector('.workspace') || document.querySelector('main');
  if (!db || !sidebar || !content || document.querySelector('#repairs')) return;
  sidebar.insertAdjacentHTML('beforeend', '<button class="nav-item" data-view="repairs">Servicio técnico</button>');
  content.insertAdjacentHTML('beforeend', `<section class="view" id="repairs" hidden><div class="view-intro"><div><p class="eyebrow">SERVICIO TÉCNICO</p><h3>Consultas de reparación, en un solo lugar.</h3><p>Cada solicitud llega con el equipo, problema, contacto y canal elegido por el cliente.</p></div><button class="primary" id="refreshRepairs">Actualizar →</button></div><div class="repair-panel-list" id="repairRequests"><p>Cargando solicitudes…</p></div></section>`);
  const button = sidebar.querySelector('[data-view="repairs"]');
  const view = document.querySelector('#repairs');
  const heading = document.querySelector('#viewTitle');
  const render = async () => {
    const holder = document.querySelector('#repairRequests');
    const { data, error } = await db.from('repair_requests').select('*').order('created_at', { ascending: false });
    if (error) { holder.innerHTML = '<p>No se pudieron cargar las solicitudes.</p>'; return; }
    holder.innerHTML = data.length ? data.map((item) => `<article class="panel-card repair-request"><div><p class="eyebrow">${new Date(item.created_at).toLocaleDateString('es-UY')} · ${item.status}</p><h4>${item.device_model}</h4><p>${item.issue}</p><strong>${item.contact}</strong><span>Contacto: ${item.preferred_channel}</span></div><label>Estado<select data-id="${item.id}"><option ${item.status==='nuevo'?'selected':''}>nuevo</option><option ${item.status==='en revisión'?'selected':''}>en revisión</option><option ${item.status==='coordinado'?'selected':''}>coordinado</option><option ${item.status==='cerrado'?'selected':''}>cerrado</option></select></label></article>`).join('') : '<div class="empty-state"><b>Sin consultas todavía.</b><p>Las nuevas solicitudes del sitio aparecerán acá.</p></div>';
    holder.querySelectorAll('select[data-id]').forEach((select) => select.addEventListener('change', async () => { await db.from('repair_requests').update({ status: select.value }).eq('id', select.dataset.id); render(); }));
  };
  button.addEventListener('click', () => { document.querySelectorAll('.view').forEach((item) => item.hidden = item !== view); document.querySelectorAll('.nav-item').forEach((item) => item.classList.toggle('active', item === button)); if (heading) heading.textContent = 'Servicio técnico'; render(); });
  document.querySelector('#refreshRepairs').addEventListener('click', render);
  const style = document.createElement('style');
  style.textContent = '.repair-panel-list{display:grid;gap:14px}.repair-request{display:flex;justify-content:space-between;gap:24px}.repair-request h4{margin:7px 0}.repair-request p{max-width:720px}.repair-request strong,.repair-request span{display:block;margin-top:8px}.repair-request label{min-width:150px}.repair-request select{margin-top:6px;width:100%;background:#0b1725;color:#fff;border:1px solid #38506d;border-radius:6px;padding:8px}@media(max-width:720px){.repair-request{display:grid}.repair-request label{min-width:0}}';
  document.head.appendChild(style);
})();
