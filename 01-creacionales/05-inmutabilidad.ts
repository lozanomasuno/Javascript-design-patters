/**
 * ! Inmutabilidad con copia
 * Aunque la inmutabilidad es una buena práctica, no siempre es posible.
 * En estos casos, se puede hacer una copia del objeto y modificar la copia.
 *
 *  * Es útil para mantener un historial de estados en aplicaciones interactivas.
 *
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Objeto de valor inmutable: Dirección ───────────────────────────────────────
// Todos sus campos son readonly: una vez creado, no se puede mutar.
class Address {
  constructor(
    readonly street: string,
    readonly city: string,
    readonly country: string,
  ) {}

  // En lugar de mutar, devuelve una nueva instancia con los cambios.
  copyWith({ street, city, country }: Partial<Address>): Address {
    return new Address(
      street   ?? this.street,
      city     ?? this.city,
      country  ?? this.country,
    );
  }

  display(): void {
    console.log(`  ${this.street}, ${this.city}, ${this.country}`);
  }
}

// ─── Objeto inmutable con historial de estados ─────────────────────────────────
class UserProfile {
  constructor(
    readonly username: string,
    readonly email: string,
    readonly address: Address,
    readonly isPremium: boolean = false,
  ) {}

  copyWith({
    username,
    email,
    address,
    isPremium,
  }: Partial<UserProfile>): UserProfile {
    return new UserProfile(
      username  ?? this.username,
      email     ?? this.email,
      address   ?? this.address,
      isPremium ?? this.isPremium,
    );
  }

  display(label: string): void {
    console.log(`%c\n[${label}]`, COLORS.cyan);
    console.log(`  Usuario : ${this.username}`);
    console.log(`  Email   : ${this.email}`);
    console.log(`  Premium : ${this.isPremium}`);
    console.log('%c  Dirección:', COLORS.gray);
    this.address.display();
  }
}

// ─── Uso: historial de estados ────────────────────────────────────────────────────
function main() {
  console.log('%c=== Inmutabilidad con copia: UserProfile ===', COLORS.green);

  const address1 = new Address('Av. Siempre Viva 742', 'Springfield', 'EE.UU.');

  // Estado inicial
  const v1 = new UserProfile('homer_s', 'homer@duff.com', address1);
  v1.display('Estado inicial');

  // Cambia el email — el objeto anterior (v1) no se modifica
  const v2 = v1.copyWith({ email: 'homer@powerplant.com' });
  v2.display('Cambió email');

  // Cambia la dirección — copia del objeto anidado
  const v3 = v2.copyWith({
    address: address1.copyWith({ city: 'Shelbyville' }),
  });
  v3.display('Cambió ciudad');

  // Activa premium
  const v4 = v3.copyWith({ isPremium: true });
  v4.display('Activado premium');

  // El historial (v1…v4) permanece intacto
  console.log('%c\n--- Verificando inmutabilidad: v1 no cambió ---', COLORS.orange);
  v1.display('v1 original');
}

main();
