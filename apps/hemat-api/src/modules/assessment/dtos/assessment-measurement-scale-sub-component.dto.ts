import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { MeasurementScaleSubcomponentTranslationDto } from '../../../shared/dtos';

export class AssessmentMeasurementScaleSubComponentDto {
  @ApiProperty({
    description: 'ID of the associated sub-component',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsUUID()
  @IsNotEmpty()
  subComponentId: string;

  @ApiProperty({
    description: 'ID of the associated measurement scale',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsUUID()
  @IsNotEmpty()
  measurementScaleId: string;

  @ApiProperty({
    description: 'Description for this sub-component and scale combination',
    example: 'Measurement scale for Initial',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  @Type(() => String)
  description: string;

  @ApiPropertyOptional({
    description: 'Translations for the measurement scale sub-component',
    type: () => MeasurementScaleSubcomponentTranslationDto,
  })
  @Type(() => MeasurementScaleSubcomponentTranslationDto)
  translations: Record<string, MeasurementScaleSubcomponentTranslationDto> = {};
}
