const login = document.querySelector('#loginScreen');
const dashboard = document.querySelector('#dashboard');
const form = document.querySelector('#loginForm');
const error = document.querySelector('#loginError');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const valid = document.querySelector('#user').value === 'admin' && document.querySelector('#password').value === 'MVD2026!';
  if (!valid) { error.textContent = 'Usuario o contraseña incorrectos.'; return; }
  error.textContent = '';
  login.hidden = true;
  dashboard.hidden = false;
});

document.querySelector('#logout').addEventListener('click', () => {
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
