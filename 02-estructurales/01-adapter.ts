/**
 * ! Patrón Adapter:
 * Es un patrón de diseño estructural que permite que objetos con interfaces
 * incompatibles trabajen juntos.
 *
 * El Adapter actúa como un puente entre dos interfaces: envuelve al objeto
 * incompatible y expone la interfaz que el cliente espera.
 *
 * * Es útil cuando queremos reutilizar una clase existente pero su interfaz
 * * no es compatible con el resto del código.
 *
 * https://refactoring.guru/es/design-patterns/adapter
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Interfaz que el cliente conoce y espera ─────────────────────────────────
interface Logger {
  log(level: 'info' | 'warn' | 'error', message: string): void;
}

// ─── Librería externa (Adaptee) ───────────────────────────────────────────────
// Clase de terceros con una interfaz completamente diferente.
// No podemos modificarla.
class ThirdPartyLogger {
  writeInfo(msg: string): void {
    console.log(`%c[3RD-INFO]  ${msg}`, COLORS.green);
  }

  writeWarning(msg: string): void {
    console.log(`%c[3RD-WARN]  ${msg}`, COLORS.yellow);
  }

  writeCritical(msg: string): void {
    console.log(`%c[3RD-CRIT]  ${msg}`, COLORS.red);
  }
}

// ─── Adapter ─────────────────────────────────────────────────────────────────
// Implementa la interfaz que el cliente espera (Logger) y por dentro
// delega las llamadas a la librería externa (ThirdPartyLogger).
class ThirdPartyLoggerAdapter implements Logger {
  private readonly adaptee: ThirdPartyLogger;

  constructor(adaptee: ThirdPartyLogger) {
    this.adaptee = adaptee;
  }

  log(level: 'info' | 'warn' | 'error', message: string): void {
    if (level === 'info')  return this.adaptee.writeInfo(message);
    if (level === 'warn')  return this.adaptee.writeWarning(message);
    if (level === 'error') return this.adaptee.writeCritical(message);
  }
}

// ─── Cliente ─────────────────────────────────────────────────────────────────
// Solo conoce la interfaz Logger; no sabe nada de ThirdPartyLogger.
function runApplication(logger: Logger): void {
  logger.log('info',  'Aplicación iniciada.');
  logger.log('warn',  'Memoria al 85 %.');
  logger.log('error', 'Fallo al conectar con la base de datos.');
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
function main() {
  console.log('%c=== Patrón Adapter: Logger ===\n', COLORS.cyan);

  const thirdParty = new ThirdPartyLogger();
  const adapter    = new ThirdPartyLoggerAdapter(thirdParty);

  // El cliente consume el adapter como si fuera cualquier Logger propio.
  runApplication(adapter);
}

main();
