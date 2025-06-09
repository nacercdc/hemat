import { ApiPropertyOptional } from '@nestjs/swagger';
import { FindAllDto } from '@shared/dtos';
import { IsArrayContains } from '@shared/validators';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class FindAllRoadmapDto extends FindAllDto {
  @ApiPropertyOptional({
    description:
      'Comma-separated relations (e.g., assessmentAnswer,subComponent,measurementScale)',
    type: String,
  })
  @IsArrayContains(['assessmentAnswer', 'subComponent', 'measurementScale'])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  include: string[] = [];

  @ApiPropertyOptional({
    description:
      'Comma-separated ascending sort fields (e.g., createdAt,updatedAt,startTime,endTime)',
    type: String,
  })
  @IsArrayContains(['createdAt', 'updatedAt', 'startTime', 'endTime'])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  ascending: string[] = [];

  @ApiPropertyOptional({
    description:
      'Comma-separated descending sort fields (e.g., createdAt,updatedAt,startTime,endTime)',
    type: String,
  })
  @IsArrayContains(['createdAt', 'updatedAt', 'startTime', 'endTime'])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  descending: string[] = [];
}

export class FindOneRoadmapDto {
  @ApiPropertyOptional({
    description:
      'Comma-separated relations (e.g., assessmentAnswer,subComponent,measurementScale)',
    type: String,
  })
  @IsArrayContains(['assessmentAnswer', 'subComponent', 'measurementScale'])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  include: string[] = [];
}
