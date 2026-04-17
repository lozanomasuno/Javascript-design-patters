/**
 * ! Patrón Memento:
 * Es un patrón de diseño de comportamiento que permite guardar y restaurar
 * el estado previo de un objeto sin revelar los detalles de su implementación.
 *
 * Participantes:
 *  - Originator  → el objeto cuyo estado queremos guardar.
 *  - Memento     → la "foto" inmutable del estado en un momento dado.
 *  - Caretaker   → almacena los mementos sin leer su contenido.
 *
 * * Es útil para implementar undo/redo, checkpoints de juego,
 * * snapshots de configuración, etc.
 *
 * https://refactoring.guru/es/design-patterns/memento
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Memento ──────────────────────────────────────────────────────────────────
// Inmutable: nadie fuera del Originator puede modificar su estado.
class EditorMemento {
  constructor(
    private readonly content: string,
    private readonly cursorPos: number,
    private readonly timestamp: Date,
  ) {}

  getContent(): string   { return this.content; }
  getCursorPos(): number { return this.cursorPos; }

  getLabel(): string {
    return `[${this.timestamp.toLocaleTimeString()}] "${this.content.slice(0, 20)}${this.content.length > 20 ? '…' : ''}"`;
  }
}

// ─── Originator ───────────────────────────────────────────────────────────────
// El editor cuyo estado queremos poder deshacer.
class TextEditor {
  private content   = '';
  private cursorPos = 0;

  type(text: string): void {
    this.content = this.content.slice(0, this.cursorPos) + text +
                   this.content.slice(this.cursorPos);
    this.cursorPos += text.length;
  }

  moveCursor(pos: number): void {
    this.cursorPos = Math.max(0, Math.min(pos, this.content.length));
  }

  deleteChar(): void {
    if (this.cursorPos === 0) return;
    this.content = this.content.slice(0, this.cursorPos - 1) +
                   this.content.slice(this.cursorPos);
    this.cursorPos--;
  }

  // Crea un snapshot del estado actual
  save(): EditorMemento {
    return new EditorMemento(this.content, this.cursorPos, new Date());
  }

  // Restaura el estado desde un snapshot
  restore(memento: EditorMemento): void {
    this.content   = memento.getContent();
    this.cursorPos = memento.getCursorPos();
  }

  display(): void {
    const before = this.content.slice(0, this.cursorPos);
    const after  = this.content.slice(this.cursorPos);
    console.log(`%c  Contenido : "${before}|${after}"`, COLORS.green);
    console.log(`%c  Cursor    : posición ${this.cursorPos}`, COLORS.gray);
  }
}

// ─── Caretaker ────────────────────────────────────────────────────────────────
// Gestiona el historial sin conocer el contenido de los mementos.
class History {
  private readonly snapshots: EditorMemento[] = [];

  push(memento: EditorMemento): void {
    this.snapshots.push(memento);
    console.log(`%c  [History] Guardado: ${memento.getLabel()}`, COLORS.yellow);
  }

  pop(): EditorMemento | undefined {
    return this.snapshots.pop();
  }

  get size(): number { return this.snapshots.length; }
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
function main() {
  console.log('%c=== Patrón Memento: Editor de Texto ===\n', COLORS.cyan);

  const editor  = new TextEditor();
  const history = new History();

  // Escribir y guardar puntos de restauración
  console.log('%c-- Estado inicial --', COLORS.gray);
  history.push(editor.save());
  editor.display();

  console.log('%c\n-- Escribir "Hola" --', COLORS.gray);
  editor.type('Hola');
  history.push(editor.save());
  editor.display();

  console.log('%c\n-- Escribir ", mundo" --', COLORS.gray);
  editor.type(', mundo');
  history.push(editor.save());
  editor.display();

  console.log('%c\n-- Escribir "!" --', COLORS.gray);
  editor.type('!');
  editor.display();

  // Deshacer sin guardar snapshot del "!"
  console.log('%c\n-- Undo (volver a "Hola, mundo") --', COLORS.gray);
  const snap = history.pop();
  if (snap) editor.restore(snap);
  editor.display();

  console.log('%c\n-- Undo (volver a "Hola") --', COLORS.gray);
  const snap2 = history.pop();
  if (snap2) editor.restore(snap2);
  editor.display();

  console.log('%c\n-- Undo (volver al inicio) --', COLORS.gray);
  const snap3 = history.pop();
  if (snap3) editor.restore(snap3);
  editor.display();

  console.log(`\n%cSnapshots restantes en historial: ${history.size}`, COLORS.orange);
}

main();
