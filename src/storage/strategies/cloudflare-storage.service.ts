import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsCommand,
} from '@aws-sdk/client-s3';
import { MemoryStoredFile } from 'nestjs-form-data';
import { ConfigService } from '@nestjs/config';
import { StorageStrategy } from './storage-strategy.interface';

@Injectable()
export class CloudflareStorageService implements StorageStrategy {
  private s3Client: S3Client;
  private configService = new ConfigService();

  constructor() {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: this.configService.get<string>('CLOUDFLARE_R2_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.get<string>(
          'CLOUDFLARE_R2_ADMIN_ACCESS_KEY_ID',
        ),
        secretAccessKey: this.configService.get<string>(
          'CLOUDFLARE_R2_ADMIN_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async uploadFile(file: MemoryStoredFile): Promise<string> {
    const key = `${Date.now()}-${file.originalName}`;
    const command = new PutObjectCommand({
      Bucket: this.configService.get<string>('CLOUDFLARE_R2_BUCKET_NAME'),
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    await this.s3Client.send(command);
    return `${this.configService.get<string>('CLOUD_FLARE_PUBLIC_ENDPOINT')}/${key}`;
  }

  async deleteFile(key: string): Promise<void> {
    const keyParts = key.split('/');
    const fileKey = keyParts[keyParts.length - 1];
    const command = new DeleteObjectCommand({
      Bucket: this.configService.get<string>('CLOUDFLARE_R2_BUCKET_NAME'),
      Key: fileKey,
    });
    await this.s3Client.send(command);
  }

  async deleteAll(): Promise<void> {
    const command = new ListObjectsCommand({
      Bucket: this.configService.get<string>('CLOUDFLARE_R2_BUCKET_NAME'),
    });
    const { Contents } = await this.s3Client.send(command);
    if (Contents) {
      for (const content of Contents) {
        await this.deleteFile(content.Key);
      }
    }
  }
}
