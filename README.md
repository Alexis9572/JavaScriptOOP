# Mini-ERP Delicia (OOP, ES Modules)

Estructura del proyecto y uso.

## Requisitos
- Node.js v16+ (soporte a ES Modules)

## Instalación
```bash
cd mini-erp-delicia-oop
npm install
```

## Ejecutar
```bash
node app.js
```

## Diseño
- Clases: Producto, ItemCarrito, Carrito, Catalogo, Cliente, Tienda, TiendaOnline
- Servicios: TicketService, ReporteService
- app.js actúa como MenuController

## Notas
- `package.json` usa "type": "module" para ESM.
- Se usa `prompt-sync` para entrada en consola y `chalk` para colores.
- Toda la información vive en memoria.
