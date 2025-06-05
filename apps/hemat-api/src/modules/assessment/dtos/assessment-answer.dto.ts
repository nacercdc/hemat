import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsExists } from '@shared/validators';

export class AssessmentAnswerCreateRequestDto {
  @ApiProperty({
    description: 'ID of the associated assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.assessmentId.isNotEmpty' })
  @IsUUID('4', { message: 'validation.assessmentId.isUUID' })
  @IsExists(
    { tableName: 'assessments', columns: ['id'] },
    { message: 'validation.assessmentId.isExists' },
  )
  @Type(() => String)
  assessmentId: string;

  @ApiProperty({
    description: 'ID of the user submitting the answer',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.userId.isNotEmpty' })
  @IsUUID('4', { message: 'validation.userId.isUUID' })
  @IsExists(
    { tableName: 'users', columns: ['id'] },
    { message: 'validation.userId.isExists' },
  )
  @Type(() => String)
  userId: string;

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
    description: 'Evidence supporting the answer',
    example:
      '{"type": "LINK", "value": "https://health.gov.et/hie-strategic-plan"}',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.evidence.isNotEmpty' })
  @IsString({ message: 'validation.evidence.isString' })
  @Length(1, 1000, {
    message: 'validation.evidence.length args: min:1 | max:1000',
  })
  @Type(() => String)
  evidence: string;

  @ApiProperty({
    description: 'Reference for the answer',
    example: '{"type": "TEXT", "value": "Health Ministry Report 2024"}',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.reference.isNotEmpty' })
  @IsString({ message: 'validation.reference.isString' })
  @Length(1, 1000, {
    message: 'validation.reference.length args: min:1 | max:1000',
  })
  @Type(() => String)
  reference: string;

  @ApiPropertyOptional({
    description: 'Notes for the answer',
    example: 'Strategic plan is in place.',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'validation.notes.isString' })
  @Length(1, 1000, {
    message: 'validation.notes.length args: min:1 | max:1000',
  })
  @Type(() => String)
  notes?: string;
}

export class AssessmentAnswerUpdateRequestDto {
  @ApiPropertyOptional({
    description: 'ID of the associated assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsOptional()
  @IsUUID('4', { message: 'validation.assessmentId.isUUID' })
  @IsExists(
    { tableName: 'assessments', columns: ['id'] },
    { message: 'validation.assessmentId.isExists' },
  )
  @Type(() => String)
  assessmentId?: string;

  @ApiPropertyOptional({
    description: 'ID of the user submitting the answer',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsOptional()
  @IsUUID('4', { message: 'validation.userId.isUUID' })
  @IsExists(
    { tableName: 'users', columns: ['id'] },
    { message: 'validation.userId.isExists' },
  )
  @Type(() => String)
  userId?: string;

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
    description: 'Evidence supporting the answer',
    example:
      '{"type": "LINK", "value": "https://health.gov.et/hie-strategic-plan"}',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'validation.evidence.isString' })
  @Length(1, 1000, {
    message: 'validation.evidence.length args: min:1 | max:1000',
  })
  @Type(() => String)
  evidence?: string;

  @ApiPropertyOptional({
    description: 'Reference for the answer',
    example: '{"type": "TEXT", "value": "Health Ministry Report 2024"}',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'validation.reference.isString' })
  @Length(1, 1000, {
    message: 'validation.reference.length args: min:1 | max:1000',
  })
  @Type(() => String)
  reference?: string;

  @ApiPropertyOptional({
    description: 'Notes for the answer',
    example: 'Strategic plan is in place.',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'validation.notes.isString' })
  @Length(1, 1000, {
    message: 'validation.notes.length args: min:1 | max:1000',
  })
  @Type(() => String)
  notes?: string;
}