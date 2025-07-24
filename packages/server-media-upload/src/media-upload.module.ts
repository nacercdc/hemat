import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadOptions } from './config/file-upload-options.interface';
import { FILE_UPLOAD_OPTIONS } from './config/file-upload.config';
import { FileUploadController } from './controllers/file-upload.controller';
import { Media } from './entities/media.entity';
import { FILE_STORAGE_TOKEN } from './interfaces/file-storage.interface';
import { MediaRepository } from './repositories/media.repository';
import { FileUploadService } from './services/file-upload.service';
import { MediaService } from './services/media.service';
import {
  registerDefaultStorageProviders,
  StorageRegistry,
} from './storage.registry';

@Module({})
export class MediaUploadModule {
  onModuleInit() {
    registerDefaultStorageProviders();
  }

  static register(options: FileUploadOptions): DynamicModule {
    registerDefaultStorageProviders();
    return {
      module: MediaUploadModule,
      imports: [TypeOrmModule.forFeature([Media])],
      controllers: [FileUploadController],
      providers: [
        {
          provide: FILE_UPLOAD_OPTIONS,
          useValue: options,
        },
        {
          provide: FILE_STORAGE_TOKEN,
          useFactory: () => {
            try {
              return StorageRegistry.create(options.storage, options);
            } catch (error: any) {
              console.warn(
                `Storage type '${options.storage}' not available: ${error}`,
              );
              console.warn('Falling back to local storage');
              return StorageRegistry.create('local', options);
            }
          },
        },
        FileUploadService,
        MediaService,
        MediaRepository,
      ],
      exports: [FileUploadService, MediaService, FILE_UPLOAD_OPTIONS],
    };
  }

  static registerStorageProvider(
    type: string,
    storageClass: new (options: FileUploadOptions) => any,
  ) {
    StorageRegistry.register(type, storageClass);
  }
}
