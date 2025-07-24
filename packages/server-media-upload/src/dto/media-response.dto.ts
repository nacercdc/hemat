import { ApiProperty } from '@nestjs/swagger';
import { Media } from '../entities/media.entity';

export class MediaResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  originalName: string;

  @ApiProperty()
  mimeType: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  url: string;

  @ApiProperty({ required: false })
  alt?: string;

  @ApiProperty({ required: false })
  title?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  entityType?: string;

  @ApiProperty({ required: false })
  entityId?: string;

  constructor(media: Media) {
    this.id = media.id;
    this.filename = media.filename;
    this.originalName = media.originalName;
    this.mimeType = media.mimeType;
    this.size = media.size;
    this.url = media.url;
    this.alt = media.alt;
    this.title = media.title;
    this.createdAt = media.createdAt;
    this.entityType = media.entityType;
    this.entityId = media.entityId;
  }

  static fromEntity(media: Media): MediaResponseDto {
    return new MediaResponseDto(media);
  }

  static fromEntities(medias: Media[]): MediaResponseDto[] {
    return medias.map((media) => MediaResponseDto.fromEntity(media));
  }
}
