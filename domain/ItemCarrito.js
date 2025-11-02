// domain/ItemCarrito.js

import { Producto } from './Producto.js';

/**
 * Representa un ítem dentro del carrito de compras.
 */
export class ItemCarrito {
    /**
     * @param {Producto} producto - El producto asociado.
     * @param {number} cantidad - La cantidad del producto (debe ser >= 1).
     */
    constructor(producto, cantidad) {
        if (!(producto instanceof Producto)) {
            throw new Error("El ítem de carrito requiere un objeto Producto.");
        }
        if (typeof cantidad !== 'number' || cantidad < 1) {
            throw new Error("La cantidad debe ser un número entero mayor o igual a 1.");
        }
        this.producto = producto;
        this.cantidad = Math.floor(cantidad); // Aseguramos que sea entero
    }

    /**
     * Calcula el subtotal del ítem (precio * cantidad).
     * @returns {number} Subtotal con precisión flotante.
     */
    subtotal() {
        return this.producto.precio * this.cantidad;
    }

    /**
     * Devuelve el subtotal formateado a dos decimales.
     * @returns {string} Subtotal en formato de cadena (ej: "25.00").
     */
    subtotalFormateado() {
        return this.subtotal().toFixed(2);
    }
}
