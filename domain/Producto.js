// domain/Producto.js

/**
 * Representa un producto en el catálogo.
 */
export class Producto {
    constructor(id, nombre, precio, categoria) {
        if (!id || !nombre || typeof precio !== 'number' || precio <= 0 || !categoria) {
            throw new Error("Producto debe tener id, nombre, precio (> 0) y categoría válidos.");
        }
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
    }

    /**
     * Devuelve el precio formateado a dos decimales.
     * @returns {string} Precio en formato de cadena (ej: "12.50").
     */
    precioFormateado() {
        return this.precio.toFixed(2);
    }

    /**
     * Devuelve una representación JSON del producto.
     * @returns {object}
     */
    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            precio: this.precio,
            categoria: this.categoria
        };
    }
}
