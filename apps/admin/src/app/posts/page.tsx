import Link from 'next/link';
import { publicFetch } from '../../lib/api';

export const dynamic = 'force-dynamic';

interface Post {
    id: string;
    title: string;
    slug: string;
    status: string;
    featured: boolean;
    publishedAt: string | null;
    createdAt: string;
}

export default async function PostsPage() {
    let posts: Post[] = [];
    try {
        const data = await publicFetch('/news?limit=50');
        if (Array.isArray(data)) {
            posts = data as Post[];
        } else if (data && typeof data === 'object' && 'posts' in data && Array.isArray((data as any).posts)) {
            posts = (data as any).posts as Post[];
        }
    } catch (error) {
        console.error('Failed to fetch posts:', error);
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Posts</h1>
                <Link href="/posts/new" style={{
                    background: '#6366f1', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontWeight: 500, textDecoration: 'none'
                }}>
                    New Post
                </Link>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Slug</th>
                            <th>Status</th>
                            <th>Featured</th>
                            <th>Published At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', color: '#666', padding: '24px' }}>
                                    No posts found.
                                </td>
                            </tr>
                        ) : (
                            posts.map((post) => (
                                <tr key={post.id || post.slug}>
                                    <td style={{ fontWeight: 500 }}>{post.title}</td>
                                    <td style={{ color: '#666' }}>{post.slug}</td>
                                    <td>
                                        <span style={{
                                            padding: '2px 8px', borderRadius: '12px', fontSize: '12px',
                                            background: post.status === 'published' ? '#dcfce7' : '#f3f4f6',
                                            color: post.status === 'published' ? '#166534' : '#374151',
                                            fontWeight: 600
                                        }}>
                                            {post.status || 'published'}
                                        </span>
                                    </td>
                                    <td>
                                        {post.featured ? (
                                            <span style={{ color: '#f59e0b' }}>★</span>
                                        ) : (
                                            <span style={{ color: '#e5e7eb' }}>☆</span>
                                        )}
                                    </td>
                                    <td style={{ fontSize: '14px', color: '#666' }}>
                                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '-'}
                                    </td>
                                    <td>
                                        <Link href={`/posts/${post.id}/edit`} style={{ color: '#6366f1', textDecoration: 'underline', fontSize: '14px' }}>
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
