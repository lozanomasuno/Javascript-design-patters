import { COLORS } from '../helpers/colors.ts';

// ============================================================
// OBSERVER — Patrón de Comportamiento
// ============================================================
// Define una dependencia uno-a-muchos entre objetos, de modo
// que cuando uno cambia de estado, todos sus dependientes son
// notificados y actualizados automáticamente.
//
// Participantes:
//   Subject    → WeatherStation
//   Observer   → WeatherObserver (interfaz)
//   Observers  → CurrentConditionsDisplay, StatisticsDisplay,
//                ForecastDisplay, HeatAlertDisplay
// ============================================================

// --- Interfaces ---

interface WeatherObserver {
  update(temperature: number, humidity: number, pressure: number): void;
}

interface WeatherSubject {
  subscribe(observer: WeatherObserver): void;
  unsubscribe(observer: WeatherObserver): void;
  notify(): void;
}

// --- Subject concreto ---

class WeatherStation implements WeatherSubject {
  private readonly observers: WeatherObserver[] = [];
  private temperature = 0;
  private humidity = 0;
  private pressure = 1013;

  subscribe(observer: WeatherObserver): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: WeatherObserver): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) this.observers.splice(index, 1);
  }

  notify(): void {
    for (const observer of this.observers) {
      observer.update(this.temperature, this.humidity, this.pressure);
    }
  }

  setMeasurements(temperature: number, humidity: number, pressure: number): void {
    this.temperature = temperature;
    this.humidity = humidity;
    this.pressure = pressure;
    this.notify();
  }
}

// --- Observers concretos ---

class CurrentConditionsDisplay implements WeatherObserver {
  private readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  update(temperature: number, humidity: number, _pressure: number): void {
    console.log(
      `${COLORS.cyan}[${this.name}]${COLORS.reset} ` +
      `${temperature}°C — Humedad: ${humidity}%`
    );
  }
}

class StatisticsDisplay implements WeatherObserver {
  private readonly readings: number[] = [];

  update(temperature: number, _humidity: number, _pressure: number): void {
    this.readings.push(temperature);
    const min = Math.min(...this.readings);
    const max = Math.max(...this.readings);
    const avg = this.readings.reduce((a, b) => a + b, 0) / this.readings.length;
    console.log(
      `${COLORS.blue}[Estadísticas]${COLORS.reset} ` +
      `Min: ${min}°C | Max: ${max}°C | Media: ${avg.toFixed(1)}°C`
    );
  }
}

class ForecastDisplay implements WeatherObserver {
  private lastPressure = 1013;
  private currentPressure = 1013;

  update(_temperature: number, _humidity: number, pressure: number): void {
    this.lastPressure = this.currentPressure;
    this.currentPressure = pressure;

    let forecast: string;
    if (this.currentPressure > this.lastPressure) {
      forecast = 'Mejorando — cielos despejados';
    } else if (this.currentPressure < this.lastPressure) {
      forecast = 'Empeorando — posible lluvia';
    } else {
      forecast = 'Sin cambios significativos';
    }

    console.log(
      `${COLORS.yellow}[Pronóstico]${COLORS.reset} ${forecast} ` +
      `(presión: ${pressure} hPa)`
    );
  }
}

class HeatAlertDisplay implements WeatherObserver {
  private readonly threshold: number;

  constructor(threshold: number) {
    this.threshold = threshold;
  }

  update(temperature: number, _humidity: number, _pressure: number): void {
    if (temperature >= this.threshold) {
      console.log(
        `${COLORS.red}[ALERTA CALOR]${COLORS.reset} ` +
        `¡${temperature}°C supera el umbral de ${this.threshold}°C!`
      );
    }
  }
}

// ============================================================
// Demo
// ============================================================

const station = new WeatherStation();

const mainDisplay = new CurrentConditionsDisplay('Pantalla Principal');
const appDisplay  = new CurrentConditionsDisplay('App Móvil');
const stats       = new StatisticsDisplay();
const forecast    = new ForecastDisplay();
const heatAlert   = new HeatAlertDisplay(35);

station.subscribe(mainDisplay);
station.subscribe(appDisplay);
station.subscribe(stats);
station.subscribe(forecast);
station.subscribe(heatAlert);

console.log(`\n${COLORS.green}=== Medición 1: Mañana (8:00) ===${COLORS.reset}`);
station.setMeasurements(22, 65, 1015);

console.log(`\n${COLORS.green}=== Medición 2: Mediodía (13:00) ===${COLORS.reset}`);
station.setMeasurements(28, 70, 1012);

console.log(`\n${COLORS.gray}--- App Móvil se desuscribe ---${COLORS.reset}`);
station.unsubscribe(appDisplay);

console.log(`\n${COLORS.green}=== Medición 3: Tarde (17:00) — Ola de calor ===${COLORS.reset}`);
station.setMeasurements(38, 45, 1008);

console.log(`\n${COLORS.green}=== Medición 4: Noche (22:00) ===${COLORS.reset}`);
station.setMeasurements(24, 80, 1010);
