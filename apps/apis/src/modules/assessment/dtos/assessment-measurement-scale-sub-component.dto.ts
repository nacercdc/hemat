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
    description: 'Translations for the measurement scale sub-component',
    type: () => DescriptionTranslationDto,
  })
  @IsNotEmpty()
  @Type(() => DescriptionTranslationDto)
  translations: DescriptionTranslationDto;
}
