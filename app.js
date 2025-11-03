import promptSync from 'prompt-sync';
import chalk from 'chalk';
const prompt = promptSync({ sigint: true });

import { Producto } from './domain/Producto.js';
import { Catalogo } from './domain/Catalogo.js';
import { Cliente } from './domain/Cliente.js';
import { TiendaOnline } from './core/TiendaOnline.js';
import { Tienda } from './core/Tienda.js';
import { ReporteService } from './services/ReporteService.js';
import { TicketService } from './services/TicketService.js';
import { PRODUCTOS_INICIALES } from './data/productos.js';



function inicializarApp() {
    console.log(chalk.bold.yellow("\n=== Selección de Tipo de Tienda ==="));
    console.log("1. Tienda Física");
    console.log("2. Tienda Online");

    let tipo = '';
    do {
        tipo = prompt(chalk.cyan("Seleccione tipo de tienda (1 o 2): ")).trim();
        if (tipo !== '1' && tipo !== '2') {
            console.log(chalk.red("[ERROR] Opción inválida. Ingrese 1 o 2."));
        }
    } while (tipo !== '1' && tipo !== '2');

    const productos = PRODUCTOS_INICIALES.map(p => new Producto(p.id, p.nombre, p.precio, p.categoria));
    const catalogo = new Catalogo(productos);
    let tienda;
    if (tipo === '1') {
        tienda = new Tienda("Mini ERP Delicia (Física)", catalogo);
        console.log(chalk.green("\n✔ Se ha creado la tienda física."));
    } else {
        tienda = new TiendaOnline("Mini ERP Delicia Online", catalogo);
        console.log(chalk.green("\n✔ Se ha creado la tienda online."));
    }

    const clientePrincipal = new Cliente("Usuario Invitado");
    return { tienda, clientePrincipal };
}


class MenuController {
    constructor(tienda, cliente) {
        this.tienda = tienda;
        this.cliente = cliente;
        this.opcion = '';
    }
    mostrarMenu() {
        console.log(chalk.magenta.bold('\n============================================='));
        console.log(chalk.magenta.bold(`                  BIENVENIDO                   `));
        console.log(chalk.magenta.bold('============================================='));
        console.log('1. Registrar Venta (Agregar al Carrito)');
        console.log('2. Listar Productos del Catálogo');
        console.log('3. Buscar Producto por Nombre');
        console.log('4. Ver Carrito Actual');
        console.log('5. Finalizar Compra y Generar Ticket');
        console.log('6. Reportes');
        console.log('7. Eliminar/Vaciar Carrito');
        console.log('8. Salir');
        console.log(chalk.magenta('============================================='));
    }

    /**
     * Valida la entrada del usuario (que no sea vacía).
     * @param {string} mensaje - Mensaje a mostrar al solicitar la entrada.
     * @returns {string | null} La entrada válida o null si se cancela.
     */
    obtenerEntradaValida(mensaje) {
        let entrada;
        do {
            entrada = prompt(mensaje).trim();
            if (entrada === '') {
                console.log(chalk.red('[ERROR] La entrada no puede ser vacía. Por favor, intente de nuevo.'));
            }
        } while (entrada === '');
        return entrada;
    }

    /*
     * Muestra el carrito actual con formato de tabla.
     */
    verCarrito() {
        const items = this.tienda.carrito.items();
        console.log(chalk.bold.yellow("\n--- CARRITO DE COMPRAS ---"));
        if (items.length === 0) {
            console.log(chalk.gray("El carrito está vacío."));
            return;
        }

        const COL_PROD = 25;
        const COL_CANT = 5;
        const COL_PRECIO = 8;
        const COL_SUBTOTAL = 10;
        const separator = chalk.gray("-").repeat(COL_PROD + COL_CANT + COL_PRECIO + COL_SUBTOTAL + 6);

        console.log(separator);
        const header = chalk.bold.blue(
            `| ${"Producto".padEnd(COL_PROD)} | ${"Cant".padEnd(COL_CANT)} | ${"Precio".padEnd(COL_PRECIO)} | ${"Subtotal".padEnd(COL_SUBTOTAL)} |`
        );
        console.log(header);
        console.log(separator);

        items.forEach(item => {
            const line = 
                `| ${item.producto.nombre.padEnd(COL_PROD)} | ${String(item.cantidad).padEnd(COL_CANT)} | ${item.producto.precioFormateado().padEnd(COL_PRECIO)} | ${item.subtotalFormateado().padEnd(COL_SUBTOTAL)} |`;
            console.log(line);
        });
        console.log(separator);

        console.log(chalk.bold.blue(`Subtotal del Carrito: S/${this.tienda.carrito.subtotalFormateado()}`));
    }

    /**
     * Proceso interactivo para agregar productos al carrito.
     */
    registrarVenta() {
        console.log(chalk.bold.yellow('\n--- REGISTRO DE VENTA ---'));
        let continuar = true;

        while (continuar) {
            const idInput = this.obtenerEntradaValida(chalk.cyan("Ingrese ID del producto (o 'f' para finalizar, 'c' para cancelar): "));
            if (idInput === 'f' || idInput === 'F') {
                continuar = false;
                break;
            }
            if (idInput === 'c' || idInput === 'C') {
                console.log(chalk.red("Registro de venta cancelado."));
                return;
            }

            const id = parseInt(idInput);
            if (isNaN(id)) {
                console.log(chalk.red('[ERROR] ID no válido. Debe ser un número.'));
                continue;
            }

            const producto = this.tienda.catalogo.buscarPorId(id);
            if (!producto) {
                console.log(chalk.red(`[ERROR] Producto con ID ${id} no encontrado.`));
                continue;
            }

            console.log(chalk.green(`Producto seleccionado: ${producto.nombre} (S/${producto.precioFormateado()})`));

            let cantidad;
            do {
                const cantidadInput = this.obtenerEntradaValida(chalk.cyan(`Ingrese cantidad (actual en carrito: ${this.tienda.carrito.items().find(i => i.producto.id === id)?.cantidad || 0}): `));
                cantidad = parseInt(cantidadInput);
                if (isNaN(cantidad) || cantidad <= 0) {
                    console.log(chalk.red('[ERROR] Cantidad no válida. Debe ser un número entero mayor a 0.'));
                }
            } while (isNaN(cantidad) || cantidad <= 0);

            // Invocación al método de la Tienda
            this.tienda.agregarAlCarritoPorId(id, cantidad);
        }

        this.verCarrito();
    }

    /**
     * Lista todos los productos del catálogo.
     */
    listarProductos() {
        const productos = this.tienda.catalogo.listar();
        console.log(chalk.bold.yellow("\n--- CATÁLOGO DE PRODUCTOS ---"));
        
        const COL_ID = 5;
        const COL_NOMBRE = 30;
        const COL_PRECIO = 10;
        const COL_CATEGORIA = 15;
        const separator = chalk.gray("-").repeat(COL_ID + COL_NOMBRE + COL_PRECIO + COL_CATEGORIA + 9);

        console.log(separator);
        const header = chalk.bold.blue(
            `| ${"ID".padEnd(COL_ID)} | ${"Nombre".padEnd(COL_NOMBRE)} | ${"Precio".padEnd(COL_PRECIO)} | ${"Categoría".padEnd(COL_CATEGORIA)} |`
        );
        console.log(header);
        console.log(separator);

        productos.forEach(prod => {
            const line = 
                `| ${String(prod.id).padEnd(COL_ID)} | ${prod.nombre.padEnd(COL_NOMBRE)} | ${('S/' + prod.precioFormateado()).padEnd(COL_PRECIO)} | ${prod.categoria.padEnd(COL_CATEGORIA)} |`;
            console.log(line);
        });
        console.log(separator);
    }

    /**
     * Busca un producto por nombre (case-insensitive).
     */
    buscarProducto() {
        console.log(chalk.bold.yellow('\n--- BÚSQUEDA DE PRODUCTO ---'));
        const nombreBusqueda = this.obtenerEntradaValida(chalk.cyan("Ingrese nombre o parte del nombre: "));
        
        const resultados = this.tienda.catalogo.buscarPorNombre(nombreBusqueda);

        if (resultados.length === 0) {
            console.log(chalk.red(`[INFO] Producto "${nombreBusqueda}" no encontrado.`));
            return;
        }

        console.log(chalk.green(`\nResultados encontrados (${resultados.length}):`));
        resultados.forEach(prod => {
            console.log(chalk.white(`- ${prod.nombre} (ID: ${prod.id})`));
            console.log(chalk.gray(`  Precio: S/${prod.precioFormateado()} | Categoría: ${prod.categoria}`));
        });
    }

    /**
     * Muestra la pantalla de reportes.
     */
    menuReportes() {
        console.log(chalk.bold.yellow('\n--- SUBMENÚ DE REPORTES ---'));
        console.log(chalk.cyan('a. Top 3 Productos Más Caros'));
        console.log(chalk.cyan('b. Productos Más Vendidos (Sesión)'));
        console.log(chalk.cyan('c. Resumen del Carrito Actual'));
        console.log(chalk.red('d. Volver al Menú Principal'));
        
        const opcion = prompt(chalk.magenta("Seleccione un reporte (a/b/c/d): ")).toLowerCase().trim();

        switch (opcion) {
            case 'a':
                ReporteService.topMasCaros(this.tienda.catalogo, 3);
                break;
            case 'b':
                ReporteService.masVendidos(this.tienda.ventas);
                break;
            case 'c':
                ReporteService.resumenCarrito(this.tienda.carrito);
                break;
            case 'd':
                console.log(chalk.gray("Volviendo al menú principal..."));
                break;
            default:
                console.log(chalk.red('Opción no válida.'));
        }
    }

    /**
     * Muestra el menú para eliminar ítems o vaciar el carrito.
     */
    menuEliminar() {
        this.verCarrito();
        if (this.tienda.carrito.items().length === 0) return;

        console.log(chalk.bold.yellow('\n--- GESTIÓN DE CARRITO ---'));
        console.log(chalk.cyan('1. Eliminar un producto por ID'));
        console.log(chalk.cyan('2. Vaciar el carrito completo'));
        console.log(chalk.red('3. Cancelar'));

        const opcion = prompt(chalk.magenta("Seleccione una opción: ")).trim();

        switch (opcion) {
            case '1':
                const idInput = this.obtenerEntradaValida(chalk.cyan("Ingrese ID del producto a eliminar: "));
                const id = parseInt(idInput);
                if (isNaN(id)) {
                    console.log(chalk.red('[ERROR] ID no válido.'));
                    return;
                }
                const deleted = this.tienda.carrito.eliminarPorId(id);
                if (deleted) {
                    console.log(chalk.green(`[ÉXITO] Producto con ID ${id} eliminado del carrito.`));
                } else {
                    console.log(chalk.red(`[ERROR] Producto con ID ${id} no encontrado en el carrito.`));
                }
                break;
            case '2':
                this.tienda.carrito.vaciar();
                console.log(chalk.green('[ÉXITO] El carrito ha sido vaciado completamente.'));
                break;
            case '3':
                console.log(chalk.gray("Cancelado."));
                break;
            default:
                console.log(chalk.red('Opción no válida.'));
        }
    }

    /**
     * Procesa la opción 5: Finalizar Compra, generar ticket y calcular totales.
     */
    finalizarCompraYTicket() {
        if (this.tienda.carrito.items().length === 0) {
            console.log(chalk.red("[ERROR] No se puede finalizar: el carrito está vacío."));
            return;
        }

        // 1. Mostrar cálculo de totales antes de finalizar
        const carrito = this.tienda.carrito;
        const subtotal = carrito.subtotal();
        const descuento = carrito.descuentoEscalonado();
        const igv = carrito.igv();
        const totalBase = carrito.total();
        let costoEnvio = 0;

        console.log(chalk.bold.yellow('\n--- CÁLCULO DE TOTALES ---'));
        console.log(`Subtotal: ${chalk.white(`S/${subtotal.toFixed(2)}`)}`);
        console.log(`Descuento (aplicado): ${chalk.red(`S/${descuento.toFixed(2)}`)}`);
        console.log(`Subtotal con Descuento: ${chalk.white(`S/${(subtotal - descuento).toFixed(2)}`)}`);
        console.log(`IGV (18%): ${chalk.cyan(`S/${igv.toFixed(2)}`)}`);
        
        // 2. Ejecutar Polimorfismo: Finalizar compra (que incluye la lógica de envío si es TiendaOnline)
        const resumenTransaccion = this.tienda.finalizarCompra(this.cliente);

        if (resumenTransaccion) {
            costoEnvio = resumenTransaccion.envio;
            const totalFinal = resumenTransaccion.total;

            if (costoEnvio > 0) {
                console.log(`Costo de Envío: ${chalk.magenta(`S/${costoEnvio.toFixed(2)}`)}`);
            }
            console.log(chalk.bold.yellow(`TOTAL FINAL A PAGAR: S/${totalFinal.toFixed(2)}`));

            // 3. Generar Ticket (se pasa la información necesaria para el renderizado)
            TicketService.renderTicket(this.tienda, this.cliente, totalFinal, costoEnvio);
            console.log(chalk.green.bold(`\n[TRANSACCIÓN COMPLETA] El total S/${totalFinal.toFixed(2)} fue pagado.`));

        } else {
            console.log(chalk.red("Ocurrió un error al finalizar la compra."));
        }
    }

    /**
     * Bucle principal de la aplicación.
     */
    async ejecutar() {
        let salir = false;
        
        while (!salir) {
            this.mostrarMenu();
            this.opcion = prompt(chalk.magenta.bold("Ingrese su opción (1-8): ")).trim();

            switch (this.opcion) {
                case '1': // Registrar venta
                    this.registrarVenta();
                    break;
                case '2': // Listar productos
                    this.listarProductos();
                    break;
                case '3': // Buscar producto
                    this.buscarProducto();
                    break;
                case '4': // Ver carrito
                    this.verCarrito();
                    break;
                case '5': // Finalizar compra y generar ticket
                    this.finalizarCompraYTicket();
                    break;
                case '6': // Reportes
                    this.menuReportes();
                    break;
                case '7': // Eliminar/Vaciar Carrito
                    this.menuEliminar();
                    break;
                case '8': // Salir
                    console.log(chalk.red.bold('\nSaliendo de la aplicación. ¡Hasta pronto!'));
                    salir = true;
                    break;
                default:
                    console.log(chalk.red('Opción no válida, por favor intente nuevamente.'));
            }
        }
    }
}

// --- Inicio de la aplicación ---
const { tienda, clientePrincipal } = inicializarApp();
const menu = new MenuController(tienda, clientePrincipal);
menu.ejecutar();
