(() => {
  const pay = document.querySelector('#payButton');
  if (!pay) return;
  pay.onclick = async () => {
    const cart = JSON.parse(localStorage.getItem('psmvd-cart') || '[]');
    const notify = message => {
      const toast = document.querySelector('#toast');
      if (!toast) return;
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2600);
    };
    if (!cart.length) return notify('Agregá un producto para continuar');
    pay.disabled = true;
    pay.textContent = 'Preparando pago…';
    try {
      const coupon = document.querySelector('#coupon')?.value || '';
      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart.map(({ id }) => ({ id })), coupon })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo iniciar el pago.');
      window.location.assign(result.init_point);
    } catch (error) {
      notify(error.message);
      pay.disabled = false;
      pay.textContent = 'Ir a pagar →';
    }
  };
})();
