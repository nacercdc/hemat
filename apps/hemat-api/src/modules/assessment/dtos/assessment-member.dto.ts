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
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'consistentGroupTypes', async: false })
export class ConsistentGroupTypesConstraint
  implements ValidatorConstraintInterface
{
  validate(groups: MoveGroupDto[]) {
    const types = groups.map((g) => {
      if (g.group === null) return 'null';
      if (
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          g.group,
        )
      )
        return 'uuid';
      return 'string';
    });
    return new Set(types).size === 1;
  }
  defaultMessage() {
    return 'validation.groups.consistentTypes';
  }
}

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

export class MoveGroupDto {
  @ApiProperty({
    description:
      'Group ID or name (null for new group with auto-generated name)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'validation.group.isString' })
  @Type(() => String)
  group: string | null;

  @ApiProperty({
    description: 'List of user IDs to move to the group',
    example: [
      '123e4567-e89b-12d3-a456-426614174001',
      '123e4567-e89b-12d3-a456-426614174002',
    ],
    type: [String],
  })
  @ArrayNotEmpty({ message: 'validation.userIds.arrayNotEmpty' })
  @IsArray()
  @IsUUID('4', { each: true, message: 'validation.userIds.isUUID' })
  @Type(() => String)
  userIds: string[];
}

export class AssessmentMemberMoveRequestDto {
  @ApiProperty({
    description: 'List of groups with users to move',
    type: [MoveGroupDto],
  })
  @ArrayNotEmpty({ message: 'validation.groups.arrayNotEmpty' })
  @ValidateNested({ each: true })
  @Type(() => MoveGroupDto)
  groups: MoveGroupDto[];
}
