import { MemoryStoredFile } from 'nestjs-form-data';

export interface StorageStrategy {
  uploadFile(file: MemoryStoredFile): Promise<string>;
  deleteFile(key: string): Promise<void>;
}
