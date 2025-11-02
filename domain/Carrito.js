import { ItemCarrito } from './ItemCarrito.js';
export class Carrito {
    // Atributo privado para encapsular la lista de ítems.
    #items; 
    constructor() {
        this.#items = [];
    }

    /**
     * Agrega un producto al carrito. Si ya existe, acumula la cantidad.
     * @param {Producto} producto - El producto a agregar.
     * @param {number} cantidad - La cantidad a agregar (debe ser > 0).
     * @returns {boolean} true si se agregó/actualizó con éxito.
     */
    agregar(producto, cantidad) {
        if (typeof cantidad !== 'number' || cantidad <= 0) {
            console.error("ERROR: La cantidad debe ser numérica y mayor a 0.");
            return false;
        }

        const existingItem = this.#items.find(item => item.producto.id === producto.id);
        
        if (existingItem) {
            existingItem.cantidad += Math.floor(cantidad);
        } else {
            // Creamos un nuevo ItemCarrito y lo agregamos.
            this.#items.push(new ItemCarrito(producto, cantidad));
        }
        return true;
    }

    /**
     * Elimina un ítem del carrito por ID de producto.
     * @param {number} id - ID del producto a eliminar.
     * @returns {boolean} true si se eliminó, false si no se encontró.
     */
    eliminarPorId(id) {
        const initialLength = this.#items.length;
        this.#items = this.#items.filter(item => item.producto.id !== id);
        return this.#items.length < initialLength;
    }

    /**
     * Vacía completamente el carrito.
     */
    vaciar() {
        this.#items = [];
    }

    /**
     * Obtiene una copia de los ítems del carrito (observador).
     * @returns {ItemCarrito[]} Copia de la lista de ítems.
     */
    items() {
        // Devolvemos una copia superficial para proteger el atributo privado
        return [...this.#items];
    }

    /**
     * Calcula la suma de todos los subtotales de los ítems.
     * @returns {number} Subtotal total del carrito.
     */
    subtotal() {
        return this.#items.reduce((acc, item) => acc + item.subtotal(), 0);
    }

    /**
     * Calcula el monto del descuento escalonado.
     * @returns {number} Monto del descuento.
     */
    descuentoEscalonado() {
        const subtotal = this.subtotal();
        let porcentaje = 0;

        if (subtotal >= 100) {
            porcentaje = 0.15; // 15%
        } else if (subtotal >= 50) {
            porcentaje = 0.10; // 10%
        } else if (subtotal >= 20) {
            porcentaje = 0.05; // 5%
        }

        return subtotal * porcentaje;
    }

    /**
     * Calcula el IGV (18%) después de aplicar el descuento.
     * @returns {number} Monto del IGV.
     */
    igv() {
        const subtotalConDescuento = this.subtotal() - this.descuentoEscalonado();
        // IGV 18%
        return subtotalConDescuento * 0.18; 
    }

    /**
     * Calcula el total final de la compra.
     * Total = (Subtotal - Descuento) + IGV.
     * @returns {number} Total final.
     */
    total() {
        const subtotalConDescuento = this.subtotal() - this.descuentoEscalonado();
        return subtotalConDescuento + this.igv();
    }

    /**
     * Devuelve el subtotal formateado.
     * @returns {string}
     */
    subtotalFormateado() {
        return this.subtotal().toFixed(2);
    }

    /**
     * Devuelve el descuento formateado.
     * @returns {string}
     */
    descuentoFormateado() {
        return this.descuentoEscalonado().toFixed(2);
    }
    
    /**
     * Devuelve el IGV formateado.
     * @returns {string}
     */
    igvFormateado() {
        return this.igv().toFixed(2);
    }

    /**
     * Devuelve el total formateado.
     * @returns {string}
     */
    totalFormateado() {
        return this.total().toFixed(2);
    }
}