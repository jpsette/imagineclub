import 'server-only';

export function getApiBaseUrl() {
    // Docker internal DNS uses 'api' as hostname on port 3000
    // Externally (browser) it might be different, but this file is server-only.
    return process.env.API_URL || 'http://api:3000';
}

export async function publicFetch(path: string, init?: RequestInit) {
    const url = `${getApiBaseUrl()}${path}`;
    console.log(`[Admin] Fetching public: ${url}`);

    const res = await fetch(url, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...init?.headers,
        },
        cache: 'no-store', // Always fresh data for admin
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || `API request failed: ${res.status}`);
    }

    return res.json();
}

export async function adminFetch(path: string, init?: RequestInit) {
    const token = process.env.ADMIN_TOKEN;
    if (!token) {
        throw new Error('Server configuration error: ADMIN_TOKEN missing');
    }

    const url = `${getApiBaseUrl()}${path}`;
    console.log(`[Admin] Fetching admin: ${url}`);

    const res = await fetch(url, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            'x-admin-token': token,
            ...init?.headers,
        },
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || `Admin API request failed: ${res.status}`);
    }

    return res.json();
}
