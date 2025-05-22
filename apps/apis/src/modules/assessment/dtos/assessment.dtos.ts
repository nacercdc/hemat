import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsUUID,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AssessmentCreateRequestDto {
  @ApiProperty({
    description: 'ID of the user creating the assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.userId.isNotEmpty' })
  @IsUUID('4', { message: 'validation.userId.isUUID' })
  @Type(() => String)
  userId: string;

  @ApiProperty({
    description: 'Name of the assessment',
    example: 'HIE Governance Assessment 2025',
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
    description: 'Description of the assessment',
    example: 'Assess HIE governance in Ethiopia',
    minLength: 1,
    maxLength: 500,
    type: String,
  })
  @IsNotEmpty({ message: 'validation.description.isNotEmpty' })
  @IsString({ message: 'validation.description.isString' })
  @Length(1, 500, {
    message: 'validation.description.length args: min:1 | max:500',
  })
  @Type(() => String)
  description: string;

  @ApiProperty({
    description: 'Country code for the assessment',
    example: 'ET',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.countryCode.isNotEmpty' })
  @IsOptional()
  @IsString({ message: 'validation.countryCode.isString' })
  @Length(2, 3, {
    message: 'validation.countryCode.length args: min:2 | max:3',
  })
  @Type(() => String)
  countryCode?: string;

  @ApiPropertyOptional({
    description: 'Organization conducting the assessment',
    example: 'Ethiopia Health Ministry',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'validation.organization.isString' })
  @Length(1, 100, {
    message: 'validation.organization.length args: min:1 | max:100',
  })
  @Type(() => String)
  organization?: string;

  @ApiProperty({
    description: 'Date of the assessment',
    example: '2025-04-30',
    type: String,
  })
  // @IsNotEmpty({ message: 'validation.date.isNotEmpty' })
  // @IsDateString({}, { message: 'validation.date.isDateString' })
  @IsOptional()
  @Type(() => Date)
  date?: Date;
}

export class AssessmentUpdateRequestDto {
  @ApiPropertyOptional({
    description: 'Name of the assessment',
    example: 'HIE Governance Assessment 2025',
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
    description: 'Description of the assessment',
    example: 'Assess HIE governance in Ethiopia',
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
    description: 'Country code for the assessment',
    example: 'ET',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'validation.countryCode.isString' })
  @Length(2, 3, {
    message: 'validation.countryCode.length args: min:2 | max:3',
  })
  @Type(() => String)
  countryCode?: string;

  @ApiPropertyOptional({
    description: 'Organization conducting the assessment',
    example: 'Ethiopia Health Ministry',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'validation.organization.isString' })
  @Length(1, 100, {
    message: 'validation.organization.length args: min:1 | max:100',
  })
  @Type(() => String)
  organization?: string;

  @ApiPropertyOptional({
    description: 'Date of the assessment',
    example: '2025-04-30',
    type: String,
  })
  @IsOptional()
  @IsDateString({}, { message: 'validation.date.isDateString' })
  @Type(() => String)
  date?: string;
}
