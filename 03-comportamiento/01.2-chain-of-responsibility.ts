/**
 * ! Patrón Chain of Responsibility:
 * Es un patrón de diseño de comportamiento que permite pasar solicitudes
 * a lo largo de una cadena de manejadores.
 *
 * https://refactoring.guru/es/design-patterns/chain-of-responsibility
 */

/**
 * ! Tarea: Pipeline de validación de formulario
 *
 * Al registrar un usuario se deben aplicar varias validaciones en orden:
 *  1. LengthValidator     → nombre mínimo 3 caracteres, máximo 50.
 *  2. EmailValidator      → email debe contener "@" y ".".
 *  3. AgeValidator        → edad entre 18 y 120.
 *  4. PasswordValidator   → contraseña mínimo 8 caracteres, al menos un número.
 *
 * Si una validación falla, la cadena se detiene y muestra el error.
 * Si todas pasan, el usuario queda registrado.
 *
 * Salida esperada:
 *  ✘ Nombre demasiado corto (mínimo 3 caracteres)
 *  ✘ Email inválido
 *  ✘ Edad fuera de rango (18-120)
 *  ✘ Contraseña inválida (mínimo 8 caracteres con al menos un número)
 *  ✔ Usuario registrado: { name: "Ana García", email: "ana@example.com", age: 28 }
 */

import { COLORS } from '../helpers/colors.ts';

interface UserData {
  name: string;
  email: string;
  age: number;
  password: string;
}

// ─── Manejador Base ───────────────────────────────────────────────────────────
abstract class Validator {
  private next: Validator | null = null;

  setNext(validator: Validator): Validator {
    this.next = validator;
    return validator;
  }

  protected passToNext(data: UserData): boolean {
    if (this.next) return this.next.validate(data);
    // Si no hay siguiente y llegamos aquí, todas las validaciones pasaron
    console.log(
      `%c✔ Usuario registrado: ${JSON.stringify({ name: data.name, email: data.email, age: data.age })}`,
      COLORS.green,
    );
    return true;
  }

  abstract validate(data: UserData): boolean;
}

// ─── Validadores Concretos ────────────────────────────────────────────────────
class LengthValidator extends Validator {
  validate(data: UserData): boolean {
    if (data.name.length < 3 || data.name.length > 50) {
      console.log(`%c✘ Nombre demasiado corto (mínimo 3 caracteres)`, COLORS.red);
      return false;
    }
    return this.passToNext(data);
  }
}

class EmailValidator extends Validator {
  validate(data: UserData): boolean {
    if (!data.email.includes('@') || !data.email.includes('.')) {
      console.log(`%c✘ Email inválido`, COLORS.red);
      return false;
    }
    return this.passToNext(data);
  }
}

class AgeValidator extends Validator {
  validate(data: UserData): boolean {
    if (data.age < 18 || data.age > 120) {
      console.log(`%c✘ Edad fuera de rango (18-120)`, COLORS.red);
      return false;
    }
    return this.passToNext(data);
  }
}

class PasswordValidator extends Validator {
  validate(data: UserData): boolean {
    const hasNumber = /\d/.test(data.password);
    if (data.password.length < 8 || !hasNumber) {
      console.log(`%c✘ Contraseña inválida (mínimo 8 caracteres con al menos un número)`, COLORS.red);
      return false;
    }
    return this.passToNext(data);
  }
}

// ─── Construcción de la cadena ────────────────────────────────────────────────
function buildValidationChain(): Validator {
  const length   = new LengthValidator();
  const email    = new EmailValidator();
  const age      = new AgeValidator();
  const password = new PasswordValidator();

  length.setNext(email).setNext(age).setNext(password);
  return length;
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
function main() {
  console.log('%c=== Chain of Responsibility: Validación de Formulario ===\n', COLORS.cyan);

  const chain = buildValidationChain();

  const cases: UserData[] = [
    { name: 'Al',           email: 'invalid',           age: 15,  password: 'abc' },
    { name: 'Pedro',        email: 'pedrogmail.com',    age: 25,  password: 'secure1' },
    { name: 'María',        email: 'maria@example.com', age: 150, password: 'secure1' },
    { name: 'Carlos',       email: 'carlos@mail.com',   age: 30,  password: 'nonum' },
    { name: 'Ana García',   email: 'ana@example.com',   age: 28,  password: 'secret42' },
  ];

  for (const data of cases) {
    console.log(`%c\nValidando: "${data.name}" / ${data.email} / edad: ${data.age}`, COLORS.yellow);
    chain.validate(data);
  }
}

main();
