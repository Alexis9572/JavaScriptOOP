export class ItemCarrito {
  constructor(producto, cantidad) {
    this.producto = producto;
    this.cantidad = Number(cantidad);
    if (this.cantidad < 1) throw new Error('Cantidad debe ser >= 1');
  }

  subtotal() {
    return this.producto.precio * this.cantidad;
  }
}
