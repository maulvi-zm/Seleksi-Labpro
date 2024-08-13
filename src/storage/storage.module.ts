import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { LocalStorageService } from './strategies/local-storage.service';
import { CloudflareStorageService } from './strategies/cloudflare-storage.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: 'StorageStrategy',
      useFactory: (configService: ConfigService) => {
        const storageType = configService.get<string>('STORAGE_TYPE');
        if (storageType === 'CLOUDFLARE_R2') {
          return new CloudflareStorageService();
        } else {
          return new LocalStorageService();
        }
      },
      inject: [ConfigService],
    },
    StorageService,
  ],
  exports: [StorageService],
})
export class StorageModule {}
