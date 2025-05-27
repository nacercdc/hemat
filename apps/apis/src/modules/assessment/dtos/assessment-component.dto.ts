import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { AssessmentTranslationDto } from '../../../shared/dtos';

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
    description: 'ID of the associated domain',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty()
  @IsUUID()
  @Type(() => String)
  domainId: string;

  @ApiPropertyOptional({
    description: 'Translations for the component',
    type: () => AssessmentTranslationDto,
  })
  @IsNotEmpty()
  @Type(() => AssessmentTranslationDto)
  translations: AssessmentTranslationDto;
}
