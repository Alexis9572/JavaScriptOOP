import { ItemCarrito } from './ItemCarrito.js';

export class Carrito {
  #items = [];

  agregar(producto, cantidad) {
    if (!producto) throw new Error('Producto inválido');
    if (!cantidad || Number.isNaN(Number(cantidad)) || Number(cantidad) <= 0) throw new Error('Cantidad inválida');
    const exists = this.#items.find(it => it.producto.id === producto.id);
    if (exists) exists.cantidad += Number(cantidad);
    else this.#items.push(new ItemCarrito(producto, Number(cantidad)));
    return true;
  }

  eliminarPorId(id) {
    const idx = this.#items.findIndex(it => it.producto.id === Number(id));
    if (idx === -1) return false;
    this.#items.splice(idx, 1);
    return true;
  }

  vaciar() {
    this.#items = [];
  }

  items() {
    // retornamos copia para no exponer referencia privada
    return this.#items.map(it => ({ producto: it.producto, cantidad: it.cantidad, subtotal: it.subtotal() }));
  }

  subtotal() {
    return this.#items.reduce((a, it) => a + it.subtotal(), 0);
  }

  descuentoEscalonado() {
    const s = this.subtotal();
    if (s >= 100) return s * 0.15;
    if (s >= 50) return s * 0.10;
    if (s >= 20) return s * 0.05;
    return 0;
  }

  igv() {
    const base = this.subtotal() - this.descuentoEscalonado();
    return base * 0.18;
  }

  total() {
    return (this.subtotal() - this.descuentoEscalonado()) + this.igv();
  }
}
