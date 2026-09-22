const login = document.querySelector('#loginScreen');
const dashboard = document.querySelector('#dashboard');
const form = document.querySelector('#loginForm');
const error = document.querySelector('#loginError');
const supabaseClient = window.supabase.createClient('https://lcycxklnvtccervyuoee.supabase.co','sb_publishable_GwKb4zzZQlLeLCbo_DjqNg_7V0n4v_l');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = document.querySelector('#user').value.trim();
  const email = username === 'RubielMedinaPhoneMVD' ? 'phonestoremvd@gmail.com' : username;
  const {error: authError} = await supabaseClient.auth.signInWithPassword({email,password:document.querySelector('#password').value});
  if (authError) { error.textContent = 'Usuario o contraseña incorrectos.'; return; }
  error.textContent = '';
  login.hidden = true;
  dashboard.hidden = false;
});

document.querySelector('#logout').addEventListener('click', async () => {
  await supabaseClient.auth.signOut();
  dashboard.hidden = true;
  login.hidden = false;
  form.reset();
});

const titles = {summary:'Bienvenido, Rubiel.',products:'Productos y fichas',inventory:'Inventario',orders:'Pedidos',warranties:'Garantías',tradeins:'Plan Recambio',offers:'Promociones',customers:'Clientes',content:'Contenido web',analytics:'Analítica'};
const catalogProducts=[['iPhone 16 Pro','128 GB · Titanio natural','$ 57.990','iphone'],['iPhone 16','128 GB · Negro','$ 48.990','iphone'],['iPhone 15','128 GB · Azul','$ 39.990','iphone'],['Funda MagSafe','Protección magnética','$ 1.890','accessory'],['Cable USB-C','1 m · Trenzado','$ 990','accessory'],['Cargador 20W','Carga rápida','$ 1.490','accessory'],['Auriculares inalámbricos','Audio envolvente','$ 3.290','accessory']];
function renderPanelCatalog(){const editor=document.querySelector('.product-editor');if(!editor)return;editor.outerHTML=`<div class="panel-catalog" id="panelCatalog">${catalogProducts.map((p,i)=>`<article class="panel-product"><div class="panel-product-art ${p[3]}">${p[3]==='iphone'?'IPHONE':'SETUP'}</div><div><span class="status">${p[3]==='iphone'?'IPHONE':'ACCESORIO'}</span><h3>${p[0]}</h3><p>${p[1]}</p><strong>${p[2]}</strong></div><button class="outline" data-edit-product="${i}">Editar ficha →</button></article>`).join('')}</div>`;document.querySelectorAll('[data-edit-product]').forEach(btn=>btn.addEventListener('click',()=>{btn.textContent='Edición preparada ✓';btn.closest('.panel-product').classList.add('is-editing')}))}
renderPanelCatalog();
function openView(id) {
  document.querySelectorAll('.view').forEach((view) => { view.hidden = view.id !== id; });
  document.querySelectorAll('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.view === id));
  document.querySelector('#viewTitle').textContent = titles[id];
}
document.querySelectorAll('.nav-item').forEach((button) => button.addEventListener('click', () => openView(button.dataset.view)));
document.querySelectorAll('[data-go]').forEach((button) => button.addEventListener('click', () => openView(button.dataset.go)));

const warrantyForm = document.querySelector('#warrantyForm');
document.querySelector('#openWarranty').addEventListener('click', () => { warrantyForm.hidden = false; warrantyForm.scrollIntoView({behavior:'smooth', block:'nearest'}); });
document.querySelector('#cancelWarranty').addEventListener('click', () => { warrantyForm.hidden = true; warrantyForm.reset(); });
warrantyForm.addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector('#warrantyNote').textContent = 'Registro preparado en esta demostración. Al conectar la base segura quedará guardado con su vencimiento de seis meses.';
});
