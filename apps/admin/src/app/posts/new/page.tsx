import Link from 'next/link';
import { createPost } from '../actions';

export default function NewPostPage() {
  return (
    <div style={{ padding: 24, maxWidth: 720 }}>
      <div style={{ marginBottom: 16 }}>
        <Link href="/posts" style={{ color: '#6366f1' }}>← Voltar</Link>
      </div>

      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Novo Post</h1>

      <form action={createPost} style={{ display: 'grid', gap: 12 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Title</span>
          <input name="title" required style={{ padding: 10, border: '1px solid #ddd', borderRadius: 8 }} />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Slug</span>
          <input name="slug" required placeholder="ex: minha-noticia" style={{ padding: 10, border: '1px solid #ddd', borderRadius: 8 }} />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Excerpt</span>
          <textarea name="excerpt" rows={2} style={{ padding: 10, border: '1px solid #ddd', borderRadius: 8 }} />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Content</span>
          <textarea name="content" rows={8} style={{ padding: 10, border: '1px solid #ddd', borderRadius: 8 }} />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Status</span>
          <select name="status" defaultValue="draft" style={{ padding: 10, border: '1px solid #ddd', borderRadius: 8 }}>
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </label>

        <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input type="checkbox" name="featured" />
          <span>Featured</span>
        </label>

        <button type="submit" style={{ padding: '12px 14px', borderRadius: 10, background: '#111827', color: '#fff', border: 0, cursor: 'pointer' }}>
          Criar
        </button>
      </form>
    </div>
  );
}
