/**
 * ! Patrón Proxy:
 * Es un patrón de diseño estructural que proporciona un sustituto o
 * marcador de posición para otro objeto, controlando el acceso a él.
 *
 * https://refactoring.guru/es/design-patterns/proxy
 */

/**
 * ! Tarea: Protection Proxy para un sistema de archivos seguro
 *
 * Tenemos un FileManager que puede leer y escribir archivos.
 * Necesitamos un SecureFileProxy que controle el acceso según el rol del usuario:
 *
 *  - Rol "admin"  → puede leer Y escribir.
 *  - Rol "editor" → puede leer Y escribir.
 *  - Rol "viewer" → solo puede leer; escribir lanza un error de permisos.
 *  - Rol desconocido → ninguna operación permitida.
 *
 * Además el proxy debe registrar (log) cada operación con su resultado.
 *
 * Salida esperada:
 *  [Proxy] admin  | read  "config.json"  → ✔ contenido: "{ theme: dark }"
 *  [Proxy] admin  | write "config.json"  → ✔ archivo guardado
 *  [Proxy] viewer | read  "config.json"  → ✔ contenido: "{ theme: dark }"
 *  [Proxy] viewer | write "config.json"  → ✘ Permiso denegado: viewers no pueden escribir
 *  [Proxy] hacker | read  "config.json"  → ✘ Acceso denegado: rol desconocido
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Interfaz común ───────────────────────────────────────────────────────────
interface FileManager {
  read(filename: string): string;
  write(filename: string, content: string): void;
}

// ─── Servicio real ────────────────────────────────────────────────────────────
class RealFileManager implements FileManager {
  private readonly files = new Map<string, string>([
    ['config.json',  '{ "theme": "dark" }'],
    ['users.csv',    'id,name,email\n1,Ana,ana@example.com'],
    ['secrets.env',  'DB_PASSWORD=ultra-secret'],
  ]);

  read(filename: string): string {
    return this.files.get(filename) ?? `[Archivo "${filename}" no encontrado]`;
  }

  write(filename: string, content: string): void {
    this.files.set(filename, content);
  }
}

// ─── Protection Proxy ─────────────────────────────────────────────────────────
type Role = 'admin' | 'editor' | 'viewer';

class SecureFileProxy implements FileManager {
  private readonly real = new RealFileManager();
  private readonly writeRoles: Role[] = ['admin', 'editor'];
  private readonly readRoles: Role[]  = ['admin', 'editor', 'viewer'];

  constructor(private readonly role: string) {}

  read(filename: string): string {
    if (!this.readRoles.includes(this.role as Role)) {
      const msg = `Acceso denegado: rol desconocido`;
      this.log('read', filename, false, msg);
      throw new Error(msg);
    }

    const content = this.real.read(filename);
    this.log('read', filename, true, `contenido: "${content}"`);
    return content;
  }

  write(filename: string, content: string): void {
    if (!this.readRoles.includes(this.role as Role)) {
      const msg = `Acceso denegado: rol desconocido`;
      this.log('write', filename, false, msg);
      throw new Error(msg);
    }

    if (!this.writeRoles.includes(this.role as Role)) {
      const msg = `Permiso denegado: viewers no pueden escribir`;
      this.log('write', filename, false, msg);
      throw new Error(msg);
    }

    this.real.write(filename, content);
    this.log('write', filename, true, 'archivo guardado');
  }

  private log(op: string, file: string, ok: boolean, detail: string): void {
    const icon  = ok ? '✔' : '✘';
    const color = ok ? COLORS.green : COLORS.red;
    console.log(
      `%c  [Proxy] ${this.role.padEnd(6)} | ${op.padEnd(5)} "${file}"  → ${icon} ${detail}`,
      color,
    );
  }
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
function tryOperation(label: string, fn: () => void): void {
  try {
    fn();
  } catch {
    // El error ya fue logueado dentro del proxy
  }
}

function main() {
  console.log('%c=== Proxy: Sistema de Archivos Seguro ===\n', COLORS.cyan);

  const admin  = new SecureFileProxy('admin');
  const viewer = new SecureFileProxy('viewer');
  const hacker = new SecureFileProxy('hacker');

  console.log('%c-- Admin --', COLORS.gray);
  tryOperation('admin read',  () => admin.read('config.json'));
  tryOperation('admin write', () => admin.write('config.json', '{ "theme": "light" }'));

  console.log('%c\n-- Viewer --', COLORS.gray);
  tryOperation('viewer read',  () => viewer.read('config.json'));
  tryOperation('viewer write', () => viewer.write('config.json', 'hack'));

  console.log('%c\n-- Hacker (rol desconocido) --', COLORS.gray);
  tryOperation('hacker read',  () => hacker.read('secrets.env'));
  tryOperation('hacker write', () => hacker.write('secrets.env', 'pwned'));
}

main();
