const dictionary = {
    en: {
        heroProps: {
            title: "Welcome to Imagine.club",
            description: "A premium editorial experience.",
            cta: "Read More"
        },
        nav: {
            home: "Home",
            about: "About",
            switch: "Switch to PT"
        },
        news: [
            { id: 1, title: "Future of AI in creative work", category: "Technology", author: "Alice Tech" },
            { id: 2, title: "Minimalism in Web Design", category: "Design", author: "Bob Art" },
        ]
    },
    pt: {
        heroProps: {
            title: "Bem-vindo ao Imagine.club",
            description: "Uma experiência editorial premium.",
            cta: "Leia Mais"
        },
        nav: {
            home: "Início",
            about: "Sobre",
            switch: "Mudar para EN"
        },
        news: [
            { id: 1, title: "O futuro da IA no trabalho criativo", category: "Tecnologia", author: "Alice Tech" },
            { id: 2, title: "Minimalismo no Web Design", category: "Design", author: "Bob Art" },
        ]
    }
} as const;

export default function Page({ params }: { params: { lang: 'en' | 'pt' } }) {
    const lang = params.lang || 'pt';
    const t = dictionary[lang];
    const targetLang = lang === 'en' ? 'pt' : 'en';

    return (
        <div className="container">
            <header style={{ padding: '20px 0', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Imagine.club</h1>
                <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <a href={`/${lang}`} style={{ fontWeight: 500 }}>{t.nav.home}</a>
                    <a href={`/${targetLang}`} className="btn btn-ghost" style={{ fontSize: '14px' }}>{t.nav.switch}</a>
                </nav>
            </header>

            <main style={{ padding: '40px 0' }}>
                <section style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '48px', marginBottom: '16px' }}>{t.heroProps.title}</h2>
                    <p style={{ fontSize: '20px', color: 'var(--text-secondary)', marginBottom: '32px' }}>{t.heroProps.description}</p>
                    <button className="btn btn-primary">{t.heroProps.cta}</button>
                </section>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                    {t.news.map(item => (
                        <article key={item.id} style={{
                            background: 'var(--bg-surface)',
                            borderRadius: 'var(--radius-md)',
                            padding: '24px',
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid #eee'
                        }}>
                            <span style={{
                                display: 'inline-block',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                background: '#EEF2FF',
                                color: 'var(--color-primary)',
                                fontSize: '12px',
                                fontWeight: 600,
                                marginBottom: '12px'
                            }}>
                                {item.category}
                            </span>
                            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>{item.title}</h3>
                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>By {item.author}</p>
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
}
