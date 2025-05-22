import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  Length,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  AssessmentTranslationDto,
  DescriptionTranslationDto,
  NameDescriptionDto,
} from '../../../shared/dtos';

export class AssessmentDomainUpdateRequestDto {
  @ApiPropertyOptional({
    description: 'Unique code of the domain',
    example: '1',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Type(() => String)
  code?: string;

  @ApiPropertyOptional({
    description: 'Name of the domain',
    example: 'Public Health',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Type(() => String)
  name?: string;

  @ApiPropertyOptional({
    description: 'Description of the domain',
    example: 'Domain covering public health initiatives',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  @Type(() => String)
  description?: string;

  @ApiPropertyOptional({
    description: 'Translations for the domain',
    type: () => AssessmentTranslationDto,
  })
  @IsOptional()
  @Type(() => AssessmentTranslationDto)
  translations?: AssessmentTranslationDto;
}

export class AssessmentComponentUpdateRequestDto {
  @ApiPropertyOptional({
    description: 'Unique code of the component',
    example: '1.A',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Type(() => String)
  code?: string;

  @ApiPropertyOptional({
    description: 'Name of the component',
    example: 'Vaccination Program',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Type(() => String)
  name?: string;

  @ApiPropertyOptional({
    description: 'Description of the component',
    example: 'Component for vaccination initiatives',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  @Type(() => String)
  description?: string;

  @ApiPropertyOptional({
    description: 'ID of the associated domain',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsOptional()
  @IsUUID()
  @Type(() => String)
  domainId?: string;

  @ApiPropertyOptional({
    description: 'Translations for the component',
    type: () => AssessmentTranslationDto,
  })
  @IsOptional()
  @Type(() => AssessmentTranslationDto)
  translations?: AssessmentTranslationDto;
}

export class AssessmentSubComponentUpdateRequestDto {
  @ApiPropertyOptional({
    description: 'Unique code of the sub-component',
    example: '1.A.1',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Type(() => String)
  code?: string;

  @ApiPropertyOptional({
    description: 'Name of the sub-component',
    example: 'Vaccine Distribution',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Type(() => String)
  name?: string;

  @ApiPropertyOptional({
    description: 'Description of the sub-component',
    example: 'Sub-component for vaccine distribution',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  @Type(() => String)
  description?: string;

  @ApiPropertyOptional({
    description: 'ID of the associated component',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsOptional()
  @IsUUID()
  @Type(() => String)
  componentId?: string;

  @ApiPropertyOptional({
    description: 'Translations for the sub-component',
    type: () => AssessmentTranslationDto,
  })
  @IsOptional()
  @Type(() => AssessmentTranslationDto)
  translations?: AssessmentTranslationDto;
}

export class AssessmentMeasurementScaleUpdateRequestDto {
  @ApiPropertyOptional({
    description: 'Name of the measurement scale',
    example: 'Initial',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Type(() => String)
  name?: string;

  @ApiPropertyOptional({
    description: 'Description of the measurement scale',
    example: 'Basic HIE planning stage',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  @Type(() => String)
  description?: string;

  @ApiPropertyOptional({
    description: 'Color associated with the measurement scale',
    example: '#FF0000',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(1, 7)
  @Type(() => String)
  color?: string;

  @ApiPropertyOptional({
    description: 'Rate of the measurement scale',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  rate?: number;

  @ApiPropertyOptional({
    description: 'Translations for the measurement scale',
    type: () => NameDescriptionDto,
  })
  @IsOptional()
  @Type(() => NameDescriptionDto)
  translations?: NameDescriptionDto;
}

export class AssessmentMeasurementScaleSubComponentUpdateRequestDto {
  @ApiPropertyOptional({
    description: 'Description for this sub-component and scale combination',
    example: 'Measurement scale for Initial',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  @Type(() => String)
  description?: string;

  @ApiPropertyOptional({
    description: 'ID of the associated sub-component',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsOptional()
  @IsUUID()
  @Type(() => String)
  subComponentId?: string;

  @ApiPropertyOptional({
    description: 'ID of the associated measurement scale',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsOptional()
  @IsUUID()
  @Type(() => String)
  measurementScaleId?: string;

  @ApiPropertyOptional({
    description: 'Translations for the measurement scale sub-component',
    type: () => DescriptionTranslationDto,
  })
  @IsOptional()
  @Type(() => DescriptionTranslationDto)
  translations?: DescriptionTranslationDto;
}
