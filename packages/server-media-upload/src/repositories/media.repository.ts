import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from '../entities/media.entity';
import { UploadResult } from '../interfaces/upload-result.interface';

@Injectable()
export class MediaRepository {
  constructor(
    @InjectRepository(Media)
    private readonly repository: Repository<Media>,
  ) {}

  async create(
    uploadResult: UploadResult,
    metadata?: Record<string, any>,
  ): Promise<Media> {
    const media = new Media();
    media.filename = uploadResult.filename;
    media.originalName = uploadResult.originalName;
    media.mimeType = uploadResult.mimeType;
    media.size = uploadResult.size;
    media.path = uploadResult.path;
    media.url = uploadResult.url;
    media.storageType = uploadResult.storageType;

    if (metadata) {
      media.metadata = metadata;
    }
    return this.repository.save(media);
  }

  async findById(id: string): Promise<Media | null> {
    return this.repository.findOneBy({ id });
  }

  async findByEntityRelation(
    entityType: string,
    entityId: string,
  ): Promise<Media[]> {
    return this.repository.find({
      where: {
        entityType,
        entityId,
      },
    });
  }

  async updateEntityRelation(
    id: string,
    entityType: string,
    entityId: string,
  ): Promise<Media | null> {
    await this.repository.update({ id }, { entityType, entityId });

    return this.findById(id);
  }

  async updateMetadata(
    id: string,
    metadata: Record<string, any>,
  ): Promise<Media | null> {
    await this.repository.update({ id }, { metadata });

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (
      result.affected !== undefined &&
      result.affected !== null &&
      result.affected > 0
    );
  }
}
