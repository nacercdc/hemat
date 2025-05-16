import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { IsMatch } from '../../../shared/validators';

export class UpdatePasswordRequestDto {
  @ApiProperty({
    description: 'New password',
    example: 'e6Uyb&j90Qh',
    minLength: 8,
    maxLength: 64,
    type: String,
  })
  @IsNotEmpty({ message: 'validation.password.isNotEmpty' })
  @IsString({ message: 'validation.password.isString' })
  @Length(8, 64, { message: 'validation.password.length args: min:8 | max:64' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'validation.password.isWeak',
  })
  @Type(() => String)
  password: string;

  @ApiProperty({
    description: 'Confirm password',
    example: 'e6Uyb&j90Qh',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.confirmPassword.isNotEmpty' })
  @IsString({ message: 'validation.confirmPassword.isString' })
  @IsMatch('password', { message: 'validation.confirmPassword.isMatch' })
  @Type(() => String)
  confirmPassword: string;
}
