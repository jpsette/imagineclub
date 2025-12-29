type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  coverImageUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
};

async function fetchPost(slug: string): Promise<NewsItem | null> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://api:3000";
  const slugEncoded = encodeURIComponent(slug);
  const res = await fetch(`${base}/news/${slugEncoded}`, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as NewsItem;
}

export default async function Page({
  params,
}: {
  params: { lang: "en" | "pt"; slug: string };
}) {
  const lang = params.lang || "pt";
  const post = await fetchPost(params.slug);

  if (!post) {
    return (
      <div className="container" style={{ padding: "40px 0" }}>
        <a href={`/${lang}`} className="btn btn-ghost">
          ← Voltar
        </a>
        <h1 style={{ marginTop: 16 }}>Notícia não encontrada</h1>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "40px 0" }}>
      <a href={`/${lang}`} className="btn btn-ghost">
        ← Voltar
      </a>

      <h1 style={{ fontSize: "42px", marginTop: 18, marginBottom: 10 }}>{post.title}</h1>

      {post.excerpt ? (
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: 24 }}>{post.excerpt}</p>
      ) : null}

      {post.content ? (
        <div style={{ lineHeight: 1.7, fontSize: "18px" }}>
          {post.content.split("\n").map((line, i) => (
            <p key={i} style={{ marginBottom: 12 }}>
              {line}
            </p>
          ))}
        </div>
      ) : (
        <p style={{ color: "var(--text-secondary)" }}>Sem conteúdo.</p>
      )}
    </div>
  );
}
