/**
 * ! Factory Method:
 * El patrón Factory Method permite crear objetos sin especificar
 * la clase exacta del objeto que se creará.
 *
 * En lugar de eso, delegamos la creación de objetos a subclases o métodos
 * que encapsulan esta lógica.
 *
 * * Es útil cuando una clase no puede anticipar la clase
 * * de objetos que debe crear.
 *
 * https://refactoring.guru/es/design-patterns/factory-method
 *
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Producto: interfaz común ────────────────────────────────────────────────
// Todos los transportes comparten la misma interfaz de entrega.
interface Transport {
  deliver(destination: string): void;
}

// ─── Productos Concretos ─────────────────────────────────────────────────────
class Truck implements Transport {
  deliver(destination: string): void {
    console.log(`%c🚚 Camión entregando por tierra a: ${destination}`, COLORS.orange);
  }
}

class Ship implements Transport {
  deliver(destination: string): void {
    console.log(`%c🚢 Barco entregando por mar a: ${destination}`, COLORS.blue);
  }
}

class Plane implements Transport {
  deliver(destination: string): void {
    console.log(`%c✈️  Avión entregando por aire a: ${destination}`, COLORS.cyan);
  }
}

// ─── Creador (Creator) ───────────────────────────────────────────────────────
// Declara el Factory Method que devuelve un objeto Transport.
// Las subclases se encargan de instanciar el transporte concreto.
abstract class Logistics {
  // El Factory Method — cada subclase lo sobreescribe.
  abstract createTransport(): Transport;

  // Lógica de negocio que usa el producto creado por el Factory Method.
  planDelivery(destination: string): void {
    const transport = this.createTransport();
    console.log('%c\n[Logistics] Preparando envío...', COLORS.gray);
    transport.deliver(destination);
  }
}

// ─── Creadores Concretos ─────────────────────────────────────────────────────
// Cada subclase decide qué tipo de transporte crear.
class RoadLogistics extends Logistics {
  createTransport(): Transport {
    return new Truck();
  }
}

class SeaLogistics extends Logistics {
  createTransport(): Transport {
    return new Ship();
  }
}

class AirLogistics extends Logistics {
  createTransport(): Transport {
    return new Plane();
  }
}

// ─── Función auxiliar de selección ──────────────────────────────────────────
// El cliente trabaja con el creador a través de su interfaz base,
// sin conocer la clase concreta del transporte.
function getLogistics(type: string): Logistics {
  if (type === 'sea') return new SeaLogistics();
  if (type === 'air') return new AirLogistics();
  return new RoadLogistics(); // por defecto: tierra
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
function main() {
  const destination = 'Ciudad de México';

  console.log('%c=== Factory Method: Logística de Transportes ===', COLORS.green);

  const types = ['road', 'sea', 'air'];
  for (const type of types) {
    const logistics = getLogistics(type);
    logistics.planDelivery(destination);
  }
}

main();
