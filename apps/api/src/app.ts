import Fastify from 'fastify';
import cors from '@fastify/cors';
import { randomUUID } from 'crypto';

const server = Fastify({
    logger: true
});

server.register(cors, {
    origin: true
});

// TYPES
interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    coverImageUrl?: string;
    status: 'draft' | 'published';
    featured: boolean;
    publishedAt?: string | null;
    createdAt: string;
    updatedAt: string;
}

// IN-MEMORY STORE (Mock DB)
const posts: Post[] = [];

// HELPERS
const requireAdmin = async (request: any, reply: any) => {
    const token = request.headers['x-admin-token'];
    if (token !== process.env.ADMIN_TOKEN) {
        reply.code(401).send({ message: 'Unauthorized' });
        throw new Error('Unauthorized');
    }
};

// ROUTES

// 1. Health
server.get('/health', async (request, reply) => {
    return { status: 'ok', timestamp: new Date().toISOString() };
});

// 2. Public: List News (Published only)
server.get('/news', async (request, reply) => {
    const { limit } = request.query as any;
    let results = posts
        .filter(p => p.status === 'published')
        .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime());

    if (limit) {
        results = results.slice(0, Number(limit));
    }
    return results; // Return array directly as per "existing" behavior implies
});

// 3. Public: Get Post by Slug
server.get('/news/:slug', async (request, reply) => {
    const { slug } = request.params as any;
    const post = posts.find(p => p.slug === slug && p.status === 'published');
    if (!post) {
        return reply.code(404).send({ message: 'Post not found' });
    }
    return post;
});

// 4. Admin: Create Post
server.post('/admin/posts', { preHandler: requireAdmin }, async (request, reply) => {
    const body = request.body as any;

    // Validation
    if (!body.title || !body.slug) {
        return reply.code(400).send({ message: 'Title and slug are required' });
    }

    // Slug conflict check (simulating Postgres 23505)
    if (posts.find(p => p.slug === body.slug)) {
        return reply.code(409).send({ code: '23505', message: 'slug already exists' });
    }

    const now = new Date().toISOString();
    const newPost: Post = {
        id: randomUUID(),
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt || '',
        content: body.content || '',
        coverImageUrl: body.coverImageUrl || '',
        status: body.status || 'draft',
        featured: body.featured || false,
        publishedAt: body.status === 'published' ? now : null,
        createdAt: now,
        updatedAt: now,
    };

    posts.push(newPost);
    return newPost;
});

// 5. Admin: Get Post by ID
server.get('/admin/posts/:id', { preHandler: requireAdmin }, async (request, reply) => {
    const { id } = request.params as any;
    const post = posts.find(p => p.id === id);
    if (!post) {
        return reply.code(404).send({ message: 'Post not found' });
    }
    return post;
});

// 6. Admin: Update Post
server.patch('/admin/posts/:id', { preHandler: requireAdmin }, async (request, reply) => {
    const { id } = request.params as any;
    const body = request.body as any;

    const postIndex = posts.findIndex(p => p.id === id);
    if (postIndex === -1) {
        return reply.code(404).send({ message: 'Post not found' });
    }

    const currentPost = posts[postIndex];

    // Slug conflict check if changing slug
    if (body.slug && body.slug !== currentPost.slug) {
        if (posts.find(p => p.slug === body.slug)) {
            return reply.code(409).send({ code: '23505', message: 'slug already exists' });
        }
    }

    // PublishedAt logic
    let newPublishedAt = currentPost.publishedAt;
    if (body.status === 'published' && currentPost.status !== 'published') {
        newPublishedAt = body.publishedAt || new Date().toISOString();
    } else if (body.status === 'draft') {
        newPublishedAt = null; // As per rule
    } else if (body.publishedAt !== undefined) {
        newPublishedAt = body.publishedAt;
    }

    const updatedPost = {
        ...currentPost,
        ...body,
        publishedAt: newPublishedAt,
        updatedAt: new Date().toISOString()
    };

    posts[postIndex] = updatedPost;
    return updatedPost;
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
