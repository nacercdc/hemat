import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class LanguageCreateRequestDto {
  @ApiProperty({
    description: 'Language code (e.g., en, fr)',
    example: 'en',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'Language name (e.g., English, French)',
    example: 'English',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Native name of the language (e.g., English, Français)',
    example: 'English',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  native: string;
}

export class LanguageUpdateRequestDto {
  @ApiPropertyOptional({
    description: 'Language name (e.g., English, French)',
    example: 'English',
    type: String,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Native name of the language (e.g., English, Français)',
    example: 'English',
    type: String,
  })
  @IsString()
  @IsOptional()
  native?: string;
}