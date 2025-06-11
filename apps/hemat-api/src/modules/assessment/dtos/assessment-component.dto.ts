import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ComponentTranslationDto } from '../../../shared/dtos';

export class AssessmentComponentDto {
  @ApiPropertyOptional({
    description: 'Unique code of the component',
    example: '1.A',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  @Type(() => String)
  code: string;

  @ApiPropertyOptional({
    description: 'Name of the component',
    example: 'Vaccination Program',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  @Type(() => String)
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the component',
    example: 'Component for vaccination initiatives',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  @Type(() => String)
  description: string;

  @ApiPropertyOptional({
    description: 'Translations for the component',
    type: () => ComponentTranslationDto,
  })
  @IsNotEmpty()
  @Type(() => ComponentTranslationDto)
  translations: Record<string, ComponentTranslationDto> = {};
}
