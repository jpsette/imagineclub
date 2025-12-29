import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import type { Readable } from 'stream';

// Initialize S3 Client
const s3Region = process.env.S3_REGION || 'nyc3';
const s3Endpoint = process.env.S3_ENDPOINT || 'https://nyc3.digitaloceanspaces.com';

const s3 = new S3Client({
    region: s3Region,
    endpoint: s3Endpoint,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    },
    forcePathStyle: false, // DigitalOcean Spaces usually works well with default or forcePathStyle: false for custom domains
});

const BUCKET = process.env.S3_BUCKET || 'imagineclub';
const PUBLIC_BASE_URL = process.env.S3_PUBLIC_BASE_URL || `https://${BUCKET}.${s3Region}.digitaloceanspaces.com`;

interface UploadResult {
    key: string;
    url: string;
    eTag?: string;
}

export async function uploadFile(
    fileStream: Readable,
    key: string,
    mimetype: string
): Promise<UploadResult> {
    const upload = new Upload({
        client: s3,
        params: {
            Bucket: BUCKET,
            Key: key,
            Body: fileStream,
            ContentType: mimetype,
            ACL: 'public-read', // Ensure public readability if DO Spaces settings require it
        },
    });

    const result = await upload.done();

    // Construct Public URL
    // If we have a custom public URL configured, use it. Otherwise fallback to standard DO URL.
    // Note: result.Location from SDK might be the internal S3 URL.
    const publicUrl = `${PUBLIC_BASE_URL}/${key}`;

    return {
        key,
        url: publicUrl,
        eTag: result.ETag,
    };
}

export async function deleteFile(key: string): Promise<void> {
    const cmd = new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: key,
    });
    await s3.send(cmd);
}
