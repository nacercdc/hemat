import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { IsMatch } from '../../../shared/validators';

export class ChangePasswordRequestDto {
  @ApiProperty({
    description: 'New password',
    example: 'NewPassword123!',
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

  @ApiProperty({
    description: 'Confirm password',
    example: 'NewPassword123!',
    type: String,
  })
  @IsString({ message: 'validation.confirmPassword.isString' })
  @IsMatch('password', { message: 'validation.confirmPassword.isMatch' })
  @IsNotEmpty({ message: 'validation.confirmPassword.isNotEmpty' })
  @Type(() => String)
  confirmPassword: string;
}
