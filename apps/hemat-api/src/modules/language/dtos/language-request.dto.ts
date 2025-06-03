import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUnique } from '@shared/validators';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';

export class LanguageCreateRequestDto {
  @ApiProperty({
    description: 'Language code (e.g., en, fr)',
    example: 'en',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.code.isNotEmpty' })
  @IsString({ message: 'validation.code.isString' })
  @Length(2, 10, { message: 'validation.code.length args: min:2 | max:10' })
  @Matches(/^[a-zA-Z0-9-]+$/, {
    message: 'validation.code.matches args: alphanumeric with hyphens',
  })
  @IsUnique(
    { tableName: 'languages', columns: ['code'] },
    { message: 'validation.code.isUnique' },
  )
  @Type(() => String)
  code: string;

  @ApiProperty({
    description: 'Language name (e.g., English, French)',
    example: 'English',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.name.isNotEmpty' })
  @IsString({ message: 'validation.name.isString' })
  @Length(1, 100, { message: 'validation.name.length args: min:1 | max:100' })
  @Type(() => String)
  name: string;

  @ApiProperty({
    description: 'Native name of the language (e.g., English, Français)',
    example: 'English',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.native.isNotEmpty' })
  @IsString({ message: 'validation.native.isString' })
  @Length(1, 100, { message: 'validation.native.length args: min:1 | max:100' })
  @Type(() => String)
  native: string;
}

export class LanguageUpdateRequestDto {
  @ApiPropertyOptional({
    description: 'Language name (e.g., English, French)',
    example: 'English',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'validation.name.isString' })
  @Length(1, 100, { message: 'validation.name.length args: min:1 | max:100' })
  @Type(() => String)
  name?: string;

  @ApiPropertyOptional({
    description: 'Native name of the language (e.g., English, Français)',
    example: 'English',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'validation.native.isString' })
  @Length(1, 100, { message: 'validation.native.length args: min:1 | max:100' })
  @Type(() => String)
  native?: string;
}
