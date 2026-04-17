import { COLORS } from '../helpers/colors.ts';

// ============================================================
// VISITOR — Tarea
// ============================================================
// Carrito de compra con distintos tipos de producto.
// Sin modificar ningún producto, se añaden tres operaciones
// nuevas mediante visitors:
//
//   TaxCalculatorVisitor  → calcula el impuesto por tipo
//   DiscountVisitor       → aplica descuentos según reglas
//   ReceiptPrinterVisitor → imprime el ticket de compra
//
// Tipos de producto (Elements):
//   PhysicalProduct  → IVA 21 %, envío por peso
//   DigitalProduct   → IVA 10 %, sin envío
//   FoodProduct      → IVA 4 %,  descuento si caduca pronto
//   SubscriptionPlan → IVA 0 %,  descuento si es anual
// ============================================================

// --- Visitor interface ---

interface CartVisitor {
  visitPhysical(p: PhysicalProduct): void;
  visitDigital(p: DigitalProduct): void;
  visitFood(p: FoodProduct): void;
  visitSubscription(p: SubscriptionPlan): void;
}

// --- Element interface ---

interface CartItem {
  readonly name: string;
  readonly basePrice: number;
  accept(visitor: CartVisitor): void;
}

// --- Elementos concretos ---

class PhysicalProduct implements CartItem {
  readonly name: string;
  readonly basePrice: number;
  readonly weightKg: number;

  constructor(name: string, basePrice: number, weightKg: number) {
    this.name      = name;
    this.basePrice = basePrice;
    this.weightKg  = weightKg;
  }

  accept(visitor: CartVisitor): void {
    visitor.visitPhysical(this);
  }
}

class DigitalProduct implements CartItem {
  readonly name: string;
  readonly basePrice: number;
  readonly licenseType: 'personal' | 'commercial';

  constructor(name: string, basePrice: number, licenseType: 'personal' | 'commercial') {
    this.name        = name;
    this.basePrice   = basePrice;
    this.licenseType = licenseType;
  }

  accept(visitor: CartVisitor): void {
    visitor.visitDigital(this);
  }
}

class FoodProduct implements CartItem {
  readonly name: string;
  readonly basePrice: number;
  readonly daysUntilExpiry: number;

  constructor(name: string, basePrice: number, daysUntilExpiry: number) {
    this.name             = name;
    this.basePrice        = basePrice;
    this.daysUntilExpiry  = daysUntilExpiry;
  }

  accept(visitor: CartVisitor): void {
    visitor.visitFood(this);
  }
}

class SubscriptionPlan implements CartItem {
  readonly name: string;
  readonly basePrice: number;
  readonly isAnnual: boolean;

  constructor(name: string, basePrice: number, isAnnual: boolean) {
    this.name      = name;
    this.basePrice = basePrice;
    this.isAnnual  = isAnnual;
  }

  accept(visitor: CartVisitor): void {
    visitor.visitSubscription(this);
  }
}

// --- Visitor 1: Cálculo de impuestos ---

class TaxCalculatorVisitor implements CartVisitor {
  private totalTax = 0;

  visitPhysical(p: PhysicalProduct): void {
    const tax = p.basePrice * 0.21;
    this.totalTax += tax;
    console.log(
      `  ${COLORS.yellow}[IVA 21%]${COLORS.reset} ${p.name}: +${tax.toFixed(2)} €`
    );
  }

  visitDigital(p: DigitalProduct): void {
    const tax = p.basePrice * 0.10;
    this.totalTax += tax;
    console.log(
      `  ${COLORS.yellow}[IVA 10%]${COLORS.reset} ${p.name}: +${tax.toFixed(2)} €`
    );
  }

  visitFood(p: FoodProduct): void {
    const tax = p.basePrice * 0.04;
    this.totalTax += tax;
    console.log(
      `  ${COLORS.yellow}[IVA  4%]${COLORS.reset} ${p.name}: +${tax.toFixed(2)} €`
    );
  }

  visitSubscription(p: SubscriptionPlan): void {
    console.log(
      `  ${COLORS.gray}[IVA  0%]${COLORS.reset} ${p.name}: exento`
    );
  }

  getTotal(): number { return this.totalTax; }
}

// --- Visitor 2: Descuentos ---

class DiscountVisitor implements CartVisitor {
  private totalDiscount = 0;

  visitPhysical(_p: PhysicalProduct): void {
    // Sin descuento para productos físicos en esta promo
  }

  visitDigital(p: DigitalProduct): void {
    if (p.licenseType === 'commercial') {
      const disc = p.basePrice * 0.15;
      this.totalDiscount += disc;
      console.log(
        `  ${COLORS.green}[Descuento 15%]${COLORS.reset} ${p.name} (licencia comercial): -${disc.toFixed(2)} €`
      );
    }
  }

  visitFood(p: FoodProduct): void {
    if (p.daysUntilExpiry <= 3) {
      const disc = p.basePrice * 0.30;
      this.totalDiscount += disc;
      console.log(
        `  ${COLORS.green}[Descuento 30%]${COLORS.reset} ${p.name} (caduca en ${p.daysUntilExpiry} días): -${disc.toFixed(2)} €`
      );
    }
  }

  visitSubscription(p: SubscriptionPlan): void {
    if (p.isAnnual) {
      const disc = p.basePrice * 0.20;
      this.totalDiscount += disc;
      console.log(
        `  ${COLORS.green}[Descuento 20%]${COLORS.reset} ${p.name} (plan anual): -${disc.toFixed(2)} €`
      );
    }
  }

  getTotal(): number { return this.totalDiscount; }
}

// --- Visitor 3: Ticket de compra ---

class ReceiptPrinterVisitor implements CartVisitor {
  private lines: string[] = [];
  private subtotal = 0;

  visitPhysical(p: PhysicalProduct): void {
    const shipping = p.weightKg * 0.5; // 0.50 € por kg
    this.subtotal += p.basePrice;
    this.lines.push(
      `  ${p.name.padEnd(28)} ${p.basePrice.toFixed(2).padStart(7)} € ` +
      `${COLORS.gray}(envío: ${shipping.toFixed(2)} €)${COLORS.reset}`
    );
  }

  visitDigital(p: DigitalProduct): void {
    this.subtotal += p.basePrice;
    this.lines.push(
      `  ${p.name.padEnd(28)} ${p.basePrice.toFixed(2).padStart(7)} € ` +
      `${COLORS.gray}(descarga digital)${COLORS.reset}`
    );
  }

  visitFood(p: FoodProduct): void {
    this.subtotal += p.basePrice;
    const expiryNote = p.daysUntilExpiry <= 3
      ? `${COLORS.red}¡caduca en ${p.daysUntilExpiry}d!${COLORS.reset}`
      : `caduca en ${p.daysUntilExpiry}d`;
    this.lines.push(
      `  ${p.name.padEnd(28)} ${p.basePrice.toFixed(2).padStart(7)} € ` +
      `${COLORS.gray}(${expiryNote}${COLORS.gray})${COLORS.reset}`
    );
  }

  visitSubscription(p: SubscriptionPlan): void {
    this.subtotal += p.basePrice;
    const period = p.isAnnual ? 'anual' : 'mensual';
    this.lines.push(
      `  ${p.name.padEnd(28)} ${p.basePrice.toFixed(2).padStart(7)} € ` +
      `${COLORS.gray}(suscripción ${period})${COLORS.reset}`
    );
  }

  print(tax: number, discount: number): void {
    const sep = '─'.repeat(50);
    console.log(`\n${COLORS.cyan}╔═══════════════ TICKET DE COMPRA ════════════════╗${COLORS.reset}`);
    for (const line of this.lines) console.log(line);
    console.log(`  ${sep}`);
    console.log(`  ${'Subtotal'.padEnd(34)} ${this.subtotal.toFixed(2).padStart(7)} €`);
    console.log(`  ${COLORS.green}${'Descuentos'.padEnd(34)} -${discount.toFixed(2).padStart(6)} €${COLORS.reset}`);
    console.log(`  ${COLORS.yellow}${'Impuestos'.padEnd(34)} +${tax.toFixed(2).padStart(6)} €${COLORS.reset}`);
    console.log(`  ${sep}`);
    const total = this.subtotal - discount + tax;
    console.log(`  ${COLORS.cyan}${'TOTAL'.padEnd(34)} ${total.toFixed(2).padStart(7)} €${COLORS.reset}`);
    console.log(`${COLORS.cyan}╚══════════════════════════════════════════════════╝${COLORS.reset}`);
  }
}

// ============================================================
// Demo
// ============================================================

const cart: CartItem[] = [
  new PhysicalProduct('Teclado mecánico RGB',      89.99, 1.2),
  new PhysicalProduct('Monitor 27" 4K',           349.00, 5.8),
  new DigitalProduct ('Adobe Photoshop (anual)',  239.88, 'commercial'),
  new DigitalProduct ('Curso TypeScript',          29.99, 'personal'),
  new FoodProduct    ('Queso manchego',             8.50, 2),    // caduca pronto → descuento
  new FoodProduct    ('Vino Ribera del Duero',     15.00, 180),
  new SubscriptionPlan('Netflix Premium (anual)', 143.88, true),
  new SubscriptionPlan('Spotify (mensual)',          9.99, false),
];

console.log(`${COLORS.cyan}=== Cálculo de impuestos ===${COLORS.reset}`);
const taxVisitor = new TaxCalculatorVisitor();
for (const item of cart) item.accept(taxVisitor);
console.log(`  ${COLORS.yellow}Total impuestos: ${taxVisitor.getTotal().toFixed(2)} €${COLORS.reset}`);

console.log(`\n${COLORS.cyan}=== Descuentos aplicados ===${COLORS.reset}`);
const discountVisitor = new DiscountVisitor();
for (const item of cart) item.accept(discountVisitor);
console.log(`  ${COLORS.green}Total descuentos: -${discountVisitor.getTotal().toFixed(2)} €${COLORS.reset}`);

console.log(`\n${COLORS.cyan}=== Generando ticket ===${COLORS.reset}`);
const receipt = new ReceiptPrinterVisitor();
for (const item of cart) item.accept(receipt);
receipt.print(taxVisitor.getTotal(), discountVisitor.getTotal());
