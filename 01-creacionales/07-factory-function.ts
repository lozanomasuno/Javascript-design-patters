/**
 * ! Factory Function
 * Es un patrón de diseño que nos permite crear objetos o funciones de manera dinámica que serán
 * usados posteriormente en el código.
 *
 * * Es útil cuando necesitamos crear objetos o funciones de manera dinámica,
 * * es decir, en tiempo de ejecución y no en tiempo de compilación.
 *
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Tipos ────────────────────────────────────────────────────────────────────────
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions {
  headers?: Record<string, string>;
  body?: unknown;
}

interface ApiResponse<T = unknown> {
  status: number;
  data: T;
  url: string;
  method: HttpMethod;
}

// ─── Factory Function: crea un cliente HTTP configurado para una baseURL ────────────
// Devuelve un objeto con métodos listos para usar, sin necesidad de repetir
// la baseURL o los headers en cada llamada.
function createHttpClient(baseUrl: string, defaultHeaders: Record<string, string> = {}) {
  // Estado privado capturado por el closure—no accesible desde fuera.
  const base = baseUrl.replace(/\/$/, '');

  function buildUrl(path: string): string {
    return `${base}/${path.replace(/^\//, '')}`;
  }

  function request<T>(method: HttpMethod, path: string, options: RequestOptions = {}): ApiResponse<T> {
    const url = buildUrl(path);
    const headers = { ...defaultHeaders, ...(options.headers) };

    // Simulación de la respuesta (en un caso real usaríamos fetch)
    console.log(`%c[${method}] ${url}`, method === 'GET' ? COLORS.green : COLORS.blue);
    console.log('  Headers:', headers);
    if (options.body) console.log('  Body:', JSON.stringify(options.body));

    return { status: 200, data: {} as T, url, method };
  }

  // Interfaz pública del cliente
  return {
    get: <T>(path: string, opts?: RequestOptions) => request<T>('GET', path, opts),
    post: <T>(path: string, body: unknown, opts?: RequestOptions) =>
      request<T>('POST', path, { ...opts, body }),
    put: <T>(path: string, body: unknown, opts?: RequestOptions) =>
      request<T>('PUT', path, { ...opts, body }),
    delete: <T>(path: string, opts?: RequestOptions) => request<T>('DELETE', path, opts),
    patch: <T>(path: string, body: unknown, opts?: RequestOptions) =>
      request<T>('PATCH', path, { ...opts, body }),
  };
}

// ─── Uso ──────────────────────────────────────────────────────────────────────
function main() {
  console.log('%c=== Factory Function: HTTP Client ===\n', COLORS.cyan);

  // Cada cliente tiene su propia baseURL y headers; el factory los encapsula.
  const usersApi = createHttpClient('https://api.example.com/v1', {
    Authorization: 'Bearer token-abc123',
    'Content-Type': 'application/json',
  });

  const analyticsApi = createHttpClient('https://analytics.example.com', {
    'X-Api-Key': 'key-xyz789',
  });

  console.log('%c-- Users API --', COLORS.gray);
  usersApi.get('/users');
  usersApi.post('/users', { name: 'Ana', email: 'ana@example.com' });
  usersApi.delete('/users/42');

  console.log('%c\n-- Analytics API --', COLORS.gray);
  analyticsApi.get('/events');
  analyticsApi.post('/events', { type: 'page_view', path: '/home' });
}

main();
