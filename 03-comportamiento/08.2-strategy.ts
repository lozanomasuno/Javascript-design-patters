import { COLORS } from '../helpers/colors.ts';

// ============================================================
// STRATEGY — Tarea
// ============================================================
// RPG: un héroe puede cambiar su estilo de combate en tiempo
// real. Cada estrategia de ataque tiene su propio cálculo de
// daño, coste de maná/stamina y descripción de animación.
//
// Estrategias disponibles:
//   SwordStrategy    → ataque cuerpo a cuerpo, alto daño, sin maná
//   BowStrategy      → ataque a distancia, daño moderado, stamina
//   MagicStrategy    → AOE, altísimo daño, gasta mucho maná
//   StealthStrategy  → golpe crítico si el enemigo no está alerta
// ============================================================

// --- Tipos ---

interface AttackResult {
  damage: number;
  cost: number;
  costType: 'stamina' | 'mana' | 'none';
  animation: string;
}

interface Enemy {
  name: string;
  hp: number;
  isAlert: boolean;
}

// --- Interfaz Strategy ---

interface AttackStrategy {
  attack(hero: Hero, enemy: Enemy): AttackResult;
  getLabel(): string;
  canUse(hero: Hero): boolean;
}

// --- Context ---

class Hero {
  readonly name: string;
  hp: number;
  mana: number;
  stamina: number;
  private strategy: AttackStrategy;
  private readonly killCount: Record<string, number> = {};

  constructor(name: string) {
    this.name   = name;
    this.hp      = 100;
    this.mana    = 80;
    this.stamina = 100;
    this.strategy = new SwordStrategy();
  }

  setStrategy(strategy: AttackStrategy): void {
    this.strategy = strategy;
    console.log(`${COLORS.cyan}[${this.name}]${COLORS.reset} Cambia estilo → ${COLORS.yellow}${strategy.getLabel()}${COLORS.reset}`);
  }

  attackEnemy(enemy: Enemy): void {
    if (!this.strategy.canUse(this)) {
      console.log(
        `${COLORS.red}[${this.name}]${COLORS.reset} ` +
        `No puede usar "${this.strategy.getLabel()}" — recursos insuficientes.`
      );
      return;
    }

    const result = this.strategy.attack(this, enemy);
    enemy.hp = Math.max(0, enemy.hp - result.damage);

    if (result.costType === 'mana')    this.mana    -= result.cost;
    if (result.costType === 'stamina') this.stamina -= result.cost;

    const resource = result.costType === 'none'
      ? ''
      : ` [-${result.cost} ${result.costType}]`;

    console.log(
      `${COLORS.green}[${this.name}]${COLORS.reset} ${result.animation} ` +
      `→ ${COLORS.red}${enemy.name}${COLORS.reset} recibe ${COLORS.yellow}${result.damage}${COLORS.reset} de daño` +
      `${COLORS.gray}${resource}${COLORS.reset} (HP enemigo: ${enemy.hp})`
    );

    if (enemy.hp === 0) {
      console.log(`${COLORS.purple}  ¡${enemy.name} ha sido derrotado!${COLORS.reset}`);
      this.killCount[enemy.name] = (this.killCount[enemy.name] ?? 0) + 1;
    }
  }

  printStats(): void {
    console.log(
      `${COLORS.cyan}[${this.name}]${COLORS.reset} ` +
      `HP: ${this.hp} | Maná: ${this.mana} | Stamina: ${this.stamina}`
    );
  }
}

// --- Strategies concretas ---

class SwordStrategy implements AttackStrategy {
  getLabel(): string { return 'Espada (cuerpo a cuerpo)'; }

  canUse(_hero: Hero): boolean { return true; } // siempre disponible

  attack(_hero: Hero, _enemy: Enemy): AttackResult {
    const damage = 20 + Math.floor(Math.random() * 10); // 20-29
    return {
      damage,
      cost: 0,
      costType: 'none',
      animation: '⚔️  Tajo diagonal',
    };
  }
}

class BowStrategy implements AttackStrategy {
  getLabel(): string { return 'Arco (distancia)'; }

  canUse(hero: Hero): boolean { return hero.stamina >= 15; }

  attack(_hero: Hero, _enemy: Enemy): AttackResult {
    const damage = 15 + Math.floor(Math.random() * 8); // 15-22
    return {
      damage,
      cost: 15,
      costType: 'stamina',
      animation: '🏹  Flecha certera',
    };
  }
}

class MagicStrategy implements AttackStrategy {
  getLabel(): string { return 'Magia (AOE)'; }

  canUse(hero: Hero): boolean { return hero.mana >= 30; }

  attack(_hero: Hero, _enemy: Enemy): AttackResult {
    const damage = 40 + Math.floor(Math.random() * 20); // 40-59
    return {
      damage,
      cost: 30,
      costType: 'mana',
      animation: '✨  Explosión arcana',
    };
  }
}

class StealthStrategy implements AttackStrategy {
  getLabel(): string { return 'Sigilo (golpe crítico)'; }

  canUse(hero: Hero): boolean { return hero.stamina >= 20; }

  attack(_hero: Hero, enemy: Enemy): AttackResult {
    const isCritical = !enemy.isAlert;
    const damage = isCritical
      ? 50 + Math.floor(Math.random() * 15)  // crítico: 50-64
      : 10 + Math.floor(Math.random() * 5);  // detectado: 10-14
    const animation = isCritical
      ? '🗡️  Apuñalada por la espalda (¡CRÍTICO!)'
      : '🗡️  Intento fallido — enemigo alerta';
    return {
      damage,
      cost: 20,
      costType: 'stamina',
      animation,
    };
  }
}

// ============================================================
// Demo
// ============================================================

const hero = new Hero('Aric');
hero.printStats();

const goblin: Enemy   = { name: 'Goblin',   hp: 60,  isAlert: false };
const troll: Enemy    = { name: 'Troll',    hp: 120, isAlert: true  };
const wizard: Enemy   = { name: 'Mago oscuro', hp: 90, isAlert: false };

console.log(`\n${COLORS.yellow}=== Combate 1: Goblin (no alerta) ===${COLORS.reset}`);
hero.setStrategy(new StealthStrategy()); // golpe crítico
hero.attackEnemy(goblin);
hero.attackEnemy(goblin); // posiblemente lo derrota

console.log(`\n${COLORS.yellow}=== Combate 2: Troll (alerta, mucho HP) ===${COLORS.reset}`);
hero.setStrategy(new MagicStrategy());  // AOE — máximo daño
hero.attackEnemy(troll);
hero.setStrategy(new SwordStrategy());  // seguir con espada
hero.attackEnemy(troll);
hero.attackEnemy(troll);

console.log(`\n${COLORS.yellow}=== Combate 3: Mago oscuro ===${COLORS.reset}`);
hero.setStrategy(new BowStrategy());    // ataque a distancia
hero.attackEnemy(wizard);
hero.setStrategy(new MagicStrategy());
hero.attackEnemy(wizard);

hero.printStats();

// Escenario: sin maná, intenta magia
console.log(`\n${COLORS.gray}--- Maná agotado, intenta lanzar magia ---${COLORS.reset}`);
hero.mana = 10;
hero.setStrategy(new MagicStrategy());
hero.attackEnemy(wizard);

// Fallback automático a espada
console.log(`${COLORS.gray}--- Fallback a espada ---${COLORS.reset}`);
hero.setStrategy(new SwordStrategy());
hero.attackEnemy(wizard);
