/**
 * ! Patrón Memento:
 * Es un patrón de diseño de comportamiento que permite guardar y restaurar
 * el estado previo de un objeto sin revelar los detalles de su implementación.
 *
 * https://refactoring.guru/es/design-patterns/memento
 */

/**
 * ! Tarea: Sistema de checkpoints para un juego
 *
 * Un jugador avanza por niveles acumulando puntos y vidas.
 * Necesitamos un sistema de checkpoints que permita:
 *
 *  1. Guardar el estado del jugador en cualquier momento (checkpoint).
 *  2. Restaurar el último checkpoint si el jugador muere.
 *  3. Listar todos los checkpoints guardados con su información.
 *
 * Estado del jugador:
 *  - name: string
 *  - level: number
 *  - score: number
 *  - lives: number
 *
 * Salida esperada:
 *  💾 Checkpoint guardado: Nivel 1 | Puntos: 0   | Vidas: 3
 *  💾 Checkpoint guardado: Nivel 2 | Puntos: 500 | Vidas: 3
 *  💾 Checkpoint guardado: Nivel 3 | Puntos: 1200| Vidas: 2
 *  💀 Jugador murió. Restaurando último checkpoint...
 *  ✔ Restaurado: Nivel 3 | Puntos: 1200 | Vidas: 2
 *  📋 Historial de checkpoints:
 *    1. Nivel 1 | Puntos: 0    | Vidas: 3
 *    2. Nivel 2 | Puntos: 500  | Vidas: 3
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Memento ──────────────────────────────────────────────────────────────────
class GameMemento {
  constructor(
    readonly level: number,
    readonly score: number,
    readonly lives: number,
    readonly savedAt: Date = new Date(),
  ) {}

  describe(): string {
    return `Nivel ${this.level} | Puntos: ${String(this.score).padEnd(5)} | Vidas: ${this.lives}`;
  }
}

// ─── Originator: Jugador ──────────────────────────────────────────────────────
class Player {
  private level = 1;
  private score = 0;
  private lives = 3;

  constructor(readonly name: string) {}

  advanceLevel(): void  { this.level++; }
  addScore(points: number): void { this.score += points; }
  loseLife(): void      { this.lives = Math.max(0, this.lives - 1); }

  isDead(): boolean { return this.lives === 0; }

  // Crea un snapshot del estado actual
  checkpoint(): GameMemento {
    return new GameMemento(this.level, this.score, this.lives);
  }

  // Restaura el estado desde un snapshot
  restore(memento: GameMemento): void {
    this.level = memento.level;
    this.score = memento.score;
    this.lives = memento.lives;
  }

  display(): void {
    console.log(
      `%c  [${this.name}] Nivel: ${this.level} | Puntos: ${this.score} | Vidas: ${this.lives}`,
      COLORS.cyan,
    );
  }
}

// ─── Caretaker: Gestor de Checkpoints ────────────────────────────────────────
class CheckpointManager {
  private readonly checkpoints: GameMemento[] = [];

  save(player: Player): void {
    const memento = player.checkpoint();
    this.checkpoints.push(memento);
    console.log(`%c  💾 Checkpoint guardado: ${memento.describe()}`, COLORS.yellow);
  }

  // Restaura y elimina el último checkpoint
  restore(player: Player): boolean {
    const memento = this.checkpoints.at(-1);
    if (!memento) {
      console.log('%c  ⚠ No hay checkpoints disponibles.', COLORS.red);
      return false;
    }
    player.restore(memento);
    console.log(`%c  ✔ Restaurado: ${memento.describe()}`, COLORS.green);
    return true;
  }

  printHistory(): void {
    console.log('%c  📋 Historial de checkpoints:', COLORS.orange);
    if (this.checkpoints.length === 0) {
      console.log('%c    (vacío)', COLORS.gray);
      return;
    }
    this.checkpoints.forEach((m, i) => {
      console.log(`%c    ${i + 1}. ${m.describe()}`, COLORS.gray);
    });
  }

  get count(): number { return this.checkpoints.length; }
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
function main() {
  console.log('%c=== Memento: Checkpoints de Videojuego ===\n', COLORS.cyan);

  const player  = new Player('Carlos');
  const manager = new CheckpointManager();

  // Nivel 1 — guardar checkpoint
  manager.save(player);

  // Avanzar al nivel 2
  player.advanceLevel();
  player.addScore(500);
  manager.save(player);

  // Avanzar al nivel 3 y perder una vida
  player.advanceLevel();
  player.addScore(700);
  player.loseLife();
  manager.save(player);

  // El jugador juega más sin guardar...
  player.addScore(300);
  player.loseLife();
  player.loseLife();

  console.log('%c\n-- Estado antes de morir --', COLORS.gray);
  player.display();

  // Jugador muere
  console.log('%c\n💀 Jugador murió. Restaurando último checkpoint...', COLORS.red);
  manager.restore(player);
  player.display();

  console.log('');
  manager.printHistory();
}

main();
