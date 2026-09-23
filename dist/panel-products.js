const catalogDb = window.supabase.createClient('https://lcycxklnvtccervyuoee.supabase.co', 'sb_publishable_GwKb4zzZQlLeLCbo_DjqNg_7V0n4v_l');
const productArt = { 'iphone-16-pro': 'phone', 'iphone-16': 'phone', 'iphone-15': 'phone', case: 'case', cable: 'cable', charger: 'charger', buds: 'buds' };
const adminCatalog = [];
const money = value => `$ ${Number(value).toLocaleString('es-UY')}`;
const slug = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function productCard(product) {
  return `<article class="panel-product"><div class="panel-product-art ${product.category === 'iphone' ? 'iphone' : 'setup'}">${product.category === 'iphone' ? 'IPHONE' : 'SETUP'}</div><div><span class="status">${product.category === 'iphone' ? 'IPHONE' : 'ACCESORIO'}</span><h3>${product.name}</h3><p>${product.detail}</p><strong>${money(product.price)} · ${product.stock} disponibles</strong></div><button class="outline" data-real-edit="${product.id}">Editar ficha →</button></article>`;
}

function renderAdminCatalog() {
  const root = document.querySelector('#panelCatalog');
  if (!root) return;
  root.innerHTML = ['iphone', 'accessory'].map(category => `<section class="catalog-group"><header><p>${category === 'iphone' ? 'IPHONE' : 'ACCESORIOS'}</p><span>${category === 'iphone' ? 'Equipos disponibles' : 'Complementos y setup'}</span></header>${adminCatalog.filter(product => product.category === category).map(productCard).join('') || '<p class="empty-state">Sin productos en esta categoría.</p>'}</section>`).join('');
  root.querySelectorAll('[data-real-edit]').forEach(button => button.onclick = () => openAdminEditor(button.dataset.realEdit));
}

async function loadCatalog() {
  const { data, error } = await catalogDb.from('products').select('*').order('position');
  if (error) return;
  adminCatalog.splice(0, adminCatalog.length, ...data);
  renderAdminCatalog();
}

function openAdminEditor(id) {
  let modal = document.querySelector('#productModal');
  if (!modal) {
    document.body.insertAdjacentHTML('beforeend', `<div class="product-modal" id="productModal" hidden><div class="product-dialog"><button class="modal-close" type="button">×</button><form id="adminProductForm"><p class="eyebrow">EDITOR DE PRODUCTO</p><h3 id="adminEditorTitle"></h3><div class="editor-fields"><label>Nombre<input name="name" required></label><label>Categoría<select name="category"><option value="iphone">iPhone</option><option value="accessory">Accesorio</option></select></label><label>Detalle<input name="detail" required></label><label>Precio UYU<input name="price" type="number" min="0" required></label><label>Stock<input name="stock" type="number" min="0" required></label><label class="wide">Descripción<textarea name="description"></textarea></label></div><div class="editor-actions"><button class="outline" type="button" id="closeProduct">Cancelar</button><button class="primary">Guardar en tienda →</button></div><p class="editor-note" id="adminProductNote"></p></form><aside class="product-live-preview"><p>VISTA PREVIA · TIENDA</p><article><small id="previewType"></small><div class="live-art" id="previewArt"></div><h4 id="previewName"></h4><span id="previewDetail"></span><strong id="previewPrice"></strong><b id="previewStock"></b></article><a href="tienda.html" target="_blank">Abrir tienda ↗</a></aside></div></div>`);
    modal = document.querySelector('#productModal');
    modal.querySelector('.modal-close').onclick = () => modal.hidden = true;
    modal.querySelector('#closeProduct').onclick = () => modal.hidden = true;
  }
  const product = adminCatalog.find(item => item.id === id) || { id: '', name: '', detail: '', price: '', category: 'iphone', stock: 0, description: '', position: adminCatalog.length };
  const form = modal.querySelector('#adminProductForm');
  Object.entries(product).forEach(([key, value]) => { if (form.elements[key]) form.elements[key].value = value ?? ''; });
  modal.querySelector('#adminEditorTitle').textContent = product.id ? `Editar ${product.name}` : 'Nuevo producto';
  const preview = () => {
    const data = Object.fromEntries(new FormData(form));
    modal.querySelector('#previewType').textContent = data.category === 'iphone' ? 'IPHONE' : 'ACCESORIO';
    modal.querySelector('#previewArt').className = `live-art ${data.category}`;
    modal.querySelector('#previewName').textContent = data.name || 'Nombre del producto';
    modal.querySelector('#previewDetail').textContent = data.detail || 'Detalle';
    modal.querySelector('#previewPrice').textContent = money(data.price || 0);
    modal.querySelector('#previewStock').textContent = `${data.stock || 0} disponibles`;
  };
  form.oninput = preview;
  form.onchange = preview;
  form.onsubmit = async event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const record = { ...product, ...data, id: product.id || slug(data.name), price: Number(data.price), stock: Number(data.stock), position: Number(product.position ?? adminCatalog.length), art: product.art || productArt[slug(data.name)] || (data.category === 'iphone' ? 'phone' : 'case') };
    const note = modal.querySelector('#adminProductNote');
    note.textContent = 'Guardando en la tienda…';
    const { error } = await catalogDb.from('products').upsert(record);
    if (error) { note.textContent = `No se pudo guardar: ${error.message}`; return; }
    const index = adminCatalog.findIndex(item => item.id === record.id);
    if (index >= 0) adminCatalog[index] = record; else adminCatalog.push(record);
    renderAdminCatalog();
    note.textContent = 'Guardado en Supabase. La tienda se actualiza al recargar.';
    preview();
  };
  preview();
  modal.hidden = false;
}

document.querySelector('#products .primary')?.addEventListener('click', () => openAdminEditor(''));
loadCatalog();
