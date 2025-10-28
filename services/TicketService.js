import chalk from 'chalk';

export class TicketService {
  renderTicket(tienda, cliente) {
    const carritoItems = tienda.carrito.items();
    if (!carritoItems || carritoItems.length === 0) {
      console.log(chalk.yellow('\nCarrito vacío.')); return;
    }
    console.log(chalk.green('\nRESUMEN DE COMPRA'));
    console.log('-'.repeat(50));
    console.log('Producto'.padEnd(20) + 'Cant.'.padStart(6) + '   Precio'.padStart(8) + '   Subtotal'.padStart(10));
    console.log('-'.repeat(50));
    carritoItems.forEach(it => {
      console.log(it.producto.nombre.padEnd(20) + String(it.cantidad).padStart(6) + '   ' + it.producto.precio.toFixed(2).padStart(8) + '   ' + it.subtotal.toFixed(2).padStart(10));
    });
    console.log('-'.repeat(50));
    const subtotal = tienda.carrito.subtotal();
    const descuento = tienda.carrito.descuentoEscalonado();
    const igv = tienda.carrito.igv();
    const total = tienda.carrito.total();
    console.log('\nSubtotal: ' + chalk.yellow('S/' + subtotal.toFixed(2)));
    console.log('Descuento: ' + chalk.yellow('S/' + descuento.toFixed(2)));
    console.log('IGV (18%): ' + chalk.yellow('S/' + igv.toFixed(2)));
    console.log(chalk.blue.bold('\nTOTAL FINAL: ' + 'S/' + total.toFixed(2)));
    console.log('\n' + chalk.green('    ¡Gracias por su compra!\n'));
  }
}
