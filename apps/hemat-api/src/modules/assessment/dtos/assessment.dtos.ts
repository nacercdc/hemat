import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsDateString,
  IsOptional,
  ArrayNotEmpty,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsExists, IsUnique } from '@shared/validators';
import { Assessment } from '@database/entities';

export class AssessmentCreateRequestDto {
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
  @IsUnique(
    { tableName: 'assessments', columns: ['name'] },
    { message: 'validation.name.isUnique' },
  )
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
  @IsString({ message: 'validation.countryCode.isString' })
  @Length(2, 3, {
    message: 'validation.countryCode.length args: min:2 | max:3',
  })
  @IsExists(
    { tableName: 'countries', columns: ['code'] },
    { message: 'validation.countryCode.isExists' },
  )
  @Type(() => String)
  countryCode: string;

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
    description: 'Start date of the assessment',
    example: '2025-04-30',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.startDate.isNotEmpty' })
  @IsDateString({}, { message: 'validation.startDate.isDateString' })
  @Type(() => String)
  startDate: string;

  @ApiProperty({
    description: 'End date of the assessment',
    example: '2025-05-30',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.endDate.isNotEmpty' })
  @IsDateString({}, { message: 'validation.endDate.isDateString' })
  @Type(() => String)
  endDate: string;

  @ApiProperty({
    description: 'Languages for the assessment',
    example: ['en'],
    type: [String],
  })
  @IsString({ each: true, message: 'validation.languages.isString' })
  @ArrayNotEmpty({ message: 'validation.languages.arrayNotEmpty' })
  @ArrayMaxSize(12, {
    message: 'validation.languages.arrayMaxSize args: max:12',
  })
  @IsExists(
    { tableName: 'languages', columns: ['code'] },
    { each: true, message: 'validation.languages.isExists' },
  )
  @Type(() => Array)
  languages: string[];
}

export class AssessmentUpdateRequestDto {
  @ApiProperty({
    description: 'ID of the assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.id.isNotEmpty' })
  @IsString({ message: 'validation.id.isString' })
  @Type(() => String)
  id: string;

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
  @IsUnique(
    { tableName: 'assessments', columns: ['name'], exclude: 'id' },
    { message: 'validation.name.isUnique' },
  )
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
  @IsExists(
    { tableName: 'countries', columns: ['code'] },
    { message: 'validation.countryCode.isExists' },
  )
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
    description: 'Start date of the assessment',
    example: '2025-04-30',
    type: String,
  })
  @IsOptional()
  @IsDateString({}, { message: 'validation.startDate.isDateString' })
  @Type(() => String)
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date of the assessment',
    example: '2025-05-30',
    type: String,
  })
  @IsOptional()
  @IsDateString({}, { message: 'validation.endDate.isDateString' })
  @Type(() => String)
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Languages for the assessment',
    example: ['en'],
    type: [String],
  })
  @IsOptional()
  @IsString({ each: true, message: 'validation.languages.isString' })
  @ArrayNotEmpty({ message: 'validation.languages.arrayNotEmpty' })
  @ArrayMaxSize(12, {
    message: 'validation.languages.arrayMaxSize args: max:12',
  })
  @IsExists(
    { tableName: 'languages', columns: ['code'] },
    { each: true, message: 'validation.languages.isExists' },
  )
  @Type(() => Array)
  languages?: string[];
}

export class AssessmentDto {
  id: string;
  name: string;
  description: string;
  countryCode: string;
  organization?: string;
  startDate: string;
  endDate: string;
  languages: string[];
  status: string;

  constructor(entity: Assessment) {
    this.id = entity.id;
    this.name = entity.name;
    this.description = entity.description;
    this.countryCode = entity.countryCode;
    this.organization = entity.organization ?? undefined;
    this.startDate = entity.startDate instanceof Date ? entity.startDate.toISOString().slice(0, 10) : String(entity.startDate);
    this.endDate = entity.endDate instanceof Date ? entity.endDate.toISOString().slice(0, 10) : String(entity.endDate);
    this.languages = entity.languages?.map((l: any) => l.code) || [];
    this.status = entity.status;
  }
}