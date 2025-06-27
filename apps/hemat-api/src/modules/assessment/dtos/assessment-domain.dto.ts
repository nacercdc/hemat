import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNotEmpty, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { DomainTranslationDto } from '../../../shared/dtos';
import { IsUnique } from '@shared/validators';

export class AssessmentDomainDto {
  @ApiProperty({
    description: 'ID of the domain',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.id.isNotEmpty' })
  @IsString({ message: 'validation.id.isString' })
  @Type(() => String)
  id: string;

  @ApiProperty({
    description: 'Unique code of the domain',
    example: '1',
    minLength: 1,
    maxLength: 10,
    type: String,
  })
  @IsNotEmpty({ message: 'validation.name.isNotEmpty' })
  @IsString({ message: 'validation.name.isString' })
  @Length(1, 10, { message: 'validation.code.length args: min:1 | max:10' })
  @IsUnique(
    {
      tableName: 'assessment-domains',
      columns: ['code'],
      exclude: 'id'
    },
    { message: 'validation.code.isUnique' },
  )
  @Type(() => String)
  code: string;

  @ApiProperty({
    description: 'Name of the domain',
    example: 'Public Health',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.name.isNotEmpt  y' })
  @IsString({ message: 'validation.name.isString' })
  @Length(1, 100, { message: 'validation.name.length args: 1,100' })
  @IsUnique(
    { tableName: 'assessment-domains', columns: ['name'], exclude: 'id' },
    { message: 'validation.name.isUnique' },
  )
  @Type(() => String)
  name: string;

  @ApiProperty({
    description: 'Description of the domain',
    example: 'Domain covering public health initiatives',
    minLength: 1,
    maxLength: 500,
    type: String,
  })
  @IsNotEmpty({ message: 'validation.description.isNotEmpty' })
  @IsString({ message: 'validation.description.isString' })
  @Length(1, 500, { message: 'validation.description.length args: 1,500' })
  @Type(() => String)
  description: string;

  @ApiProperty({
    description: 'Translations for the domain',
    example: {
      en: {
        code: '1',
        name: 'Public Health',
        description: 'Domain covering public health initiatives',
      },
    },
    type: () => DomainTranslationDto,
  })
  @IsNotEmpty({ message: 'validation.translations.isNotEmpty' })
  @IsObject({ message: 'validation.translations.isObject' })
  @Type(() => Object)
  translations: Record<string, DomainTranslationDto>;
}
