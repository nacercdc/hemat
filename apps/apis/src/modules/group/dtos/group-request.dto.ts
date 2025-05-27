import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GroupCreateRequestDto {
  @ApiProperty({
    description: 'Name of the assessment group',
    example: 'Ethiopia Group 1',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.name.isNotEmpty' })
  @IsString({ message: 'validation.name.isString' })
  @Length(1, 100, { message: 'validation.name.length args: min:1 | max:100' })
  @Type(() => String)
  name: string;

  @ApiProperty({
    description: 'ID of the associated assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.assessmentId.isNotEmpty' })
  @IsUUID('4', { message: 'validation.assessmentId.isUUID' })
  @Type(() => String)
  assessmentId: string;
}

export class GroupUpdateRequestDto {
  @ApiPropertyOptional({
    description: 'Name of the assessment group',
    example: 'Ethiopia Group 1 Updated',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'validation.name.isString' })
  @Length(1, 100, { message: 'validation.name.length args: min:1 | max:100' })
  @Type(() => String)
  name?: string;
}
