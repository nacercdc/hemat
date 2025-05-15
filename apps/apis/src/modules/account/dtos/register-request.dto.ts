import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterRequestDto {
  @ApiProperty({
    description: "The user's name",
    example: 'John Doe',
    type: String,
  })
  @IsString({ message: 'validation.name.isString' })
  @IsNotEmpty({ message: 'validation.name.isNotEmpty' })
  @Type(() => String)
  name: string;

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
}
