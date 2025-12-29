import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import pg from 'pg';

const server = Fastify({
  logger: true,
});

import fastifyMultipart from '@fastify/multipart';
import cmsAssetsRoutes from './routes/cmsAssets';

server.register(cors, {
  origin: true,
});

server.register(fastifyMultipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
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

server.register(cmsAssetsRoutes, { pool });


server.get('/db-health', async (request, reply) => {
  try {
    const r = await pool.query('select now() as now');
    return { status: 'ok', now: r.rows?.[0]?.now };
  } catch (err: unknown) {
    request.log.error({ err }, 'db-health failed');
    const message = err instanceof Error ? err.message : 'db error';
    return reply.code(500).send({ status: 'error', message });
  }
});

function getAdminToken(request: FastifyRequest): string {
  const authRaw = request.headers.authorization;
  const auth = typeof authRaw === 'string' ? authRaw : '';
  if (auth.toLowerCase().startsWith('bearer ')) return auth.slice(7).trim();

  const x = request.headers['x-admin-token'];
  if (typeof x === 'string') return x.trim();
  if (Array.isArray(x) && typeof x[0] === 'string') return x[0].trim();

  return '';
}

async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  const expected = process.env.ADMIN_TOKEN || '';
  const got = getAdminToken(request);

  if (!expected || got !== expected) {
    return reply.code(401).send({ status: 'error', message: 'unauthorized' });
  }
}

type PostStatus = 'draft' | 'published';

type CreatePostBody = {
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  coverImageUrl?: string | null;
  status?: PostStatus;
  featured?: boolean;
  publishedAt?: string | Date | null;
};

server.post<{ Body: CreatePostBody }>(
  '/admin/posts',
  { preHandler: requireAdmin },
  async (request, reply) => {
    const body = request.body;

    const title = String(body.title || '').trim();
    const slug = String(body.slug || '').trim();

    if (!title || !slug) {
      return reply.code(400).send({ status: 'error', message: 'title and slug are required' });
    }

    const excerpt = body.excerpt != null ? String(body.excerpt) : null;
    const content = body.content != null ? String(body.content) : null;
    const coverImageUrl = body.coverImageUrl != null ? String(body.coverImageUrl) : null;

    const status = String(body.status || 'draft') as PostStatus;
    const featured = Boolean(body.featured || false);

    let publishedAt: Date | null =
      body.publishedAt ? new Date(body.publishedAt as string | number | Date) : null;
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
    } catch (err: unknown) {
      request.log.error({ err }, 'admin create post failed');
      const e = err as { code?: string; message?: string };
      const msg = e?.code === '23505' ? 'slug already exists' : (e?.message ?? 'db error');
      return reply.code(400).send({ status: 'error', message: msg });
    }
  }
);

type PatchPostBody = {
  title?: string;
  slug?: string;
  excerpt?: string | null;
  content?: string | null;
  status?: PostStatus;
  featured?: boolean;
};

server.get<{ Params: { id: string } }>(
  '/admin/posts/:id',
  { preHandler: requireAdmin },
  async (request, reply) => {
    const id = String(request.params.id || '').trim();
    if (!id) return reply.code(400).send({ status: 'error', message: 'id is required' });

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
        where id = $1
        limit 1
        `,
        [id]
      );

      if (!r.rows?.length) return reply.code(404).send({ status: 'error', message: 'not found' });
      return r.rows[0];
    } catch (err: unknown) {
      request.log.error({ err }, 'admin get post failed');
      const message = err instanceof Error ? err.message : 'db error';
      return reply.code(500).send({ status: 'error', message });
    }
  }
);

server.patch<{ Params: { id: string }; Body: PatchPostBody }>(
  '/admin/posts/:id',
  { preHandler: requireAdmin },
  async (request, reply) => {
    const id = String(request.params.id || '').trim();
    if (!id) return reply.code(400).send({ status: 'error', message: 'id is required' });

    const body = request.body || {};

    const title = body.title != null ? String(body.title).trim() : '';
    const slug = body.slug != null ? String(body.slug).trim() : '';
    const excerpt = body.excerpt != null ? String(body.excerpt) : null;
    const content = body.content != null ? String(body.content) : null;
    const status = String(body.status || 'draft') as PostStatus;
    const featured = Boolean(body.featured || false);

    if (!title || !slug) {
      return reply.code(400).send({ status: 'error', message: 'title and slug are required' });
    }

    try {
      const current = await pool.query(
        `select status, published_at as "publishedAt" from posts where id = $1 limit 1`,
        [id]
      );
      if (!current.rows?.length) return reply.code(404).send({ status: 'error', message: 'not found' });

      const currentPublishedAt: Date | null = current.rows[0].publishedAt ? new Date(current.rows[0].publishedAt) : null;

      let nextPublishedAt: Date | null = currentPublishedAt;
      if (status === 'published') {
        if (!currentPublishedAt) nextPublishedAt = new Date();
      } else {
        nextPublishedAt = null;
      }

      const r = await pool.query(
        `
        update posts
        set
          title = $1,
          slug = $2,
          excerpt = $3,
          content = $4,
          status = $5,
          featured = $6,
          published_at = $7,
          updated_at = now()
        where id = $8
        returning
          id, title, slug, excerpt, content, cover_image_url as "coverImageUrl",
          status, featured,
          published_at as "publishedAt",
          created_at as "createdAt",
          updated_at as "updatedAt"
        `,
        [title, slug, excerpt, content, status, featured, nextPublishedAt, id]
      );

      return reply.send(r.rows[0]);
    } catch (err: unknown) {
      request.log.error({ err }, 'admin update post failed');
      const e = err as { code?: string; message?: string };
      const msg = e?.code === '23505' ? 'slug already exists' : (e?.message ?? 'db error');
      return reply.code(400).send({ status: 'error', message: msg });
    }
  }
);

server.get<{ Querystring: { limit?: string } }>('/news', async (request, reply) => {
  const limitRaw = request.query?.limit;
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
  } catch (err: unknown) {
    request.log.error({ err }, 'news list failed');
    const message = err instanceof Error ? err.message : 'db error';
    return reply.code(500).send({ status: 'error', message });
  }
});

server.get<{ Params: { slug: string } }>('/news/:slug', async (request, reply) => {
  const slug = String(request.params.slug || '').trim();
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
  } catch (err: unknown) {
    request.log.error({ err }, 'news get failed');
    const message = err instanceof Error ? err.message : 'db error';
    return reply.code(500).send({ status: 'error', message });
  }
});

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
