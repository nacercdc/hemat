import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';
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
}
