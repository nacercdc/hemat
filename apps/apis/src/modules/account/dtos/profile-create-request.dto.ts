import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Title of the user',
    example: 'Manager',
    type: String,
  })
  @IsString({ message: 'validation.title.isString' })
  @IsNotEmpty({ message: 'validation.title.isNotEmpty' })
  @Type(() => String)
  title: string;

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

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@hiemat.org',
    type: String,
  })
  @ApiProperty({
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
    description: 'Birth date',
    example: '2000-10-25',
    type: Date,
  })
  @IsOptional()
  @Type(() => Date)
  dateOfBirth?: Date;

  @ApiProperty({
    description: 'Country',
    example: 'Ethiopia',
    type: String,
  })
  @IsString({ message: 'validation.country.isString' })
  @IsOptional()
  @Type(() => String)
  country?: string;

  @ApiProperty({
    description: 'Job title of the user',
    example: 'Team Lead',
    type: String,
  })
  @IsString({ message: 'validation.jobTitle.isString' })
  @IsNotEmpty({ message: 'validation.jobTitle.isNotEmpty' })
  @Type(() => String)
  jobTitle: string;

  @ApiProperty({
    description: 'Profile status',
    example: 'active',
    type: String,
  })
  @IsString({ message: 'validation.status.isString' })
  @IsOptional()
  @Type(() => String)
  status?: string;
}
