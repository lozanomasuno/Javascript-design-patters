import { COLORS } from '../helpers/colors.ts';

// ============================================================
// TEMPLATE METHOD — Tarea
// ============================================================
// Turno de combate en un RPG.
//
// Cada personaje sigue el mismo esqueleto de turno:
//   1. startTurn()         → mensaje de inicio
//   2. selectTarget()      → elegir objetivo (abstracto)
//   3. performAction()     → acción principal (abstracto)
//   4. useSpecialAbility() → hook — solo si tiene habilidad especial
//   5. endTurn()           → estado final del turno
//
// Subclases: WarriorTurn, MageTurn, RogueTurn
// ============================================================

interface CombatTarget {
  name: string;
  hp: number;
  isShielded: boolean;
}

// --- Clase abstracta ---

abstract class CharacterTurn {
  protected readonly characterName: string;
  protected readonly enemies: CombatTarget[];
  protected selectedTarget: CombatTarget | null = null;

  constructor(name: string, enemies: CombatTarget[]) {
    this.characterName = name;
    this.enemies       = enemies;
  }

  // === TEMPLATE METHOD ===
  takeTurn(): void {
    console.log(`\n${COLORS.cyan}── Turno de ${this.characterName} ──${COLORS.reset}`);
    this.startTurn();
    this.selectTarget();

    if (!this.selectedTarget) {
      console.log(`  ${COLORS.gray}No hay objetivos. Turno saltado.${COLORS.reset}`);
      return;
    }

    this.performAction();

    // Hook — por defecto no hace nada
    if (this.hasSpecialAbility()) {
      this.useSpecialAbility();
    }

    this.endTurn();
  }

  // --- Abstractos ---
  protected abstract getRole(): string;
  protected abstract selectTarget(): void;
  protected abstract performAction(): void;

  // --- Implementación por defecto ---
  protected startTurn(): void {
    const alive = this.enemies.filter(e => e.hp > 0);
    console.log(
      `  ${COLORS.gray}[${this.getRole()}]${COLORS.reset} ` +
      `Enemigos vivos: ${alive.map(e => `${e.name}(${e.hp}HP)`).join(', ')}`
    );
  }

  protected endTurn(): void {
    console.log(`  ${COLORS.gray}Fin del turno de ${this.characterName}.${COLORS.reset}`);
  }

  // --- Hook method ---
  protected hasSpecialAbility(): boolean { return false; }
  protected useSpecialAbility(): void {}

  // --- Utilidad compartida ---
  protected dealDamage(target: CombatTarget, damage: number, action: string): void {
    const effective = target.isShielded ? Math.floor(damage / 2) : damage;
    target.hp = Math.max(0, target.hp - effective);
    const shieldNote = target.isShielded ? ` ${COLORS.gray}(escudo: daño reducido)${COLORS.reset}` : '';
    console.log(
      `  ${COLORS.yellow}${action}${COLORS.reset} → ${target.name} ` +
      `recibe ${COLORS.red}${effective}${COLORS.reset} de daño${shieldNote}. HP: ${target.hp}`
    );
    if (target.hp === 0) {
      console.log(`  ${COLORS.purple}  ¡${target.name} ha caído!${COLORS.reset}`);
    }
  }
}

// --- Guerrero: ataca al enemigo con más HP, doble golpe como especial ---

class WarriorTurn extends CharacterTurn {
  private readonly rage: number; // acumulado de turnos anteriores

  constructor(name: string, enemies: CombatTarget[], rage: number) {
    super(name, enemies);
    this.rage = rage;
  }

  protected getRole(): string { return 'Guerrero'; }

  protected selectTarget(): void {
    // Prioridad: mayor HP entre los vivos
    const alive = this.enemies.filter(e => e.hp > 0);
    this.selectedTarget = alive.reduce(
      (max, e) => e.hp > max.hp ? e : max,
      alive[0]
    ) ?? null;
    if (this.selectedTarget) {
      console.log(`  ${COLORS.green}Objetivo:${COLORS.reset} ${this.selectedTarget.name} (${this.selectedTarget.hp} HP) — el más resistente`);
    }
  }

  protected performAction(): void {
    this.dealDamage(this.selectedTarget!, 25, '⚔️  Tajo de espada');
  }

  protected override hasSpecialAbility(): boolean {
    return this.rage >= 50;
  }

  protected override useSpecialAbility(): void {
    console.log(`  ${COLORS.red}[FURIA]${COLORS.reset} ¡${this.characterName} entra en frenesí!`);
    this.dealDamage(this.selectedTarget!, 35, '💢 Golpe devastador');
  }
}

// --- Mago: ataca al enemigo con menos HP (rematar), AOE como especial ---

class MageTurn extends CharacterTurn {
  private mana: number;

  constructor(name: string, enemies: CombatTarget[], mana: number) {
    super(name, enemies);
    this.mana = mana;
  }

  protected getRole(): string { return 'Mago'; }

  protected selectTarget(): void {
    // Prioridad: menor HP entre los vivos (fácil de rematar)
    const alive = this.enemies.filter(e => e.hp > 0);
    this.selectedTarget = alive.reduce(
      (min, e) => e.hp < min.hp ? e : min,
      alive[0]
    ) ?? null;
    if (this.selectedTarget) {
      console.log(`  ${COLORS.green}Objetivo:${COLORS.reset} ${this.selectedTarget.name} (${this.selectedTarget.hp} HP) — el más débil`);
    }
  }

  protected performAction(): void {
    if (this.mana < 15) {
      console.log(`  ${COLORS.gray}[Mago]${COLORS.reset} Sin maná. Usa bastón (daño físico 8).`);
      this.dealDamage(this.selectedTarget!, 8, '🪄 Golpe de bastón');
      return;
    }
    this.mana -= 15;
    this.dealDamage(this.selectedTarget!, 40, '✨ Proyectil mágico');
  }

  protected override hasSpecialAbility(): boolean {
    return this.mana >= 30;
  }

  protected override useSpecialAbility(): void {
    this.mana -= 30;
    console.log(`  ${COLORS.blue}[AOE]${COLORS.reset} ¡Tormenta arcana! Todos los enemigos reciben daño.`);
    for (const enemy of this.enemies.filter(e => e.hp > 0)) {
      this.dealDamage(enemy, 20, '🌩️  Rayo arcano');
    }
  }

  protected override endTurn(): void {
    console.log(`  ${COLORS.gray}Maná restante: ${this.mana}. Fin del turno de ${this.characterName}.${COLORS.reset}`);
  }
}

// --- Pícaro: ataca al objetivo con escudo (para romperlo), bonus crítico ---

class RogueTurn extends CharacterTurn {
  constructor(name: string, enemies: CombatTarget[]) {
    super(name, enemies);
  }

  protected getRole(): string { return 'Pícaro'; }

  protected selectTarget(): void {
    const alive = this.enemies.filter(e => e.hp > 0);
    // Prioridad: enemigos con escudo (para quitarlo)
    const shielded = alive.filter(e => e.isShielded);
    this.selectedTarget = (shielded.length > 0 ? shielded[0] : alive[0]) ?? null;
    if (this.selectedTarget) {
      const note = this.selectedTarget.isShielded ? '🛡️  con escudo — objetivo prioritario' : 'sin escudo';
      console.log(`  ${COLORS.green}Objetivo:${COLORS.reset} ${this.selectedTarget.name} — ${note}`);
    }
  }

  protected performAction(): void {
    if (this.selectedTarget!.isShielded) {
      // Romper escudo
      this.selectedTarget!.isShielded = false;
      console.log(`  ${COLORS.yellow}🗡️  Ataque furtivo${COLORS.reset} → escudo de ${this.selectedTarget!.name} destruido.`);
      this.dealDamage(this.selectedTarget!, 15, '🗡️  Daño de penetración');
    } else {
      // Crítico sin escudo
      this.dealDamage(this.selectedTarget!, 45, '🗡️  Apuñalada crítica');
    }
  }

  // Sin habilidad especial — hasSpecialAbility() false por defecto
}

// ============================================================
// Demo
// ============================================================

const enemies: CombatTarget[] = [
  { name: 'Orco',  hp: 80, isShielded: true  },
  { name: 'Troll', hp: 120, isShielded: false },
  { name: 'Gnoll', hp: 40,  isShielded: false },
];

const warrior = new WarriorTurn('Thorin', enemies, 60); // rage >= 50 → especial activa
const mage    = new MageTurn('Gandalf', enemies, 80);   // maná 80 → especial activa
const rogue   = new RogueTurn('Kira', enemies);

console.log(`${COLORS.yellow}=== RONDA 1 ===${COLORS.reset}`);
warrior.takeTurn();
mage.takeTurn();
rogue.takeTurn();

console.log(`\n${COLORS.yellow}=== RONDA 2 ===${COLORS.reset}`);
warrior.takeTurn();
mage.takeTurn();
rogue.takeTurn();

console.log(`\n${COLORS.cyan}=== Estado final de los enemigos ===${COLORS.reset}`);
for (const e of enemies) {
  const status = e.hp > 0
    ? `${e.hp} HP ${e.isShielded ? '🛡️' : ''}`
    : `${COLORS.red}Derrotado${COLORS.reset}`;
  console.log(`  ${e.name}: ${status}`);
}
