/**
 * ! Abstract Factory:
 * Es un patrón de diseño que permite crear familias de objetos relacionados
 * sin especificar sus clases concretas.
 *
 * En lugar de crear objetos individuales directamente,
 * creamos fábricas que producen un conjunto de objetos relacionados.
 *
 * * Es útil cuando necesitas crear objetos que son parte de una familia
 * * y quieres asegurarte de que estos objetos se complementen entre sí.
 *
 * https://refactoring.guru/es/design-patterns/abstract-factory
 */

/**
 *  El propósito del Abstract Factory es crear familias de objetos relacionados
 *  (en este caso, hamburguesas y bebidas) sin especificar las clases concretas
 *  de cada uno de esos objetos en el código principal.
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Productos: interfaces comunes ───────────────────────────────────────────
// Cada familia tendrá su propia implementación de estas interfaces.
interface Burger {
  prepare(): void;
}

interface Drink {
  pour(): void;
}

// ─── Familia A: Menú Clásico ─────────────────────────────────────────────────
class ClassicBurger implements Burger {
  prepare(): void {
    console.log('%c🍔 Preparando hamburguesa clásica con queso y cebolla', COLORS.orange);
  }
}

class Soda implements Drink {
  pour(): void {
    console.log('%c🥤 Sirviendo refresco de cola', COLORS.blue);
  }
}

// ─── Familia B: Menú Vegano ──────────────────────────────────────────────────
class VeganBurger implements Burger {
  prepare(): void {
    console.log('%c🌱 Preparando hamburguesa vegana de lentejas', COLORS.green);
  }
}

class FreshJuice implements Drink {
  pour(): void {
    console.log('%c🥤 Sirviendo jugo natural de naranja', COLORS.green);
  }
}

// ─── Familia C: Menú Gourmet ─────────────────────────────────────────────────
class GourmetBurger implements Burger {
  prepare(): void {
    console.log('%c🥩 Preparando hamburguesa gourmet de res angus', COLORS.brown);
  }
}

class CraftBeer implements Drink {
  pour(): void {
    console.log('%c🍺 Sirviendo cerveza artesanal IPA', COLORS.yellow);
  }
}

// ─── Abstract Factory ────────────────────────────────────────────────────────
// Define el contrato para crear cada tipo de producto dentro de una familia.
interface RestaurantFactory {
  createBurger(): Burger;
  createDrink(): Drink;
}

// ─── Fábricas Concretas ──────────────────────────────────────────────────────
// Cada fábrica produce una familia completa y compatible de productos.
class ClassicMenuFactory implements RestaurantFactory {
  createBurger(): Burger {
    return new ClassicBurger();
  }
  createDrink(): Drink {
    return new Soda();
  }
}

class VeganMenuFactory implements RestaurantFactory {
  createBurger(): Burger {
    return new VeganBurger();
  }
  createDrink(): Drink {
    return new FreshJuice();
  }
}

class GourmetMenuFactory implements RestaurantFactory {
  createBurger(): Burger {
    return new GourmetBurger();
  }
  createDrink(): Drink {
    return new CraftBeer();
  }
}

// ─── Cliente ──────────────────────────────────────────────────────────────────
// El cliente no conoce las clases concretas; solo trabaja con la fábrica.
function serveMenu(factory: RestaurantFactory): void {
  const burger = factory.createBurger();
  const drink  = factory.createDrink();
  burger.prepare();
  drink.pour();
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
function main() {
  console.log('%c=== Abstract Factory: Restaurante ===\n', COLORS.cyan);

  console.log('%c-- Menú Clásico --', COLORS.gray);
  serveMenu(new ClassicMenuFactory());

  console.log('%c\n-- Menú Vegano --', COLORS.gray);
  serveMenu(new VeganMenuFactory());

  console.log('%c\n-- Menú Gourmet --', COLORS.gray);
  serveMenu(new GourmetMenuFactory());
}

main();
