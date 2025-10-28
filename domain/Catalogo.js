import { Producto } from './Producto.js';

export class Catalogo {
  constructor(productosArray = []) {
    this.map = new Map();
    productosArray.forEach(p => {
      const prod = (p instanceof Producto) ? p : new Producto(p.id, p.nombre, p.precio, p.categoria);
      this.map.set(prod.id, prod);
    });
  }

  listar() {
    console.log('\nID  Producto         Precio    Categoría');
    console.log('-'.repeat(50));
    [...this.map.values()].forEach(p => {
      console.log(String(p.id).padEnd(4) + p.nombre.padEnd(16) + p.precio.toFixed(2).padStart(9) + '   ' + p.categoria);
    });
  }

  buscarPorId(id) {
    return this.map.get(Number(id)) || null;
  }

  buscarPorNombre(nombre) {
    const lower = nombre.toLowerCase();
    for (const p of this.map.values()) {
      if (p.nombre.toLowerCase() === lower) return p;
    }
    return null;
  }

  topMasCaros(n = 3) {
    return [...this.map.values()].sort((a,b)=>b.precio-a.precio).slice(0,n);
  }
}
