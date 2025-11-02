// services/ReporteService.js

import chalk from 'chalk';

/**
 * Servicio encargado de generar reportes estadísticos y resúmenes.
 */
export class ReporteService {

    /**
     * Muestra el Top N de productos más caros del catálogo.
     * @param {Catalogo} catalogo - La instancia del Catálogo.
     * @param {number} n - El número de productos del top (ej: 3).
     */
    static topMasCaros(catalogo, n = 3) {
        const topProductos = catalogo.topMasCaros(n);

        console.log(chalk.bold.yellow(`\n--- REPORTE: TOP ${n} PRODUCTOS MÁS CAROS ---`));
        if (topProductos.length === 0) {
            console.log(chalk.gray("No hay productos en el catálogo."));
            return;
        }

        const COL_ID = 5;
        const COL_NOMBRE = 25;
        const COL_PRECIO = 10;
        const COL_CATEGORIA = 15;
        const separator = chalk.gray("-").repeat(COL_ID + COL_NOMBRE + COL_PRECIO + COL_CATEGORIA + 9);

        console.log(separator);
        const header = chalk.bold.blue(
            `| ${"ID".padEnd(COL_ID)} | ${"Nombre".padEnd(COL_NOMBRE)} | ${"Precio".padEnd(COL_PRECIO)} | ${"Categoría".padEnd(COL_CATEGORIA)} |`
        );
        console.log(header);
        console.log(separator);

        topProductos.forEach(prod => {
            const line = 
                `| ${String(prod.id).padEnd(COL_ID)} | ${prod.nombre.padEnd(COL_NOMBRE)} | ${('S/' + prod.precioFormateado()).padEnd(COL_PRECIO)} | ${prod.categoria.padEnd(COL_CATEGORIA)} |`;
            console.log(line);
        });
        console.log(separator);
    }

    /**
     * Muestra los productos más vendidos en la sesión actual.
     * @param {ItemCarrito[]} ventas - El array de ItemCarrito de todas las ventas realizadas.
     */
    static masVendidos(ventas) {
        console.log(chalk.bold.yellow("\n--- REPORTE: PRODUCTOS MÁS VENDIDOS EN SESIÓN ---"));
        if (ventas.length === 0) {
            console.log(chalk.gray("Aún no se han registrado ventas."));
            return;
        }

        // Agrupa las ventas por ID de producto y suma las cantidades
        const ventasAgrupadas = ventas.reduce((acc, item) => {
            const id = item.producto.id;
            if (!acc[id]) {
                acc[id] = { 
                    nombre: item.producto.nombre, 
                    cantidadTotal: 0,
                    ventasTotales: 0
                };
            }
            acc[id].cantidadTotal += item.cantidad;
            acc[id].ventasTotales += item.subtotal();
            return acc;
        }, {});

        // Convierte el objeto a array y ordena por cantidad total vendida (descendente)
        const topVendidos = Object.values(ventasAgrupadas)
            .sort((a, b) => b.cantidadTotal - a.cantidadTotal);

        const COL_NOMBRE = 25;
        const COL_CANTIDAD = 10;
        const COL_MONTO = 12;
        const separator = chalk.gray("-").repeat(COL_NOMBRE + COL_CANTIDAD + COL_MONTO + 7);

        console.log(separator);
        const header = chalk.bold.blue(
            `| ${"Producto".padEnd(COL_NOMBRE)} | ${"Cant. Vendida".padEnd(COL_CANTIDAD)} | ${"Monto Total".padEnd(COL_MONTO)} |`
        );
        console.log(header);
        console.log(separator);

        topVendidos.forEach(item => {
            const line = 
                `| ${item.nombre.padEnd(COL_NOMBRE)} | ${String(item.cantidadTotal).padEnd(COL_CANTIDAD)} | ${('S/' + item.ventasTotales.toFixed(2)).padEnd(COL_MONTO)} |`;
            console.log(line);
        });
        console.log(separator);
    }

    /**
     * Muestra un resumen del estado actual del carrito.
     * @param {Carrito} carrito - La instancia del Carrito.
     */
    static resumenCarrito(carrito) {
        const totalItems = carrito.items().reduce((sum, item) => sum + item.cantidad, 0);
        const montoAcumulado = carrito.subtotal();

        console.log(chalk.bold.yellow("\n--- REPORTE: RESUMEN DE CARRITO ACTUAL ---"));
        console.log(chalk.cyan(`Cantidad total de ítems únicos: ${carrito.items().length}`));
        console.log(chalk.cyan(`Cantidad total de unidades: ${totalItems}`));
        console.log(chalk.cyan(`Monto Subtotal Acumulado: ${chalk.bold(`S/${montoAcumulado.toFixed(2)}`)}`));
        console.log(chalk.cyan(`Descuento Aplicable: ${chalk.bold(`S/${carrito.descuentoFormateado()}`)}`));
        console.log(chalk.bold.blue(`TOTAL CARRO (Pre-envío): S/${carrito.totalFormateado()}`));
    }
}
