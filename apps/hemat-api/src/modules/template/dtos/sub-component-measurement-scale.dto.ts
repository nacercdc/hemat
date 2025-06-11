import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  IsUUID,
  IsObject,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsExists } from '@shared/validators';
import { MeasurementScaleSubcomponentTranslationDto } from '@shared/dtos';

export class SubComponentMeasurementScaleDto {
  @ApiProperty({
    description: 'ID of the measurement scale',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.measurementScaleId.isNotEmpty' })
  @IsExists(
    { tableName: 'measurement_scales', columns: ['id'] },
    { message: 'validation.measurementScaleId.isExists' },
  )
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

export class UpdateSubComponentMeasurementScaleDto {
  @ApiProperty({
    description:
      'Description of the sub-component and measurement scale combination',
    example: 'This scale indicates a basic level of implementation.',
    minLength: 1,
    maxLength: 500,
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'validation.description.isString' })
  @Length(1, 500, {
    message: 'validation.description.length args: min:1 | max:500',
  })
  @Type(() => String)
  description?: string;

  @ApiProperty({
    description: 'Translations for the description',
    example: {
      en: {
        description: 'Domain covering public health initiatives',
      },
    },
    type: () => Object,
    required: false,
  })
  @IsOptional()
  @IsObject({ message: 'validation.translations.isObject' })
  @Type(() => Object)
  translations?: Record<string, MeasurementScaleSubcomponentTranslationDto>;
}
