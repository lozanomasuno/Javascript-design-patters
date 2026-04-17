/**
 * ! Patrón Proxy:
 * Es un patrón de diseño estructural que proporciona un sustituto o
 * marcador de posición para otro objeto. Un Proxy controla el acceso
 * al objeto original, permitiendo hacer algo antes o después de que
 * la solicitud llegue al objeto real.
 *
 * Tipos de Proxy más comunes:
 *  - Virtual Proxy   → inicialización diferida (lazy loading).
 *  - Protection Proxy → control de acceso según permisos.
 *  - Caching Proxy   → guarda resultados para evitar trabajo repetido.
 *  - Logging Proxy   → registra llamadas sin modificar el objeto real.
 *
 * * Es útil cuando necesitas controlar el acceso a un objeto sin cambiar
 * * su clase, o añadir lógica transversal (caché, logs, permisos).
 *
 * https://refactoring.guru/es/design-patterns/proxy
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Interfaz común ───────────────────────────────────────────────────────────
// El Proxy y el objeto real implementan la misma interfaz;
// el cliente no nota la diferencia.
interface DataService {
  fetchData(query: string): string;
}

// ─── Servicio Real ────────────────────────────────────────────────────────────
// Operación costosa (simula llamada a una BD o API externa).
class RealDataService implements DataService {
  fetchData(query: string): string {
    console.log(`%c  [RealDataService] Ejecutando consulta: "${query}" (costoso)`, COLORS.orange);
    // Simulamos latencia / trabajo pesado
    return `Resultados de: "${query}"`;
  }
}

// ─── Caching Proxy ────────────────────────────────────────────────────────────
// Misma interfaz que el real; agrega caché transparente al cliente.
class CachingProxy implements DataService {
  private readonly real  = new RealDataService();
  private readonly cache = new Map<string, string>();

  fetchData(query: string): string {
    if (this.cache.has(query)) {
      console.log(`%c  [CachingProxy] Cache HIT para: "${query}"`, COLORS.green);
      return this.cache.get(query)!;
    }

    console.log(`%c  [CachingProxy] Cache MISS — delegando al servicio real...`, COLORS.yellow);
    const result = this.real.fetchData(query);
    this.cache.set(query, result);
    return result;
  }

  get cacheSize(): number { return this.cache.size; }
}

// ─── Logging Proxy ────────────────────────────────────────────────────────────
// Agrega logging sin tocar RealDataService ni CachingProxy.
class LoggingProxy implements DataService {
  private callCount = 0;

  constructor(private readonly service: DataService) {}

  fetchData(query: string): string {
    this.callCount++;
    console.log(`%c  [LoggingProxy] Llamada #${this.callCount} → fetchData("${query}")`, COLORS.blue);
    const result = this.service.fetchData(query);
    console.log(`%c  [LoggingProxy] Respuesta: "${result}"`, COLORS.blue);
    return result;
  }
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
// El cliente solo conoce DataService; no sabe cuántos proxies hay en la cadena.
function clientCode(service: DataService, query: string): void {
  service.fetchData(query);
}

function main() {
  console.log('%c=== Patrón Proxy: DataService con Caché y Logging ===\n', COLORS.cyan);

  // Cadena: LoggingProxy → CachingProxy → RealDataService
  const cache   = new CachingProxy();
  const service = new LoggingProxy(cache);

  console.log('%c-- Primera llamada (cache miss) --', COLORS.gray);
  clientCode(service, 'SELECT * FROM users');

  console.log('%c\n-- Segunda llamada misma consulta (cache hit) --', COLORS.gray);
  clientCode(service, 'SELECT * FROM users');

  console.log('%c\n-- Tercera llamada diferente consulta (cache miss) --', COLORS.gray);
  clientCode(service, 'SELECT * FROM orders');

  console.log(`\n%cEntradas en caché: ${cache.cacheSize}`, COLORS.orange);
}

main();
