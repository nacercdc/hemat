import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Length,
  Matches,
  IsInt,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MeasurementScaleCreateRequestDto {
  @ApiProperty({
    description: 'Name of the measurement scale',
    example: 'Initial',
    minLength: 1,
    maxLength: 100,
    type: String,
  })
  @IsNotEmpty({ message: 'validation.name.isNotEmpty' })
  @IsString({ message: 'validation.name.isString' })
  @Length(1, 100, { message: 'validation.name.length args: min:1 | max:100' })
  @Type(() => String)
  name: string;

  @ApiProperty({
    description: 'Description of the measurement scale',
    example: 'Basic HIE planning stage',
    minLength: 1,
    maxLength: 500,
    type: String,
  })
  @IsNotEmpty({ message: 'validation.description.isNotEmpty' })
  @IsString({ message: 'validation.description.isString' })
  @Length(1, 500, { message: 'validation.description.length args: min:1 | max:500' })
  @Type(() => String)
  description: string;

  @ApiProperty({
    description: 'Color associated with the measurement scale (hex code)',
    example: '#FF0000',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.color.isNotEmpty' })
  @IsString({ message: 'validation.color.isString' })
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'validation.color.invalidHex' })
  @Type(() => String)
  color: string;

  @ApiProperty({
    description: 'Rate of the measurement scale',
    example: 1,
    minimum: 1,
    maximum: 10,
    type: Number,
  })
  @IsNotEmpty({ message: 'validation.rate.isNotEmpty' })
  @IsInt({ message: 'validation.rate.isInt' })
  @Min(1, { message: 'validation.rate.min args: value:1' })
  @Max(10, { message: 'validation.rate.max args: value:10' })
  @Type(() => Number)
  rate: number;
}

export class MeasurementScaleUpdateRequestDto {
  @ApiProperty({
    description: 'ID of the measurement scale',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.id.isNotEmpty' })
  @IsString({ message: 'validation.id.isString' })
  @Type(() => String)
  id: string;

  @ApiPropertyOptional({
    description: 'Name of the measurement scale',
    example: 'Initial',
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
    description: 'Description of the measurement scale',
    example: 'Basic HIE planning stage',
    minLength: 1,
    maxLength: 500,
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'validation.description.isString' })
  @Length(1, 500, { message: 'validation.description.length args: min:1 | max:500' })
  @Type(() => String)
  description?: string;

  @ApiPropertyOptional({
    description: 'Color associated with the measurement scale (hex code)',
    example: '#FF0000',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'validation.color.isString' })
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'validation.color.invalidHex' })
  @Type(() => String)
  color?: string;

  @ApiPropertyOptional({
    description: 'Rate of the measurement scale',
    example: 1,
    minimum: 1,
    maximum: 10,
    type: Number,
  })
  @IsOptional()
  @IsInt({ message: 'validation.rate.isInt' })
  @Min(1, { message: 'validation.rate.min args: value:1' })
  @Max(10, { message: 'validation.rate.max args: value:10' })
  @Type(() => Number)
  rate?: number;
}