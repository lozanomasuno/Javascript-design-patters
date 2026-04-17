import { COLORS } from '../helpers/colors.ts';

// ============================================================
// STRATEGY — Patrón de Comportamiento
// ============================================================
// Define una familia de algoritmos, encapsula cada uno y los
// hace intercambiables. Permite que el algoritmo varíe
// independientemente de los clientes que lo usan.
//
// Participantes:
//   Context    → Navigator
//   Strategy   → RouteStrategy (interfaz)
//   ConcreteStrategies:
//     CarStrategy, WalkingStrategy,
//     CyclingStrategy, PublicTransportStrategy
// ============================================================

interface RoutePoint {
  name: string;
  lat: number;
  lng: number;
}

interface RouteResult {
  distance: number;  // km
  duration: number;  // minutos
  steps: string[];
}

// --- Interfaz Strategy ---

interface RouteStrategy {
  buildRoute(from: RoutePoint, to: RoutePoint): RouteResult;
  getLabel(): string;
}

// --- Strategies concretas ---

class CarStrategy implements RouteStrategy {
  getLabel(): string { return 'Coche'; }

  buildRoute(from: RoutePoint, to: RoutePoint): RouteResult {
    const distance = haversine(from, to);
    const duration = Math.round(distance / 50 * 60); // 50 km/h media ciudad
    return {
      distance,
      duration,
      steps: [
        `Salir de ${from.name} por la autovía`,
        `Continuar ${(distance * 0.6).toFixed(1)} km por carretera principal`,
        `Tomar el desvío hacia ${to.name}`,
        `Llegar a ${to.name}`,
      ],
    };
  }
}

class WalkingStrategy implements RouteStrategy {
  getLabel(): string { return 'A pie'; }

  buildRoute(from: RoutePoint, to: RoutePoint): RouteResult {
    const distance = haversine(from, to) * 1.2; // rutas peatonales +20%
    const duration = Math.round(distance / 5 * 60);  // 5 km/h
    return {
      distance,
      duration,
      steps: [
        `Salir de ${from.name} hacia el norte`,
        `Cruzar el parque central`,
        `Girar a la derecha en la calle principal`,
        `Llegar a ${to.name} (${distance.toFixed(1)} km a pie)`,
      ],
    };
  }
}

class CyclingStrategy implements RouteStrategy {
  getLabel(): string { return 'Bicicleta'; }

  buildRoute(from: RoutePoint, to: RoutePoint): RouteResult {
    const distance = haversine(from, to) * 1.1; // carriles bici +10%
    const duration = Math.round(distance / 15 * 60); // 15 km/h
    return {
      distance,
      duration,
      steps: [
        `Tomar el carril bici desde ${from.name}`,
        `Seguir la ruta verde ${(distance * 0.5).toFixed(1)} km`,
        `Cruzar el puente peatonal`,
        `Llegar a ${to.name} — aparca la bici`,
      ],
    };
  }
}

class PublicTransportStrategy implements RouteStrategy {
  getLabel(): string { return 'Transporte público'; }

  buildRoute(from: RoutePoint, to: RoutePoint): RouteResult {
    const distance = haversine(from, to);
    const duration = Math.round(distance / 30 * 60) + 15; // 30 km/h + 15 min espera
    return {
      distance,
      duration,
      steps: [
        `Caminar 300 m hasta la parada de bus en ${from.name}`,
        `Tomar el bus L4 — dirección centro`,
        `Transbordar en Estación Central al metro línea 2`,
        `Bajar en parada "${to.name}"`,
        `Caminar 200 m hasta el destino`,
      ],
    };
  }
}

// --- Context ---

class Navigator {
  private strategy: RouteStrategy;

  constructor(strategy: RouteStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: RouteStrategy): void {
    this.strategy = strategy;
    console.log(`${COLORS.cyan}[Navigator]${COLORS.reset} Estrategia cambiada a: ${strategy.getLabel()}`);
  }

  navigate(from: RoutePoint, to: RoutePoint): void {
    console.log(
      `\n${COLORS.green}▶ Ruta [${this.strategy.getLabel()}]:${COLORS.reset} ` +
      `${from.name} → ${to.name}`
    );
    const result = this.strategy.buildRoute(from, to);
    console.log(
      `  ${COLORS.yellow}Distancia:${COLORS.reset} ${result.distance.toFixed(1)} km  ` +
      `${COLORS.yellow}Tiempo estimado:${COLORS.reset} ${result.duration} min`
    );
    console.log(`  ${COLORS.blue}Pasos:${COLORS.reset}`);
    result.steps.forEach((step, i) => console.log(`    ${i + 1}. ${step}`));
  }
}

// --- Utilidad: fórmula Haversine simplificada ---

function haversine(a: RoutePoint, b: RoutePoint): number {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

// ============================================================
// Demo
// ============================================================

const home:   RoutePoint = { name: 'Casa',       lat: 40.4168, lng: -3.7038 };
const office: RoutePoint = { name: 'Oficina',     lat: 40.453,  lng: -3.6883 };
const park:   RoutePoint = { name: 'Parque Retiro', lat: 40.4153, lng: -3.6844 };

const nav = new Navigator(new CarStrategy());

nav.navigate(home, office);

nav.setStrategy(new WalkingStrategy());
nav.navigate(home, park);

nav.setStrategy(new CyclingStrategy());
nav.navigate(home, office);

nav.setStrategy(new PublicTransportStrategy());
nav.navigate(home, office);

// Cambio dinámico según condición (lluvia → coche)
console.log(`\n${COLORS.gray}--- Está lloviendo, cambiamos a coche ---${COLORS.reset}`);
const isRaining = true;
nav.setStrategy(isRaining ? new CarStrategy() : new CyclingStrategy());
nav.navigate(home, park);
