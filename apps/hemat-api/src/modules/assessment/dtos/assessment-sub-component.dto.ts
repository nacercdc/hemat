import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsUUID,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SubComponentTranslationDto } from '../../../shared/dtos';
import { IsExists, IsUnique } from '@shared/validators';

export class AssessmentSubComponentDto {
  @ApiPropertyOptional({
    description: 'ID of the sub-component',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.id.isNotEmpty' })
  @IsString({ message: 'validation.id.isString' })
  @Type(() => String)
  id: string;

  @ApiPropertyOptional({
    description: 'Unique code of the sub-component',
    example: '1.A.1',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  @IsUnique(
    {
      tableName: 'assessment-sub-components',
      columns: ['code'],
      exclude: 'id',
    },
    { message: 'validation.code.isUnique' },
  )
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
  @IsUnique(
    {
      tableName: 'assessment-sub-components',
      columns: ['name'],
      exclude: 'id',
    },
    { message: 'validation.name.isUnique' },
  )
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
