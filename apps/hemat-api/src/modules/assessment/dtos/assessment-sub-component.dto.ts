import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { SubComponentTranslationDto } from '../../../shared/dtos';

export class AssessmentSubComponentDto {
  @ApiPropertyOptional({
    description: 'Unique code of the sub-component',
    example: '1.A.1',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  @Type(() => String)
  code: string;

  @ApiPropertyOptional({
    description: 'Name of the sub-component',
    example: 'Vaccine Distribution',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  @Type(() => String)
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the sub-component',
    example: 'Sub-component for vaccine distribution',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  @Type(() => String)
  description: string;

  @ApiPropertyOptional({
    description: 'Translations for the sub-component',
    type: () => SubComponentTranslationDto,
  })
  @IsNotEmpty()
  @Type(() => SubComponentTranslationDto)
  translations: Record<string, SubComponentTranslationDto> = {};
}
