/**
 * ! Patrón Mediator:
 * Es un patrón de diseño de comportamiento que reduce las dependencias caóticas
 * entre objetos, centralizando la comunicación en un mediador.
 *
 * https://refactoring.guru/es/design-patterns/mediator
 */

/**
 * ! Tarea: Mediator para componentes de un formulario UI
 *
 * En un formulario de registro, los componentes interactúan entre sí:
 *
 *  - Checkbox "¿Eres empresa?"
 *      → al activarse: muestra el campo "Nombre de empresa" y oculta "Nombre completo".
 *      → al desactivarse: lo contrario.
 *
 *  - Selector de país "País"
 *      → al cambiar a "US": muestra el campo "Estado".
 *      → al cambiar a otro país: oculta "Estado".
 *
 *  - Botón "Enviar"
 *      → solo se habilita si todos los campos visibles tienen valor.
 *
 * Sin Mediator: cada componente tendría referencias directas a los demás (acoplamiento).
 * Con Mediator: cada componente notifica al mediador y este coordina los cambios.
 *
 * Salida esperada:
 *  [Mediator] "¿Eres empresa?" activado
 *    → "Nombre completo" ocultado
 *    → "Nombre de empresa" mostrado
 *  [Mediator] País cambiado a "US"
 *    → "Estado" mostrado
 *  [Mediator] Validando formulario...
 *    → Botón "Enviar": HABILITADO ✔
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Interfaz Mediator ────────────────────────────────────────────────────────
interface FormMediator {
  notify(sender: FormComponent, event: string): void;
}

// ─── Componente base ──────────────────────────────────────────────────────────
abstract class FormComponent {
  protected visible = true;
  protected value   = '';

  constructor(
    readonly name: string,
    protected mediator: FormMediator,
  ) {}

  setValue(value: string): void {
    this.value = value;
    this.mediator.notify(this, 'change');
  }

  getValue(): string  { return this.value; }
  isVisible(): boolean { return this.visible; }

  show(): void {
    this.visible = true;
    console.log(`%c    → "${this.name}" mostrado`, COLORS.green);
  }

  hide(): void {
    this.visible = false;
    console.log(`%c    → "${this.name}" ocultado`, COLORS.gray);
  }
}

// ─── Componentes Concretos ────────────────────────────────────────────────────
class Checkbox extends FormComponent {
  private checked = false;

  toggle(): void {
    this.checked = !this.checked;
    this.value = this.checked ? 'true' : 'false';
    console.log(
      `%c  [Mediator] "${this.name}" ${this.checked ? 'activado' : 'desactivado'}`,
      COLORS.blue,
    );
    this.mediator.notify(this, 'toggle');
  }

  isChecked(): boolean { return this.checked; }
}

class TextInput extends FormComponent {
  setValue(value: string): void {
    this.value = value;
    this.mediator.notify(this, 'change');
  }
}

class Select extends FormComponent {
  setValue(value: string): void {
    this.value = value;
    console.log(`%c  [Mediator] País cambiado a "${value}"`, COLORS.blue);
    this.mediator.notify(this, 'change');
  }
}

class Button extends FormComponent {
  private enabled = false;

  enable(): void {
    this.enabled = true;
    console.log(`%c    → Botón "${this.name}": HABILITADO ✔`, COLORS.green);
  }

  disable(): void {
    this.enabled = false;
    console.log(`%c    → Botón "${this.name}": DESHABILITADO`, COLORS.red);
  }

  isEnabled(): boolean { return this.enabled; }
}

// ─── Mediador Concreto: Formulario de Registro ────────────────────────────────
class RegistrationFormMediator implements FormMediator {
  readonly isCompany:    Checkbox;
  readonly fullName:     TextInput;
  readonly companyName:  TextInput;
  readonly country:      Select;
  readonly state:        TextInput;
  readonly submitButton: Button;

  constructor() {
    this.isCompany   = new Checkbox('¿Eres empresa?',    this);
    this.fullName    = new TextInput('Nombre completo',  this);
    this.companyName = new TextInput('Nombre de empresa',this);
    this.country     = new Select('País',                this);
    this.state       = new TextInput('Estado',           this);
    this.submitButton = new Button('Enviar',             this);

    // Estado inicial
    this.companyName.hide();
    this.state.hide();
    this.submitButton.disable();
  }

  notify(sender: FormComponent, event: string): void {
    if (sender === this.isCompany && event === 'toggle') {
      if ((sender as Checkbox).isChecked()) {
        this.fullName.hide();
        this.companyName.show();
      } else {
        this.companyName.hide();
        this.fullName.show();
      }
    }

    if (sender === this.country && event === 'change') {
      if (sender.getValue() === 'US') {
        this.state.show();
      } else {
        this.state.hide();
        this.state.setValue('');
      }
    }

    // Validar formulario en cualquier cambio
    this.validate();
  }

  private validate(): void {
    console.log(`%c  [Mediator] Validando formulario...`, COLORS.yellow);
    const nameOk    = !this.isCompany.isChecked()
      ? this.fullName.getValue().length > 0
      : this.companyName.getValue().length > 0;
    const countryOk = this.country.getValue().length > 0;
    const stateOk   = !this.state.isVisible() || this.state.getValue().length > 0;

    if (nameOk && countryOk && stateOk) {
      this.submitButton.enable();
    } else {
      this.submitButton.disable();
    }
  }
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
function main() {
  console.log('%c=== Mediator: Formulario de Registro ===\n', COLORS.cyan);

  const form = new RegistrationFormMediator();

  console.log('%c-- Usuario individual llena el formulario --', COLORS.gray);
  form.fullName.setValue('Carlos Pérez');
  form.country.setValue('MX');

  console.log('%c\n-- Cambia a modo empresa --', COLORS.gray);
  form.isCompany.toggle();
  form.companyName.setValue('Acme Corp');

  console.log('%c\n-- Cambia país a US (aparece Estado) --', COLORS.gray);
  form.country.setValue('US');
  form.state.setValue('California');
}

main();
