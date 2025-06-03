import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsBoolean, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { DomaintranslationDto } from '@africa-cdc/shared/dtos';

export class DomainCreateRequestDto {
  @ApiProperty({
    description: 'Unique code of the domain',
    example: '1',
    minLength: 1,
    maxLength: 50,
    type: String,
  })
  @IsNotEmpty({ message: 'validation.code.isNotEmpty' })
  @IsString({ message: 'validation.code.isString' })
  @Length(1, 50, { message: 'validation.code.length args: min:1 | max:50' })
  @Type(() => String)
  code: string;

  @ApiProperty({
    description: 'Name of the domain',
    example: 'Public Health',
    minLength: 1,
    maxLength: 100,
    type: String,
  })
  @IsNotEmpty({ message: 'validation.name.isNotEmpty' })
  @IsString({ message: 'validation.name.isString' })
  @Length(1, 100, { message: 'validation.name.length args: min:1 | max:100' })
  @Type(() => String)
  name: string;

  @ApiProperty({
    description: 'Description of the domain',
    example: 'Domain covering public health initiatives',
    minLength: 1,
    maxLength: 500,
    type: String,
  })
  @IsNotEmpty({ message: 'validation.description.isNotEmpty' })
  @IsString({ message: 'validation.description.isString' })
  @Length(1, 500, {
    message: 'validation.description.length args: min:1 | max:500',
  })
  @Type(() => String)
  description: string;

  @ApiProperty({
    description: 'Whether the domain is active',
    example: true,
    type: Boolean,
  })
  @IsNotEmpty({ message: 'validation.isActive.isNotEmpty' })
  @IsBoolean({ message: 'validation.isActive.isBoolean' })
  @Type(() => Boolean)
  isActive: boolean;

  @ApiProperty({
    description: 'Translations for the domain',
    example: {
      en: {
        code: '1',
        name: 'Public Health',
        description: 'Domain covering public health initiatives',
      },
    },
    type: () => Object,
  })
  @IsNotEmpty({ message: 'validation.translations.isNotEmpty' })
  @IsObject({ message: 'validation.translations.isObject' })
  @Type(() => Object)
  translations: Record<string, DomaintranslationDto>;
}
