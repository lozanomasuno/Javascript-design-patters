import { COLORS } from '../helpers/colors.ts';

// ============================================================
// OBSERVER — Tarea
// ============================================================
// Sistema de subasta en tiempo real.
//
// - AuctionItem (Subject) notifica cuando hay nueva puja
//   o cuando la subasta cierra.
// - Bidder (Observer) reacciona si va ganando o si lo superan.
// - AuctionLogger (Observer) registra toda la actividad.
// ============================================================

// --- Interfaces ---

interface AuctionObserver {
  onNewBid(item: string, amount: number, bidder: string): void;
  onAuctionEnd(item: string, winner: string, finalPrice: number): void;
}

interface AuctionSubject {
  subscribe(observer: AuctionObserver): void;
  unsubscribe(observer: AuctionObserver): void;
}

// --- Subject concreto ---

class AuctionItem implements AuctionSubject {
  private readonly observers: AuctionObserver[] = [];
  private readonly name: string;
  private currentBid: number;
  private currentBidder = 'Sin pujas';
  private isOpen = true;

  constructor(name: string, startingPrice: number) {
    this.name = name;
    this.currentBid = startingPrice;
  }

  subscribe(observer: AuctionObserver): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: AuctionObserver): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) this.observers.splice(index, 1);
  }

  private notifyNewBid(): void {
    for (const obs of this.observers) {
      obs.onNewBid(this.name, this.currentBid, this.currentBidder);
    }
  }

  private notifyAuctionEnd(): void {
    for (const obs of this.observers) {
      obs.onAuctionEnd(this.name, this.currentBidder, this.currentBid);
    }
  }

  bid(bidder: string, amount: number): void {
    if (!this.isOpen) {
      console.log(`${COLORS.red}La subasta de "${this.name}" ya cerró.${COLORS.reset}`);
      return;
    }
    if (amount <= this.currentBid) {
      console.log(
        `${COLORS.red}[${bidder}]${COLORS.reset} Puja de $${amount} rechazada` +
        ` — la puja actual es $${this.currentBid}`
      );
      return;
    }
    this.currentBidder = bidder;
    this.currentBid = amount;
    this.notifyNewBid();
  }

  close(): void {
    this.isOpen = false;
    this.notifyAuctionEnd();
  }
}

// --- Observers concretos ---

class Bidder implements AuctionObserver {
  private readonly name: string;
  private isWinning = false;

  constructor(name: string) {
    this.name = name;
  }

  onNewBid(item: string, amount: number, bidder: string): void {
    const wasWinning = this.isWinning;
    this.isWinning = bidder === this.name;

    if (this.isWinning) {
      console.log(
        `${COLORS.green}[${this.name}]${COLORS.reset} ` +
        `Voy ganando "${item}" con $${amount}.`
      );
    } else if (wasWinning) {
      console.log(
        `${COLORS.red}[${this.name}]${COLORS.reset} ` +
        `Me superaron en "${item}". Nueva puja: $${amount} por ${bidder}.`
      );
    }
  }

  onAuctionEnd(item: string, winner: string, finalPrice: number): void {
    if (winner === this.name) {
      console.log(
        `${COLORS.green}[${this.name}]${COLORS.reset} ` +
        `Gane "${item}" por $${finalPrice}!`
      );
    } else {
      console.log(
        `${COLORS.gray}[${this.name}]${COLORS.reset} ` +
        `No gane "${item}". Gano ${winner} con $${finalPrice}.`
      );
    }
  }
}

class AuctionLogger implements AuctionObserver {
  private readonly log: string[] = [];

  onNewBid(item: string, amount: number, bidder: string): void {
    const entry = `[PUJA]  ${item} → $${amount} por ${bidder}`;
    this.log.push(entry);
    console.log(`${COLORS.blue}[Logger]${COLORS.reset} ${entry}`);
  }

  onAuctionEnd(item: string, winner: string, finalPrice: number): void {
    const entry = `[FIN]   ${item} → ${winner} ($${finalPrice})`;
    this.log.push(entry);
    console.log(`${COLORS.blue}[Logger]${COLORS.reset} ${entry}`);
  }

  printHistory(): void {
    console.log(`\n${COLORS.yellow}=== Historial completo ===${COLORS.reset}`);
    for (const entry of this.log) {
      console.log(`  ${entry}`);
    }
  }
}

// ============================================================
// Demo
// ============================================================

const painting = new AuctionItem('Cuadro de Monet', 1_000);

const logger = new AuctionLogger();
const ana    = new Bidder('Ana');
const bob    = new Bidder('Bob');
const carlos = new Bidder('Carlos');

painting.subscribe(logger);
painting.subscribe(ana);
painting.subscribe(bob);
painting.subscribe(carlos);

console.log(`\n${COLORS.cyan}=== Subasta: Cuadro de Monet (base $1,000) ===${COLORS.reset}\n`);

painting.bid('Ana',    1_200);
painting.bid('Bob',      900);  // rechazada — por debajo de la actual
painting.bid('Carlos', 1_500);
painting.bid('Ana',    2_000);
painting.bid('Bob',    2_200);
painting.bid('Carlos', 2_100);  // rechazada
painting.bid('Ana',    2_500);

console.log(`\n${COLORS.yellow}[Martillo]${COLORS.reset} ¡A la una, a las dos, a las tres!\n`);
painting.close();

// Intento de puja tras el cierre
painting.bid('Bob', 3_000);

logger.printHistory();
