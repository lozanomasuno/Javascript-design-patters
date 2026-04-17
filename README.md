# Patrones de Diseño en TypeScript

> "Un patrón de diseño no es código que copias y pegas — es una solución probada que aprendes a **pensar**."

Este repositorio recorre los **24 patrones de diseño clásicos** (GoF) implementados en TypeScript con Deno. Cada patrón tiene dos archivos: un ejemplo comentado y un ejercicio resuelto. Ideal para estudiarlos uno a uno, a tu ritmo.

---

## 🚀 Requisitos previos

Antes de empezar, instala **Deno** (no necesitas configurar nada más — TypeScript viene incluido):

```bash
# Windows (PowerShell)
irm https://deno.land/install.ps1 | iex

# macOS / Linux
curl -fsSL https://deno.land/install.sh | sh
```

Verifica la instalación:

```bash
deno --version
```

> ¿Prefieres **Bun**? También funciona: `bun run archivo.ts`
> ¿Prefieres **Node**? Necesitarás configurar `ts-node` o `tsx` manualmente — por eso recomendamos Deno o Bun para este repo.

---

## ▶️ Cómo ejecutar un archivo

```bash
deno run 01-creacionales/01-builder.ts
```

Así de simple. Sin compilar, sin `tsconfig.json`, sin instalar dependencias.

---

## 📁 Estructura del proyecto

```
patrones-diseno/
├── helpers/
│   ├── colors.ts        ← colores para la consola
│   └── sleep.ts         ← utilidad de espera async
│
├── 01-creacionales/     ← CÓMO se crean los objetos
├── 02-estructurales/    ← CÓMO se organizan y componen
└── 03-comportamiento/   ← CÓMO se comunican y reparten responsabilidades
```

Dentro de cada carpeta encontrarás pares de archivos:

| Archivo | Propósito |
|---|---|
| `NN-nombre-patron.ts` | Ejemplo clásico comentado paso a paso |
| `NN.2-nombre-patron.ts` | Ejercicio resuelto con un dominio diferente |

---

## 📚 Patrones implementados

### 🏗️ Creacionales — *Cómo construir objetos*

| # | Patrón | Ejemplo | Ejercicio |
|---|---|---|---|
| 01 | Builder | Configurador de computadoras | QueryBuilder SQL |
| 02 | Factory Method | Logística (Camión / Barco / Avión) | Reportes de ventas e inventario |
| 03 | Abstract Factory | Menús de restaurante | Fábrica de vehículos eléctricos/gasolina |
| 04 | Prototype | Documento con copia profunda | Clonación de Pokémon |
| 05 | Inmutabilidad | Perfil de usuario con `copyWith` | Jugador con historial de estados |
| 06 | Singleton | Logger con instancia única | Conexión a base de datos |
| 07 | Factory Function | Cliente HTTP por clausura | Logger factory con nivel y colores |

### 🧱 Estructurales — *Cómo organizar y componer*

| # | Patrón | Ejemplo | Ejercicio |
|---|---|---|---|
| 01 | Adapter | Logger de terceros | Pasarelas de pago (Stripe + PayPal) |
| 02 | Bridge | Formas × Renderers | Notificaciones × Canales |
| 03 | Composite | Sistema de archivos | Organigrama de empleados |
| 04 | Decorator | Cafetería con ingredientes | Transformaciones de texto |
| 05 | Facade | Conversor de video | Pedido e-commerce (4 subsistemas) |
| 06 | Flyweight | Motor de partículas | Renderizador de bosque (10 000 árboles) |
| 07 | Proxy | DataService con caché y logging | Sistema de archivos con roles |

### 🔄 Comportamiento — *Cómo se comunican*

| # | Patrón | Ejemplo | Ejercicio |
|---|---|---|---|
| 01 | Chain of Responsibility | Tickets de soporte | Pipeline de validación de formulario |
| 02 | Command | Editor de texto con undo/redo | Mando a distancia + MacroCommand |
| 03 | Iterator | Playlist de música | BST con InOrder y PreOrder |
| 04 | Mediator | Chat room con moderación | Formulario de registro reactivo |
| 05 | Memento | Editor de texto con historial | Checkpoints de videojuego |
| 06 | Observer | Estación meteorológica | Subasta en tiempo real |
| 07 | State | Máquina expendedora | Pedidos online |
| 08 | Strategy | Navegador GPS | RPG con estilos de combate |
| 09 | Template Method | Pipeline de datos (CSV / JSON / DB) | Turno de combate RPG |
| 10 | Visitor | Exportador de documentos | Carrito de compra con impuestos |

---

## 🧭 Ruta de aprendizaje recomendada

Si estás empezando, sigue este orden. Cada paso construye sobre el anterior:

```
Semana 1 — Creacionales
  → Builder → Factory Method → Abstract Factory → Prototype → Singleton

Semana 2 — Estructurales
  → Adapter → Decorator → Facade → Proxy → Composite

Semana 3 — Comportamiento (parte 1)
  → Observer → Strategy → Command → State

Semana 4 — Comportamiento (parte 2)
  → Chain of Responsibility → Iterator → Template Method → Visitor → Mediator → Memento
```

**Para cada patrón, te sugerimos:**

1. Lee el archivo de ejemplo (`NN-nombre.ts`) de arriba a abajo.
2. Identifica los participantes: ¿quién es el Context? ¿quién es la interfaz? ¿quién es la implementación concreta?
3. Ejecuta el archivo: `deno run NN-nombre.ts`
4. Lee el ejercicio resuelto (`NN.2-nombre.ts`) y compara el dominio diferente con los mismos roles.
5. ¡Intenta escribir tu propio ejemplo desde cero!

---

## 💡 Consejos para estudiantes

- **No memorices** — entiende el *problema* que resuelve cada patrón, no su código.
- Si al leer un patrón piensas *"esto ya lo había hecho sin saber cómo se llamaba"*, ¡perfecto! Estás en el camino correcto.
- Los patrones no se usan siempre — un buen desarrollador sabe *cuándo no* aplicarlos.
- Los mejores patrones son los que el código siguiente no nota que existen.

---

## 📖 Recursos adicionales

- [Fuentes recomendadas por el autor](https://gist.github.com/Klerith/f7f558766cb9ad8f36e471cceb5dd910)
- [Refactoring Guru — Patrones de diseño](https://refactoring.guru/es/design-patterns) ← referencia visual excelente
- [Deno — documentación oficial](https://docs.deno.com)

