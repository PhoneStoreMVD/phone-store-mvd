(() => {
  const db = window.supabase?.createClient('https://lcycxklnvtccervyuoee.supabase.co', 'sb_publishable_GwKb4zzZQlLeLCbo_DjqNg_7V0n4v_l');
  if (!db || typeof products === 'undefined') return;
  const art = { 'iphone-16-pro': 'phone', 'iphone-16': 'phone', 'iphone-15': 'phone', case: 'case', cable: 'cable', charger: 'charger', buds: 'buds' };
  db.from('products').select('*').order('position').then(({ data, error }) => {
    if (error || !data?.length) return;
    products.splice(0, products.length, ...data.map(item => ({ id: item.id, name: item.name, detail: item.detail, price: Number(item.price), cat: item.category, art: item.art || art[item.id] || 'phone' })));
    draw();
    render();
  });
})();
