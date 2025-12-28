import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.imagine.club';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

export async function POST(request: Request) {
    if (!ADMIN_TOKEN) {
        return NextResponse.json({ message: 'Server configuration error: ADMIN_TOKEN missing' }, { status: 500 });
    }

    try {
        const body = await request.json();

        const res = await fetch(`${API_URL}/admin/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-token': ADMIN_TOKEN,
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(data, { status: res.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
