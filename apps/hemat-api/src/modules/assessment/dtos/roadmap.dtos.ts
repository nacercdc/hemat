import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  Length,
  IsDateString,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsExists } from '@shared/validators';

export class RoadmapCreateRequestDto {
  @ApiProperty({
    description: 'ID of the associated assessment answer',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.assessmentAnswerId.isNotEmpty' })
  @IsUUID('4', { message: 'validation.assessmentAnswerId.isUUID' })
  @IsExists(
    { tableName: 'assessment_answers', columns: ['id'] },
    { message: 'validation.assessmentAnswerId.isExists' },
  )
  @Type(() => String)
  assessmentAnswerId: string;

  @ApiProperty({
    description: 'ID of the associated sub-component',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.subComponentId.isNotEmpty' })
  @IsUUID('4', { message: 'validation.subComponentId.isUUID' })
  @IsExists(
    { tableName: 'assessment_sub_components', columns: ['id'] },
    { message: 'validation.subComponentId.isExists' },
  )
  @Type(() => String)
  subComponentId: string;

  @ApiProperty({
    description: 'ID of the associated measurement scale',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.measurementScaleId.isNotEmpty' })
  @IsUUID('4', { message: 'validation.measurementScaleId.isUUID' })
  @IsExists(
    { tableName: 'assessment_measurement_scale', columns: ['id'] },
    { message: 'validation.measurementScaleId.isExists' },
  )
  @Type(() => String)
  measurementScaleId: string;

  @ApiProperty({
    description: 'Target of the roadmap',
    example: 'Increase vaccination coverage',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.target.isNotEmpty' })
  @IsString({ message: 'validation.target.isString' })
  @Length(1, 1000, {
    message: 'validation.target.length args: min:1 | max:1000',
  })
  @Type(() => String)
  target: string;

  @ApiProperty({
    description: 'Activities planned in the roadmap',
    example: 'Conduct outreach programs',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.activities.isNotEmpty' })
  @IsString({ message: 'validation.activities.isString' })
  @Length(1, 10000, {
    message: 'validation.activities.length args: min:1 | max:10000',
  })
  @Type(() => String)
  activities: string;

  @ApiProperty({
    description: 'Responsible party for the roadmap',
    example: 'Health Ministry',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.responsible.isNotEmpty' })
  @IsString({ message: 'validation.responsible.isString' })
  @Length(1, 500, {
    message: 'validation.responsible.length args: min:1 | max:500',
  })
  @Type(() => String)
  responsible: string;

  @ApiProperty({
    description: 'Resources required for the roadmap',
    example: 'Funding, staff',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.resources.isNotEmpty' })
  @IsString({ message: 'validation.resources.isString' })
  @Length(1, 10000, {
    message: 'validation.resources.length args: min:1 | max:10000',
  })
  @Type(() => String)
  resources: string;

  @ApiProperty({
    description: 'Documentation for the roadmap',
    example: 'Project plan',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.documentation.isNotEmpty' })
  @IsString({ message: 'validation.documentation.isString' })
  @Length(1, 10000, {
    message: 'validation.documentation.length args: min:1 | max:10000',
  })
  @Type(() => String)
  documentation: string;

  @ApiProperty({
    description: 'Start time of the roadmap',
    example: '2025-06-01T00:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsNotEmpty({ message: 'validation.startTime.isNotEmpty' })
  @IsDateString({}, { message: 'validation.startTime.isDateString' })
  @Type(() => String)
  startTime: string;

  @ApiProperty({
    description: 'End time of the roadmap',
    example: '2025-12-31T23:59:59.999Z',
    type: String,
    format: 'date-time',
  })
  @IsNotEmpty({ message: 'validation.endTime.isNotEmpty' })
  @IsDateString({}, { message: 'validation.endTime.isDateString' })
  @Type(() => String)
  endTime: string;
}

export class RoadmapUpdateRequestDto {
  @ApiPropertyOptional({
    description: 'ID of the associated assessment answer',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsOptional()
  @IsUUID('4', { message: 'validation.assessmentAnswerId.isUUID' })
  @IsExists(
    { tableName: 'assessment_answers', columns: ['id'] },
    { message: 'validation.assessmentAnswerId.isExists' },
  )
  @Type(() => String)
  assessmentAnswerId?: string;

  @ApiPropertyOptional({
    description: 'ID of the associated sub-component',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsOptional()
  @IsUUID('4', { message: 'validation.subComponentId.isUUID' })
  @IsExists(
    { tableName: 'assessment_sub_components', columns: ['id'] },
    { message: 'validation.subComponentId.isExists' },
  )
  @Type(() => String)
  subComponentId?: string;

  @ApiPropertyOptional({
    description: 'ID of the associated measurement scale',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsOptional()
  @IsUUID('4', { message: 'validation.measurementScaleId.isUUID' })
  @IsExists(
    { tableName: 'assessment_measurement_scales', columns: ['id'] },
    { message: 'validation.measurementScaleId.isExists' },
  )
  @Type(() => String)
  measurementScaleId?: string;

  @ApiPropertyOptional({
    description: 'Target of the roadmap',
    example: 'Increase vaccination coverage',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'validation.target.isString' })
  @Length(1, 1000, {
    message: 'validation.target.length args: min:1 | max:1000',
  })
  @Type(() => String)
  target?: string;

  @ApiPropertyOptional({
    description: 'Current state of the roadmap based on scale rate',
    example: 3,
    type: Number,
  })
  @IsOptional()
  @IsInt({ message: 'validation.currentState.isInt' })
  @Min(1, { message: 'validation.currentState.min args: value:1' })
  @Max(10, { message: 'validation.currentState.max args: value:10' })
  @Type(() => Number)
  currentState?: number;

  @ApiPropertyOptional({
    description: 'Activities planned in the roadmap',
    example: 'Conduct outreach programs',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'validation.activities.isString' })
  @Length(1, 10000, {
    message: 'validation.activities.length args: min:1 | max:10000',
  })
  @Type(() => String)
  activities?: string;

  @ApiPropertyOptional({
    description: 'Responsible party for the roadmap',
    example: 'Health Ministry',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'validation.responsible.isString' })
  @Length(1, 500, {
    message: 'validation.responsible.length args: min:1 | max:500',
  })
  @Type(() => String)
  responsible?: string;

  @ApiPropertyOptional({
    description: 'Resources required for the roadmap',
    example: 'Funding, staff',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'validation.resources.isString' })
  @Length(1, 10000, {
    message: 'validation.resources.length args: min:1 | max:10000',
  })
  @Type(() => String)
  resources?: string;

  @ApiPropertyOptional({
    description: 'Documentation for the roadmap',
    example: 'Project plan',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'validation.documentation.isString' })
  @Length(1, 10000, {
    message: 'validation.documentation.length args: min:1 | max:10000',
  })
  @Type(() => String)
  documentation?: string;

  @ApiPropertyOptional({
    description: 'Start time of the roadmap',
    example: '2025-06-01T00:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString({}, { message: 'validation.startTime.isDateString' })
  @Type(() => String)
  startTime?: string;

  @ApiPropertyOptional({
    description: 'End time of the roadmap',
    example: '2025-12-31T23:59:59.999Z',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString({}, { message: 'validation.endTime.isDateString' })
  @Type(() => String)
  endTime?: string;
}