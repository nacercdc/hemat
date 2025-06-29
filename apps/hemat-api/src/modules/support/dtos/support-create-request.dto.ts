import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SupportCreateRequestDto {
  @ApiProperty({ description: 'Support ticket title', example: 'Cannot login' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'Support ticket description', example: 'I am unable to login with my credentials.' })
  @IsString()
  @IsNotEmpty()
  description: string;
} 