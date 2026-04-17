import { COLORS } from '../helpers/colors.ts';

// ============================================================
// TEMPLATE METHOD — Patrón de Comportamiento
// ============================================================
// Define el esqueleto de un algoritmo en la clase base,
// delegando algunos pasos a las subclases. Las subclases
// pueden redefinir ciertos pasos sin cambiar la estructura.
//
// Principio de Hollywood: "No nos llames, nosotros te llamamos."
//
// Participantes:
//   AbstractClass  → DataPipeline
//   ConcreteClasses→ CSVPipeline, JSONPipeline, DatabasePipeline
//
// Template method: pipeline.run()
// Pasos abstractos: connect(), extract(), parse()
// Pasos con implementación default: validate(), transform()
// Hook method: shouldSendAlert() → opcional en subclases
// ============================================================

interface DataRecord {
  id: number;
  value: string;
  timestamp: string;
}

// --- Clase abstracta (AbstractClass) ---

abstract class DataPipeline {
  private records: DataRecord[] = [];

  // === TEMPLATE METHOD ===
  // El esqueleto del algoritmo — no se puede sobrescribir (final en otros lenguajes)
  run(): void {
    console.log(`\n${COLORS.cyan}[Pipeline: ${this.getLabel()}]${COLORS.reset} Iniciando...`);
    this.connect();
    this.records = this.extract();
    const valid = this.validate(this.records);
    const transformed = this.transform(valid);
    const parsed = this.parse(transformed);
    this.report(parsed);

    // Hook — solo actúa si la subclase lo activa
    if (this.shouldSendAlert(parsed)) {
      this.sendAlert(parsed.length);
    }

    this.disconnect();
    console.log(`${COLORS.green}[Pipeline: ${this.getLabel()}]${COLORS.reset} Completado. ${parsed.length} registros procesados.\n`);
  }

  // --- Pasos abstractos (OBLIGATORIO implementar) ---
  protected abstract getLabel(): string;
  protected abstract connect(): void;
  protected abstract extract(): DataRecord[];
  protected abstract parse(records: DataRecord[]): DataRecord[];

  // --- Pasos con implementación por defecto (se pueden sobreescribir) ---
  protected validate(records: DataRecord[]): DataRecord[] {
    const valid = records.filter(r => r.value.trim() !== '');
    const skipped = records.length - valid.length;
    if (skipped > 0) {
      console.log(`  ${COLORS.yellow}[Validate]${COLORS.reset} Descartados ${skipped} registros vacíos.`);
    }
    return valid;
  }

  protected transform(records: DataRecord[]): DataRecord[] {
    // Por defecto normaliza el valor a mayúsculas
    return records.map(r => ({ ...r, value: r.value.toUpperCase() }));
  }

  protected report(records: DataRecord[]): void {
    console.log(`  ${COLORS.blue}[Report]${COLORS.reset} Muestra de datos (primeros 3):`);
    records.slice(0, 3).forEach(r =>
      console.log(`    #${r.id} | ${r.value} | ${r.timestamp}`)
    );
  }

  protected disconnect(): void {
    console.log(`  ${COLORS.gray}[Disconnect]${COLORS.reset} Conexión cerrada.`);
  }

  // --- Hook method (opcional — por defecto no hace nada) ---
  protected shouldSendAlert(_records: DataRecord[]): boolean {
    return false;
  }

  private sendAlert(count: number): void {
    console.log(`  ${COLORS.red}[ALERTA]${COLORS.reset} Volumen inusual de datos: ${count} registros.`);
  }
}

// --- Subclase concreta 1: CSV ---

class CSVPipeline extends DataPipeline {
  private readonly filePath: string;

  constructor(filePath: string) {
    super();
    this.filePath = filePath;
  }

  protected getLabel(): string { return `CSV (${this.filePath})`; }

  protected connect(): void {
    console.log(`  ${COLORS.green}[Connect]${COLORS.reset} Abriendo archivo CSV: ${this.filePath}`);
  }

  protected extract(): DataRecord[] {
    console.log(`  ${COLORS.green}[Extract]${COLORS.reset} Leyendo filas del CSV...`);
    // Simulamos filas CSV
    return [
      { id: 1, value: 'ventas_enero', timestamp: '2024-01-31' },
      { id: 2, value: '',             timestamp: '2024-02-01' }, // vacío → se descarta
      { id: 3, value: 'ventas_febrero', timestamp: '2024-02-28' },
      { id: 4, value: 'ventas_marzo', timestamp: '2024-03-31' },
    ];
  }

  protected parse(records: DataRecord[]): DataRecord[] {
    console.log(`  ${COLORS.green}[Parse]${COLORS.reset} Parseando ${records.length} filas CSV...`);
    return records.map(r => ({ ...r, value: r.value.replace(/_/g, ' ') }));
  }
}

// --- Subclase concreta 2: JSON API ---

class JSONApiPipeline extends DataPipeline {
  private readonly endpoint: string;

  constructor(endpoint: string) {
    super();
    this.endpoint = endpoint;
  }

  protected getLabel(): string { return `JSON API (${this.endpoint})`; }

  protected connect(): void {
    console.log(`  ${COLORS.green}[Connect]${COLORS.reset} Conectando a ${this.endpoint}...`);
  }

  protected extract(): DataRecord[] {
    console.log(`  ${COLORS.green}[Extract]${COLORS.reset} GET ${this.endpoint}/records`);
    return [
      { id: 10, value: 'order_A', timestamp: '2024-04-01T10:00Z' },
      { id: 11, value: 'order_B', timestamp: '2024-04-01T11:30Z' },
      { id: 12, value: 'order_C', timestamp: '2024-04-01T12:45Z' },
      { id: 13, value: 'order_D', timestamp: '2024-04-01T13:00Z' },
      { id: 14, value: 'order_E', timestamp: '2024-04-01T14:20Z' },
    ];
  }

  protected parse(records: DataRecord[]): DataRecord[] {
    console.log(`  ${COLORS.green}[Parse]${COLORS.reset} Deserializando JSON (${records.length} objetos)...`);
    return records.map(r => ({ ...r, value: `[API] ${r.value}` }));
  }

  // Override del transform: JSON no cambia a mayúsculas, añade prefijo
  protected override transform(records: DataRecord[]): DataRecord[] {
    return records.map(r => ({ ...r, value: `✓ ${r.value}` }));
  }

  // Hook activado: muchos registros = alerta
  protected override shouldSendAlert(records: DataRecord[]): boolean {
    return records.length > 4;
  }
}

// --- Subclase concreta 3: Base de datos ---

class DatabasePipeline extends DataPipeline {
  private readonly connectionString: string;
  private readonly query: string;

  constructor(connectionString: string, query: string) {
    super();
    this.connectionString = connectionString;
    this.query = query;
  }

  protected getLabel(): string { return 'Database'; }

  protected connect(): void {
    console.log(`  ${COLORS.green}[Connect]${COLORS.reset} Abriendo conexión: ${this.connectionString}`);
  }

  protected extract(): DataRecord[] {
    console.log(`  ${COLORS.green}[Extract]${COLORS.reset} Ejecutando: ${this.query}`);
    return [
      { id: 100, value: 'producto_alpha', timestamp: '2024-05-01' },
      { id: 101, value: 'producto_beta',  timestamp: '2024-05-02' },
      { id: 102, value: '',               timestamp: '2024-05-03' }, // vacío
    ];
  }

  protected parse(records: DataRecord[]): DataRecord[] {
    console.log(`  ${COLORS.green}[Parse]${COLORS.reset} Mapeando filas → DataRecord (${records.length} rows)`);
    return records;
  }

  // Override: validación más estricta — rechaza también IDs impares
  protected override validate(records: DataRecord[]): DataRecord[] {
    const base = super.validate(records);
    const valid = base.filter(r => r.id % 2 === 0);
    const extra = base.length - valid.length;
    if (extra > 0) {
      console.log(`  ${COLORS.yellow}[Validate DB]${COLORS.reset} Filtrados ${extra} registros con ID impar.`);
    }
    return valid;
  }

  protected override disconnect(): void {
    console.log(`  ${COLORS.gray}[Disconnect]${COLORS.reset} Transacción comprometida. Conexión cerrada.`);
  }
}

// ============================================================
// Demo
// ============================================================

const pipelines: DataPipeline[] = [
  new CSVPipeline('data/ventas-2024.csv'),
  new JSONApiPipeline('https://api.example.com/v1'),
  new DatabasePipeline('postgres://prod:5432/store', 'SELECT * FROM products WHERE active = true'),
];

for (const pipeline of pipelines) {
  pipeline.run();
}
