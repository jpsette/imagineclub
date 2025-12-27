'use server';

import { adminFetch } from '../../lib/api';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const title = String(formData.get('title') || '').trim();
  const slug = String(formData.get('slug') || '').trim();
  const excerpt = String(formData.get('excerpt') || '').trim();
  const content = String(formData.get('content') || '').trim();
  const status = String(formData.get('status') || 'draft').trim();
  const featured = formData.get('featured') === 'on';

  if (!title || !slug) {
    throw new Error('Title e Slug são obrigatórios');
  }

  await adminFetch('/admin/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      slug,
      excerpt: excerpt || null,
      content: content || null,
      status,
      featured,
    }),
  });

  redirect('/posts');
}
