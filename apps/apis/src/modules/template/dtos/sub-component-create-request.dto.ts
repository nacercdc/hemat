import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsUUID,
  IsBoolean,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  MeasurementScaleSubcomponentTranslationDto,
  SubcomponenttanslationDto,
} from '@africa-cdc/shared/dtos';

export class SubComponentCreateRequestDto {
  @ApiProperty({
    description: 'Unique code of the sub-component',
    example: '1.A.1',
    minLength: 1,
    maxLength: 50,
    type: String,
  })
  @IsNotEmpty({ message: 'validation.code.isNotEmpty' })
  @IsString({ message: 'validation.code.isString' })
  @Length(1, 50, { message: 'validation.code.length args: min:1 | max:50' })
  @Type(() => String)
  code: string;

  @ApiProperty({
    description: 'Name of the sub-component',
    example: 'Vaccine Distribution',
    minLength: 1,
    maxLength: 100,
    type: String,
  })
  @IsNotEmpty({ message: 'validation.name.isNotEmpty' })
  @IsString({ message: 'validation.name.isString' })
  @Length(1, 100, { message: 'validation.name.length args: min:1 | max:100' })
  @Type(() => String)
  name: string;

  @ApiProperty({
    description: 'Description of the sub-component',
    example: 'Sub-component for vaccine distribution',
    minLength: 1,
    maxLength: 500,
    type: String,
  })
  @IsNotEmpty({ message: 'validation.description.isNotEmpty' })
  @IsString({ message: 'validation.description.isString' })
  @Length(1, 500, {
    message: 'validation.description.length args: min:1 | max:500',
  })
  @Type(() => String)
  description: string;

  @ApiProperty({
    description: 'Whether the sub-component is active',
    example: true,
    type: Boolean,
  })
  @IsNotEmpty({ message: 'validation.isActive.isNotEmpty' })
  @IsBoolean({ message: 'validation.isActive.isBoolean' })
  @Type(() => Boolean)
  isActive: boolean;

  @ApiProperty({
    description: 'ID of the associated component',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.componentId.isNotEmpty' })
  @IsUUID('4', { message: 'validation.componentId.isUUID' })
  @Type(() => String)
  componentId: string;

  @ApiProperty({
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
  @IsNotEmpty({ message: 'validation.translations.isNotEmpty' })
  @IsObject({ message: 'validation.translations.isObject' })
  @Type(() => Object)
  translations: Record<string, SubcomponenttanslationDto>;
}

export class SubComponentMeasurementScaleDto {
  @ApiProperty({
    description: 'ID of the measurement scale',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.measurementScaleId.isNotEmpty' })
  @IsUUID('4', { message: 'validation.measurementScaleId.isUUID' })
  @Type(() => String)
  measurementScaleId: string;

  @ApiProperty({
    description:
      'Description of the sub-component and measurement scale combination',
    example: 'This scale indicates a basic level of implementation.',
    minLength: 1,
    maxLength: 500,
    type: String,
  })
  @IsNotEmpty({ message: 'validation.description.isNotEmpty' })
  @IsString({ message: 'validation.description.isString' })
  @Length(1, 500, {
    message: 'validation.description.length args: min:1 | max:500',
  })
  @Type(() => String)
  description: string;

  @ApiProperty({
    description: 'Translations for the description',
    example: {
      en: {
        description: 'Domain covering public health initiatives',
      },
    },
    type: () => Object,
  })
  @IsNotEmpty({ message: 'validation.translations.isNotEmpty' })
  @IsObject({ message: 'validation.translations.isObject' })
  @Type(() => Object)
  translations: Record<string, MeasurementScaleSubcomponentTranslationDto>;
}