export class Cliente {
  constructor(nombre) {
    this.nombre = nombre || 'Anonimo';
    this.historial = []; // array de ItemCarrito simples
  }

  agregarCompra(items) {
    // items: array de {producto, cantidad, subtotal}
    this.historial.push(...items);
  }

  totalGastado() {
    return this.historial.reduce((a, it) => a + (it.subtotal || 0), 0);
  }
}
