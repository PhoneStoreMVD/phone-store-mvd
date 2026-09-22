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
