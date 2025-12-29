"use client";

import { updatePost } from '../../actions';
import { useState } from 'react';
import RichTextEditor from '../../../../components/RichTextEditor';

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  status: 'draft' | 'published';
  featured: boolean;
};

export default function EditPostForm({ post }: { post: Post }) {
  const [content, setContent] = useState(post.content ?? '');

  return (
    <form action={updatePost} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <input type="hidden" name="id" value={post.id} />

      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontWeight: 600 }}>Title</span>
        <input
          name="title"
          defaultValue={post.title}
          required
          style={{ padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }}
        />
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontWeight: 600 }}>Slug</span>
        <input
          name="slug"
          defaultValue={post.slug}
          required
          style={{ padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }}
        />
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontWeight: 600 }}>Excerpt</span>
        <textarea
          name="excerpt"
          defaultValue={post.excerpt ?? ''}
          rows={3}
          style={{ padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }}
        />
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontWeight: 600 }}>Content</span>
        <input type="hidden" name="content" value={content} />
        <RichTextEditor content={content} onChange={setContent} />
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontWeight: 600 }}>Status</span>
        <select
          name="status"
          defaultValue={post.status}
          style={{ padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </label>

      <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <input type="checkbox" name="featured" defaultChecked={post.featured} />
        <span style={{ fontWeight: 600 }}>Featured</span>
      </label>

      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button className="btn btn-primary" type="submit">
          Salvar
        </button>
        <a className="btn btn-ghost" href="/posts">
          Cancelar
        </a>
      </div>
    </form>
  );
}
