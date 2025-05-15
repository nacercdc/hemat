import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class LoginRequestDto {
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
  @IsString({ message: 'validation.password.isString' })
  @IsNotEmpty({ message: 'validation.password.isNotEmpty' })
  @Type(() => String)
  password: string;
}
