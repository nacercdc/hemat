import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class AssessmentGroupRequestDto {
  @ApiProperty({
    description: 'Name of the assessment group',
    example: 'Health Team',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  @Type(() => String)
  name: string;
}
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
}
