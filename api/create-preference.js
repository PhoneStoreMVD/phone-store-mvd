const catalog = {
  'iphone-16-pro': { title: 'iPhone 16 Pro · 128 GB · Titanio natural', price: 57990, category: 'iphone' },
  'iphone-16': { title: 'iPhone 16 · 128 GB · Negro', price: 48990, category: 'iphone' },
  'iphone-15': { title: 'iPhone 15 · 128 GB · Azul', price: 39990, category: 'iphone' },
  case: { title: 'Funda MagSafe', price: 1890, category: 'accessory' },
  cable: { title: 'Cable USB-C · 1 m · Trenzado', price: 990, category: 'accessory' },
  charger: { title: 'Cargador 20W · Carga rápida', price: 1490, category: 'accessory' },
  buds: { title: 'Auriculares inalámbricos', price: 3290, category: 'accessory' }
};

const originFor = request => {
  const host = request.headers['x-forwarded-host'] || request.headers.host;
  return `${request.headers['x-forwarded-proto'] || 'https'}://${host}`;
};

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Método no permitido' });
  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) return response.status(503).json({ error: 'Mercado Pago aún no está configurado.' });
  const { items = [], coupon = '' } = request.body || {};
  const quantities = new Map();
  items.forEach(item => { if (catalog[item?.id]) quantities.set(item.id, (quantities.get(item.id) || 0) + 1); });
  if (!quantities.size) return response.status(400).json({ error: 'El carrito está vacío.' });
  const usesSetup15 = String(coupon).trim().toUpperCase() === 'SETUP15';
  const preferenceItems = [...quantities].map(([id, quantity]) => {
    const product = catalog[id];
    return { id, title: product.title, quantity, currency_id: 'UYU', unit_price: usesSetup15 && product.category === 'accessory' ? Math.round(product.price * .85) : product.price };
  });
  const origin = originFor(request);
  const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST', headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: preferenceItems, external_reference: `PSMVD-${Date.now()}`, statement_descriptor: 'PHONE STORE MVD', back_urls: { success: `${origin}/resultado.html?estado=aprobado`, pending: `${origin}/resultado.html?estado=pendiente`, failure: `${origin}/resultado.html?estado=rechazado` }, auto_return: 'approved' })
  });
  const data = await mpResponse.json();
  if (!mpResponse.ok) return response.status(mpResponse.status).json({ error: data.message || 'No se pudo iniciar el pago.' });
  return response.status(200).json({ init_point: data.init_point });
}
