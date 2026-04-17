/**
 * ! Singleton:
 * Es un patrón de diseño creacional que garantiza que una clase
 * tenga una única instancia y proporciona un punto de acceso global a ella.
 *
 * * Es útil cuando necesitas controlar el acceso a una única instancia
 * * de una clase, como por ejemplo, en un objeto de base de datos o en un
 * * objeto de configuración.
 *
 * https://refactoring.guru/es/design-patterns/singleton
 */

import { COLORS } from '../helpers/colors.ts';

/**
 * Variante con módulo (module singleton):
 * En TypeScript/Deno, los módulos se ejecutan una sola vez y su estado
 * persiste. Podemos aprovechar eso para un singleton sin clase.
 *
 * La instancia se crea al importar el módulo y queda congelada
 * para evitar modificaciones accidentales.
 */

interface AppConfig {
  readonly appName: string;
  readonly version: string;
  readonly debug: boolean;
  readonly maxConnections: number;
}

// La única instancia: se crea una sola vez cuando el módulo se carga.
const config: AppConfig = Object.freeze({
  appName: 'PatronesApp',
  version: '1.0.0',
  debug: false,
  maxConnections: 10,
});

// Para modificar la config se exporta una función que devuelve una copia
// (inmutabilidad + singleton: los dos patrones combinados).
function getConfig(): AppConfig {
  return config;
}

function main() {
  console.log('%c=== Singleton con módulo: AppConfig ===\n', COLORS.cyan);

  const cfg1 = getConfig();
  const cfg2 = getConfig();

  console.log('%cConfiguración:', COLORS.green);
  console.log(cfg1);

  console.log('%c\n¿Son la misma referencia?', COLORS.orange, cfg1 === cfg2);

  // Intentar mutar la config lanzaría un error en tiempo de ejecución
  // gracias a Object.freeze().
  try {
    // @ts-expect-error: probando que la mutación falla
    cfg1.debug = true;
  } catch {
    console.log('%cIntentar mutar la config lanza un TypeError (modo strict).', COLORS.red);
  }

  console.log('%c\nDebug sigue siendo:', COLORS.gray, cfg1.debug);
}

main();
