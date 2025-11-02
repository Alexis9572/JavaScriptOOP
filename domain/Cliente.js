// domain/Cliente.js

import { ItemCarrito } from './ItemCarrito.js';

/**
 * Representa a un cliente con historial de compras.
 */
export class Cliente {
    /**
     * @param {string} nombre - Nombre del cliente.
     * @param {ItemCarrito[]} [historial=[]] - Historial de ítems comprados.
     */
    constructor(nombre) {
        if (!nombre) {
            throw new Error("El cliente debe tener un nombre.");
        }
        this.nombre = nombre;
        // Almacena una copia de los ItemCarrito de las compras finalizadas
        this.historial = []; 
    }

    /**
     * Agrega una compra al historial del cliente.
     * @param {ItemCarrito[]} items - Array de ItemCarrito de la compra.
     */
    agregarCompra(items) {
        // Agrega una copia de los ítems comprados al historial
        this.historial.push(...items); 
    }

    /**
     * Calcula el monto total gastado por el cliente sumando los subtotales de todos los ítems en el historial.
     * Nota: El requisito pide sumar ItemCarrito[], pero esto solo suma los subtotales sin incluir descuentos/IGV de la transacción original. 
     * Cumpliendo el requisito: se suman los ItemCarrito.subtotal().
     * @returns {number} Monto total gastado.
     */
    totalGastado() {
        return this.historial.reduce((total, item) => total + item.subtotal(), 0);
    }

    /**
     * Devuelve el total gastado formateado.
     * @returns {string}
     */
    totalGastadoFormateado() {
        return this.totalGastado().toFixed(2);
    }
}
