import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsUnique } from '../../../shared/validators';
import { GenderEnum } from '../../../shared/enums';

export class ProfileCreateRequestDto {
  @ApiPropertyOptional({
    description: 'Title of the user',
    example: 'Mr.,Ms.,Dr.',
    type: String,
  })
  @IsString({ message: 'validation.title.isString' })
  @IsOptional()
  @Type(() => String)
  title?: string;

  @ApiProperty({
    description: 'First name',
    example: 'John',
    type: String,
  })
  @Length(2, 64, {
    message: 'validation.firstName.length args: min:2 | max:64',
  })
  @IsString({ message: 'validation.firstName.isString' })
  @IsNotEmpty({ message: 'validation.firstName.isNotEmpty' })
  @Type(() => String)
  firstName: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
    type: String,
  })
  @Length(2, 64, { message: 'validation.lastName.length args: min:2 | max:64' })
  @IsString({ message: 'validation.lastName.isString' })
  @IsNotEmpty({ message: 'validation.lastName.isNotEmpty' })
  @Type(() => String)
  lastName: string;

  @ApiPropertyOptional({
    description: 'Gender',
    enum: GenderEnum,
    example: GenderEnum.MALE,
    type: String,
  })
  @IsEnum(GenderEnum, { message: 'validation.gender.isEnum' })
  @IsOptional()
  @Type(() => String)
  gender?: GenderEnum;

  @ApiProperty({
    description: 'Country',
    example: 'Ethiopia',
    type: String,
  })
  @IsString({ message: 'validation.country.isString' })
  @IsOptional()
  @Type(() => String)
  country?: string;

  @ApiPropertyOptional({
    description: 'Job title of the user',
    example: 'Team Lead',
    type: String,
  })
  @IsString({ message: 'validation.jobTitle.isString' })
  @IsOptional()
  @Type(() => String)
  jobTitle?: string;

  @ApiPropertyOptional({
    description: 'Profession of the user',
    example: 'Medical Doctor',
    type: String,
  })
  @IsString({ message: 'validation.profession.isString' })
  @IsOptional()
  @Type(() => String)
  profession?: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+251900000000',
    type: String,
  })
  @IsString({ message: 'validation.phoneNumber.isString' })
  @IsOptional()
  @Type(() => String)
  @IsUnique({ tableName: 'profiles', columns: ['phoneNumber'] })
  phoneNumber?: string;
}
