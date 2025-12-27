type Json =
  | Record<string, unknown>
  | unknown[]
  | string
  | number
  | boolean
  | null;

function getBaseUrl() {
  // Dentro do Docker Compose, o host "api" resolve via rede interna
  return process.env.API_URL || 'http://api:3000';
}

async function fetchJson<T = Json>(path: string, init: RequestInit = {}): Promise<T> {
  const base = getBaseUrl();
  const res = await fetch(`${base}${path}`, {
    ...init,
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${text || res.statusText}`);
  }

  return (await res.json()) as T;
}

export async function publicFetch<T = Json>(path: string): Promise<T> {
  return fetchJson<T>(path);
}

export async function adminFetch<T = Json>(path: string, init: RequestInit = {}): Promise<T> {
  const token = process.env.ADMIN_TOKEN || '';
  if (!token) throw new Error('ADMIN_TOKEN is not set in admin environment');

  return fetchJson<T>(path, {
    ...init,
    headers: {
      ...(init.headers || {}),
      'x-admin-token': token,
    },
  });
}
