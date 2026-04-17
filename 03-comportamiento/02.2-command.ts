/**
 * ! Patrón Command:
 * Es un patrón de diseño de comportamiento que convierte una solicitud
 * en un objeto independiente que contiene toda la información sobre dicha solicitud.
 *
 * https://refactoring.guru/es/design-patterns/command
 */

/**
 * ! Tarea: Control remoto de dispositivos del hogar
 *
 * Tenemos dispositivos del hogar (luz, ventilador, TV) que se controlan
 * mediante un control remoto con botones programables.
 *
 * 1. Implementa los receptores: Light, Fan, Television.
 * 2. Implementa comandos concretos con execute() y undo() para cada dispositivo.
 * 3. Implementa RemoteControl con slots programables, un botón de undo global
 *    y un macro-comando que ejecuta varios comandos a la vez.
 *
 * Salida esperada:
 *  [Luz]       Encendida 💡
 *  [Ventilador] Velocidad: alta 🌀
 *  [TV]        Encendida 📺  Canal: 5
 *  --- MACRO APAGAR TODO ---
 *  [TV]        Apagada
 *  [Ventilador] Apagado
 *  [Luz]       Apagada
 *  --- UNDO macro ---
 *  [Luz]       Encendida 💡
 *  [Ventilador] Velocidad: alta 🌀
 *  [TV]        Encendida 📺  Canal: 5
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Interfaz Command ─────────────────────────────────────────────────────────
interface Command {
  execute(): void;
  undo(): void;
}

// ─── Receptores ───────────────────────────────────────────────────────────────
class Light {
  private on = false;

  turnOn(): void {
    this.on = true;
    console.log('%c  [Luz]        Encendida 💡', COLORS.yellow);
  }

  turnOff(): void {
    this.on = false;
    console.log('%c  [Luz]        Apagada', COLORS.gray);
  }

  isOn(): boolean { return this.on; }
}

class Fan {
  private speed: 'off' | 'low' | 'medium' | 'high' = 'off';

  setSpeed(speed: 'off' | 'low' | 'medium' | 'high'): void {
    this.speed = speed;
    if (speed === 'off') {
      console.log('%c  [Ventilador] Apagado', COLORS.gray);
    } else {
      console.log(`%c  [Ventilador] Velocidad: ${speed} 🌀`, COLORS.blue);
    }
  }

  getSpeed(): 'off' | 'low' | 'medium' | 'high' { return this.speed; }
}

class Television {
  private on = false;
  private channel = 1;

  turnOn(channel = this.channel): void {
    this.on = true;
    this.channel = channel;
    console.log(`%c  [TV]         Encendida 📺  Canal: ${this.channel}`, COLORS.cyan);
  }

  turnOff(): void {
    this.on = false;
    console.log('%c  [TV]         Apagada', COLORS.gray);
  }

  getChannel(): number { return this.channel; }
  isOn(): boolean { return this.on; }
}

// ─── Comandos Concretos ───────────────────────────────────────────────────────
class LightOnCommand implements Command {
  constructor(private readonly light: Light) {}
  execute(): void { this.light.turnOn(); }
  undo(): void    { this.light.turnOff(); }
}

class LightOffCommand implements Command {
  constructor(private readonly light: Light) {}
  execute(): void { this.light.turnOff(); }
  undo(): void    { this.light.turnOn(); }
}

class FanSpeedCommand implements Command {
  private previousSpeed: 'off' | 'low' | 'medium' | 'high' = 'off';

  constructor(
    private readonly fan: Fan,
    private readonly speed: 'off' | 'low' | 'medium' | 'high',
  ) {}

  execute(): void {
    this.previousSpeed = this.fan.getSpeed();
    this.fan.setSpeed(this.speed);
  }

  undo(): void { this.fan.setSpeed(this.previousSpeed); }
}

class TvOnCommand implements Command {
  constructor(
    private readonly tv: Television,
    private readonly channel: number,
  ) {}
  execute(): void { this.tv.turnOn(this.channel); }
  undo(): void    { this.tv.turnOff(); }
}

class TvOffCommand implements Command {
  private previousChannel = 1;
  constructor(private readonly tv: Television) {}
  execute(): void {
    this.previousChannel = this.tv.getChannel();
    this.tv.turnOff();
  }
  undo(): void { this.tv.turnOn(this.previousChannel); }
}

// ─── Macro Command ────────────────────────────────────────────────────────────
// Ejecuta varios comandos como si fueran uno solo.
class MacroCommand implements Command {
  constructor(private readonly commands: Command[]) {}

  execute(): void {
    for (const cmd of this.commands) cmd.execute();
  }

  undo(): void {
    // Deshacer en orden inverso
    for (const cmd of [...this.commands].reverse()) cmd.undo();
  }
}

// ─── Invocador: Control Remoto ────────────────────────────────────────────────
class RemoteControl {
  private readonly slots: Map<string, Command> = new Map();
  private lastCommand: Command | null = null;

  setSlot(name: string, command: Command): void {
    this.slots.set(name, command);
  }

  press(slotName: string): void {
    const command = this.slots.get(slotName);
    if (!command) {
      console.log(`%c  [Remote] Slot "${slotName}" no configurado`, COLORS.red);
      return;
    }
    command.execute();
    this.lastCommand = command;
  }

  undo(): void {
    if (!this.lastCommand) {
      console.log('%c  [Remote] Nada que deshacer', COLORS.gray);
      return;
    }
    this.lastCommand.undo();
    this.lastCommand = null;
  }
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
function main() {
  console.log('%c=== Command: Control Remoto del Hogar ===\n', COLORS.cyan);

  const light = new Light();
  const fan   = new Fan();
  const tv    = new Television();

  const remote = new RemoteControl();

  remote.setSlot('luz-on',   new LightOnCommand(light));
  remote.setSlot('luz-off',  new LightOffCommand(light));
  remote.setSlot('fan-alta', new FanSpeedCommand(fan, 'high'));
  remote.setSlot('fan-off',  new FanSpeedCommand(fan, 'off'));
  remote.setSlot('tv-on',    new TvOnCommand(tv, 5));
  remote.setSlot('tv-off',   new TvOffCommand(tv));

  // Macro: apagar todo de golpe
  const apagarTodo = new MacroCommand([
    new TvOffCommand(tv),
    new FanSpeedCommand(fan, 'off'),
    new LightOffCommand(light),
  ]);
  remote.setSlot('apagar-todo', apagarTodo);

  console.log('%c-- Encender dispositivos --', COLORS.gray);
  remote.press('luz-on');
  remote.press('fan-alta');
  remote.press('tv-on');

  console.log('%c\n--- MACRO APAGAR TODO ---', COLORS.orange);
  remote.press('apagar-todo');

  console.log('%c\n--- UNDO macro ---', COLORS.orange);
  remote.undo();
}

main();
