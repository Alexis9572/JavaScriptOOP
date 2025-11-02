// core/Tienda.js

import { Catalogo } from '../domain/Catalogo.js';
import { Carrito } from '../domain/Carrito.js';
import { Producto } from '../domain/Producto.js';
import { Cliente } from '../domain/Cliente.js';

/**
 * Clase base para la gestión de la tienda (catálogo, carrito, ventas).
 */
export class Tienda {
    /**
     * @param {string} nombre - Nombre de la tienda.
     * @param {Catalogo} catalogo - Catálogo de productos.
     */
    constructor(nombre, catalogo) {
        this.nombre = nombre;
        this.catalogo = catalogo;
        this.carrito = new Carrito();
        // Almacena todos los ItemCarrito de todas las ventas para reportes
        this.ventas = []; 
    }

    /**
     * Agrega un producto al catálogo interno.
     * @param {Producto} prod 
     */
    agregarProducto(prod) {
        this.catalogo.agregar(prod);
    }

    /**
     * Agrega un producto al carrito resolviendo el producto desde el catálogo.
     * @param {number} id - ID del producto.
     * @param {number} cantidad - Cantidad a agregar.
     * @returns {boolean} true si se agregó con éxito.
     */
    agregarAlCarritoPorId(id, cantidad) {
        const producto = this.catalogo.buscarPorId(id);
        
        if (!producto) {
            console.error(`\n[ERROR] Producto con ID ${id} no encontrado en el catálogo.`);
            return false;
        }

        // El método Carrito.agregar ya valida que cantidad > 0
        const success = this.carrito.agregar(producto, cantidad);

        if (success) {
            console.log(`\n[ÉXITO] ${cantidad}x ${producto.nombre} agregado al carrito.`);
        }
        return success;
    }

    /**
     * Finaliza la compra, registra la venta y vacía el carrito.
     * Este es el método que será sobreescrito por TiendaOnline (Polimorfismo).
     * @param {Cliente} cliente - El cliente que realiza la compra.
     * @returns {object | null} Un resumen de la transacción o null si el carrito está vacío.
     */
    finalizarCompra(cliente) {
        if (this.carrito.items().length === 0) {
            console.error("\n[ERROR] El carrito está vacío. No se puede finalizar la compra.");
            return null;
        }

        const itemsVendidos = this.carrito.items();
        const totalFinal = this.carrito.total();

        // 1. Agregar al historial de ventas de la tienda
        this.ventas.push(...itemsVendidos);
        
        // 2. Agregar la compra al historial del cliente
        cliente.agregarCompra(itemsVendidos);

        // 3. Vaciar el carrito
        this.carrito.vaciar();

        return {
            total: totalFinal,
            items: itemsVendidos.length,
            nombreCliente: cliente.nombre,
            envio: 0 // Envío por defecto en tienda física
        };
    }
}
