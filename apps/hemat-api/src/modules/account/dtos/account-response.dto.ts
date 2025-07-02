import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../../database/entities';
import { UserStatusEnum, LanguageEnum, MemberRole } from '../../../shared/enums';
import { ProfileResponseDto } from './profile-response.dto';
import { RoleResponseDto } from './role-response.dto';
import { PermissionResponseDto } from './permission-response.dto';

export class AssessmentMembershipDto {
  @ApiProperty({
    description: 'Assessment ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  assessmentId: string;

  @ApiProperty({
    description: 'Assessment name',
    example: 'Ethiopia Health Assessment 2024',
  })
  assessmentName: string;

  @ApiProperty({
    description: 'Role of the user in the assessment',
    enum: MemberRole,
    example: MemberRole.PRIMARY,
  })
  role: MemberRole;

  @ApiProperty({
    description: 'Group ID the user belongs to in the assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  groupId: string;

  @ApiProperty({
    description: 'Group name',
    example: 'Ethiopia Group 1',
  })
  groupName: string;

  constructor(data: {
    assessmentId: string;
    assessmentName: string;
    role: MemberRole;
    groupId: string;
    groupName: string;
  }) {
    this.assessmentId = data.assessmentId;
    this.assessmentName = data.assessmentName;
    this.role = data.role;
    this.groupId = data.groupId;
    this.groupName = data.groupName;
  }
}

export class AccountResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '4f23dbc3-3134-4a74-b0c8-5741ad2fb516',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Is admin',
    example: false,
    type: Boolean,
  })
  isAdmin: boolean;

  @ApiProperty({
    description: 'Full name',
    example: 'John Doe',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@hiemat.org',
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'Status',
    enum: UserStatusEnum,
    example: UserStatusEnum.ACTIVE,
    type: String,
  })
  status: UserStatusEnum;

  @ApiPropertyOptional({
    description: 'Last logged in at',
    example: '2024-01-10T07:56:08.000000Z',
    type: Date,
  })
  lastLoggedInAt: Date | null;

  @ApiPropertyOptional({
    description: 'Last password updated at',
    example: '2024-01-10T07:56:08.000000Z',
    type: Date,
  })
  lastPasswordUpdatedAt: Date | null;

  @ApiProperty({
    description: 'Language',
    example: LanguageEnum.EN,
    type: String,
  })
  lang: LanguageEnum;

  @ApiPropertyOptional({
    description: 'Profile',
    type: ProfileResponseDto,
  })
  profile: ProfileResponseDto | null;

  @ApiProperty({
    description: 'Roles',
    type: [RoleResponseDto],
  })
  roles: RoleResponseDto[];

  @ApiProperty({
    description: 'Permissions',
    type: [PermissionResponseDto],
  })
  permissions: PermissionResponseDto[];

  @ApiPropertyOptional({
    description: 'Assessment role of the user (if member of an assessment)',
    enum: MemberRole,
    example: MemberRole.PRIMARY,
    nullable: true,
  })
  assessmentRole?: MemberRole | null;

  @ApiPropertyOptional({
    description: 'Assessment group ID the user belongs to (if member of an assessment)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  assessmentGroupId?: string | null;

  @ApiPropertyOptional({
    description: 'Assessment ID the user is currently in context of',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  currentAssessmentId?: string | null;

  @ApiPropertyOptional({
    description: 'All assessment memberships of the user',
    type: [AssessmentMembershipDto],
  })
  assessmentMemberships?: AssessmentMembershipDto[];

  constructor(entity: User, assessmentContext?: { role?: MemberRole; groupId?: string; assessmentId?: string }, assessmentMemberships?: AssessmentMembershipDto[]) {
    this.id = entity.id;
    this.isAdmin = entity.isAdmin;
    this.name = entity.name;
    this.email = entity.email;
    this.status = entity.status;
    this.lastLoggedInAt = entity.lastLoggedInAt;
    this.lastPasswordUpdatedAt = entity.lastPasswordUpdatedAt;
    this.lang = entity.lang;
    this.profile = entity.profile
      ? new ProfileResponseDto(entity.profile)
      : null;
    this.roles = (entity.roles || []).map((role) => new RoleResponseDto(role));
    this.permissions = (entity.permissions || []).map(
      (permission) => new PermissionResponseDto(permission),
    );
    
    // Add assessment context if available
    if (assessmentContext) {
      this.assessmentRole = assessmentContext.role || null;
      this.assessmentGroupId = assessmentContext.groupId || null;
      this.currentAssessmentId = assessmentContext.assessmentId || null;
    }

    // Add assessment memberships if available
    if (assessmentMemberships) {
      this.assessmentMemberships = assessmentMemberships;
    }
  }
}
