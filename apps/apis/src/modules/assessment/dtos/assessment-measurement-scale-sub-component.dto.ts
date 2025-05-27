import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { DescriptionTranslationDto } from '../../../shared/dtos';

export class AssessmentMeasurementScaleSubComponentDto {
  @ApiPropertyOptional({
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
    description: 'ID of the associated sub-component',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty()
  @IsUUID()
  @Type(() => String)
  subComponentId: string;

  @ApiPropertyOptional({
    description: 'ID of the associated measurement scale',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty()
  @IsUUID()
  @Type(() => String)
  measurementScaleId: string;

  @ApiPropertyOptional({
    description: 'Translations for the measurement scale sub-component',
    type: () => DescriptionTranslationDto,
  })
  @IsNotEmpty()
  @Type(() => DescriptionTranslationDto)
  translations: DescriptionTranslationDto;
}
