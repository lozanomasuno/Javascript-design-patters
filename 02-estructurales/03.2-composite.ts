/**
 * ! Patrón Composite:
 * Es un patrón de diseño estructural que permite componer objetos en estructuras
 * de árbol para representar jerarquías parte-todo.
 *
 * Composite permite a los clientes tratar objetos individuales (hojas)
 * y composiciones de objetos (ramas) de manera uniforme.
 *
 * * Es útil cuando necesitas representar estructuras jerárquicas como
 * * árboles de archivos, menús anidados u organigramas.
 *
 * https://refactoring.guru/es/design-patterns/composite
 */

/**
 * ! Tarea: Organigrama de empleados
 *
 * Una empresa tiene empleados individuales (hojas) y gerentes (compuestos)
 * que pueden tener otros empleados o gerentes a su cargo.
 *
 * 1. Implementa Employee como hoja: tiene nombre, puesto y salario.
 * 2. Implementa Manager como compuesto: puede agregar subordinados y
 *    calcula el costo total de su equipo (su salario + el de todos sus subordinados).
 * 3. Construye el organigrama y muestra la estructura con print(),
 *    y el costo total con getCost().
 *
 * Salida esperada:
 *  👔 Ana García - CEO ($15000)
 *    👔 Luis Pérez - CTO ($10000)
 *      👤 Carlos Ruiz - Dev Senior ($6000)
 *      👤 María López - Dev Junior ($3500)
 *    👔 Sara Núñez - CFO ($9000)
 *      👤 Pedro Mora - Contador ($4000)
 *  Costo total de la empresa: $47500
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Componente ───────────────────────────────────────────────────────────────
interface OrgComponent {
  getName(): string;
  getCost(): number;
  print(indent?: string): void;
}

// ─── Hoja: Empleado individual ────────────────────────────────────────────────
class Employee implements OrgComponent {
  constructor(
    private readonly name: string,
    private readonly position: string,
    private readonly salary: number,
  ) {}

  getName(): string { return this.name; }
  getCost(): number { return this.salary; }

  print(indent = ''): void {
    console.log(
      `%c${indent}👤 ${this.name} - ${this.position} ($${this.salary})`,
      COLORS.green,
    );
  }
}

// ─── Compuesto: Gerente con equipo ────────────────────────────────────────────
class Manager implements OrgComponent {
  private readonly subordinates: OrgComponent[] = [];

  constructor(
    private readonly name: string,
    private readonly position: string,
    private readonly salary: number,
  ) {}

  getName(): string { return this.name; }

  add(member: OrgComponent): this {
    this.subordinates.push(member);
    return this;
  }

  // Costo propio + costo recursivo de todo el equipo
  getCost(): number {
    return this.subordinates.reduce(
      (total, member) => total + member.getCost(),
      this.salary,
    );
  }

  print(indent = ''): void {
    console.log(
      `%c${indent}👔 ${this.name} - ${this.position} ($${this.salary})`,
      COLORS.cyan,
    );
    for (const member of this.subordinates) {
      member.print(indent + '  ');
    }
  }
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
function main() {
  console.log('%c=== Composite: Organigrama de Empleados ===\n', COLORS.orange);

  // Hojas
  const devSenior  = new Employee('Carlos Ruiz',  'Dev Senior', 6000);
  const devJunior  = new Employee('María López',  'Dev Junior', 3500);
  const contador   = new Employee('Pedro Mora',   'Contador',   4000);

  // Gerentes intermedios
  const cto = new Manager('Luis Pérez',  'CTO', 10000)
    .add(devSenior)
    .add(devJunior);

  const cfo = new Manager('Sara Núñez',  'CFO', 9000)
    .add(contador);

  // Raíz del organigrama
  const ceo = new Manager('Ana García', 'CEO', 15000)
    .add(cto)
    .add(cfo);

  ceo.print();
  console.log(`\n%cCosto total de la empresa: $${ceo.getCost()}`, COLORS.yellow);
}

main();
