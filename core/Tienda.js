import { Carrito } from '../domain/Carrito.js';

export class Tienda {
  constructor(nombre, catalogo) {
    this.nombre = nombre;
    this.catalogo = catalogo;
    this.carrito = new Carrito();
    this.ventas = []; // historial de ventas (item simples)
  }

  agregarProducto(prod) {
    // no persistido en este ejercicio: prod debe ser instancia Producto
    // asume que catalogo es manejado fuera
    return true;
  }

  agregarAlCarritoPorId(idOrName, cantidad) {
    // puede recibir id o nombre
    if (!idOrName) return false;
    let producto = null;
    if (!Number.isNaN(Number(idOrName))) producto = this.catalogo.buscarPorId(Number(idOrName));
    if (!producto) producto = this.catalogo.buscarPorNombre(idOrName);
    if (!producto) return false;
    try {
      this.carrito.agregar(producto, cantidad);
      return { producto, cantidad };
    } catch (e) {
      return false;
    }
  }

  finalizarCompra(cliente) {
    // mover items del carrito a ventas y al cliente, luego vaciar carrito
    const items = this.carrito.items().map(it => ({ producto: it.producto, cantidad: it.cantidad, subtotal: it.subtotal }));
    // registrar ventas
    items.forEach(it => this.ventas.push({ id: it.producto.id, nombre: it.producto.nombre, cantidad: it.cantidad }));
    // registrar en cliente
    if (cliente) cliente.agregarCompra(items);
    // vaciar carrito
    this.carrito.vaciar();
    return items;
  }

  verCarrito() {
    const items = this.carrito.items();
    if (items.length === 0) { console.log('\n' + 'El carrito está vacío.'); return; }
    console.log('\nProducto'.padEnd(16) + 'Cant.'.padStart(6) + '   Precio'.padStart(8) + '   Subtotal'.padStart(10));
    console.log('-'.repeat(50));
    items.forEach(it => {
      console.log(it.producto.nombre.padEnd(16) + String(it.cantidad).padStart(6) + '   ' + it.producto.precio.toFixed(2).padStart(8) + '   ' + it.subtotal.toFixed(2).padStart(10));
    });
  }

  imprimirTotales() {
    const subtotal = this.carrito.subtotal();
    const descuento = this.carrito.descuentoEscalonado();
    const igv = this.carrito.igv();
    const total = this.carrito.total();
    console.log('\nSubtotal: S/' + subtotal.toFixed(2));
    console.log('Descuento: S/' + descuento.toFixed(2));
    console.log('IGV (18%): S/' + igv.toFixed(2));
    console.log('TOTAL FINAL: S/' + total.toFixed(2));
  }
}
