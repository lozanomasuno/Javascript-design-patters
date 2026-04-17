/**
 * ! Patrón Facade:
 * Es un patrón de diseño estructural que proporciona una interfaz simplificada
 * a un conjunto de interfaces en un subsistema complejo.
 *
 * * Es útil cuando quieres simplificar la interacción con un sistema complejo
 * * o reducir las dependencias entre el cliente y los subsistemas.
 *
 * https://refactoring.guru/es/design-patterns/facade
 */

/**
 * ! Tarea: Facade para un sistema de pedidos de e-commerce
 *
 * El proceso de realizar un pedido involucra varios subsistemas:
 *   - InventoryService  → verifica que el producto tenga stock.
 *   - PaymentService    → procesa el cobro.
 *   - ShippingService   → genera la guía de envío.
 *   - NotificationService → notifica al cliente por email.
 *
 * Implementa OrderFacade con el método placeOrder(productId, quantity, userId)
 * que coordine todos los subsistemas en orden y simplifique el proceso al cliente.
 *
 * Salida esperada:
 *  [Inventory]    Verificando stock del producto P-001 (x2)... ✔
 *  [Payment]      Procesando pago de $240 para usuario U-42... ✔
 *  [Shipping]     Generando guía de envío para P-001 x2...    ✔  Guía: SHIP-8821
 *  [Notification] Enviando email a usuario U-42...            ✔
 *  ✅ Pedido completado. Guía de envío: SHIP-8821
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Subsistemas ──────────────────────────────────────────────────────────────

class InventoryService {
  private readonly stock: Record<string, number> = {
    'P-001': 10,
    'P-002': 0,
    'P-003': 5,
  };

  check(productId: string, quantity: number): boolean {
    const available = this.stock[productId] ?? 0;
    const ok = available >= quantity;
    console.log(
      `%c  [Inventory]    Verificando stock del producto ${productId} (x${quantity})... ${ok ? '✔' : '✘ Sin stock'}`,
      ok ? COLORS.green : COLORS.red,
    );
    return ok;
  }
}

class PaymentService {
  private readonly prices: Record<string, number> = {
    'P-001': 120,
    'P-002': 50,
    'P-003': 200,
  };

  process(productId: string, quantity: number, userId: string): boolean {
    const total = (this.prices[productId] ?? 0) * quantity;
    console.log(
      `%c  [Payment]      Procesando pago de $${total} para usuario ${userId}... ✔`,
      COLORS.blue,
    );
    return true;
  }

  getTotal(productId: string, quantity: number): number {
    return (this.prices[productId] ?? 0) * quantity;
  }
}

class ShippingService {
  generate(productId: string, quantity: number): string {
    const guide = `SHIP-${Math.floor(Math.random() * 9000) + 1000}`;
    console.log(
      `%c  [Shipping]     Generando guía de envío para ${productId} x${quantity}... ✔  Guía: ${guide}`,
      COLORS.cyan,
    );
    return guide;
  }
}

class NotificationService {
  send(userId: string, message: string): void {
    console.log(
      `%c  [Notification] Enviando email a usuario ${userId}... ✔`,
      COLORS.purple,
    );
    console.log(`%c             → ${message}`, COLORS.gray);
  }
}

// ─── Facade ───────────────────────────────────────────────────────────────────
class OrderFacade {
  private readonly inventory    = new InventoryService();
  private readonly payment      = new PaymentService();
  private readonly shipping     = new ShippingService();
  private readonly notification = new NotificationService();

  placeOrder(productId: string, quantity: number, userId: string): void {
    console.log(`%c\n[OrderFacade] Procesando pedido...`, COLORS.orange);

    // 1. Verificar stock
    if (!this.inventory.check(productId, quantity)) {
      console.log('%c  ❌ Pedido cancelado: producto sin stock.', COLORS.red);
      return;
    }

    // 2. Cobrar
    const total = this.payment.getTotal(productId, quantity);
    if (!this.payment.process(productId, quantity, userId)) {
      console.log('%c  ❌ Pedido cancelado: fallo en el pago.', COLORS.red);
      return;
    }

    // 3. Generar envío
    const guide = this.shipping.generate(productId, quantity);

    // 4. Notificar
    this.notification.send(
      userId,
      `Tu pedido de ${quantity}x ${productId} por $${total} está en camino. Guía: ${guide}`,
    );

    console.log(`%c\n  ✅ Pedido completado. Guía de envío: ${guide}\n`, COLORS.green);
  }
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
function main() {
  console.log('%c=== Facade: Sistema de Pedidos ===', COLORS.cyan);

  const orders = new OrderFacade();

  orders.placeOrder('P-001', 2, 'U-42');   // exitoso
  orders.placeOrder('P-002', 1, 'U-17');   // sin stock
  orders.placeOrder('P-003', 3, 'U-88');   // exitoso
}

main();
