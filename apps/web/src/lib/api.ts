const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.imagine.club';

export async function fetchAPI(path: string, options: RequestInit = {}) {
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'API request failed');
    }

    return res.json();
}
