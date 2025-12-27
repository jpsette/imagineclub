import Fastify from 'fastify';
import cors from '@fastify/cors';
import pg from 'pg';

const server = Fastify({
  logger: true,
});

server.register(cors, {
  origin: true,
});

function getPool() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');

  const u = new URL(url);

  return new pg.Pool({
    host: u.hostname,
    port: u.port ? Number(u.port) : 5432,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ''),
    ssl: { rejectUnauthorized: false },
  });
}

const pool = getPool();

server.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

server.get('/db-health', async (request, reply) => {
  try {
    const r = await pool.query('select now() as now');
    return { status: 'ok', now: r.rows?.[0]?.now };
  } catch (err: any) {
    request.log.error({ err }, 'db-health failed');
    return reply.code(500).send({ status: 'error', message: err?.message ?? 'db error' });
  }
});


function getAdminToken(request: any) {
  const auth = (request.headers?.authorization || '') as string;
  if (auth.toLowerCase().startsWith('bearer ')) return auth.slice(7).trim();

  const x = request.headers?.['x-admin-token'];
  if (typeof x === 'string') return x.trim();

  return '';
}

async function requireAdmin(request: any, reply: any) {
  const expected = process.env.ADMIN_TOKEN || '';
  const got = getAdminToken(request);

  if (!expected || got !== expected) {
    return reply.code(401).send({ status: 'error', message: 'unauthorized' });
  }
}

server.post('/admin/posts', { preHandler: requireAdmin }, async (request, reply) => {
  const body = (request.body || {}) as any;

  const title = String(body.title || '').trim();
  const slug = String(body.slug || '').trim();

  if (!title || !slug) {
    return reply.code(400).send({ status: 'error', message: 'title and slug are required' });
  }

  const excerpt = body.excerpt != null ? String(body.excerpt) : null;
  const content = body.content != null ? String(body.content) : null;
  const coverImageUrl = body.coverImageUrl != null ? String(body.coverImageUrl) : null;

  const status = String(body.status || 'draft');
  const featured = Boolean(body.featured || false);

  let publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
  if (status === 'published' && !publishedAt) publishedAt = new Date();

  try {
    const r = await pool.query(
      `
      insert into posts
        (title, slug, excerpt, content, cover_image_url, status, featured, published_at)
      values
        ($1,$2,$3,$4,$5,$6,$7,$8)
      returning
        id, title, slug, excerpt, cover_image_url as "coverImageUrl",
        status, featured,
        published_at as "publishedAt",
        created_at as "createdAt",
        updated_at as "updatedAt"
      `,
      [title, slug, excerpt, content, coverImageUrl, status, featured, publishedAt]
    );

    return reply.code(201).send(r.rows[0]);
  } catch (err: any) {
    request.log.error({ err }, 'admin create post failed');
    const msg = err?.code == '23505' ? 'slug already exists' : (err?.message ?? 'db error');
    return reply.code(400).send({ status: 'error', message: msg });
  }
});

server.get('/news', async (request, reply) => {
  const limitRaw = (request.query as any)?.limit;
  const limit = Math.max(1, Math.min(50, Number(limitRaw ?? 20)));

  try {
    const r = await pool.query(
      `
      select
        id, title, slug, excerpt, cover_image_url as "coverImageUrl",
        status, featured,
        published_at as "publishedAt",
        created_at as "createdAt",
        updated_at as "updatedAt"
      from posts
      where status = 'published'
      order by published_at desc nulls last, created_at desc
      limit $1
      `,
      [limit]
    );

    return { items: r.rows, limit };
  } catch (err: any) {
    request.log.error({ err }, 'news list failed');
    return reply.code(500).send({ status: 'error', message: err?.message ?? 'db error' });
  }
});


server.get('/news/:slug', async (request, reply) => {
  const slug = String((request.params as any)?.slug || '').trim();
  if (!slug) return reply.code(400).send({ status: 'error', message: 'slug is required' });

  try {
    const r = await pool.query(
      `
      select
        id, title, slug, excerpt, content, cover_image_url as "coverImageUrl",
        status, featured,
        published_at as "publishedAt",
        created_at as "createdAt",
        updated_at as "updatedAt"
      from posts
      where status = 'published' and slug = $1
      limit 1
      `,
      [slug]
    );

    if (!r.rows?.length) return reply.code(404).send({ status: 'error', message: 'not found' });
    return r.rows[0];
  } catch (err: any) {
    request.log.error({ err }, 'news get failed');
    return reply.code(500).send({ status: 'error', message: err?.message ?? 'db error' });
  }
});

const start = async () => {
  try {
    await server.listen( { port: 3000, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
