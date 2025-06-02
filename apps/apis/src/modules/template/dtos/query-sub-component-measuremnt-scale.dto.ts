// src/sub-components/dtos/find-all-sub-component-measurement-scale.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { FindAllDto } from '@shared/dtos';
import { IsArrayContains } from '@shared/validators';

export class FindAllSubComponentMeasurementScaleDto extends FindAllDto {
  @ApiPropertyOptional({
    description:
      'Comma-separated relations (e.g., subComponent,measurementScale)',
    type: String,
  })
  @IsArrayContains(['subComponent', 'measurementScale'])
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
  ascending?: string[];

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
  descending?: string[];
}
