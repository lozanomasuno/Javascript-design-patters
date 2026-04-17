import { COLORS } from '../helpers/colors.ts';

// ============================================================
// STATE — Tarea
// ============================================================
// Sistema de gestión de pedidos en una tienda online.
//
// Un pedido (Order) pasa por los siguientes estados:
//   Pending → Processing → Shipped → Delivered
//                ↓
//            Cancelled  (solo desde Pending o Processing)
//
// Cada estado permite o rechaza acciones como:
//   pay(), process(), ship(), deliver(), cancel()
// ============================================================

// --- Interfaz State ---

interface OrderState {
  pay(order: Order): void;
  process(order: Order): void;
  ship(order: Order): void;
  deliver(order: Order): void;
  cancel(order: Order): void;
  getLabel(): string;
}

// --- Context ---

class Order {
  private state: OrderState;
  readonly id: string;
  readonly items: string[];

  constructor(id: string, items: string[]) {
    this.id = id;
    this.items = items;
    this.state = new PendingState();
    console.log(
      `${COLORS.cyan}[Pedido #${id}]${COLORS.reset} Creado con ${items.length} artículo(s): ${items.join(', ')}`
    );
  }

  setState(state: OrderState): void {
    console.log(
      `${COLORS.gray}  → Estado: ${COLORS.reset}` +
      `${COLORS.yellow}${state.getLabel()}${COLORS.reset}`
    );
    this.state = state;
  }

  getStatus(): string { return this.state.getLabel(); }

  pay(): void      { this.state.pay(this); }
  process(): void  { this.state.process(this); }
  ship(): void     { this.state.ship(this); }
  deliver(): void  { this.state.deliver(this); }
  cancel(): void   { this.state.cancel(this); }
}

// --- Estados concretos ---

class PendingState implements OrderState {
  getLabel(): string { return 'Pendiente de pago'; }

  pay(order: Order): void {
    console.log(`${COLORS.green}[Pago]${COLORS.reset} Pago recibido para pedido #${order.id}.`);
    order.setState(new ProcessingState());
  }

  process(order: Order): void {
    console.log(`${COLORS.red}[Error]${COLORS.reset} El pedido #${order.id} aún no ha sido pagado.`);
  }

  ship(order: Order): void {
    console.log(`${COLORS.red}[Error]${COLORS.reset} El pedido #${order.id} no puede enviarse sin pagar.`);
  }

  deliver(order: Order): void {
    console.log(`${COLORS.red}[Error]${COLORS.reset} El pedido #${order.id} no puede entregarse aún.`);
  }

  cancel(order: Order): void {
    console.log(`${COLORS.yellow}[Cancelación]${COLORS.reset} Pedido #${order.id} cancelado antes del pago.`);
    order.setState(new CancelledState());
  }
}

class ProcessingState implements OrderState {
  getLabel(): string { return 'En preparación'; }

  pay(order: Order): void {
    console.log(`${COLORS.red}[Error]${COLORS.reset} El pedido #${order.id} ya fue pagado.`);
  }

  process(order: Order): void {
    console.log(`${COLORS.green}[Preparación]${COLORS.reset} Pedido #${order.id} siendo preparado en almacén.`);
  }

  ship(order: Order): void {
    console.log(`${COLORS.green}[Envío]${COLORS.reset} Pedido #${order.id} entregado al transportista.`);
    order.setState(new ShippedState());
  }

  deliver(order: Order): void {
    console.log(`${COLORS.red}[Error]${COLORS.reset} El pedido #${order.id} todavía no fue enviado.`);
  }

  cancel(order: Order): void {
    console.log(`${COLORS.yellow}[Cancelación]${COLORS.reset} Pedido #${order.id} cancelado durante preparación. Se procesará el reembolso.`);
    order.setState(new CancelledState());
  }
}

class ShippedState implements OrderState {
  getLabel(): string { return 'En camino'; }

  pay(order: Order): void {
    console.log(`${COLORS.red}[Error]${COLORS.reset} El pedido #${order.id} ya fue pagado.`);
  }

  process(order: Order): void {
    console.log(`${COLORS.red}[Error]${COLORS.reset} El pedido #${order.id} ya salió del almacén.`);
  }

  ship(order: Order): void {
    console.log(`${COLORS.red}[Error]${COLORS.reset} El pedido #${order.id} ya está en camino.`);
  }

  deliver(order: Order): void {
    console.log(`${COLORS.green}[Entrega]${COLORS.reset} ¡Pedido #${order.id} entregado al cliente!`);
    order.setState(new DeliveredState());
  }

  cancel(order: Order): void {
    console.log(`${COLORS.red}[Error]${COLORS.reset} No se puede cancelar el pedido #${order.id}: ya está en camino.`);
  }
}

class DeliveredState implements OrderState {
  getLabel(): string { return 'Entregado'; }

  pay(order: Order): void {
    console.log(`${COLORS.red}[Error]${COLORS.reset} El pedido #${order.id} ya fue entregado.`);
  }

  process(order: Order): void {
    console.log(`${COLORS.red}[Error]${COLORS.reset} El pedido #${order.id} ya fue entregado.`);
  }

  ship(order: Order): void {
    console.log(`${COLORS.red}[Error]${COLORS.reset} El pedido #${order.id} ya fue entregado.`);
  }

  deliver(order: Order): void {
    console.log(`${COLORS.red}[Error]${COLORS.reset} El pedido #${order.id} ya fue entregado.`);
  }

  cancel(order: Order): void {
    console.log(`${COLORS.red}[Error]${COLORS.reset} No se puede cancelar: el pedido #${order.id} ya fue entregado.`);
  }
}

class CancelledState implements OrderState {
  getLabel(): string { return 'Cancelado'; }

  pay(order: Order): void {
    console.log(`${COLORS.red}[Error]${COLORS.reset} El pedido #${order.id} fue cancelado.`);
  }

  process(order: Order): void {
    console.log(`${COLORS.red}[Error]${COLORS.reset} El pedido #${order.id} fue cancelado.`);
  }

  ship(order: Order): void {
    console.log(`${COLORS.red}[Error]${COLORS.reset} El pedido #${order.id} fue cancelado.`);
  }

  deliver(order: Order): void {
    console.log(`${COLORS.red}[Error]${COLORS.reset} El pedido #${order.id} fue cancelado.`);
  }

  cancel(order: Order): void {
    console.log(`${COLORS.gray}[Cancelación]${COLORS.reset} El pedido #${order.id} ya estaba cancelado.`);
  }
}

// ============================================================
// Demo
// ============================================================

// Flujo normal: Pending → Processing → Shipped → Delivered
console.log(`\n${COLORS.cyan}=== Flujo normal ===${COLORS.reset}`);
const order1 = new Order('A001', ['Teclado', 'Ratón', 'Monitor']);
order1.pay();
order1.process();
order1.ship();
order1.deliver();

// Intento de acción en estado final
console.log(`\n${COLORS.yellow}--- Intento de cancelar entregado ---${COLORS.reset}`);
order1.cancel();

// Flujo cancelado antes del envío
console.log(`\n${COLORS.cyan}=== Cancelación en preparación ===${COLORS.reset}`);
const order2 = new Order('B002', ['Auriculares']);
order2.pay();
order2.process();
order2.cancel();

// Intento de seguir tras cancelación
console.log(`\n${COLORS.yellow}--- Intento de enviar cancelado ---${COLORS.reset}`);
order2.ship();

// Intento de acciones fuera de orden
console.log(`\n${COLORS.cyan}=== Acciones fuera de orden ===${COLORS.reset}`);
const order3 = new Order('C003', ['Webcam']);
order3.ship();    // sin pagar
order3.deliver(); // sin pagar
order3.pay();
order3.deliver(); // sin haber enviado
order3.ship();

console.log(`\n${COLORS.cyan}=== Estados finales ===${COLORS.reset}`);
console.log(`  Pedido A001: ${order1.getStatus()}`);
console.log(`  Pedido B002: ${order2.getStatus()}`);
console.log(`  Pedido C003: ${order3.getStatus()}`);
