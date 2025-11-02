// domain/Catalogo.js

import { Producto } from './Producto.js';

/**
 * Gestiona la colección de productos, permitiendo búsquedas y reportes.
 */
export class Catalogo {
    /**
     * @private
     * Estructura interna Map<number, Producto> para acceso rápido por ID.
     */
    #productos; 

    /**
     * Inicializa el catálogo con una lista de objetos Producto.
     * @param {Producto[]} productos - Array de objetos Producto.
     */
    constructor(productos = []) {
        this.#productos = new Map();
        for (const prod of productos) {
            this.agregar(prod);
        }
    }

    /**
     * Agrega un producto al catálogo.
     * @param {Producto} producto - Objeto Producto.
     */
    agregar(producto) {
        if (!(producto instanceof Producto)) {
            console.error("ERROR: Solo se pueden agregar objetos Producto al catálogo.");
            return;
        }
        this.#productos.set(producto.id, producto);
    }

    /**
     * Devuelve un array de todos los productos en el catálogo.
     * @returns {Producto[]}
     */
    listar() {
        return Array.from(this.#productos.values());
    }

    /**
     * Busca un producto por su ID.
     * @param {number} id - ID del producto.
     * @returns {Producto | undefined} El producto o undefined si no se encuentra.
     */
    buscarPorId(id) {
        return this.#productos.get(id);
    }

    /**
     * Busca productos por nombre (búsqueda parcial e insensible a mayúsculas/minúsculas).
     * @param {string} nombre - Parte del nombre a buscar.
     * @returns {Producto[]} Lista de productos que coinciden.
     */
    buscarPorNombre(nombre) {
        const query = nombre.toLowerCase().trim();
        if (!query) return [];
        
        return this.listar().filter(prod => 
            prod.nombre.toLowerCase().includes(query)
        );
    }

    /**
     * Devuelve el top N de productos más caros.
     * @param {number} n - Cantidad de productos a devolver.
     * @returns {Producto[]} Lista de productos ordenados por precio descendente.
     */
    topMasCaros(n = 3) {
        return this.listar()
            .sort((a, b) => b.precio - a.precio)
            .slice(0, n);
    }
}
