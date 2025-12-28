// apps/admin/src/lib/api.ts

type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json };

function normalizeBaseUrl(raw: string): string {
  return raw.replace(/\/+$/, "");
}

function getBaseUrl(): string {
  // Prioridade:
  // 1) API_URL (bom dentro do Docker: http://api:3000)
  // 2) NEXT_PUBLIC_API_URL (bom local e também prod: https://api.imagine.club)
  // 3) fallback para o domínio público
  const fromDocker = process.env.API_URL;
  if (fromDocker && fromDocker.trim()) return normalizeBaseUrl(fromDocker.trim());

  const fromPublic = process.env.NEXT_PUBLIC_API_URL;
  if (fromPublic && fromPublic.trim()) return normalizeBaseUrl(fromPublic.trim());

  return "https://api.imagine.club";
}

async function fetchAPI<T = Json>(path: string, options: RequestInit = {}): Promise<T> {
  const base = getBaseUrl();
  const url =
    path.startsWith("http://") || path.startsWith("https://")
      ? path
      : `${base}${path.startsWith("/") ? "" : "/"}${path}`;

  const res = await fetch(url, {
    ...options,
    // evita cache esquisito em Server Components
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") || "";

  // Helper para extrair msg de erro sem usar `any`
  const readErrorMessage = async (): Promise<string> => {
    try {
      if (contentType.includes("application/json")) {
        const data: unknown = await res.json();
        if (typeof data === "object" && data !== null) {
          const maybeMessage = (data as { message?: unknown }).message;
          if (typeof maybeMessage === "string" && maybeMessage.trim()) return maybeMessage;
        }
        return "Request failed";
      }
      const txt = await res.text();
      return txt || "Request failed";
    } catch {
      return "Request failed";
    }
  };

  if (!res.ok) {
    const msg = await readErrorMessage();
    throw new Error(`${res.status} ${res.statusText}: ${msg}`);
  }

  // Retorno (JSON quando possível; senão texto)
  if (contentType.includes("application/json")) {
    const data: unknown = await res.json();
    return data as T;
  }

  const text = await res.text();
  return text as unknown as T;
}

export async function publicFetch<T = Json>(path: string, options: RequestInit = {}): Promise<T> {
  return fetchAPI<T>(path, options);
}

export async function adminFetch<T = Json>(path: string, options: RequestInit = {}): Promise<T> {
  const token = process.env.ADMIN_TOKEN || "";
  if (!token) throw new Error("ADMIN_TOKEN is not set (Admin app)");

  // Merge seguro de headers (sem aquele erro chato de types)
  const headers = new Headers(options.headers ?? {});
  headers.set("x-admin-token", token);

  return fetchAPI<T>(path, { ...options, headers });
}
