import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SubComponentUpdateRequestDto {
  @ApiProperty({
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
    minLength: 1,
    maxLength: 50,
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'validation.code.isString' })
  @Length(1, 50, { message: 'validation.code.length args: min:1 | max:50' })
  @Type(() => String)
  code?: string;

  @ApiPropertyOptional({
    description: 'Name of the sub-component',
    example: 'Vaccine Distribution',
    minLength: 1,
    maxLength: 100,
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'validation.name.isString' })
  @Length(1, 100, { message: 'validation.name.length args: min:1 | max:100' })
  @Type(() => String)
  name?: string;

  @ApiPropertyOptional({
    description: 'Description of the sub-component',
    example: 'Sub-component for vaccine distribution',
    minLength: 1,
    maxLength: 500,
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'validation.description.isString' })
  @Length(1, 500, {
    message: 'validation.description.length args: min:1 | max:500',
  })
  @Type(() => String)
  description?: string;

  @ApiPropertyOptional({
    description: 'ID of the associated component',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsOptional()
  @IsUUID('4', { message: 'validation.componentId.isUUID' })
  @Type(() => String)
  componentId?: string;
}
