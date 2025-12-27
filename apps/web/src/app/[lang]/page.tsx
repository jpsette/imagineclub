import { fetchAPI } from '../../lib/api';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: { lang: 'en' | 'pt' } }) {
    const lang = params.lang || 'pt';
    const targetLang = lang === 'en' ? 'pt' : 'en';

    let news: any[] = [];
    try {
        const data = await fetchAPI('/news?limit=10', { next: { revalidate: 60 } });
        news = Array.isArray(data) ? data : (data.posts || []);
    } catch (err) {
        console.error('Fetch error:', err);
    }

    // Fallback / UX Strings
    const t = {
        en: { home: "Home", switch: "Switch to PT", heroTitle: "Welcome to Imagine.club", heroDesc: "A premium editorial experience.", cta: "Read More" },
        pt: { home: "Início", switch: "Mudar para EN", heroTitle: "Bem-vindo ao Imagine.club", heroDesc: "Uma experiência editorial premium.", cta: "Leia Mais" }
    }[lang];

    return (
        <div className="container">
            <header style={{ padding: '24px 0', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '-0.02em' }}>Imagine.club</h1>
                <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <Link href={`/${lang}`} style={{ fontWeight: 500 }}>{t.home}</Link>
                    <a href={`/${targetLang}`} className="btn btn-ghost" style={{ fontSize: '14px' }}>{t.switch}</a>
                </nav>
            </header>

            <main style={{ padding: '64px 0' }}>
                <section style={{ textAlign: 'center', marginBottom: '80px', maxWidth: '800px', margin: '0 auto 80px' }}>
                    <h2 style={{ fontSize: '56px', marginBottom: '24px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>{t.heroTitle}</h2>
                    <p style={{ fontSize: '24px', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.6 }}>{t.heroDesc}</p>
                    <button className="btn btn-primary" style={{ padding: '16px 48px', fontSize: '18px', borderRadius: 'full' }}>{t.cta}</button>
                </section>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '48px 32px' }}>
                    {news.length > 0 ? (
                        news.map((item) => (
                            <article key={item.id || item.slug} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ aspectRatio: '16/9', background: '#f3f4f6', borderRadius: 'var(--radius-md)' }}></div>
                                <div>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '4px 0',
                                        color: 'var(--color-primary)',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        marginBottom: '8px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        Featured
                                    </span>
                                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px', lineHeight: 1.3 }}>
                                        <Link href={`/${lang}/news/${item.slug}`} style={{ textDecoration: 'none' }}>
                                            {item.title}
                                        </Link>
                                    </h3>
                                    <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.excerpt}</p>
                                </div>
                            </article>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#666' }}>No news available yet.</p>
                    )}
                </div>
            </main>
        </div>
    );
}
