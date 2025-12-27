'use server';

import { redirect } from 'next/navigation';
import { adminFetch } from '../../lib/api';

export async function createPost(prevState: unknown, formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const status = formData.get('status') as string;
    const featured = formData.get('featured') === 'on';

    try {
        await adminFetch('/admin/posts', {
            method: 'POST',
            body: JSON.stringify({
                title,
                slug,
                excerpt,
                content,
                status,
                featured,
            }),
        });
    } catch (error: unknown) {
        console.error('Create Post Error:', error);
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Failed to create post' };
    }

    redirect('/posts');
}

export async function updatePost(id: string, prevState: unknown, formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const status = formData.get('status') as string;
    const featured = formData.get('featured') === 'on';

    try {
        await adminFetch(`/admin/posts/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                title,
                slug,
                excerpt,
                content,
                status,
                featured,
            }),
        });
    } catch (error: unknown) {
        console.error('Update Post Error:', error);
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Failed to update post' };
    }

    redirect('/posts');
}
