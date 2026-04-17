/**
 * ! Patrón Chain of Responsibility:
 * Es un patrón de diseño de comportamiento que permite pasar solicitudes
 * a lo largo de una cadena de manejadores.
 *
 * Al recibir una solicitud, cada manejador decide si la procesa o si la
 * pasa al siguiente manejador de la cadena.
 *
 * * Es útil cuando más de un objeto puede manejar una solicitud y el
 * * manejador no se conoce a priori, o cuando quieres enviar una solicitud
 * * a varios objetos sin especificar el receptor explícitamente.
 *
 * https://refactoring.guru/es/design-patterns/chain-of-responsibility
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Interfaz del manejador ───────────────────────────────────────────────────
interface SupportHandler {
  setNext(handler: SupportHandler): SupportHandler;
  handle(request: SupportRequest): void;
}

interface SupportRequest {
  level: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

// ─── Manejador Base ───────────────────────────────────────────────────────────
// Implementa el encadenamiento; las subclases solo sobreescriben handle().
abstract class BaseHandler implements SupportHandler {
  private next: SupportHandler | null = null;

  setNext(handler: SupportHandler): SupportHandler {
    this.next = handler;
    return handler; // permite encadenar: a.setNext(b).setNext(c)
  }

  protected passToNext(request: SupportRequest): void {
    if (this.next) {
      this.next.handle(request);
    } else {
      console.log(`%c  [Sin manejador] Solicitud no resuelta: "${request.description}"`, COLORS.red);
    }
  }

  abstract handle(request: SupportRequest): void;
}

// ─── Manejadores Concretos ────────────────────────────────────────────────────
class Level1Support extends BaseHandler {
  handle(request: SupportRequest): void {
    if (request.level === 'low') {
      console.log(`%c  [Nivel 1 - FAQ Bot] Resuelto: "${request.description}"`, COLORS.green);
    } else {
      console.log(`%c  [Nivel 1] No puedo manejar "${request.level}", escalando...`, COLORS.gray);
      this.passToNext(request);
    }
  }
}

class Level2Support extends BaseHandler {
  handle(request: SupportRequest): void {
    if (request.level === 'medium') {
      console.log(`%c  [Nivel 2 - Técnico] Resuelto: "${request.description}"`, COLORS.blue);
    } else {
      console.log(`%c  [Nivel 2] No puedo manejar "${request.level}", escalando...`, COLORS.gray);
      this.passToNext(request);
    }
  }
}

class Level3Support extends BaseHandler {
  handle(request: SupportRequest): void {
    if (request.level === 'high') {
      console.log(`%c  [Nivel 3 - Ingeniero Senior] Resuelto: "${request.description}"`, COLORS.orange);
    } else {
      console.log(`%c  [Nivel 3] No puedo manejar "${request.level}", escalando...`, COLORS.gray);
      this.passToNext(request);
    }
  }
}

class CriticalSupport extends BaseHandler {
  handle(request: SupportRequest): void {
    if (request.level === 'critical') {
      console.log(`%c  [CRÍTICO - CTO] Atendiendo personalmente: "${request.description}"`, COLORS.red);
    } else {
      this.passToNext(request);
    }
  }
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
function main() {
  console.log('%c=== Chain of Responsibility: Soporte Técnico ===\n', COLORS.cyan);

  // Construir la cadena
  const level1 = new Level1Support();
  const level2 = new Level2Support();
  const level3 = new Level3Support();
  const critical = new CriticalSupport();

  level1.setNext(level2).setNext(level3).setNext(critical);

  // Distintas solicitudes recorren la cadena hasta encontrar su manejador
  const requests: SupportRequest[] = [
    { level: 'low',      description: '¿Cómo cambio mi contraseña?' },
    { level: 'medium',   description: 'El módulo de reportes no carga' },
    { level: 'high',     description: 'Pérdida de datos en producción' },
    { level: 'critical', description: 'Servidores principales caídos' },
  ];

  for (const req of requests) {
    console.log(`%c\nSolicitud [${req.level.toUpperCase()}]:`, COLORS.yellow);
    level1.handle(req);
  }
}

main();
