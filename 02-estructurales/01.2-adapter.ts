/**
 * ! Patrón Adapter:
 * Es un patrón de diseño estructural que permite que objetos con interfaces
 * incompatibles trabajen juntos.
 *
 * * Es útil cuando queremos reutilizar una clase existente pero su interfaz
 * * no es compatible con el resto del código.
 *
 * https://refactoring.guru/es/design-patterns/adapter
 */

/**
 * !Tarea: Adaptador de pagos
 *
 * Tenemos un sistema de pagos propio que espera la interfaz PaymentProcessor.
 * Sin embargo, debemos integrar dos pasarelas externas (Stripe y PayPal)
 * que tienen interfaces totalmente distintas.
 *
 * 1. Implementa StripeAdapter para que adapte StripeGateway a PaymentProcessor.
 * 2. Implementa PayPalAdapter para que adapte PayPalGateway a PaymentProcessor.
 * 3. Usa processPayment() para procesar pagos con ambas pasarelas sin cambiar
 *    el código cliente.
 *
 * Salida esperada:
 *  Procesando $120 via Stripe...
 *    → Stripe cobró $120 USD al token tok_abc123
 *  Procesando $75 via PayPal...
 *    → PayPal transfirió 75 EUR a buyer@example.com
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Interfaz propia del sistema ──────────────────────────────────────────────
interface PaymentProcessor {
  pay(amount: number, currency: string, reference: string): void;
}

// ─── Pasarela externa 1: Stripe (Adaptee) ────────────────────────────────────
// No podemos modificar esta clase.
class StripeGateway {
  charge(amountInCents: number, currency: string, token: string): void {
    const amount = amountInCents / 100;
    console.log(
      `%c  → Stripe cobró $${amount} ${currency.toUpperCase()} al token ${token}`,
      COLORS.blue,
    );
  }
}

// ─── Pasarela externa 2: PayPal (Adaptee) ────────────────────────────────────
// No podemos modificar esta clase.
class PayPalGateway {
  sendPayment(receiverEmail: string, amount: number, currencyCode: string): void {
    console.log(
      `%c  → PayPal transfirió ${amount} ${currencyCode} a ${receiverEmail}`,
      COLORS.blue,
    );
  }
}

// ─── Adapter 1: Stripe ───────────────────────────────────────────────────────
class StripeAdapter implements PaymentProcessor {
  private readonly gateway: StripeGateway;

  constructor(gateway: StripeGateway) {
    this.gateway = gateway;
  }

  pay(amount: number, currency: string, reference: string): void {
    // Stripe espera el monto en centavos
    this.gateway.charge(amount * 100, currency, reference);
  }
}

// ─── Adapter 2: PayPal ───────────────────────────────────────────────────────
class PayPalAdapter implements PaymentProcessor {
  private readonly gateway: PayPalGateway;

  constructor(gateway: PayPalGateway) {
    this.gateway = gateway;
  }

  pay(amount: number, currency: string, reference: string): void {
    // PayPal espera (email, amount, currency)
    this.gateway.sendPayment(reference, amount, currency);
  }
}

// ─── Cliente ──────────────────────────────────────────────────────────────────
// Solo conoce PaymentProcessor; no sabe nada de Stripe ni PayPal.
function processPayment(
  processor: PaymentProcessor,
  amount: number,
  currency: string,
  reference: string,
  label: string,
): void {
  console.log(`%cProcesando $${amount} via ${label}...`, COLORS.cyan);
  processor.pay(amount, currency, reference);
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
function main() {
  console.log('%c=== Adapter: Pasarelas de Pago ===\n', COLORS.green);

  const stripeAdapter = new StripeAdapter(new StripeGateway());
  const paypalAdapter = new PayPalAdapter(new PayPalGateway());

  processPayment(stripeAdapter, 120, 'usd', 'tok_abc123',        'Stripe');
  processPayment(paypalAdapter, 75,  'EUR', 'buyer@example.com', 'PayPal');
}

main();
