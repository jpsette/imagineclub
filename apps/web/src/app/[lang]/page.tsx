type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
};

const dictionary = {
  en: {
    heroProps: {
      title: "Welcome to Imagine.club",
      description: "A premium editorial experience.",
      cta: "Read More",
    },
    nav: {
      home: "Home",
      switch: "Switch to PT",
    },
    section: {
      latest: "Latest news",
      empty: "No news yet.",
    },
  },
  pt: {
    heroProps: {
      title: "Bem-vindo ao Imagine.club",
      description: "Uma experiência editorial premium.",
      cta: "Leia Mais",
    },
    nav: {
      home: "Início",
      switch: "Mudar para EN",
    },
    section: {
      latest: "Últimas notícias",
      empty: "Ainda não há notícias.",
    },
  },
} as const;

async function fetchNews(limit = 20): Promise<NewsItem[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://api:3000";
  const res = await fetch(`${base}/news?limit=${limit}`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return (data?.items || []) as NewsItem[];
}

export default async function Page({ params }: { params: { lang: "en" | "pt" } }) {
  const lang = params.lang || "pt";
  const t = dictionary[lang];
  const targetLang = lang === "en" ? "pt" : "en";

  const news = await fetchNews(20);

  return (
    <div className="container">
      <header
        style={{
          padding: "20px 0",
          borderBottom: "1px solid #eee",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Imagine.club</h1>
        <nav style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <a href={`/${lang}`} style={{ fontWeight: 500 }}>
            {t.nav.home}
          </a>
          <a href={`/${targetLang}`} className="btn btn-ghost" style={{ fontSize: "14px" }}>
            {t.nav.switch}
          </a>
        </nav>
      </header>

      <main style={{ padding: "40px 0" }}>
        <section style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2 style={{ fontSize: "48px", marginBottom: "16px" }}>{t.heroProps.title}</h2>
          <p style={{ fontSize: "20px", color: "var(--text-secondary)", marginBottom: "32px" }}>
            {t.heroProps.description}
          </p>
          <button className="btn btn-primary">{t.heroProps.cta}</button>
        </section>

        <section>
          <h3 style={{ fontSize: "22px", marginBottom: "16px" }}>{t.section.latest}</h3>

          {news.length === 0 ? (
            <p style={{ color: "var(--text-secondary)" }}>{t.section.empty}</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "32px",
              }}
            >
              {news.map((item) => (
                <article
                  key={item.id}
                  style={{
                    background: "var(--bg-surface)",
                    borderRadius: "var(--radius-md)",
                    padding: "24px",
                    boxShadow: "var(--shadow-sm)",
                    border: "1px solid #eee",
                  }}
                >
                  <h4 style={{ fontSize: "20px", marginBottom: "8px" }}>{item.title}</h4>

                  {item.excerpt ? (
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "12px" }}>
                      {item.excerpt}
                    </p>
                  ) : null}

                  <a href={`/${lang}/news/${item.slug}`} className="btn btn-ghost" style={{ fontSize: "14px" }}>
                    {t.heroProps.cta}
                  </a>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
