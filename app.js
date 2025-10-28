import promptSync from 'prompt-sync';
import chalk from 'chalk';
import { Tienda } from './core/Tienda.js';
import { TiendaOnline } from './core/TiendaOnline.js';
import { Catalogo } from './domain/Catalogo.js';
import productosSeed from './data/productos.js';
import { TicketService } from './services/TicketService.js';
import { ReporteService } from './services/ReporteService.js';
import { Cliente } from './domain/Cliente.js';

const prompt = promptSync({ sigint: true });

// Inicialización
const catalogo = new Catalogo(productosSeed);
const tienda = new Tienda('Delicia', catalogo);
const tiendaOnline = new TiendaOnline('Delicia Online', catalogo);
const ticketService = new TicketService();
const reporteService = new ReporteService();

console.clear();
console.log(chalk.blue.bold('\nBienvenido al sistema Mini-ERP Delicia (OOP)\n'));

let running = true;
const cliente = new Cliente('Cliente temporal');

while (running) {
  console.log('\n1. Registrar venta');
  console.log('2. Listar productos');
  console.log('3. Buscar producto');
  console.log('4. Ver carrito');
  console.log('5. Calcular total');
  console.log('6. Generar ticket');
  console.log('7. Reportes');
  console.log('8. Salir\n');

  const opt = prompt(chalk.cyan('Seleccione una opción: ')).trim();

  switch (opt) {
    case '1': {
      // registrar venta: elegir tienda (física o online)
      const tiendaOpt = prompt('Tienda (1 - Física, 2 - Online) [1]: ').trim() || '1';
      const shop = tiendaOpt === '2' ? tiendaOnline : tienda;
      let more = 's';
      while (more.toLowerCase() === 's') {
        const entrada = prompt('Producto (id o nombre): ').trim();
        if (!entrada) { console.log(chalk.red('Entrada vacía.')); continue; }
        const cantidadStr = prompt('Cantidad: ').trim();
        const cantidad = Number(cantidadStr);
        if (!cantidadStr || Number.isNaN(cantidad) || cantidad <= 0) {
          console.log(chalk.red('Cantidad inválida. Debe ser un número mayor a 0.')); continue;
        }
        const added = shop.agregarAlCarritoPorId(entrada, cantidad);
        if (added) console.log(chalk.green(` ${added.producto.nombre} agregado (${added.cantidad} x S/${added.producto.precio.toFixed(2)} = S/${(added.producto.precio*added.cantidad).toFixed(2)})`));
        else console.log(chalk.red('Producto no encontrado.'));
        more = prompt('¿Agregar otro producto? (s/n): ').trim().toLowerCase() || 'n';
      }
      console.log(chalk.blue('\nRESUMEN:'));
      ticketService.renderTicket(tienda, cliente); // muestra el carrito de la tienda fisica por defecto
      break;
    }
    case '2': {
      catalogo.listar();
      break;
    }
    case '3': {
      const nombre = prompt('Nombre del producto a buscar: ').trim();
      if (!nombre) { console.log(chalk.red('Entrada vacía.')); break; }
      const p = catalogo.buscarPorNombre(nombre);
      if (!p) console.log(chalk.red('Producto no encontrado'));
      else console.log(chalk.green(`Producto: ${p.nombre} — Precio: S/${p.precio.toFixed(2)} — Categoría: ${p.categoria}`));
      break;
    }
    case '4': {
      tienda.verCarrito();
      break;
    }
    case '5': {
      tienda.imprimirTotales();
      break;
    }
    case '6': {
      const tiendaOpt = prompt('Generar ticket para (1 - Física, 2 - Online) [1]: ').trim() || '1';
      const shop = tiendaOpt === '2' ? tiendaOnline : tienda;
      if (shop.carrito.items().length === 0) { console.log(chalk.red('Carrito vacío. No se puede generar ticket.')); break; }
      const nombreCliente = prompt('Nombre del cliente: ').trim() || 'Cliente';
      const clienteActual = new Cliente(nombreCliente);
      // finalizar compra (mueve a ventas y vacía carrito)
      shop.finalizarCompra(clienteActual);
      ticketService.renderTicket(shop, clienteActual);
      break;
    }
    case '7': {
      reporteService.topMasCaros(catalogo, 3);
      reporteService.masVendidos(tienda.ventas);
      reporteService.resumenCarrito(tienda.carrito);
      break;
    }
    case '8': {
      console.log(chalk.green('\nSaliendo... ¡Hasta luego!')); running = false; break;
    }
    default: {
      console.log(chalk.red('\nOpción no válida, por favor intente nuevamente.')); break;
    }
  }
}

console.log('\n');