import { FastifyInstance } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { uploadFile, deleteFile } from '../services/s3';
import { assets } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { Readable } from 'stream';

// We need to access the database pool from the main app or pass it in. 
// For better modularity in this codebase style (where db is in app.ts or similar), 
// we might assume 'server.db' or similar if we used plugins cleanly.
// However, looking at app.ts, 'pool' is local. Ideally, we should export the db/pool or use dependency injection.
// Given strict instructions to "create src/services/s3.ts" and "create src/routes/cmsAssets.ts" 
// and "register in app.ts", and seeing app.ts uses 'pg' pool directly:
// I will adhere to the existing pattern: I'll accept the pool as a plugin option or importing a singleton if one existed.
// BUT, since 'pool' is local in app.ts, I will refactor app.ts to export the pool OR pass it to this route registration.
// Let's assume we will pass { pool } in options.

interface CmsAssetsOptions {
    pool: any; // pg.Pool
}

export default async function cmsAssetsRoutes(server: FastifyInstance, options: CmsAssetsOptions) {
    const { pool } = options;

    // POST /cms/assets/upload
    server.post('/cms/assets/upload', async (request, reply) => {
        const data = await request.file();
        if (!data) {
            return reply.code(400).send({ status: 'error', message: 'No file uploaded' });
        }

        const { filename, mimetype, file } = data;

        // 1. Validation
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedMimeTypes.includes(mimetype)) {
            return reply.code(400).send({ status: 'error', message: 'Invalid file type. Only images allowed.' });
        }

        // 2. Generate Key
        const ext = filename.split('.').pop() || 'bin';
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const id = uuidv4();
        const key = `uploads/${year}/${month}/${id}.${ext}`;

        // 3. Upload to S3
        // We need to calculate size. Fastify-multipart stream doesn't give size upfront strictly unless we buffer.
        // For 10MB limit (handled by fastify-multipart busboy config), buffering is acceptable or we rely on stream.
        // However, to save 'size' to DB, we need to know it. 
        // Option A: Buffer it (easiest for size). 
        // Option B: Pass stream to S3, and standard S3 upload might not give byte count easily without buffering? 
        // Actually, Upload lib handles stream. But we still need 'size' for DB.
        // Let's buffer since 10MB is small.
        const buffer = await data.toBuffer();
        const size = buffer.length;

        // Re-create stream from buffer for S3 upload (or upload buffer directly if supported, SDK supports buffer)
        // Upload supports Body: Buffer.

        try {
            const result = await uploadFile(buffer as any, key, mimetype);

            // 4. Insert into DB
            // Using raw SQL as per existing app.ts usage of 'pg' pool, even though Drizzle is installed we saw app.ts using raw SQL?
            // Wait, app.ts uses 'pool.query'. The prompt said "Implement the table assets in Drizzle schema".
            // It's weird to mix Drizzle schema definition but raw SQL in endpoints. 
            // User "Create src/services/assets.ts (or use drizzle directly in route)". 
            // Since app.ts uses raw SQL heavily, sticking to that for consistency might be safer OR I can use Drizzle if I instantiate it.
            // Let's use raw SQL to match app.ts style exactly for now, ensuring 100% compatibility with what I saw in app.ts.

            const r = await pool.query(
                `INSERT INTO assets 
           (id, key, url, filename, mime, size, width, height, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
           RETURNING *`,
                [id, result.key, result.url, filename, mimetype, size, null, null]
                // width/height are null for now as per "Opcional" requirement
            );

            return reply.code(201).send(r.rows[0]);

        } catch (err: any) {
            request.log.error({ err }, 'upload failed');
            return reply.code(500).send({ status: 'error', message: err.message });
        }
    });

    // GET /cms/assets
    server.get('/cms/assets', async (request, reply) => {
        const query = request.query as { limit?: string; cursor?: string };
        const limit = Math.max(1, Math.min(50, Number(query.limit || 20)));
        const cursor = query.cursor; // Assume cursor is 'created_at' ISO string for simple seek pagination

        try {
            let sql = `SELECT * FROM assets`;
            const params: any[] = [limit];

            if (cursor) {
                sql += ` WHERE created_at < $2`;
                params.push(cursor);
            }

            sql += ` ORDER BY created_at DESC LIMIT $1`;

            const r = await pool.query(sql, params);

            let nextCursor = null;
            if (r.rows.length === limit) {
                nextCursor = r.rows[r.rows.length - 1].created_at;
            }

            return { items: r.rows, nextCursor };

        } catch (err: any) {
            return reply.code(500).send({ status: 'error', message: err.message });
        }
    });

    // DELETE /cms/assets/:id
    server.delete<{ Params: { id: string } }>('/cms/assets/:id', async (request, reply) => {
        const { id } = request.params;

        try {
            // 1. Get Key
            const r = await pool.query(`SELECT key FROM assets WHERE id = $1`, [id]);
            if (r.rows.length === 0) {
                return reply.code(404).send({ status: 'error', message: 'Asset not found' });
            }
            const { key } = r.rows[0];

            // 2. Delete from S3
            await deleteFile(key);

            // 3. Delete from DB
            await pool.query(`DELETE FROM assets WHERE id = $1`, [id]);

            return { status: 'ok', deleted: true };
        } catch (err: any) {
            return reply.code(500).send({ status: 'error', message: err.message });
        }
    });
}
