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

  @ApiPropertyOptional({
    description: 'UserId to promote to TEAM_LEADER in the current group (required when updating MEMBER to TEAM_LEADER)',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsUUID('4')
  promoteUserId?: string;
}

export class AssessmentMemberMoveSimpleDto {
  @ApiProperty({ description: 'The userId to move', type: String })
  @IsNotEmpty()
  @IsUUID('4')
  userId: string;

  @ApiProperty({ description: 'The groupId to move the user to', type: String })
  @IsNotEmpty()
  @IsUUID('4')
  toGroupId: string;

  @ApiPropertyOptional({
    description: 'The userId in the old group to promote to TEAM_LEADER (required if moving a PRIMARY or TEAM_LEADER)',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsUUID('4')
  promoteUserId?: string;
}
