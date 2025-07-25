import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FILE_UPLOAD_OPTIONS } from '../config';
import { type FileUploadOptions } from '../config/file-upload-options.interface';
import { Media } from '../entities/media.entity';
import {
  FILE_STORAGE_TOKEN,
  FileStorageInterface,
} from '../interfaces/file-storage.interface';
import { MediaService } from './media.service';

@Injectable()
export class FileUploadService {
  constructor(
    @Inject(FILE_UPLOAD_OPTIONS) private options: FileUploadOptions,
    @Inject(FILE_STORAGE_TOKEN)
    private readonly storageRepository: FileStorageInterface,
    private readonly mediaService: MediaService,
  ) {}

  validateFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (this.options.maxFileSize && file.size > this.options.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds the limit of ${this.options.maxFileSize} bytes`,
      );
    }

    if (
      this.options.allowedMimeTypes &&
      this.options.allowedMimeTypes.length > 0 &&
      !this.options.allowedMimeTypes.includes(file.mimetype)
    ) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed. Allowed types: ${this.options.allowedMimeTypes.join(', ')}`,
      );
    }
  }

  async upload(
    file: Express.Multer.File,
    path?: string,
    entityType?: string,
    entityId?: string,
    metadata?: Record<string, any>,
  ): Promise<Media> {
    this.validateFile(file);
    const uploadResult = await this.storageRepository.upload(file, path);
    const media = await this.mediaService.create(uploadResult, metadata);
    if (entityType && entityId) {
      await this.mediaService.updateEntityRelation(
        media.id,
        entityType,
        entityId,
      );
      media.entityType = entityType;
      media.entityId = entityId;
    }

    return media;
  }

  async delete(id: string): Promise<boolean> {
    const media = await this.mediaService.findById(id);

    if (!media) {
      return false;
    }
    await this.storageRepository.delete(media.path);

    return this.mediaService.delete(id);
  }

  getFileUrl(filename: string): string {
    return this.storageRepository.getFileUrl(filename);
  }
}
