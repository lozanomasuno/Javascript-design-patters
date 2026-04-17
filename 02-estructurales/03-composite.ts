/**
 * ! Patrón Composite:
 * Es un patrón de diseño estructural que permite componer objetos en estructuras
 * de árbol para representar jerarquías parte-todo.
 *
 * Composite permite a los clientes tratar objetos individuales (hojas)
 * y composiciones de objetos (ramas) de manera uniforme.
 *
 * * Es útil cuando necesitas representar estructuras jerárquicas como
 * * árboles de archivos, menús anidados u organigramas.
 *
 * https://refactoring.guru/es/design-patterns/composite
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Componente: interfaz común ───────────────────────────────────────────────
// Tanto las hojas como los nodos compuestos implementan esta interfaz.
interface FileSystemItem {
  getName(): string;
  getSize(): number;
  print(indent?: string): void;
}

// ─── Hoja (Leaf) ─────────────────────────────────────────────────────────────
// Representa un archivo; no tiene hijos.
class File implements FileSystemItem {
  constructor(
    private readonly name: string,
    private readonly size: number, // en KB
  ) {}

  getName(): string { return this.name; }
  getSize(): number { return this.size; }

  print(indent = ''): void {
    console.log(`%c${indent}📄 ${this.name} (${this.size} KB)`, COLORS.green);
  }
}

// ─── Compuesto (Composite) ────────────────────────────────────────────────────
// Representa una carpeta; puede contener hojas y otras carpetas.
class Folder implements FileSystemItem {
  private readonly children: FileSystemItem[] = [];

  constructor(private readonly name: string) {}

  getName(): string { return this.name; }

  add(item: FileSystemItem): this {
    this.children.push(item);
    return this;
  }

  remove(item: FileSystemItem): void {
    const index = this.children.indexOf(item);
    if (index !== -1) this.children.splice(index, 1);
  }

  // La carpeta suma recursivamente el tamaño de todos sus hijos.
  getSize(): number {
    return this.children.reduce((total, child) => total + child.getSize(), 0);
  }

  print(indent = ''): void {
    console.log(`%c${indent}📁 ${this.name}/ (${this.getSize()} KB)`, COLORS.cyan);
    for (const child of this.children) {
      child.print(indent + '  ');
    }
  }
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
function main() {
  console.log('%c=== Patrón Composite: Sistema de Archivos ===\n', COLORS.orange);

  // Hojas
  const index   = new File('index.ts',    12);
  const app     = new File('app.ts',      34);
  const readme  = new File('README.md',    5);
  const test    = new File('app.test.ts', 18);
  const logo    = new File('logo.png',   200);
  const styles  = new File('styles.css',  15);

  // Árbol compuesto
  const src = new Folder('src')
    .add(index)
    .add(app);

  const tests = new Folder('tests')
    .add(test);

  const assets = new Folder('assets')
    .add(logo)
    .add(styles);

  const root = new Folder('proyecto')
    .add(src)
    .add(tests)
    .add(assets)
    .add(readme);

  // El cliente llama a print() y getSize() sin distinguir hojas de carpetas.
  root.print();

  console.log(`\n%cTamaño total del proyecto: ${root.getSize()} KB`, COLORS.yellow);
}

main();
