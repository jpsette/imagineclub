import Link from 'next/link';
import { publicFetch } from '../../lib/api';

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  status: 'draft' | 'published';
  featured: boolean;
  publishedAt?: string | null;
  createdAt?: string;
};

export default async function PostsPage() {
  const data = await publicFetch<{ items: Post[]; limit: number }>('/news');

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Posts</h1>
        <Link href="/posts/new" style={{ padding: '10px 14px', borderRadius: 8, background: '#6366f1', color: '#fff' }}>
          + New Post
        </Link>
      </div>

      <div style={{ border: '1px solid #eee', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr', gap: 12, padding: 12, background: '#fafafa', fontWeight: 600 }}>
          <div>Title</div>
          <div>Slug</div>
          <div>Status</div>
          <div>Featured</div>
        </div>

        {data.items.length === 0 ? (
          <div style={{ padding: 12, color: '#666' }}>Nenhum post publicado ainda.</div>
        ) : (
          data.items.map((p) => (
            <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr', gap: 12, padding: 12, borderTop: '1px solid #eee' }}>
              <div style={{ fontWeight: 600 }}>{p.title}</div>
              <div style={{ color: '#555' }}>{p.slug}</div>
              <div>{p.status}</div>
              <div>{p.featured ? '✅' : '—'}</div>
            </div>
          ))
        )}
      </div>

      <p style={{ marginTop: 12, color: '#666', fontSize: 13 }}>
        * Por enquanto esta tela lista só os publicados (endpoint /news).
      </p>
    </div>
  );
}
