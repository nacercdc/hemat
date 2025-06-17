import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ComponentTranslationDto } from '../../../shared/dtos';
import { IsUnique } from '@shared/validators';

export class AssessmentComponentDto {
  @ApiPropertyOptional({
    description: 'ID of the component',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.id.isNotEmpty' })
  @IsString({ message: 'validation.id.isString' })
  @Type(() => String)
  id: string;

  @ApiPropertyOptional({
    description: 'Unique code of the component',
    example: '1.A',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  @IsUnique(
    { tableName: 'assessment-components', columns: ['code'], exclude: 'id' },
    { message: 'validation.code.isUnique' },
  )
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
  @IsUnique(
    { tableName: 'assessment-components', columns: ['name'], exclude: 'id' },
    { message: 'validation.code.isUnique' },
  )
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
