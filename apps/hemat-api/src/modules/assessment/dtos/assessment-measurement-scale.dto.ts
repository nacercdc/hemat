import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { MeasurementScaleTranslationDto } from '../../../shared/dtos';

export class AssessmentMeasurementScaleDto {
  @ApiPropertyOptional({
    description: 'Name of the measurement scale',
    example: 'Initial',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  @Type(() => String)
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the measurement scale',
    example: 'Basic HIE planning stage',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  @Type(() => String)
  description: string;

  @ApiPropertyOptional({
    description: 'Color associated with the measurement scale',
    example: '#FF0000',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 7)
  @Type(() => String)
  color: string;

  @ApiPropertyOptional({
    description: 'Rate of the measurement scale',
    example: 1,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  rate: number;

  @ApiPropertyOptional({
    description: 'Translations for the measurement scale',
    type: () => MeasurementScaleTranslationDto,
  })
  @IsNotEmpty()
  @Type(() => MeasurementScaleTranslationDto)
  translations: Record<string, MeasurementScaleTranslationDto> = {};

  templateMeasurementScaleId?: string;
}
