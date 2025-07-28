import { Injectable, NotFoundException } from '@nestjs/common';
import { MediaRepository } from '../repositories/media.repository';
import { Media } from '../entities/media.entity';
import { UploadResult } from '../interfaces/upload-result.interface';

@Injectable()
export class MediaService {
  constructor(private readonly mediaRepository: MediaRepository) {}

  async create(
    uploadResult: UploadResult,
    metadata?: Record<string, any>,
  ): Promise<Media> {
    return this.mediaRepository.create(uploadResult, metadata);
  }

  async findById(id: string): Promise<Media> {
    const media = await this.mediaRepository.findById(id);

    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }

    return media;
  }

  async findByEntityRelation(
    entityType: string,
    entityId: string,
  ): Promise<Media[]> {
    return this.mediaRepository.findByEntityRelation(entityType, entityId);
  }

  async updateEntityRelation(
    id: string,
    entityType: string,
    entityId: string,
  ): Promise<Media> {
    const media = await this.mediaRepository.updateEntityRelation(
      id,
      entityType,
      entityId,
    );

    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }

    return media;
  }

  async updateMetadata(
    id: string,
    metadata: Record<string, any>,
  ): Promise<Media> {
    const media = await this.mediaRepository.updateMetadata(id, metadata);

    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }

    return media;
  }

  async delete(id: string): Promise<boolean> {
    return this.mediaRepository.delete(id);
  }
}
