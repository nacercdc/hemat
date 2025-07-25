import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  BadRequestException,
  UploadedFile as NestUploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { FileUploadService } from '../services/file-upload.service';
import { MediaService } from '../services/media.service';
import { FileUploadDto } from '../dto/file-upload.dto';
import { MediaResponseDto } from '../dto/media-response.dto';

@ApiTags('file-upload')
@Controller('file-upload')
export class FileUploadController {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly mediaService: MediaService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  async uploadFile(
    @NestUploadedFile() file: Express.Multer.File,
    @Body() body: FileUploadDto,
  ): Promise<MediaResponseDto> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const { path, entityType, entityId, alt, title } = body;

    const metadata: Record<string, any> = {};

    if (alt) {
      metadata.alt = alt;
    }

    if (title) {
      metadata.title = title;
    }
    const media = await this.fileUploadService.upload(
      file,
      path,
      entityType,
      entityId,
      metadata,
    );

    return MediaResponseDto.fromEntity(media);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Media ID' })
  async getMedia(@Param('id') id: string): Promise<MediaResponseDto> {
    const media = await this.mediaService.findById(id);
    return MediaResponseDto.fromEntity(media);
  }

  @Get()
  @ApiQuery({ name: 'entityType', required: false })
  @ApiQuery({ name: 'entityId', required: false })
  async getMediaByEntity(
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
  ): Promise<MediaResponseDto[]> {
    if (!entityType || !entityId) {
      throw new BadRequestException('entityType and entityId are required');
    }

    const medias = await this.mediaService.findByEntityRelation(
      entityType,
      entityId,
    );
    return MediaResponseDto.fromEntities(medias);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Media ID' })
  async deleteMedia(@Param('id') id: string): Promise<{ success: boolean }> {
    const success = await this.fileUploadService.delete(id);
    return { success };
  }
}
