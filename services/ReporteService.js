export class ReporteService {
  topMasCaros(catalogo, n = 3) {
    console.log('\nTop ' + n + ' productos más caros:');
    const top = catalogo.topMasCaros(n);
    top.forEach((p,i) => console.log(`${i+1}. ${p.nombre} — S/${p.precio.toFixed(2)}`));
  }

  masVendidos(ventas) {
    console.log('\nProductos más vendidos en la sesión:');
    if (!ventas || ventas.length === 0) { console.log('No se han registrado ventas.'); return; }
    const map = new Map();
    ventas.forEach(v => {
      const key = v.id;
      map.set(key, (map.get(key) || 0) + (v.cantidad || 0));
    });
    const arr = [...map.entries()].map(([id, qty]) => ({ id, qty })).sort((a,b)=>b.qty-a.qty);
    arr.slice(0,10).forEach((r,i) => console.log(`${i+1}. id:${r.id} — ${r.qty}`));
  }

  resumenCarrito(carrito) {
    const items = carrito.items();
    const totalItems = items.reduce((a,i)=>a+i.cantidad,0);
    const monto = carrito.subtotal();
    console.log('\nResumen del carrito actual:');
    console.log(`Cantidad total de ítems: ${totalItems}`);
    console.log(`Monto acumulado: S/${monto.toFixed(2)}`);
  }
}
