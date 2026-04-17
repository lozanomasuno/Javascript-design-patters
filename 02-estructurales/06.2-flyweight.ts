/**
 * ! Patrón Flyweight:
 * Es un patrón de diseño estructural que permite mantener más objetos en la
 * memoria RAM compartiendo partes comunes del estado entre múltiples objetos.
 *
 * Estado intrínseco → compartido e inmutable (vive en el Flyweight).
 * Estado extrínseco → único por objeto (lo pasa el cliente al llamar).
 *
 * https://refactoring.guru/es/design-patterns/flyweight
 */

/**
 * ! Tarea: Renderizador de bosque
 *
 * Un videojuego necesita renderizar miles de árboles en pantalla.
 * Cada árbol tiene:
 *   - Datos COMPARTIDOS (intrínseco): especie, color, textura del sprite.
 *   - Datos ÚNICOS (extrínseco): posición (x, y) y tamaño en pantalla.
 *
 * Sin Flyweight: 10 000 árboles × todos los datos = RAM agotada.
 * Con Flyweight: 10 000 contextos ligeros + N tipos compartidos.
 *
 * 1. Implementa TreeType como Flyweight (datos compartidos).
 * 2. Implementa TreeFactory para cachear y reutilizar TreeTypes.
 * 3. Implementa Tree como contexto con solo posición y tamaño.
 * 4. Implementa Forest que gestiona los árboles y los renderiza.
 * 5. Planta 10 000 árboles con solo 4 tipos distintos y muestra
 *    cuántos objetos pesados se crearon realmente.
 *
 * Salida esperada (resumen):
 *  Árboles plantados : 10000
 *  Tipos en caché    : 4
 *  (mostrando primeros 5 árboles)
 *  [Pino]  color=dark-green textura=pine.png  pos=(12,45)  tamaño=3
 *  ...
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Flyweight: datos compartidos ─────────────────────────────────────────────
class TreeType {
  constructor(
    readonly species: string,  // "Pino", "Roble", "Palma", "Cerezo"
    readonly color: string,
    readonly texture: string,  // ruta del sprite (dato "pesado")
  ) {}

  render(x: number, y: number, size: number): void {
    console.log(
      `%c  [${this.species.padEnd(6)}] color=${this.color.padEnd(11)} textura=${this.texture.padEnd(12)} pos=(${x},${y})  tamaño=${size}`,
      COLORS.green,
    );
  }
}

// ─── Flyweight Factory ────────────────────────────────────────────────────────
class TreeFactory {
  private readonly cache = new Map<string, TreeType>();

  getTreeType(species: string, color: string, texture: string): TreeType {
    const key = `${species}-${color}`;
    if (!this.cache.has(key)) {
      this.cache.set(key, new TreeType(species, color, texture));
    }
    return this.cache.get(key)!;
  }

  get count(): number { return this.cache.size; }
}

// ─── Contexto: datos únicos por árbol ────────────────────────────────────────
class Tree {
  constructor(
    private readonly type: TreeType,
    private readonly x: number,
    private readonly y: number,
    private readonly size: number,
  ) {}

  render(): void {
    this.type.render(this.x, this.y, this.size);
  }
}

// ─── Bosque ───────────────────────────────────────────────────────────────────
class Forest {
  private readonly trees: Tree[] = [];
  private readonly factory = new TreeFactory();

  plantTree(
    x: number,
    y: number,
    size: number,
    species: string,
    color: string,
    texture: string,
  ): void {
    const type = this.factory.getTreeType(species, color, texture);
    this.trees.push(new Tree(type, x, y, size));
  }

  render(preview = 5): void {
    console.log(`%c\nÁrboles plantados : ${this.trees.length}`, COLORS.orange);
    console.log(`%cTipos en caché    : ${this.factory.count}  (objetos pesados reutilizados)`, COLORS.orange);
    console.log(`%c\n-- Primeros ${preview} árboles --`, COLORS.gray);
    this.trees.slice(0, preview).forEach((t) => t.render());
  }
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
function main() {
  console.log('%c=== Flyweight: Renderizador de Bosque ===\n', COLORS.cyan);

  const forest = new Forest();

  const treeTypes: [string, string, string][] = [
    ['Pino',   'dark-green', 'pine.png'],
    ['Roble',  'brown',      'oak.png'],
    ['Palma',  'light-green','palm.png'],
    ['Cerezo', 'pink',       'cherry.png'],
  ];

  // Plantar 10 000 árboles con posiciones aleatorias y solo 4 tipos.
  for (let i = 0; i < 10_000; i++) {
    const [species, color, texture] = treeTypes[i % treeTypes.length];
    const x    = Math.floor(Math.random() * 1000);
    const y    = Math.floor(Math.random() * 1000);
    const size = Math.floor(Math.random() * 5) + 1;
    forest.plantTree(x, y, size, species, color, texture);
  }

  forest.render(5);
}

main();
