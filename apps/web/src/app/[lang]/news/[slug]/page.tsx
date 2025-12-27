import { fetchAPI } from '../../../../lib/api';
import Link from 'next/link';

// Helper to fetch data
async function getPost(slug: string) {
    try {
        const data = await fetchAPI(`/news/${slug}`, { next: { revalidate: 60 } });
        return data;
    } catch (error) {
        return null;
    }
}

export default async function PostPage({ params }: { params: { slug: string, lang: string } }) {
    const post = await getPost(params.slug);

    if (!post) {
        return (
            <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
                <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>Post Not Found</h1>
                <Link href={`/${params.lang}`} style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Return Home</Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <header style={{ padding: '24px 0', marginBottom: '64px', borderBottom: '1px solid #e5e7eb' }}>
                <Link href={`/${params.lang}`} style={{ fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    ← Back
                </Link>
            </header>

            <article>
                <span style={{
                    display: 'block',
                    color: 'var(--color-primary)',
                    fontWeight: 700,
                    fontSize: '14px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '16px'
                }}>
                    {post.featured ? 'Featured Story' : 'News'}
                </span>

                <h1 style={{
                    fontSize: '48px',
                    fontWeight: 800,
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    marginBottom: '32px',
                    color: 'var(--text-primary)'
                }}>
                    {post.title}
                </h1>

                <p style={{
                    fontSize: '24px',
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)',
                    marginBottom: '48px',
                    fontStyle: 'italic'
                }}>
                    {post.excerpt}
                </p>

                <div
                    style={{
                        fontSize: '18px',
                        lineHeight: 1.8,
                        color: '#374151'
                    }}
                >
                    {/* Simple rendering for MVP; ideally use a Markdown renderer if content is complex */}
                    {post.content.split('\n').map((paragraph: string, idx: number) => (
                        paragraph ? <p key={idx} style={{ marginBottom: '24px' }}>{paragraph}</p> : null
                    ))}
                </div>
            </article>

            <footer style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
                <p style={{ color: '#9ca3af', fontSize: '14px' }}>Published on {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</p>
            </footer>
        </div>
    );
}
