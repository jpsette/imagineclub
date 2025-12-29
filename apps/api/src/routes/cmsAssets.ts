import { FastifyInstance } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { uploadFile, deleteFile } from '../services/s3';
import { Pool } from 'pg';

interface CmsAssetsOptions {
    pool: Pool;
}



interface AssetRow {
    id: string;
    key: string;
    url: string;
    created_at: Date;
    [key: string]: unknown;
}

export default async function cmsAssetsRoutes(server: FastifyInstance, options: CmsAssetsOptions) {
    const { pool } = options;

    // POST /cms/assets/upload
    server.post('/cms/assets/upload', async (request, reply) => {
        const data = await request.file();
        if (!data) {
            return reply.code(400).send({ status: 'error', message: 'No file uploaded' });
        }

        const { filename, mimetype } = data;

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
        const buffer = await data.toBuffer();
        const size = buffer.length;

        try {
            const result = await uploadFile(buffer as unknown as import('stream').Readable, key, mimetype);

            // 4. Insert into DB
            const r = await pool.query(
                `INSERT INTO assets 
           (id, key, url, filename, mime, size, width, height, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
           RETURNING *`,
                [id, result.key, result.url, filename, mimetype, size, null, null]
            );

            return reply.code(201).send(r.rows[0]);

        } catch (err: unknown) {
            request.log.error({ err }, 'upload failed');
            const message = err instanceof Error ? err.message : 'Unknown error';
            return reply.code(500).send({ status: 'error', message });
        }
    });

    // GET /cms/assets
    server.get('/cms/assets', async (request, reply) => {
        const query = request.query as { limit?: string; cursor?: string };
        const limit = Math.max(1, Math.min(50, Number(query.limit || 20)));
        const cursor = query.cursor;

        try {
            let sql = `SELECT * FROM assets`;
            const params: (string | number)[] = [limit];

            if (cursor) {
                sql += ` WHERE created_at < $2`;
                params.push(cursor);
            }

            sql += ` ORDER BY created_at DESC LIMIT $1`;

            const r = await pool.query(sql, params);

            let nextCursor = null;
            if (r.rows.length === limit) {
                const lastRow = r.rows[r.rows.length - 1] as AssetRow;
                nextCursor = lastRow.created_at;
            }

            return { items: r.rows, nextCursor };

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            return reply.code(500).send({ status: 'error', message });
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
            const { key } = r.rows[0] as AssetRow;

            // 2. Delete from S3
            await deleteFile(key);

            // 3. Delete from DB
            await pool.query(`DELETE FROM assets WHERE id = $1`, [id]);

            return { status: 'ok', deleted: true };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            return reply.code(500).send({ status: 'error', message });
        }
    });
}
