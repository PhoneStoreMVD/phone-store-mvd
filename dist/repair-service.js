(() => {
  const supabaseUrl = 'https://lcycxklnvtccervyuoee.supabase.co';
  const supabaseKey = 'sb_publishable_GwKb4zzZQlLeLCbo_DjqNg_7V0n4v_l';
  const anchor = document.querySelector('.tradein') || document.querySelector('#familia');
  if (!anchor || document.querySelector('#servicio-tecnico')) return;

  const entrance = document.querySelector('.entrance');
  if (entrance && !entrance.querySelector('.repair-hero-chip')) {
    entrance.insertAdjacentHTML('beforeend', '<a class="repair-hero-chip" href="#servicio-tecnico"><span aria-hidden="true">⌁</span><i>¿Necesitás reparar?</i><b>Servicio técnico →</b></a>');
  }

  anchor.insertAdjacentHTML('afterend', `
    <section class="repair-service" id="servicio-tecnico" aria-labelledby="repairTitle">
      <div class="repair-story">
        <p class="repair-kicker">SERVICIO TÉCNICO</p>
        <h2 id="repairTitle">Tu equipo todavía<br><em>tiene camino.</em></h2>
        <p class="repair-lead">Si no es momento de cambiarlo, lo revisamos. Diagnóstico claro, presupuesto antes de avanzar y atención directa.</p>
        <div class="repair-steps" aria-label="Cómo funciona">
          <span><b>01</b> Contanos qué le pasa</span><span><b>02</b> Te orientamos</span><span><b>03</b> Coordinamos la reparación</span>
        </div>
      </div>
      <form class="repair-form" id="repairForm">
        <div class="repair-form-heading"><span class="repair-tool" aria-hidden="true">✦</span><div><small>DIAGNÓSTICO INICIAL</small><strong>Contanos de tu equipo</strong></div></div>
        <label>Equipo<input name="device_model" required maxlength="100" placeholder="Ej. iPhone 13 Pro" autocomplete="off"></label>
        <label>¿Qué necesita?<textarea name="issue" required maxlength="800" placeholder="Pantalla rota, batería, cámara, no enciende…"></textarea></label>
        <div class="repair-form-row"><label>Tu contacto<input name="contact" required maxlength="160" placeholder="WhatsApp o correo" autocomplete="email"></label><label>Preferís<select name="preferred_channel"><option>WhatsApp</option><option>Llamada</option><option>Correo</option></select></label></div>
        <button type="submit">Solicitar diagnóstico <b>→</b></button><p class="repair-status" role="status" aria-live="polite"></p>
      </form>
    </section>`);

  const nav = document.querySelector('.topbar nav, .site-nav');
  if (nav && !nav.querySelector('[href="#servicio-tecnico"]')) nav.insertAdjacentHTML('beforeend', '<a class="repair-nav-link" href="#servicio-tecnico">Servicio técnico</a>');

  const form = document.querySelector('#repairForm');
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = form.querySelector('.repair-status');
    const button = form.querySelector('button');
    const data = Object.fromEntries(new FormData(form));
    button.disabled = true;
    status.textContent = 'Enviando solicitud…';
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/repair_requests`, {
        method: 'POST',
        headers: { apikey: supabaseKey, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('request_failed');
      form.reset();
      status.textContent = 'Listo. Recibimos tu consulta y te contactaremos por el medio indicado.';
      status.classList.add('is-success');
    } catch {
      status.textContent = 'No pudimos enviar la solicitud. Probá nuevamente en unos minutos.';
    } finally { button.disabled = false; }
  });

  const style = document.createElement('style');
  style.textContent = `
    .repair-hero-chip{display:none}.repair-service{background:radial-gradient(circle at 12% 12%,rgba(0,213,255,.13),transparent 28%),linear-gradient(125deg,#07111b 0%,#0c1d2e 58%,#10112b 100%);color:#f7fbff;display:grid;grid-template-columns:minmax(0,1fr) minmax(380px,.92fr);gap:clamp(42px,8vw,130px);align-items:center;padding:clamp(68px,10vw,138px) max(6vw,28px);position:relative;overflow:hidden}.repair-service:after{content:'';position:absolute;width:460px;height:460px;border:1px solid rgba(71,227,240,.18);border-radius:50%;right:-260px;top:-260px}.repair-story,.repair-form{position:relative;z-index:1}.repair-kicker,.repair-form small{font-size:11px;letter-spacing:.17em;font-weight:800;color:#49e8f5}.repair-story h2{font-size:clamp(42px,5.2vw,78px);line-height:.94;letter-spacing:-.075em;margin:17px 0 26px;max-width:680px}.repair-story h2 em{font-style:normal;background:linear-gradient(90deg,#5cecf5,#a89aff);background-clip:text;-webkit-background-clip:text;color:transparent}.repair-lead{max-width:540px;font-size:17px;line-height:1.55;color:#c0d2e3}.repair-steps{display:flex;flex-wrap:wrap;gap:12px 24px;margin-top:34px;color:#d8e8f5;font-size:13px}.repair-steps span{display:flex;gap:8px;align-items:center}.repair-steps b{color:#52eaf6;font-size:11px}.repair-form{background:rgba(8,16,29,.72);border:1px solid rgba(89,224,241,.65);border-radius:22px;padding:28px;box-shadow:0 24px 60px rgba(0,0,0,.2);display:grid;gap:15px}.repair-form-heading{display:flex;align-items:center;gap:12px;margin-bottom:4px}.repair-form-heading div{display:grid;gap:4px}.repair-form-heading strong{font-size:21px}.repair-tool{display:grid;place-items:center;border:1px solid #49e8f5;width:38px;height:38px;border-radius:50%;color:#49e8f5}.repair-form label{display:grid;gap:7px;font-size:12px;font-weight:700;color:#c9d9e5}.repair-form input,.repair-form textarea,.repair-form select{width:100%;box-sizing:border-box;border:1px solid #364b62;border-radius:9px;background:#0b1725;color:#fff;padding:12px;font:inherit;font-size:14px;outline:none}.repair-form textarea{min-height:86px;resize:vertical}.repair-form input:focus,.repair-form textarea:focus,.repair-form select:focus{border-color:#4de9f4}.repair-form-row{display:grid;grid-template-columns:1.4fr .8fr;gap:12px}.repair-form button{border:0;border-radius:10px;background:#effcff;color:#07121f;font-weight:800;padding:14px 16px;cursor:pointer;font:inherit}.repair-form button b{margin-left:8px;color:#009db2}.repair-form button:disabled{opacity:.65;cursor:wait}.repair-status{min-height:18px;margin:0;font-size:12px;color:#f6c56b}.repair-status.is-success{color:#77f2c3}.repair-nav-link{color:#68eaf3!important}@media(max-width:760px){.repair-hero-chip{display:grid;position:absolute;z-index:4;top:28px;right:20px;width:158px;grid-template-columns:21px 1fr;column-gap:7px;align-items:center;border:1px solid rgba(93,239,247,.75);border-radius:13px;padding:10px 11px;background:rgba(4,14,25,.72);box-shadow:0 8px 24px rgba(0,0,0,.3);color:#fff;text-decoration:none;backdrop-filter:blur(8px)}.repair-hero-chip span{grid-row:1/3;color:#5cecf5;font-size:20px}.repair-hero-chip i{font-size:9px;line-height:1;font-style:normal;letter-spacing:.08em;color:#a3b7c8}.repair-hero-chip b{font-size:11px;line-height:1.35;color:#70f0f5}.repair-service{grid-template-columns:1fr;padding:70px 24px;gap:34px}.repair-story h2{font-size:45px}.repair-lead{font-size:15px}.repair-steps{display:grid;gap:11px;margin-top:25px}.repair-form{padding:20px;border-radius:17px}.repair-form-row{grid-template-columns:1fr}.repair-service:after{width:300px;height:300px;right:-190px;top:-160px}}
  `;
  document.head.appendChild(style);
})();
