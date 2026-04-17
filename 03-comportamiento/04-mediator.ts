/**
 * ! Patrón Mediator:
 * Es un patrón de diseño de comportamiento que reduce las dependencias caóticas
 * entre objetos. El patrón restringe las comunicaciones directas entre objetos
 * y los obliga a colaborar únicamente a través de un objeto mediador.
 *
 * * Es útil cuando un conjunto de objetos se comunican de formas complejas,
 * * resultando en dependencias difíciles de entender y mantener.
 * * El mediador centraliza toda la lógica de comunicación.
 *
 * https://refactoring.guru/es/design-patterns/mediator
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Interfaz Mediator ────────────────────────────────────────────────────────
interface ChatMediator {
  sendMessage(message: string, sender: User): void;
  addUser(user: User): void;
}

// ─── Componente base ──────────────────────────────────────────────────────────
// Cada usuario conoce solo al mediador, no a los demás usuarios.
class User {
  constructor(
    readonly name: string,
    private readonly mediator: ChatMediator,
  ) {}

  send(message: string): void {
    console.log(`%c  [${this.name}] → "${message}"`, COLORS.blue);
    this.mediator.sendMessage(message, this);
  }

  receive(message: string, from: User): void {
    console.log(`%c  [${this.name}] ← recibió de [${from.name}]: "${message}"`, COLORS.green);
  }
}

// ─── Mediador Concreto: ChatRoom ──────────────────────────────────────────────
// Centraliza toda la lógica de distribución de mensajes.
class ChatRoom implements ChatMediator {
  private readonly users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
    console.log(`%c  [ChatRoom] ${user.name} se unió al chat.`, COLORS.gray);
  }

  sendMessage(message: string, sender: User): void {
    // Distribuye el mensaje a todos excepto al emisor
    for (const user of this.users) {
      if (user !== sender) {
        user.receive(message, sender);
      }
    }
  }
}

// ─── Mediador Concreto: ChatRoom con filtro ───────────────────────────────────
// Extiende el comportamiento sin tocar a los usuarios.
class ModerateChatRoom implements ChatMediator {
  private readonly users: User[] = [];
  private readonly bannedWords = ['spam', 'ofensivo', 'prohibido'];

  addUser(user: User): void {
    this.users.push(user);
  }

  sendMessage(message: string, sender: User): void {
    const lower = message.toLowerCase();
    const hasBanned = this.bannedWords.some((w) => lower.includes(w));

    if (hasBanned) {
      console.log(
        `%c  [ChatRoom Moderado] Mensaje de [${sender.name}] bloqueado por contenido inapropiado.`,
        COLORS.red,
      );
      return;
    }

    for (const user of this.users) {
      if (user !== sender) user.receive(message, sender);
    }
  }
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
function main() {
  console.log('%c=== Patrón Mediator: Chat Room ===\n', COLORS.cyan);

  // Chat normal
  const room = new ChatRoom();
  const ana   = new User('Ana',   room);
  const luis  = new User('Luis',  room);
  const marta = new User('Marta', room);

  room.addUser(ana);
  room.addUser(luis);
  room.addUser(marta);

  console.log('%c\n-- Mensajes --', COLORS.gray);
  ana.send('¡Hola a todos!');
  luis.send('Hola Ana, ¿cómo estás?');
  marta.send('¡Buenas tardes!');

  // Chat con moderación
  console.log('%c\n-- Chat Moderado --', COLORS.gray);
  const modRoom = new ModerateChatRoom();
  const pedro = new User('Pedro', modRoom);
  const sofia = new User('Sofia', modRoom);

  modRoom.addUser(pedro);
  modRoom.addUser(sofia);

  pedro.send('¡Hola Sofia!');
  pedro.send('Este es un mensaje spam prohibido');
  sofia.send('¡Hola Pedro!');
}

main();
