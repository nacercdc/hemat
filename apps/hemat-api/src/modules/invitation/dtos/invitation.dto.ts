import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  ValidateNested,
  ArrayNotEmpty,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MemberRole } from '@shared/enums';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

export class InvitationItemDto {
  @ApiProperty({
    description: 'Email of the invitee',
    example: 'jane.doe@hiemat.org',
  })
  @IsNotEmpty({ message: 'validation.email.isNotEmpty' })
  @IsEmail({}, { message: 'validation.email.isEmail' })
  email: string;

  @ApiProperty({
    description: 'Role assigned to the invitee',
    enum: MemberRole,
    example: MemberRole.PRIMARY,
  })
  @IsNotEmpty({ message: 'validation.role.isNotEmpty' })
  @IsEnum(MemberRole, { message: 'validation.role.isEnum' })
  role: MemberRole;

  @ApiProperty({
    description: 'If adding a team-leader to a group with a primary, specify which team-leader should be promoted to primary',
    required: false,
    example: 'existing.teamleader@email.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'validation.promoteToPrimaryEmail.isEmail' })
  promoteToPrimaryEmail?: string;
}

export class GroupInvitationDto {
  @ApiProperty({
    description: 'Group ID or name (null for new group)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  @IsOptional()
  group: string | null;

  @ApiProperty({
    description: 'List of invitations for the group',
    type: [InvitationItemDto],
  })
  @ArrayNotEmpty({ message: 'validation.invitations.arrayNotEmpty' })
  @ValidateNested({ each: true })
  @Type(() => InvitationItemDto)
  invitations: InvitationItemDto[];
}

export type InvitationCreateBulkRequestDto = GroupInvitationDto[];

export class InvitationUpdateRequestDto {
  @ApiProperty({
    description: 'Email of the invitee',
    example: 'jane.doe@hiemat.org',
  })
  @IsNotEmpty({ message: 'validation.email.isNotEmpty' })
  @IsEmail({}, { message: 'validation.email.isEmail' })
  email: string;

  @ApiProperty({ description: 'Invitation token', example: 'abc123xyz789' })
  @IsNotEmpty({ message: 'validation.token.isNotEmpty' })
  @IsString({ message: 'validation.token.isString' })
  token: string;
}
