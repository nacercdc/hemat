import { ApiPropertyOptional } from '@nestjs/swagger';
import { FindAllDto } from '@shared/dtos';
import { IsArrayContains } from '@shared/validators';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class FindAllAssessmentAnswerDto extends FindAllDto {
  @ApiPropertyOptional({
    description:
      'Comma-separated relations (e.g., assessment,user,subComponent,measurementScale,roadmaps)',
    type: String,
  })
  @IsArrayContains([
    'assessment',
    'user',
    'subComponent',
    'measurementScale',
    'roadmaps',
  ])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  include: string[] = [];

  @ApiPropertyOptional({
    description:
      'Comma-separated ascending sort fields (e.g., createdAt,updatedAt)',
    type: String,
  })
  @IsArrayContains(['createdAt', 'updatedAt'])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  ascending: string[] = [];

  @ApiPropertyOptional({
    description:
      'Comma-separated descending sort fields (e.g., createdAt,updatedAt)',
    type: String,
  })
  @IsArrayContains(['createdAt', 'updatedAt'])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  descending: string[] = [];
}

export class FindOneAssessmentAnswerDto {
  @ApiPropertyOptional({
    description:
      'Comma-separated relations (e.g., assessment,user,subComponent,measurementScale,roadmaps)',
    type: String,
  })
  @IsArrayContains([
    'assessment',
    'user',
    'subComponent',
    'measurementScale',
    'roadmaps',
  ])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  include: string[] = [];
}
