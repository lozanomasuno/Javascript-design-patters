import { COLORS } from '../helpers/colors.ts';

// ============================================================
// STATE — Patrón de Comportamiento
// ============================================================
// Permite que un objeto altere su comportamiento cuando su
// estado interno cambia. Parece que el objeto cambia de clase.
//
// Participantes:
//   Context      → VendingMachine
//   State        → VendingState (interfaz)
//   ConcreteStates:
//     IdleState      → esperando moneda
//     HasCoinState   → moneda insertada, seleccionar producto
//     DispensingState→ entregando producto
//     OutOfStockState→ sin stock
// ============================================================

// --- Interfaz State ---

interface VendingState {
  insertCoin(machine: VendingMachine, amount: number): void;
  selectProduct(machine: VendingMachine, product: string): void;
  dispense(machine: VendingMachine): void;
  cancel(machine: VendingMachine): void;
}

// --- Context ---

class VendingMachine {
  private state: VendingState;
  private balance = 0;
  private readonly inventory: Map<string, { price: number; stock: number }>;

  constructor() {
    this.inventory = new Map([
      ['Agua',   { price: 100, stock: 3 }],
      ['Refresco', { price: 150, stock: 2 }],
      ['Snack',  { price: 200, stock: 1 }],
    ]);
    this.state = new IdleState();
  }

  setState(state: VendingState): void {
    this.state = state;
  }

  getBalance(): number { return this.balance; }
  addBalance(amount: number): void { this.balance += amount; }
  deductBalance(price: number): void { this.balance -= price; }
  returnBalance(): number {
    const returned = this.balance;
    this.balance = 0;
    return returned;
  }

  getProduct(name: string) { return this.inventory.get(name); }
  decreaseStock(name: string): void {
    const item = this.inventory.get(name);
    if (item) item.stock--;
  }
  hasStock(): boolean {
    return [...this.inventory.values()].some(i => i.stock > 0);
  }

  // Delegación al estado actual
  insertCoin(amount: number): void     { this.state.insertCoin(this, amount); }
  selectProduct(product: string): void { this.state.selectProduct(this, product); }
  dispense(): void                     { this.state.dispense(this); }
  cancel(): void                       { this.state.cancel(this); }

  printStatus(): void {
    console.log(`\n${COLORS.gray}  Saldo: $${this.balance}`);
    for (const [name, { price, stock }] of this.inventory) {
      const icon = stock > 0 ? COLORS.green + '✓' : COLORS.red + '✗';
      console.log(`  ${icon}${COLORS.reset} ${name} ($${price}) — stock: ${stock}`);
    }
  }
}

// --- Estados concretos ---

class IdleState implements VendingState {
  insertCoin(machine: VendingMachine, amount: number): void {
    machine.addBalance(amount);
    console.log(`${COLORS.green}[Idle → HasCoin]${COLORS.reset} Moneda insertada: $${amount}`);
    machine.setState(new HasCoinState());
  }

  selectProduct(machine: VendingMachine, _product: string): void {
    console.log(`${COLORS.red}[Idle]${COLORS.reset} Inserta una moneda primero.`);
  }

  dispense(_machine: VendingMachine): void {
    console.log(`${COLORS.red}[Idle]${COLORS.reset} Inserta una moneda primero.`);
  }

  cancel(_machine: VendingMachine): void {
    console.log(`${COLORS.gray}[Idle]${COLORS.reset} No hay nada que cancelar.`);
  }
}

class HasCoinState implements VendingState {
  private selectedProduct: string | null = null;

  insertCoin(machine: VendingMachine, amount: number): void {
    machine.addBalance(amount);
    console.log(`${COLORS.green}[HasCoin]${COLORS.reset} Moneda adicional: $${amount}. Saldo: $${machine.getBalance()}`);
  }

  selectProduct(machine: VendingMachine, product: string): void {
    const item = machine.getProduct(product);
    if (!item) {
      console.log(`${COLORS.red}[HasCoin]${COLORS.reset} Producto "${product}" no encontrado.`);
      return;
    }
    if (item.stock === 0) {
      console.log(`${COLORS.red}[HasCoin]${COLORS.reset} "${product}" sin stock.`);
      return;
    }
    if (machine.getBalance() < item.price) {
      console.log(
        `${COLORS.red}[HasCoin]${COLORS.reset} Saldo insuficiente. ` +
        `Necesitas $${item.price - machine.getBalance()} más.`
      );
      return;
    }
    this.selectedProduct = product;
    console.log(`${COLORS.cyan}[HasCoin → Dispensing]${COLORS.reset} Seleccionado: "${product}" ($${item.price})`);
    machine.deductBalance(item.price);
    machine.setState(new DispensingState(product));
    machine.dispense();
  }

  dispense(_machine: VendingMachine): void {
    console.log(`${COLORS.red}[HasCoin]${COLORS.reset} Selecciona un producto primero.`);
  }

  cancel(machine: VendingMachine): void {
    const returned = machine.returnBalance();
    console.log(`${COLORS.yellow}[HasCoin → Idle]${COLORS.reset} Cancelado. Devolviendo $${returned}.`);
    machine.setState(new IdleState());
  }
}

class DispensingState implements VendingState {
  private readonly product: string;

  constructor(product: string) {
    this.product = product;
  }

  insertCoin(_machine: VendingMachine, _amount: number): void {
    console.log(`${COLORS.red}[Dispensing]${COLORS.reset} Espera, dispensando producto...`);
  }

  selectProduct(_machine: VendingMachine, _product: string): void {
    console.log(`${COLORS.red}[Dispensing]${COLORS.reset} Espera, dispensando producto...`);
  }

  dispense(machine: VendingMachine): void {
    machine.decreaseStock(this.product);
    console.log(`${COLORS.green}[Dispensing]${COLORS.reset} ¡Disfruta tu "${this.product}"!`);

    if (machine.getBalance() > 0) {
      console.log(`${COLORS.yellow}[Dispensing]${COLORS.reset} Cambio devuelto: $${machine.returnBalance()}`);
    }

    const nextState: VendingState = machine.hasStock() ? new IdleState() : new OutOfStockState();
    machine.setState(nextState);
    console.log(machine.hasStock()
      ? `${COLORS.cyan}[Dispensing → Idle]${COLORS.reset} Máquina lista.`
      : `${COLORS.red}[Dispensing → OutOfStock]${COLORS.reset} Sin productos.`
    );
  }

  cancel(_machine: VendingMachine): void {
    console.log(`${COLORS.red}[Dispensing]${COLORS.reset} No se puede cancelar durante la entrega.`);
  }
}

class OutOfStockState implements VendingState {
  insertCoin(machine: VendingMachine, amount: number): void {
    console.log(`${COLORS.red}[OutOfStock]${COLORS.reset} Sin stock. Devolviendo $${amount}.`);
  }

  selectProduct(_machine: VendingMachine, _product: string): void {
    console.log(`${COLORS.red}[OutOfStock]${COLORS.reset} Lo sentimos, no hay productos disponibles.`);
  }

  dispense(_machine: VendingMachine): void {
    console.log(`${COLORS.red}[OutOfStock]${COLORS.reset} Sin stock para dispensar.`);
  }

  cancel(_machine: VendingMachine): void {
    console.log(`${COLORS.gray}[OutOfStock]${COLORS.reset} Nada que cancelar.`);
  }
}

// ============================================================
// Demo
// ============================================================

const machine = new VendingMachine();

console.log(`${COLORS.cyan}=== Máquina Expendedora ===${COLORS.reset}`);
machine.printStatus();

// Intento sin moneda
console.log(`\n${COLORS.yellow}--- Intento sin moneda ---${COLORS.reset}`);
machine.selectProduct('Agua');

// Compra exitosa con cambio
console.log(`\n${COLORS.yellow}--- Compra: Agua ($100) con $150 ---${COLORS.reset}`);
machine.insertCoin(100);
machine.insertCoin(50);
machine.selectProduct('Agua');

machine.printStatus();

// Saldo insuficiente
console.log(`\n${COLORS.yellow}--- Saldo insuficiente ---${COLORS.reset}`);
machine.insertCoin(100);
machine.selectProduct('Refresco'); // necesita $150

// Añadir y comprar
machine.insertCoin(50);
machine.selectProduct('Refresco');

machine.printStatus();

// Cancelación
console.log(`\n${COLORS.yellow}--- Cancelación ---${COLORS.reset}`);
machine.insertCoin(200);
machine.cancel();

// Agotar el último producto
console.log(`\n${COLORS.yellow}--- Último producto (Snack $200) ---${COLORS.reset}`);
machine.insertCoin(200);
machine.selectProduct('Snack');

machine.printStatus();

// Intento en OutOfStock
console.log(`\n${COLORS.yellow}--- Máquina sin stock ---${COLORS.reset}`);
machine.insertCoin(100);
machine.selectProduct('Agua');
