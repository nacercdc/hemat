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
} from 'class-validator';
@ValidatorConstraint({ name: 'uniqueEmails', async: false })
export class UniqueEmailsConstraint implements ValidatorConstraintInterface {
  validate(groups: GroupInvitationDto[]) {
    const emails = groups.flatMap((g) => g.invitations.map((i) => i.email));
    return new Set(emails).size === emails.length;
  }
  defaultMessage() {
    return 'validation.invitations.uniqueEmails';
  }
}

@ValidatorConstraint({ name: 'consistentGroupTypes', async: false })
export class ConsistentGroupTypesConstraint
  implements ValidatorConstraintInterface
{
  validate(groups: GroupInvitationDto[]) {
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
}

export class GroupInvitationDto {
  @ApiProperty({
    description: 'Group ID or name (null for new group)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'validation.group.isString' })
  @Type(() => String)
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
