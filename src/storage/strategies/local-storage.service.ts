import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { MemoryStoredFile } from 'nestjs-form-data';
import { StorageStrategy } from './storage-strategy.interface';

@Injectable()
export class LocalStorageService implements StorageStrategy {
  private readonly uploadPath = path.join(
    process.cwd(),
    'dist',
    'public',
    'uploads',
  );

  constructor() {
    fs.mkdir(this.uploadPath, { recursive: true }).catch(console.error);
  }

  async uploadFile(file: MemoryStoredFile): Promise<string> {
    const fileName = `${Date.now()}-${file.originalName}`;
    const filePath = path.join(this.uploadPath, fileName);
    await fs.writeFile(filePath, file.buffer);
    return `http://localhost:3000/uploads/${fileName}`;
  }

  async deleteFile(filePath: string): Promise<void> {
    const fileName = filePath.split('/').pop();

    await fs.unlink(path.join(this.uploadPath, fileName)).catch(console.error);
  }
}
