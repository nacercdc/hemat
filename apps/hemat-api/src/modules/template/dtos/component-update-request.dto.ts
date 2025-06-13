import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsUUID,
  IsOptional,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ComponentTranslationDto } from '@shared/dtos';
import { IsUnique } from '@shared/validators';

export class ComponentUpdateRequestDto {
  @ApiProperty({
    description: 'ID of the component',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.id.isNotEmpty' })
  @IsString({ message: 'validation.id.isString' })
  @Type(() => String)
  id: string;

  @ApiPropertyOptional({
    description: 'Unique code of the component',
    example: '1.A',
    minLength: 1,
    maxLength: 50,
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'validation.code.isString' })
  @Length(1, 50, { message: 'validation.code.length args: min:1 | max:50' })
  @IsUnique(
    { tableName: 'components', columns: ['code'], exclude: 'id' },
    { message: 'validation.code.isUnique' },
  )
  @Type(() => String)
  code?: string;

  @ApiPropertyOptional({
    description: 'Name of the component',
    example: 'Vaccination Program',
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
    description: 'Description of the component',
    example: 'Component for vaccination initiatives',
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
    description: 'ID of the associated domain',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsOptional()
  @IsUUID('4', { message: 'validation.domainId.isUUID' })
  @Type(() => String)
  domainId?: string;

  @ApiPropertyOptional({
    description: 'Translations for the Component',
    example: {
      en: {
        code: '1',
        name: 'Public Health',
        description: 'Component covering public health initiatives',
      },
    },
    type: () => Object,
  })
  @IsOptional()
  @IsObject({ message: 'validation.translations.isObject' })
  @Type(() => Object)
  translations?: Record<string, ComponentTranslationDto>;
}
