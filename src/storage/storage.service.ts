import { Injectable, Inject } from '@nestjs/common';
import { StorageStrategy } from './strategies/storage-strategy.interface';
import { MemoryStoredFile } from 'nestjs-form-data';

@Injectable()
export class StorageService {
  constructor(
    @Inject('StorageStrategy') private storageStrategy: StorageStrategy,
  ) {}

  uploadFile(file: MemoryStoredFile): Promise<string> {
    return this.storageStrategy.uploadFile(file);
  }

  deleteFile(key: string): Promise<void> {
    return this.storageStrategy.deleteFile(key);
  }
}
