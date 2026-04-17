/**
 * ! Patrón Prototype:

 * Es un patrón de diseño creacional que nos permite copiar objetos existentes sin hacer
 * que el código dependa de sus clases.
 * 
 * * Es útil cuando queremos duplicar el contenido, 
 * * el título y el autor de un documento, por ejemplo o cualquier objeto complejo.
 * 
 * https://refactoring.guru/es/design-patterns/prototype
 */

class Pokemon {
  name: string;
  type: string;
  level: number;
  attacks: string[];

  constructor(name: string, type: string, level: number, attacks: string[]) {
    this.name = name;
    this.type = type;
    this.level = level;
    this.attacks = attacks;
  }

  // Método para clonar el Pokémon
  clone(): Pokemon {
    // Copia profunda del arreglo de ataques para evitar referencia compartida.
    return new Pokemon(this.name, this.type, this.level, [...this.attacks]);
  }

  displayInfo(): void {
    console.log(
      `Nombre: ${this.name}\nTipo: ${this.type}\nNivel: ${
        this.level
      }\nAtaques: ${this.attacks.join(', ')}`
    );
  }
}

// Pokémon base
const basePokemon = new Pokemon('Charmander', 'Fuego', 1, ['Llamarada', 'Arañazo']);

// Clon 1: Charmeleon
const clone1 = basePokemon.clone();
clone1.name = 'Charmeleon';
clone1.level = 16;
clone1.attacks.push('Lanzallamas');

// Clon 2: Charizard
const clone2 = basePokemon.clone();
clone2.name = 'Charizard';
clone2.level = 36;
clone2.attacks.push('Lanzallamas', 'Vuelo');

console.log('--- Pokémon base ---');
basePokemon.displayInfo(); // No debe tener "Lanzallamas"

console.log('\n--- Clon 1: Charmeleon ---');
clone1.displayInfo();

console.log('\n--- Clon 2: Charizard ---');
clone2.displayInfo();
