/**
 * ! Patrón Bridge:
 * Es un patrón de diseño estructural que divide una clase grande o un grupo
 * de clases relacionadas en dos jerarquías separadas: abstracción e implementación,
 * las cuales pueden desarrollarse de forma independiente.
 *
 * * Es útil cuando queremos evitar una explosión de subclases al combinar
 * * múltiples dimensiones de variación (p. ej. tipo de forma + color de renderizado).
 *
 * https://refactoring.guru/es/design-patterns/bridge
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Implementación: interfaz del "lado técnico" ──────────────────────────────
// Define cómo se renderiza algo. Puede variar de forma independiente.
interface Renderer {
  renderCircle(radius: number): void;
  renderSquare(side: number): void;
}

// ─── Implementaciones Concretas ───────────────────────────────────────────────
class VectorRenderer implements Renderer {
  renderCircle(radius: number): void {
    console.log(`%c[Vector] Dibujando círculo con radio ${radius} (SVG/paths)`, COLORS.blue);
  }
  renderSquare(side: number): void {
    console.log(`%c[Vector] Dibujando cuadrado con lado ${side} (SVG/paths)`, COLORS.blue);
  }
}

class RasterRenderer implements Renderer {
  renderCircle(radius: number): void {
    console.log(`%c[Raster] Dibujando círculo con radio ${radius} (píxeles)`, COLORS.orange);
  }
  renderSquare(side: number): void {
    console.log(`%c[Raster] Dibujando cuadrado con lado ${side} (píxeles)`, COLORS.orange);
  }
}

// ─── Abstracción ──────────────────────────────────────────────────────────────
// Mantiene una referencia a la implementación y delega el trabajo a ella.
abstract class Shape {
  constructor(protected readonly renderer: Renderer) {}
  abstract draw(): void;
  abstract resize(factor: number): void;
}

// ─── Abstracciones Refinadas ─────────────────────────────────────────────────
class Circle extends Shape {
  constructor(renderer: Renderer, private radius: number) {
    super(renderer);
  }

  draw(): void {
    this.renderer.renderCircle(this.radius);
  }

  resize(factor: number): void {
    this.radius *= factor;
  }
}

class Square extends Shape {
  constructor(renderer: Renderer, private side: number) {
    super(renderer);
  }

  draw(): void {
    this.renderer.renderSquare(this.side);
  }

  resize(factor: number): void {
    this.side *= factor;
  }
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
// Podemos combinar cualquier forma con cualquier renderer sin crear subclases
// adicionales (sin Bridge necesitaríamos VectorCircle, RasterCircle,
// VectorSquare, RasterSquare...).
function main() {
  console.log('%c=== Patrón Bridge: Formas y Renderers ===\n', COLORS.cyan);

  const vector = new VectorRenderer();
  const raster = new RasterRenderer();

  const shapes: Shape[] = [
    new Circle(vector, 5),
    new Circle(raster, 5),
    new Square(vector, 10),
    new Square(raster, 10),
  ];

  for (const shape of shapes) {
    shape.draw();
  }

  console.log('%c\n-- Redimensionando círculo vectorial x2 --', COLORS.gray);
  const circle = new Circle(vector, 8);
  circle.draw();
  circle.resize(2);
  circle.draw();
}

main();
