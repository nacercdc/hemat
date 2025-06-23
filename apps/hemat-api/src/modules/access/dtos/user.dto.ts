import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsEnum,
  IsNotEmpty,
  Length,
  Matches,
  IsDateString,
  IsUUID,
  ArrayMinSize,
  ArrayMaxSize,
  IsArray,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  IsAlphaSpaceOnly,
  IsExists,
  IsMatch,
  IsUnique,
} from '../../../shared/validators';
import { GenderEnum, UserStatusEnum } from '../../../shared/enums';
const userStatus = Object.values(UserStatusEnum).join(', ');
const genders = Object.values(GenderEnum).join(', ');

export class UserBaseRequestDto {
  @ApiPropertyOptional({
    description: 'Title',
    example: 'Mr',
    minLength: 2,
    maxLength: 10,
    type: String,
  })
  @Length(2, 10, {
    message: 'validation.title.length args: min:2 | max:10',
  })
  @IsAlphaSpaceOnly({ message: 'validation.title.isAlphaSpaceOnly' })
  @IsOptional()
  @Type(() => String)
  title?: string | null = null;

  @ApiProperty({
    description: 'First name',
    example: 'John',
    minLength: 2,
    maxLength: 64,
    type: String,
  })
  @Transform(({ value }) => value.charAt(0).toUpperCase() + value.slice(1))
  @Length(2, 64, {
    message: 'validation.firstName.length args: min:2 | max:64',
  })
  @IsAlphaSpaceOnly({ message: 'validation.firstName.isAlphaSpaceOnly' })
  @IsNotEmpty({ message: 'validation.firstName.isNotEmpty' })
  @Type(() => String)
  firstName: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
    minLength: 2,
    maxLength: 64,
    type: String,
  })
  @Transform(({ value }) => value.charAt(0).toUpperCase() + value.slice(1))
  @Length(2, 64, { message: 'validation.lastName.length args: min:2 | max:64' })
  @IsAlphaSpaceOnly({ message: 'validation.lastName.isAlphaSpaceOnly' })
  @IsNotEmpty({ message: 'validation.lastName.isNotEmpty' })
  @Type(() => String)
  lastName: string;

  @ApiPropertyOptional({
    description: 'Gender',
    enum: GenderEnum,
    example: GenderEnum.MALE,
    type: String,
  })
  @IsEnum(GenderEnum, {
    message: `validation.gender.isEnum args: values:${genders}`,
  })
  @IsOptional()
  @Type(() => String)
  gender: GenderEnum | null = null;

  @ApiPropertyOptional({
    description: 'Birth date',
    example: '2000-10-25',
    type: Date,
  })
  @IsDateString({}, { message: 'validation.dateOfBirth.isDateString' })
  @IsOptional()
  @Type(() => String)
  dateOfBirth: Date | null = null;

  @ApiPropertyOptional({
    description: 'Country',
    example: 'United States',
    type: String,
  })
  @IsString({ message: 'validation.country.isString' })
  @IsOptional()
  @Type(() => String)
  country: string | null = null;

  @ApiProperty({
    description: 'Roles',
    example: ['1fcdc123-6906-4789-b75a-983260bc135d'],
    minItems: 1,
    maxItems: 16,
    uniqueItems: true,
    type: String,
    isArray: true,
  })
  @IsArray({ message: 'validation.roleIds.isArray' })
  @IsUUID('all', { each: true, message: 'validation.roleIds.isUUID' })
  @ArrayMinSize(1, {
    message: 'validation.roleIds.isArrayMinSize args: value:1',
  })
  @ArrayMaxSize(16, {
    message: 'validation.roleIds.isArrayMaxSize args: value:16',
  })
  @IsExists(
    { tableName: 'roles', columns: ['id'] },
    { message: 'validation.roleIds.isExists' },
  )
  @Type(() => String)
  roleIds: string[];

  @ApiPropertyOptional({
    description: 'Direct permissions',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    minItems: 0,
    maxItems: 15,
    uniqueItems: true,
    type: String,
    isArray: true,
  })
  @IsArray({ message: 'validation.permissionsIds.isArray' })
  @IsUUID('all', { each: true, message: 'validation.permissionsIds.isUUID' })
  @ArrayMinSize(0, {
    message: 'validation.permissionsIds.isArrayMinSize args: value:0',
  })
  @ArrayMaxSize(15, {
    message: 'validation.permissionsIds.isArrayMaxSize args: value:15',
  })
  @IsExists(
    { tableName: 'permissions', columns: ['id'] },
    { message: 'validation.permissionsIds.isExists' },
  )
  @IsOptional()
  @Type(() => String)
  permissionsIds?: string[];

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+1234567890',
    type: String,
  })
  @IsString({ message: 'validation.phoneNumber.isString' })
  @IsOptional()
  @Type(() => String)
  phoneNumber?: string | null = null;
}

export class UserCreateRequestDto extends UserBaseRequestDto {
  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@example.com',
    minLength: 3,
    maxLength: 320,
    type: String,
  })
  @Length(3, 320, { message: 'validation.email.length args: min:3 | max:320' })
  @IsEmail()
  @IsUnique(
    { tableName: 'users', columns: ['email'] },
    { message: 'validation.email.isUnique' },
  )
  @IsNotEmpty({ message: 'validation.email.isNotEmpty' })
  @Type(() => String)
  email: string;
}

export class UserUpdateRequestDto extends UserBaseRequestDto {
  @ApiProperty({
    description: 'User Id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsUUID('all', { message: 'validation.id.isUUID' })
  @IsNotEmpty({ message: 'validation.id.isNotEmpty' })
  @Type(() => String)
  id: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@example.com',
    minLength: 3,
    maxLength: 320,
    type: String,
  })
  @Length(3, 320, { message: 'validation.email.length args: min:3 | max:320' })
  @IsEmail()
  @IsUnique(
    { tableName: 'users', columns: ['email'], exclude: 'id' },
    { message: 'validation.email.isUnique' },
  )
  @IsNotEmpty({ message: 'validation.email.isNotEmpty' })
  @Type(() => String)
  email: string;
}
