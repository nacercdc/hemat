import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { FindAllDto } from '@shared/dtos';
import { IsArrayContains } from '@shared/validators';

export class FindAllAssessmentMeasurementScaleSubComponentDto extends FindAllDto {
  @ApiPropertyOptional({
    description: 'Comma-separated relations (e.g., measurementScale)',
    type: String,
  })
  @IsArrayContains(['measurementScale'])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  include: string[] = [];

  @ApiPropertyOptional({
    description: 'Comma separated ascending sort fields',
    type: String,
  })
  @IsArrayContains(['description', 'createdAt', 'updatedAt'])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  ascending: string[] = [];

  @ApiPropertyOptional({
    description: 'Comma separated descending sort fields',
    type: String,
  })
  @IsArrayContains(['description', 'createdAt', 'updatedAt'])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  descending: string[] = [];

  @ApiPropertyOptional({
    description: 'Filter records by active/inactive status',
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'validation.isActive.isBoolean' })
  @Transform(({ value }) =>
    !['true', 'false'].includes(value) ? null : value === 'true',
  )
  isActive: boolean | null = null;
}
