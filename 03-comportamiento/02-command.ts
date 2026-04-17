/**
 * ! Patrón Command:
 * Es un patrón de diseño de comportamiento que convierte una solicitud
 * en un objeto independiente que contiene toda la información sobre dicha solicitud.
 *
 * Esta transformación permite parametrizar métodos con diferentes solicitudes,
 * retrasar o poner en cola la ejecución, y soportar operaciones reversibles (undo).
 *
 * * Es útil cuando necesitas operaciones deshacer/rehacer, colas de tareas,
 * * o desacoplar al invocador del receptor de una acción.
 *
 * https://refactoring.guru/es/design-patterns/command
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Interfaz Command ─────────────────────────────────────────────────────────
interface Command {
  execute(): void;
  undo(): void;
}

// ─── Receptor ─────────────────────────────────────────────────────────────────
// El objeto que realiza el trabajo real.
class TextEditor {
  private content = '';

  write(text: string): void {
    this.content += text;
  }

  delete(length: number): void {
    this.content = this.content.slice(0, -length);
  }

  getContent(): string {
    return this.content;
  }
}

// ─── Comandos Concretos ───────────────────────────────────────────────────────
class WriteCommand implements Command {
  constructor(
    private readonly editor: TextEditor,
    private readonly text: string,
  ) {}

  execute(): void {
    this.editor.write(this.text);
    console.log(`%c  [WriteCommand] Escribió: "${this.text}"`, COLORS.green);
  }

  undo(): void {
    this.editor.delete(this.text.length);
    console.log(`%c  [WriteCommand] Deshizo escritura de: "${this.text}"`, COLORS.yellow);
  }
}

class DeleteCommand implements Command {
  private deleted = '';

  constructor(
    private readonly editor: TextEditor,
    private readonly length: number,
  ) {}

  execute(): void {
    const content = this.editor.getContent();
    this.deleted = content.slice(-this.length);
    this.editor.delete(this.length);
    console.log(`%c  [DeleteCommand] Eliminó: "${this.deleted}"`, COLORS.red);
  }

  undo(): void {
    this.editor.write(this.deleted);
    console.log(`%c  [DeleteCommand] Restauró: "${this.deleted}"`, COLORS.yellow);
  }
}

// ─── Invocador ────────────────────────────────────────────────────────────────
// Almacena y ejecuta comandos; mantiene el historial para undo/redo.
class CommandHistory {
  private readonly history: Command[] = [];
  private readonly redoStack: Command[] = [];

  execute(command: Command): void {
    command.execute();
    this.history.push(command);
    this.redoStack.length = 0; // nueva acción borra el redo stack
  }

  undo(): void {
    const command = this.history.pop();
    if (!command) {
      console.log('%c  [History] Nada que deshacer.', COLORS.gray);
      return;
    }
    command.undo();
    this.redoStack.push(command);
  }

  redo(): void {
    const command = this.redoStack.pop();
    if (!command) {
      console.log('%c  [History] Nada que rehacer.', COLORS.gray);
      return;
    }
    command.execute();
    this.history.push(command);
  }
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
function printState(editor: TextEditor): void {
  console.log(`%c  Estado: "${editor.getContent()}"`, COLORS.cyan);
}

function main() {
  console.log('%c=== Patrón Command: Editor de Texto con Undo/Redo ===\n', COLORS.cyan);

  const editor  = new TextEditor();
  const history = new CommandHistory();

  console.log('%c-- Escribiendo --', COLORS.gray);
  history.execute(new WriteCommand(editor, 'Hola'));
  history.execute(new WriteCommand(editor, ', mundo'));
  history.execute(new WriteCommand(editor, '!'));
  printState(editor);

  console.log('%c\n-- Undo x2 --', COLORS.gray);
  history.undo();
  printState(editor);
  history.undo();
  printState(editor);

  console.log('%c\n-- Redo x1 --', COLORS.gray);
  history.redo();
  printState(editor);

  console.log('%c\n-- Eliminar 5 caracteres --', COLORS.gray);
  history.execute(new DeleteCommand(editor, 5));
  printState(editor);

  console.log('%c\n-- Undo eliminación --', COLORS.gray);
  history.undo();
  printState(editor);
}

main();
