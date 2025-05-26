import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';

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
