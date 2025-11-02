// core/TiendaOnline.js

import { Tienda } from './Tienda.js';

/**
 * Tienda especializada en ventas online, que hereda de Tienda
 * y agrega la funcionalidad de cálculo de envío (Polimorfismo).
 */
export class TiendaOnline extends Tienda {

    constructor(nombre, catalogo) {
        super(nombre, catalogo);
    }

    /**
     * Calcula el costo de envío (ejemplo: flat rate de S/5.00).
     * @returns {number} Costo de envío.
     */
    calcularEnvio() {
        // Lógica de ejemplo: envío gratuito si el subtotal supera 50, si no, cuesta 5.00
        const subtotal = this.carrito.subtotal();
        return subtotal >= 50 ? 0.00 : 5.00;
    }

    /**
     * Sobreescribe el método de la clase padre (Tienda) para incluir el costo de envío.
     * @param {Cliente} cliente - El cliente que realiza la compra.
     * @returns {object | null} Un resumen de la transacción o null si el carrito está vacío.
     */
    finalizarCompra(cliente) {
        // Llama a la validación de la clase padre
        if (this.carrito.items().length === 0) {
            return null;
        }

        // Calcula el envío antes de vaciar el carrito
        const costoEnvio = this.calcularEnvio();
        const totalBase = this.carrito.total(); // Total sin envío
        const totalFinalConEnvio = totalBase + costoEnvio;

        // 1. Obtener la información necesaria antes de llamar al método padre
        const itemsVendidos = this.carrito.items();

        // 2. Actualizar el historial de ventas y cliente, y vaciar el carrito (reutilizando lógica del padre)
        
        // 1. Agregar al historial de ventas de la tienda
        this.ventas.push(...itemsVendidos);
        
        // 2. Agregar la compra al historial del cliente
        cliente.agregarCompra(itemsVendidos);

        // 3. Vaciar el carrito
        this.carrito.vaciar();
        
        return {
            total: totalFinalConEnvio,
            items: itemsVendidos.length,
            nombreCliente: cliente.nombre,
            envio: costoEnvio
        };
    }
}
