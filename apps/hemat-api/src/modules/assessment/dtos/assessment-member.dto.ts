import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsOptional,
  IsString,
  ArrayNotEmpty,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MemberRole } from '@shared/enums';

export class AssessmentMemberCreateRequestDto {
  @ApiProperty({
    description: 'ID of the user to be added as a member',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.userId.isNotEmpty' })
  @IsUUID('4', { message: 'validation.userId.isUUID' })
  @Type(() => String)
  userId: string;

  @ApiProperty({
    description: 'Role of the member in the assessment group',
    enum: MemberRole,
    example: MemberRole.PRIMARY,
    type: String,
  })
  @IsNotEmpty({ message: 'validation.role.isNotEmpty' })
  @IsEnum(MemberRole, { message: 'validation.role.isEnum' })
  @Type(() => String)
  role: MemberRole;

  @ApiProperty({
    description: 'ID of the group to add the member to',
    example: '123e4567-e89b-12d3-a456-426614174003',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.groupId.isNotEmpty' })
  @IsUUID('4', { message: 'validation.groupId.isUUID' })
  @Type(() => String)
  groupId: string;
}

export class AssessmentMemberUpdateRequestDto {
  @ApiPropertyOptional({
    description: 'Role of the member in the assessment group',
    enum: MemberRole,
    example: MemberRole.MEMBER,
    type: String,
  })
  @IsOptional()
  @IsEnum(MemberRole, { message: 'validation.role.isEnum' })
  @Type(() => String)
  role?: MemberRole;
}

export class AssessmentMemberMoveItemDto {
  @ApiProperty({
    description: 'The groupId to move the user(s) to',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsNotEmpty()
  @IsUUID('4')
  toGroupId: string;

  @ApiProperty({
    description: 'The userIds to move',
    type: [String],
    example: ['71a84068-6060-4751-8710-d82ad3caad8f'],
  })
  @ArrayNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  userIds: string[];

  @ApiProperty({
    description: 'The new role for the user(s) in the destination group',
    enum: MemberRole,
    example: MemberRole.PRIMARY,
  })
  @IsNotEmpty()
  @IsEnum(MemberRole)
  newRole: MemberRole;

  @ApiProperty({
    description: 'The userId in the old group to promote to TEAM_LEADER (required if moving a PRIMARY)',
    type: String,
    example: 'user-to-promote-in-old-group',
    required: false,
  })
  @IsOptional()
  @IsUUID('4')
  promoteUserId?: string;

  @ApiProperty({
    description: 'The userId of a Team Leader from another group to promote to PRIMARY for the assessment (required if there are 3 or more groups and moving a TEAM_LEADER)',
    type: String,
    example: 'userH',
    required: false,
  })
  @IsOptional()
  @IsUUID('4')
  promotePrimaryId?: string;
}

export class AssessmentMemberMoveRequestDto {
  @ApiProperty({
    description: 'Array of move operations',
    type: [AssessmentMemberMoveItemDto],
  })
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AssessmentMemberMoveItemDto)
  moves: AssessmentMemberMoveItemDto[];
}
