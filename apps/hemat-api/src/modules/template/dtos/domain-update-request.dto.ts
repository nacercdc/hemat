import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsBoolean,
  IsOptional,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DomainTranslationDto } from '@shared/dtos';

export class DomainUpdateRequestDto {
  @ApiProperty({
    description: 'ID of the domain',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.id.isNotEmpty' })
  @IsString({ message: 'validation.id.isString' })
  @Type(() => String)
  id: string;

  @ApiPropertyOptional({
    description: 'Unique code of the domain',
    example: '1',
    minLength: 1,
    maxLength: 50,
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'validation.code.isString' })
  @Length(1, 50, { message: 'validation.code.length args: min:1 | max:50' })
  @Type(() => String)
  code?: string;

  @ApiPropertyOptional({
    description: 'Name of the domain',
    example: 'Public Health',
    minLength: 1,
    maxLength: 100,
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'validation.name.isString' })
  @Length(1, 100, { message: 'validation.name.length args: min:1 | max:100' })
  @Type(() => String)
  name?: string;

  @ApiPropertyOptional({
    description: 'Description of the domain',
    example: 'Domain covering public health initiatives',
    minLength: 1,
    maxLength: 500,
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'validation.description.isString' })
  @Length(1, 500, {
    message: 'validation.description.length args: min:1 | max:500',
  })
  @Type(() => String)
  description?: string;

  @ApiPropertyOptional({
    description: 'Translations for the domain',
    example: {
      en: {
        code: '1',
        name: 'Public Health',
        description: 'Domain covering public health initiatives',
      },
    },
    type: () => Object,
  })
  @IsOptional()
  @IsObject({ message: 'validation.translations.isObject' })
  @Type(() => Object)
  translations?: Record<string, DomainTranslationDto>;
}
