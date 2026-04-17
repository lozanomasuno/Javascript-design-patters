/**
 * ! Patrón Bridge:
 * Es un patrón de diseño estructural que divide una clase grande o un grupo
 * de clases relacionadas en dos jerarquías separadas: abstracción e implementación,
 * las cuales pueden desarrollarse de forma independiente.
 *
 * * Es útil cuando queremos evitar una explosión de subclases al combinar
 * * múltiples dimensiones de variación.
 *
 * https://refactoring.guru/es/design-patterns/bridge
 */

/**
 * ! Tarea: Sistema de notificaciones
 *
 * Tenemos dos dimensiones que varían de forma independiente:
 *   - Tipo de notificación: Email, Push, SMS
 *   - Prioridad del mensaje: Normal, Urgente
 *
 * Sin Bridge tendríamos: EmailNormal, EmailUrgente, PushNormal, PushUrgente...
 *
 * 1. Implementa los canales concretos: EmailSender, PushSender, SmsSender.
 * 2. Implementa las abstracciones refinadas: NormalNotification, UrgentNotification.
 * 3. Prueba todas las combinaciones en main().
 *
 * Salida esperada (ejemplo):
 *  [Email] Mensaje: Reunión a las 3pm
 *  [Email] 🚨 URGENTE 🚨 Mensaje: Servidor caído
 *  [Push]  Mensaje: Nueva actualización disponible
 *  [SMS]   🚨 URGENTE 🚨 Mensaje: Código de verificación: 4821
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Implementación: canal de envío ──────────────────────────────────────────
interface MessageSender {
  send(message: string): void;
}

// ─── Implementaciones Concretas ───────────────────────────────────────────────
class EmailSender implements MessageSender {
  send(message: string): void {
    console.log(`%c[Email] ${message}`, COLORS.blue);
  }
}

class PushSender implements MessageSender {
  send(message: string): void {
    console.log(`%c[Push]  ${message}`, COLORS.green);
  }
}

class SmsSender implements MessageSender {
  send(message: string): void {
    console.log(`%c[SMS]   ${message}`, COLORS.orange);
  }
}

// ─── Abstracción ──────────────────────────────────────────────────────────────
abstract class Notification {
  constructor(protected readonly sender: MessageSender) {}
  abstract notify(message: string): void;
}

// ─── Abstracciones Refinadas ─────────────────────────────────────────────────
class NormalNotification extends Notification {
  notify(message: string): void {
    this.sender.send(`Mensaje: ${message}`);
  }
}

class UrgentNotification extends Notification {
  notify(message: string): void {
    this.sender.send(`🚨 URGENTE 🚨 Mensaje: ${message}`);
  }
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
function main() {
  console.log('%c=== Bridge: Sistema de Notificaciones ===\n', COLORS.cyan);

  const email = new EmailSender();
  const push  = new PushSender();
  const sms   = new SmsSender();

  const notifications: Array<[Notification, string]> = [
    [new NormalNotification(email), 'Reunión a las 3pm'],
    [new UrgentNotification(email), 'Servidor caído'],
    [new NormalNotification(push),  'Nueva actualización disponible'],
    [new UrgentNotification(push),  'Alerta de seguridad detectada'],
    [new NormalNotification(sms),   'Tu pedido ha sido enviado'],
    [new UrgentNotification(sms),   'Código de verificación: 4821'],
  ];

  for (const [notification, message] of notifications) {
    notification.notify(message);
  }
}

main();
