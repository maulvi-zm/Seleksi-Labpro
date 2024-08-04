import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { MemoryStoredFile } from 'nestjs-form-data';

@Injectable()
export class CloudflareService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ADMIN_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_R2_ADMIN_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadFile(file: MemoryStoredFile): Promise<string> {
    const key = `${Date.now()}-${file.originalName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);

    // Generate a signed URL for the uploaded file
    const signedUrl = process.env.CLOUD_FLARE_PUBLIC_ENDPOINT + '/' + key;

    return signedUrl;
  }

  async deleteFile(key: string): Promise<void> {
    // Get file name from the URL
    const keyParts = key.split('/');

    if (keyParts.length === 0) {
      throw new Error('Invalid key');
    }

    const fileKey = keyParts[keyParts.length - 1];

    try {
      const command = new DeleteObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: fileKey,
      });

      await this.s3Client.send(command);

      return;
    } catch (error) {
      console.error('Failed to delete file', error);
    }
  }
}
