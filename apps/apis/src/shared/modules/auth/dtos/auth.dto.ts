import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { UserStatusEnum } from '../../../enums';

export class AuthDto {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Unique email address of the user',
    example: 'john.doe@cdc.org',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+251912345678',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    description: 'User status',
    enum: UserStatusEnum,
    example: UserStatusEnum.ACTIVE,
  })
  @IsEnum(UserStatusEnum)
  status: UserStatusEnum;

  @ApiProperty({
    description: 'Indicates if the user is an admin',
    example: false,
  })
  isAdmin: boolean;
}
