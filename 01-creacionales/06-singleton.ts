/**
 * ! Singleton:
 * Es un patrón de diseño creacional que garantiza que una clase
 * tenga una única instancia y proporciona un punto de acceso global a ella.
 *
 * * Es útil cuando necesitas controlar el acceso a una única instancia
 * * de una clase, como por ejemplo, en un objeto de base de datos o en un
 * * objeto de configuración.
 *
 * https://refactoring.guru/es/design-patterns/singleton
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Singleton clásico: Logger ─────────────────────────────────────────────────────
// Un logger centralizado: todos los módulos de la app comparten la misma instancia.
class Logger {
  // 1. Instancia única almacenada como campo estático privado.
  private static instance: Logger;
  private readonly logs: string[] = [];

  // 2. Constructor privado: nadie puede hacer `new Logger()` desde fuera.
  private constructor() {
    console.log('%c[Logger] Instancia creada.', COLORS.gray);
  }

  // 3. Punto de acceso global: crea la instancia solo la primera vez.
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(message: string): void {
    const entry = `[${new Date().toISOString()}] ${message}`;
    this.logs.push(entry);
    console.log(`%c${entry}`, COLORS.green);
  }

  warn(message: string): void {
    const entry = `[WARN] ${message}`;
    this.logs.push(entry);
    console.log(`%c${entry}`, COLORS.yellow);
  }

  error(message: string): void {
    const entry = `[ERROR] ${message}`;
    this.logs.push(entry);
    console.log(`%c${entry}`, COLORS.red);
  }

  printHistory(): void {
    console.log('%c\n--- Historial de logs ---', COLORS.cyan);
    this.logs.forEach((l) => console.log(l));
  }
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
function main() {
  console.log('%c=== Singleton: Logger ===\n', COLORS.cyan);

  // Distintos módulos obtienen la misma instancia.
  const loggerA = Logger.getInstance();
  const loggerB = Logger.getInstance();

  loggerA.log('Aplicación iniciada');
  loggerB.warn('Memoria al 80 %');
  loggerA.error('Fallo en el servicio de pagos');

  // Ambas referencias apuntan al mismo objeto.
  console.log('%c\n¿Son la misma instancia?', COLORS.orange, loggerA === loggerB);

  // El historial acumula los mensajes de todos los llamadores.
  loggerB.printHistory();
}

main();
