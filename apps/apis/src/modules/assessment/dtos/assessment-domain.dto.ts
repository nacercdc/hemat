import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, Length, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { AssessmentTranslationDto } from '../../../shared/dtos';

export class AssessmentDomainDto {
  @ApiPropertyOptional({
    description: 'Unique code of the domain',
    example: '1',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  @Type(() => String)
  code: string;

  @ApiPropertyOptional({
    description: 'Name of the domain',
    example: 'Public Health',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  @Type(() => String)
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the domain',
    example: 'Domain covering public health initiatives',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  @Type(() => String)
  description: string;

  @ApiPropertyOptional({
    description: 'Translations for the domain',
    type: () => AssessmentTranslationDto,
  })
  @IsOptional()
  @Type(() => AssessmentTranslationDto)
  translations: AssessmentTranslationDto;
}
