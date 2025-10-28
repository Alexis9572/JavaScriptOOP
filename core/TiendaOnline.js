import { Tienda } from './Tienda.js';

export class TiendaOnline extends Tienda {
  constructor(nombre, catalogo) {
    super(nombre, catalogo);
  }

  calcularEnvio() {
    // ejemplo sencillo: envío fijo S/5 si subtotal < 50, gratis si >=50
    const s = this.carrito.subtotal();
    return s >= 50 ? 0 : 5;
  }

  finalizarCompra(cliente) {
    const items = super.finalizarCompra(cliente);
    // agregar registro especial de envío en ventas si aplica
    const envio = this.calcularEnvio();
    if (envio > 0) {
      // registrar como venta no producto (id 0)
      this.ventas.push({ id: 0, nombre: 'envío', cantidad: 1, monto: envio });
    }
    return { items, envio };
  }
}
