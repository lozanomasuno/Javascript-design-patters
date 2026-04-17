/**
 * ! Patrón Decorator:
 * Es un patrón de diseño estructural que permite añadir funcionalidades
 * a un objeto de forma dinámica, envolviéndolo en objetos "decoradores".
 *
 * A diferencia de la herencia, el Decorator añade comportamiento en tiempo
 * de ejecución y permite combinar múltiples decoradores entre sí.
 *
 * * Es útil cuando necesitas agregar responsabilidades a objetos de manera
 * * flexible sin modificar su clase original ni crear una explosión de subclases.
 *
 * https://refactoring.guru/es/design-patterns/decorator
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Componente: interfaz común ───────────────────────────────────────────────
interface Coffee {
  getDescription(): string;
  getCost(): number;
}

// ─── Componente Concreto (base) ───────────────────────────────────────────────
class SimpleCoffee implements Coffee {
  getDescription(): string { return 'Café simple'; }
  getCost(): number        { return 10; }
}

// ─── Decorador Base ───────────────────────────────────────────────────────────
// Implementa Coffee y envuelve otro Coffee. Los decoradores concretos
// heredan de aquí para no repetir la referencia al componente envuelto.
abstract class CoffeeDecorator implements Coffee {
  constructor(protected readonly coffee: Coffee) {}

  getDescription(): string { return this.coffee.getDescription(); }
  getCost(): number        { return this.coffee.getCost(); }
}

// ─── Decoradores Concretos ────────────────────────────────────────────────────
class MilkDecorator extends CoffeeDecorator {
  getDescription(): string {
    return `${this.coffee.getDescription()}, leche`;
  }
  getCost(): number { return this.coffee.getCost() + 2; }
}

class SugarDecorator extends CoffeeDecorator {
  getDescription(): string {
    return `${this.coffee.getDescription()}, azúcar`;
  }
  getCost(): number { return this.coffee.getCost() + 1; }
}

class VanillaDecorator extends CoffeeDecorator {
  getDescription(): string {
    return `${this.coffee.getDescription()}, vainilla`;
  }
  getCost(): number { return this.coffee.getCost() + 3; }
}

class WhipDecorator extends CoffeeDecorator {
  getDescription(): string {
    return `${this.coffee.getDescription()}, crema batida`;
  }
  getCost(): number { return this.coffee.getCost() + 4; }
}

// ─── Función de ayuda ─────────────────────────────────────────────────────────
function printCoffee(coffee: Coffee): void {
  console.log(`%c  ${coffee.getDescription()}`, COLORS.brown);
  console.log(`%c  Precio: $${coffee.getCost()}\n`, COLORS.yellow);
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
function main() {
  console.log('%c=== Patrón Decorator: Cafetería ===\n', COLORS.cyan);

  // Café base
  console.log('%c-- Café simple --', COLORS.gray);
  const simple: Coffee = new SimpleCoffee();
  printCoffee(simple);

  // Se añaden decoradores en cadena; el orden importa solo para la descripción.
  console.log('%c-- Café con leche y azúcar --', COLORS.gray);
  const withMilkAndSugar: Coffee = new SugarDecorator(new MilkDecorator(new SimpleCoffee()));
  printCoffee(withMilkAndSugar);

  console.log('%c-- Latte de vainilla con crema --', COLORS.gray);
  const vanillaLatte: Coffee = new WhipDecorator(
    new VanillaDecorator(
      new MilkDecorator(
        new MilkDecorator(    // doble leche
          new SimpleCoffee(),
        ),
      ),
    ),
  );
  printCoffee(vanillaLatte);
}

main();
