/**
 * ! Patrón Builder:
 * Es un patrón de diseño creacional que nos permite construir objetos complejos
 * paso a paso.
 *
 * El patrón nos permite producir distintos tipos y representaciones
 * de un objeto empleando el mismo código de construcción.
 *
 * * Es útil cuando necesitamos construir un objeto complejo con muchas partes
 * * y queremos que el proceso de construcción sea independiente de las partes
 * * que lo componen.
 *
 * https://refactoring.guru/es/design-patterns/builder
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Producto ────────────────────────────────────────────────────────────────
// La clase que queremos construir paso a paso.
class Computer {
  public cpu: string = '';
  public ram: string = '';
  public storage: string = '';
  public gpu: string = '';
  public os: string = '';

  describe(): void {
    console.log('%cComputadora configurada:', COLORS.green);
    console.log(`  CPU:     ${this.cpu}`);
    console.log(`  RAM:     ${this.ram}`);
    console.log(`  Storage: ${this.storage}`);
    console.log(`  GPU:     ${this.gpu || 'Integrada'}`);
    console.log(`  OS:      ${this.os || 'Sin SO'}`);
  }
}

// ─── Builder Interface ────────────────────────────────────────────────────────
// Define los pasos de construcción que cada builder concreto debe implementar.
interface IComputerBuilder {
  setCPU(cpu: string): this;
  setRAM(ram: string): this;
  setStorage(storage: string): this;
  setGPU(gpu: string): this;
  setOS(os: string): this;
  build(): Computer;
}

// ─── Builder Concreto ────────────────────────────────────────────────────────
// Implementa los pasos de construcción y ofrece una interfaz fluida (fluent).
class ComputerBuilder implements IComputerBuilder {
  private computer: Computer;

  constructor() {
    this.computer = new Computer();
  }

  setCPU(cpu: string): this {
    this.computer.cpu = cpu;
    return this;
  }

  setRAM(ram: string): this {
    this.computer.ram = ram;
    return this;
  }

  setStorage(storage: string): this {
    this.computer.storage = storage;
    return this;
  }

  setGPU(gpu: string): this {
    this.computer.gpu = gpu;
    return this;
  }

  setOS(os: string): this {
    this.computer.os = os;
    return this;
  }

  // Devuelve el producto terminado y reinicia el builder.
  build(): Computer {
    const result = this.computer;
    this.computer = new Computer(); // reset para la siguiente construcción
    return result;
  }
}

// ─── Director ─────────────────────────────────────────────────────────────────
// El Director orquesta los pasos de construcción para crear configuraciones
// predefinidas. Es opcional, pero centraliza los "recetarios" de construcción.
class ComputerDirector {
  private readonly builder: IComputerBuilder;

  constructor(builder: IComputerBuilder) {
    this.builder = builder;
  }

  buildGamingPC(): Computer {
    return this.builder
      .setCPU('Intel Core i9-14900K')
      .setRAM('64 GB DDR5')
      .setStorage('2 TB NVMe SSD')
      .setGPU('NVIDIA RTX 4090')
      .setOS('Windows 11')
      .build();
  }

  buildOfficePC(): Computer {
    return this.builder
      .setCPU('Intel Core i5-13400')
      .setRAM('16 GB DDR4')
      .setStorage('512 GB SSD')
      .setOS('Ubuntu 24.04 LTS')
      .build();
  }
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
function main() {
  const builder = new ComputerBuilder();
  const director = new ComputerDirector(builder);

  console.log('%c=== PC Gamer (via Director) ===', COLORS.cyan);
  const gamingPC = director.buildGamingPC();
  gamingPC.describe();

  console.log('%c\n=== PC de Oficina (via Director) ===', COLORS.cyan);
  const officePC = director.buildOfficePC();
  officePC.describe();

  // También podemos construir sin Director para configuraciones personalizadas.
  console.log('%c\n=== PC Personalizada (sin Director) ===', COLORS.cyan);
  const customPC = builder
    .setCPU('AMD Ryzen 9 7950X')
    .setRAM('32 GB DDR5')
    .setStorage('1 TB NVMe SSD')
    .setGPU('AMD RX 7900 XTX')
    .build();
  customPC.describe();
}

main();
