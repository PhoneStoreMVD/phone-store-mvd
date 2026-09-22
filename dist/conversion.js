const family = document.querySelector('#familia');
if (family && !document.querySelector('.conversion')) {
  family.insertAdjacentHTML('afterend', `<section class="conversion">
    <div class="conversion-intro"><p>COMPRÁ CON CLARIDAD</p><h2>Elegí con toda<br>la información.</h2><span>Compará los modelos destacados, encontrá el que te sirve y conocé cada detalle antes de comprar.</span><a href="producto.html">Comparar iPhone <b>→</b></a></div>
    <div class="compare-grid"><article><img src="assets/iphone16-editorial.png" alt="iPhone 16"><small>IPHONE 16</small><h3>Equilibrio para todos los días.</h3><p>128 GB · Cámara avanzada · USB-C</p><a href="producto.html">Ver información →</a></article><article class="compare-pro"><img src="assets/iphone16pro-editorial.png" alt="iPhone 16 Pro"><small>IPHONE 16 PRO</small><h3>Potencia pensada para más.</h3><p>128 GB · Titanio · Sistema Pro</p><a href="producto.html">Ver información →</a></article></div>
  </section>`);
}
