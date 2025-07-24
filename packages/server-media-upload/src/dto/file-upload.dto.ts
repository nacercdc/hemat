import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  path?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  entityType?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  entityId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  alt?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;
}
