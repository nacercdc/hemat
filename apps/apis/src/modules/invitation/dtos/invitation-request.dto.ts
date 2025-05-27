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
import { MemberRole } from '../../../shared';
import { InvitationStatus } from '../../../shared';
export class InvitationCreateRequestDto {
  @ApiProperty({
    description: 'Name of the invitee',
    example: 'Jane Doe',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.name.isNotEmpty' })
  @IsString({ message: 'validation.name.isString' })
  @Length(1, 100, { message: 'validation.name.length args: min:1 | max:100' })
  @Type(() => String)
  name: string;

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
    description: 'ID of the associated assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.assessmentId.isNotEmpty' })
  @IsUUID('4', { message: 'validation.assessmentId.isUUID' })
  @Type(() => String)
  assessmentId: string;

  @ApiProperty({
    description: 'ID of the associated group',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.groupId.isNotEmpty' })
  @IsUUID('4', { message: 'validation.groupId.isUUID' })
  @Type(() => String)
  groupId: string;

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
  @ApiPropertyOptional({
    description: 'Status of the invitation',
    enum: InvitationStatus,
    example: InvitationStatus.ACCEPTED,
    type: String,
  })
  @IsOptional()
  @IsEnum(InvitationStatus, { message: 'validation.status.isEnum' })
  @Type(() => String)
  status?: InvitationStatus;
}
