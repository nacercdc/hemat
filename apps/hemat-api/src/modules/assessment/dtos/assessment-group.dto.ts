import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsOptional, IsArray, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class AssessmentGroupUpdateRequestDto {
  @ApiPropertyOptional({
    description: 'Name of the assessment group',
    example: 'Health Team Updated',
    type: String,
  })
  @IsString()
  @Length(1, 100)
  @IsNotEmpty()
  @Type(() => String)
  name: string;

  @ApiPropertyOptional({
    description: 'Array of domain IDs to associate with the group',
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '223e4567-e89b-12d3-a456-426614174001',
    ],
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true, message: 'validation.domainIds.isUUID' })
  @Type(() => String)
  domainIds: string[];
}
