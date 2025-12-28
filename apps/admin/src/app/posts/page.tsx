import Link from 'next/link';
import { publicFetch } from '../../lib/api';

export const dynamic = 'force-dynamic';

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  status: 'draft' | 'published';
  featured: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

function isPostsResponse(x: unknown): x is { items: Post[] } {
  if (!x || typeof x !== 'object') return false;
  const obj = x as Record<string, unknown>;
  return Array.isArray(obj.items);
}

export default async function PostsPage() {
  const data = await publicFetch('/news?limit=50');
  const items: Post[] = isPostsResponse(data) ? data.items : [];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Posts</h1>

        <Link
          href="/posts/new"
          style={{ padding: '10px 14px', borderRadius: 8, background: '#6366f1', color: '#fff', textDecoration: 'none' }}
        >
          + New Post
        </Link>
      </div>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb' }}>
            <tr>
              <th style={{ textAlign: 'left', padding: 12, fontSize: 12, color: '#6b7280' }}>Title</th>
              <th style={{ textAlign: 'left', padding: 12, fontSize: 12, color: '#6b7280' }}>Slug</th>
              <th style={{ textAlign: 'left', padding: 12, fontSize: 12, color: '#6b7280' }}>Featured</th>
              <th style={{ textAlign: 'left', padding: 12, fontSize: 12, color: '#6b7280' }}>Published</th>
              <th style={{ textAlign: 'left', padding: 12, fontSize: 12, color: '#6b7280' }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((p) => (
              <tr key={p.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: 12, fontWeight: 600 }}>{p.title}</td>
                <td style={{ padding: 12, color: '#374151' }}>{p.slug}</td>
                <td style={{ padding: 12 }}>{p.featured ? 'Yes' : 'No'}</td>
                <td style={{ padding: 12, color: '#374151' }}>
                  {p.publishedAt ? new Date(p.publishedAt).toLocaleString() : '—'}
                </td>
                <td style={{ padding: 12 }}>
                  <Link
                    href={`/posts/${p.id}/edit`}
                    style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}

            {!items.length && (
              <tr>
                <td colSpan={5} style={{ padding: 16, color: '#6b7280' }}>
                  Nenhum post publicado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 12, color: '#6b7280', fontSize: 12 }}>
        * Por enquanto essa lista puxa de <code>/news</code> (somente publicados).
      </div>
    </div>
  );
}
