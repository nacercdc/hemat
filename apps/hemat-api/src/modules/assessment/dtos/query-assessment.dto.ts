import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { FindAllDto } from '@shared/dtos';
import { IsArrayContains } from '@shared/validators';
import { AssessmentStatus } from '@shared/enums';

export class FindAllAssessmentDto extends FindAllDto {
  @ApiPropertyOptional({
    description: 'Comma-separated relations (e.g., user,members)',
    type: String,
  })
  @IsArrayContains(['user', 'members', 'groups'])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  include: string[] = [];

  @ApiPropertyOptional({
    description: 'Comma-separated ascending sort fields (e.g., name,createdAt)',
    type: String,
  })
  @IsArrayContains(['name', 'createdAt'])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  ascending: string[] = [];

  @ApiPropertyOptional({
    description:
      'Comma-separated descending sort fields (e.g., name,createdAt)',
    type: String,
  })
  @IsArrayContains(['name', 'createdAt'])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  descending: string[] = [];

  @ApiPropertyOptional({
    description: 'Filter records by status',
    enum: AssessmentStatus,
    example: AssessmentStatus.READY,
  })
  @IsOptional()
  @IsEnum(AssessmentStatus, { message: 'validation.status.isEnum' })
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim() : undefined))
  status?: AssessmentStatus;
}

export class FindOneAssessmentDto {
  @ApiPropertyOptional({
    description: 'Comma-separated relations (e.g., user,country)',
    type: String,
  })
  @IsArrayContains(['user', 'members', 'groups'])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  include: string[] = [];
}
