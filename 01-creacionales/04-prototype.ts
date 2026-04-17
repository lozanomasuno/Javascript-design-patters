/**
 * ! Patrón Prototype:

 * Es un patrón de diseño creacional que nos permite copiar objetos existentes sin hacer
 * que el código dependa de sus clases.
 * 
 * * Es útil cuando queremos duplicar el contenido, 
 * * el título y el autor de un documento, por ejemplo o cualquier objeto complejo.
 * 
 * https://refactoring.guru/es/design-patterns/prototype
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Interfaz Prototype ─────────────────────────────────────────────────────
// Declara el método de clonación. Todas las clases clonables lo implementan.
interface Prototype<T> {
  clone(): T;
}

// ─── Objeto complejo: Dirección (referencia anidada) ───────────────────────────
class Address implements Prototype<Address> {
  constructor(
    public street: string,
    public city: string,
    public country: string,
  ) {}

  clone(): Address {
    // Copia profunda de un objeto simple—basta con el constructor.
    return new Address(this.street, this.city, this.country);
  }
}

// ─── Producto: Documento ────────────────────────────────────────────────────────────
// Simula un documento con campos primitivos y referencias a objetos.
class Document implements Prototype<Document> {
  public tags: string[];

  constructor(
    public title: string,
    public author: string,
    public content: string,
    public address: Address,
    tags: string[],
  ) {
    this.tags = tags;
  }

  clone(): Document {
    return new Document(
      this.title,
      this.author,
      this.content,
      this.address.clone(), // copia profunda del objeto anidado
      [...this.tags],        // copia del arreglo para evitar referencia compartida
    );
  }

  display(): void {
    console.log(`%cDocumento: "${this.title}"`, COLORS.cyan);
    console.log(`  Autor   : ${this.author}`);
    console.log(`  Tags    : ${this.tags.join(', ')}`);
    console.log(`  Ciudad  : ${this.address.city}`);
  }
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
function main() {
  console.log('%c=== Patrón Prototype: Documentos ===\n', COLORS.green);

  const original = new Document(
    'Informe Anual 2025',
    'Ana Gómez',
    'Contenido del informe...',
    new Address('Av. Reforma 100', 'Ciudad de México', 'México'),
    ['finanzas', 'anual'],
  );

  // Clonar y personalizar sin afectar el original
  const copy1 = original.clone();
  copy1.title = 'Informe Anual 2025 - Versión Borrador';
  copy1.tags.push('borrador');        // no afecta al original
  copy1.address.city = 'Guadalajara'; // tampoco afecta al original

  const copy2 = original.clone();
  copy2.title = 'Informe Anual 2025 - Resumen Ejecutivo';
  copy2.author = 'Luis Martínez';

  console.log('%c-- Original --', COLORS.gray);
  original.display();

  console.log('%c\n-- Copia 1 (borrador, Guadalajara) --', COLORS.gray);
  copy1.display();

  console.log('%c\n-- Copia 2 (resumen ejecutivo) --', COLORS.gray);
  copy2.display();
}

main();
