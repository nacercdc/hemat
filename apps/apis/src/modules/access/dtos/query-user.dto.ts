import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { FindAllDto } from '@shared/dtos';
import { IsArrayContains } from '@shared/validators';

export class FindAllUserDto extends FindAllDto {
  @ApiPropertyOptional({
    description: 'Comma-separated relations (e.g., roles,profile,permissions)',
    type: String,
  })
  @IsArrayContains(['roles', 'profile', 'permissions'])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  include: string[] = [];

  @ApiPropertyOptional({
    description:
      'Comma-separated ascending sort fields (e.g., name,email,createdAt)',
    type: String,
  })
  @IsArrayContains(['name', 'email', 'createdAt', 'updatedAt'])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  ascending: string[] = [];

  @ApiPropertyOptional({
    description:
      'Comma-separated descending sort fields (e.g., name,email,createdAt)',
    type: String,
  })
  @IsArrayContains(['name', 'email', 'createdAt', 'updatedAt'])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  descending: string[] = [];

  @ApiPropertyOptional({
    description: 'Filter by isAdmin status',
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isAdmin?: boolean;
}

export class FindOneUserDto {
  @ApiPropertyOptional({
    description: 'Comma-separated relations (e.g., roles,profile,permissions)',
    type: String,
  })
  @IsArrayContains(['roles', 'profile', 'permissions'])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  include: string[] = [];
}
