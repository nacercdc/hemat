import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxLength,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GenderEnum } from '@shared/enums';

export class RegisterRequestDto {
  @ApiProperty({
    description: "The user's title",
    example: 'Mr.',
    type: String,
  })
  @MaxLength(150)
  @IsString({ message: 'validation.title.isString' })
  @IsOptional()
  @Type(() => String)
  title: string | null = null;

  @ApiProperty({
    description: "The user's first name",
    example: 'John',
    type: String,
  })
  @MaxLength(50)
  @IsString({ message: 'validation.name.isString' })
  @IsNotEmpty({ message: 'validation.name.isNotEmpty' })
  @Type(() => String)
  firstName: string;

  @ApiProperty({
    description: "The user's middle name",
    example: 'William',
    type: String,
  })
  @MaxLength(50)
  @IsString({ message: 'validation.name.isString' })
  @IsOptional()
  @Type(() => String)
  middleName: string | null = null;

  @ApiProperty({
    description: "The user's last name",
    example: 'Doe',
    type: String,
  })
  @MaxLength(50)
  @IsString({ message: 'validation.name.isString' })
  @IsNotEmpty({ message: 'validation.name.isNotEmpty' })
  @Type(() => String)
  lastName: string;

  @ApiProperty({
    description: "The user's gender",
    example: GenderEnum.MALE,
    enum: GenderEnum,
  })
  @IsEnum(GenderEnum, { message: 'validation.gender.isEnum' })
  @IsNotEmpty({ message: 'validation.gender.isNotEmpty' })
  gender: GenderEnum;

  @ApiProperty({
    description: "The user's date of birth",
    example: '1990-01-01',
    type: String,
  })
  @IsDateString({}, { message: 'validation.dateOfBirth.isDateString' })
  @IsNotEmpty({ message: 'validation.dateOfBirth.isNotEmpty' })
  dateOfBirth: string;

  @ApiProperty({
    description: "The user's country",
    example: 'United States',
    type: String,
  })
  @IsString({ message: 'validation.country.isString' })
  @IsNotEmpty({ message: 'validation.country.isNotEmpty' })
  @Type(() => String)
  country: string;

  @ApiProperty({
    description: "The user's job title",
    example: 'Software Engineer',
    type: String,
  })
  @IsString({ message: 'validation.jobTitle.isString' })
  @IsNotEmpty({ message: 'validation.jobTitle.isNotEmpty' })
  @Type(() => String)
  jobTitle: string;

  @ApiProperty({
    description: "The user's email address",
    example: 'john.doe@hiemat.org',
    type: String,
  })
  @IsEmail({}, { message: 'validation.email.isEmail' })
  @IsNotEmpty({ message: 'validation.email.isNotEmpty' })
  @Type(() => String)
  email: string;

  @ApiProperty({
    description: "The user's password",
    example: 'Password123!',
    type: String,
  })
  @Length(8, 64, { message: 'validation.password.length args: min:8 | max:64' })
  @Matches(/((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'validation.password.isWeak',
  })
  @IsString({ message: 'validation.password.isString' })
  @IsNotEmpty({ message: 'validation.password.isNotEmpty' })
  @Type(() => String)
  password: string;

  @ApiPropertyOptional({
    description: "The user's email address",
    example: 'john.doe@hiemat.org',
    type: String,
  })
  @IsUUID(undefined, { message: 'validation.email.isEmail' })
  @IsOptional()
  @Type(() => String)
  invitationId: string | null = null;

  @ApiPropertyOptional({
    description: "The user's phone number",
    example: '+251900000000',
    type: String,
  })
  @IsString({ message: 'validation.phoneNumber.isString' })
  @IsOptional()
  @Type(() => String)
  phoneNumber?: string;
}
