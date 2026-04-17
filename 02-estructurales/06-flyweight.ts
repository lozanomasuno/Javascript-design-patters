/**
 * ! Patrón Flyweight:
 * Es un patrón de diseño estructural que permite mantener más objetos en la
 * memoria RAM compartiendo partes comunes del estado entre múltiples objetos,
 * en lugar de guardar todos los datos en cada objeto.
 *
 * El estado se divide en:
 *  - Estado intrínseco: datos compartidos e inmutables (viven en el Flyweight).
 *  - Estado extrínseco: datos únicos por objeto (los pasa el cliente al llamar).
 *
 * * Es útil cuando un programa debe soportar una enorme cantidad de objetos
 * * que apenas caben en la RAM disponible.
 *
 * https://refactoring.guru/es/design-patterns/flyweight
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Estado intrínseco (compartido) ──────────────────────────────────────────
// Los datos que NO cambian entre partículas del mismo tipo se guardan aquí.
// Esta clase se comparte entre miles de objetos.
class ParticleType {
  constructor(
    readonly name: string,   // "bala", "misil", "metralla"
    readonly color: string,  // color del sprite
    readonly sprite: string, // ruta del recurso gráfico
  ) {}

  // Recibe el estado extrínseco (posición, velocidad) para renderizar.
  render(x: number, y: number, dx: number, dy: number): void {
    console.log(
      `%c  [${this.name}] sprite="${this.sprite}" color=${this.color} pos=(${x},${y}) vel=(${dx},${dy})`,
      COLORS.green,
    );
  }
}

// ─── Flyweight Factory ────────────────────────────────────────────────────────
// Crea y cachea los flyweights; garantiza que no haya duplicados.
class ParticleFactory {
  private readonly cache = new Map<string, ParticleType>();

  getType(name: string, color: string, sprite: string): ParticleType {
    const key = `${name}-${color}`;
    if (!this.cache.has(key)) {
      this.cache.set(key, new ParticleType(name, color, sprite));
      console.log(`%c  [Factory] Creando nuevo ParticleType: "${key}"`, COLORS.yellow);
    }
    return this.cache.get(key)!;
  }

  get count(): number { return this.cache.size; }
}

// ─── Contexto (extrinsic state por partícula) ─────────────────────────────────
// Cada partícula en pantalla guarda solo su estado único.
// La parte compartida vive en ParticleType.
class Particle {
  constructor(
    private readonly type: ParticleType, // referencia al flyweight compartido
    private x: number,
    private y: number,
    private dx: number,
    private dy: number,
  ) {}

  move(): void {
    this.x += this.dx;
    this.y += this.dy;
  }

  render(): void {
    this.type.render(this.x, this.y, this.dx, this.dy);
  }
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
function main() {
  console.log('%c=== Patrón Flyweight: Motor de Partículas ===\n', COLORS.cyan);

  const factory = new ParticleFactory();

  // Simulamos 10 partículas con solo 3 tipos distintos.
  // Sin Flyweight: 10 objetos × todos los datos del sprite.
  // Con Flyweight: 10 objetos ligeros + 3 objetos compartidos con los datos pesados.
  const rawData: [string, string, string, number, number, number, number][] = [
    ['bala',     'gray',   'sprites/bullet.png',  10, 20,  2,  0],
    ['bala',     'gray',   'sprites/bullet.png',  15, 30,  2,  1],
    ['bala',     'gray',   'sprites/bullet.png',   5, 10,  3, -1],
    ['misil',    'red',    'sprites/missile.png', 50, 60,  1,  2],
    ['misil',    'red',    'sprites/missile.png', 70, 40,  1, -2],
    ['metralla', 'orange', 'sprites/shrapnel.png', 30, 50, -1,  3],
    ['metralla', 'orange', 'sprites/shrapnel.png', 20, 80,  2,  1],
    ['bala',     'gray',   'sprites/bullet.png',  40, 10,  2,  0],
    ['misil',    'red',    'sprites/missile.png',  90, 20,  0,  3],
    ['metralla', 'orange', 'sprites/shrapnel.png', 60, 70, -2, -1],
  ];

  const particles = rawData.map(
    ([name, color, sprite, x, y, dx, dy]) =>
      new Particle(factory.getType(name, color, sprite), x, y, dx, dy),
  );

  console.log(`\n%cTotal partículas en pantalla : ${particles.length}`, COLORS.orange);
  console.log(`%cTipos únicos en memoria       : ${factory.count}  (¡sin repetir datos pesados!)`, COLORS.orange);

  console.log('%c\n-- Renderizando partículas --', COLORS.gray);
  for (const p of particles) p.render();
}

main();
