import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MemberRole } from '@africa-cdc/shared';
import { InvitationStatus } from '@africa-cdc/shared';

export class InvitationCreateRequestDto {
  @ApiProperty({
    description: 'Group ID for the invitation',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.name.isNotEmpty' })
  @IsUUID(undefined, { message: 'validation.name.isString' })
  @Type(() => String)
  groupId: string;

  @ApiProperty({
    description: 'Email of the invitee',
    example: 'jane.doe@hiemat.org',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.email.isNotEmpty' })
  @IsEmail({}, { message: 'validation.email.isEmail' })
  @Type(() => String)
  email: string;

  @ApiProperty({
    description: 'Role assigned to the invitee',
    enum: MemberRole,
    example: MemberRole.PRIMARY,
    type: String,
  })
  @IsNotEmpty({ message: 'validation.role.isNotEmpty' })
  @IsEnum(MemberRole, { message: 'validation.role.isEnum' })
  @Type(() => String)
  role: MemberRole;
}

export class InvitationUpdateRequestDto {
  @ApiProperty({
    description: 'Email of the invitee',
    example: 'jane.doe@hiemat.org',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.email.isNotEmpty' })
  @IsEmail({}, { message: 'validation.email.isEmail' })
  @Type(() => String)
  email: string;

  @ApiProperty({
    description: 'Invitation token',
    example: 'abc123xyz789',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.email.isNotEmpty' })
  @IsString({ message: 'validation.email.isEmail' })
  @Type(() => String)
  token: string;
}