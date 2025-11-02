// services/TicketService.js

import chalk from 'chalk';

/**
 * Servicio encargado de generar el ticket de compra en consola con formato y colores.
 */
export class TicketService {

    /**
     * Genera y muestra un ticket de compra con formato de columnas.
     * @param {Tienda} tienda - La instancia de la Tienda (o TiendaOnline).
     * @param {Cliente} cliente - El cliente que realizó la compra.
     * @param {number} totalFinal - El total final pagado (incluyendo envío si aplica).
     * @param {number} costoEnvio - El costo de envío (0 si es tienda física).
     */
    static renderTicket(tienda, cliente, totalFinal, costoEnvio = 0) {
        const carrito = tienda.carrito;
        const items = carrito.items();

        // Si el carrito está vacío, no se debe generar ticket
        if (items.length === 0) {
            console.log(chalk.red("\n[ERROR] No hay ítems para generar el ticket."));
            return;
        }

        const COL_PROD = 25;
        const COL_CANT = 5;
        const COL_PRECIO = 8;
        const COL_SUBTOTAL = 10;

        const separator = chalk.gray("-").repeat(COL_PROD + COL_CANT + COL_PRECIO + COL_SUBTOTAL + 6);

        console.log(chalk.bold.yellow(`\n--- ${tienda.nombre.toUpperCase()} - RESUMEN DE COMPRA ---`));
        console.log(separator);

        // Encabezados
        const header = chalk.bold.blue(
            `| ${"Producto".padEnd(COL_PROD)} | ${"Cant".padEnd(COL_CANT)} | ${"Precio".padEnd(COL_PRECIO)} | ${"Subtotal".padEnd(COL_SUBTOTAL)} |`
        );
        console.log(header);
        console.log(separator);

        // Detalles del Producto
        items.forEach(item => {
            const line = 
                `| ${item.producto.nombre.padEnd(COL_PROD)} | ${String(item.cantidad).padEnd(COL_CANT)} | ${String(item.producto.precioFormateado()).padEnd(COL_PRECIO)} | ${item.subtotalFormateado().padEnd(COL_SUBTOTAL)} |`;
            console.log(line);
        });

        console.log(separator);

        // Resumen de Totales
        const totalRows = [
            { label: "Subtotal:", value: carrito.subtotalFormateado() },
            { label: "Descuento:", value: carrito.descuentoFormateado(), color: chalk.red },
            { label: `IGV (18%):`, value: carrito.igvFormateado(), color: chalk.cyan },
        ];

        totalRows.forEach(({ label, value, color = chalk.white }) => {
            const formattedValue = `S/${value}`;
            console.log(
                chalk.bold(label.padStart(COL_PROD + COL_CANT + COL_PRECIO + 3)) + 
                color(formattedValue.padEnd(COL_SUBTOTAL + 4))
            );
        });
        
        // Fila de Envío (solo si aplica)
        if (costoEnvio > 0) {
             console.log(
                chalk.bold("Costo de Envío:".padStart(COL_PROD + COL_CANT + COL_PRECIO + 3)) + 
                chalk.magenta(`S/${costoEnvio.toFixed(2)}`.padEnd(COL_SUBTOTAL + 4))
            );
        }

        // Total Final
        console.log(chalk.yellow(separator));
        const finalTotalLine = chalk.bold.yellow(
            `TOTAL FINAL: S/${totalFinal.toFixed(2)}`
        ).padStart(COL_PROD + COL_CANT + COL_PRECIO + COL_SUBTOTAL + 7);
        console.log(finalTotalLine);
        console.log(chalk.yellow(separator));

        console.log(chalk.green.bold("\n¡Gracias por su compra, " + cliente.nombre + "!"));
        console.log(chalk.gray(`Atendido por: ${tienda.nombre}`));
    }
}
