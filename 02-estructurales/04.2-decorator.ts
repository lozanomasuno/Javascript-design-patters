/**
 * ! Patrón Decorator:
 * Es un patrón de diseño estructural que permite añadir funcionalidades
 * a un objeto de forma dinámica, envolviéndolo en objetos "decoradores".
 *
 * * Es útil cuando necesitas agregar responsabilidades a objetos de manera
 * * flexible sin modificar su clase original.
 *
 * https://refactoring.guru/es/design-patterns/decorator
 */

/**
 * ! Tarea: Decoradores de texto
 *
 * Tenemos un componente base TextComponent que devuelve un texto plano.
 * Debemos enriquecerlo con decoradores que transformen ese texto:
 *
 * 1. UpperCaseDecorator  → convierte el texto a MAYÚSCULAS.
 * 2. ExclamationDecorator → añade "!!!" al final del texto.
 * 3. BorderDecorator      → rodea el texto con "[ ]".
 * 4. TrimDecorator        → elimina espacios al inicio y al final.
 *
 * Los decoradores se pueden combinar en cualquier orden.
 *
 * Salida esperada:
 *  hola mundo
 *  HOLA MUNDO
 *  hola mundo!!!
 *  [hola mundo]
 *  [HOLA MUNDO!!!]
 *  [ hola mundo ] → [ hola mundo ]  (TrimDecorator elimina espacios)
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Componente ───────────────────────────────────────────────────────────────
interface TextComponent {
  getText(): string;
}

// ─── Componente Concreto ──────────────────────────────────────────────────────
class PlainText implements TextComponent {
  constructor(private readonly text: string) {}
  getText(): string { return this.text; }
}

// ─── Decorador Base ───────────────────────────────────────────────────────────
abstract class TextDecorator implements TextComponent {
  constructor(protected readonly component: TextComponent) {}
  getText(): string { return this.component.getText(); }
}

// ─── Decoradores Concretos ────────────────────────────────────────────────────
class UpperCaseDecorator extends TextDecorator {
  getText(): string {
    return this.component.getText().toUpperCase();
  }
}

class ExclamationDecorator extends TextDecorator {
  getText(): string {
    return `${this.component.getText()}!!!`;
  }
}

class BorderDecorator extends TextDecorator {
  getText(): string {
    return `[${this.component.getText()}]`;
  }
}

class TrimDecorator extends TextDecorator {
  getText(): string {
    return this.component.getText().trim();
  }
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
function print(label: string, component: TextComponent): void {
  console.log(`%c${label}:`, COLORS.gray);
  console.log(`  "${component.getText()}"\n`);
}

function main() {
  console.log('%c=== Decorator: Transformaciones de Texto ===\n', COLORS.cyan);

  const base = new PlainText('hola mundo');

  print('Texto base',                base);
  print('UpperCase',                 new UpperCaseDecorator(base));
  print('Exclamación',               new ExclamationDecorator(base));
  print('Borde',                     new BorderDecorator(base));
  print('Borde + UpperCase + !!!',
    new BorderDecorator(
      new UpperCaseDecorator(
        new ExclamationDecorator(base),
      ),
    ),
  );

  // TrimDecorator elimina los espacios extras del texto base
  const withSpaces = new PlainText('   hola mundo   ');
  print('Con espacios (sin Trim)',   withSpaces);
  print('Con espacios + Trim',       new TrimDecorator(withSpaces));
}

main();
