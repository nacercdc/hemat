import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { FindAllDto } from '@shared/dtos';
import { IsArrayContains } from '@shared/validators';

export class FindAllAssessmentDto extends FindAllDto {
  @ApiPropertyOptional({
    description: 'Comma-separated relations (e.g., user,country,members)',
    type: String,
  })
  @IsArrayContains(['user', 'country', 'members', 'groups'])
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
}

export class FindOneAssessmentDto {
  @ApiPropertyOptional({
    description: 'Comma-separated relations (e.g., user,country)',
    type: String,
  })
  @IsArrayContains(['user', 'country', 'members', 'groups'])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  include: string[] = [];
}
