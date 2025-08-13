import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../../database/entities';
import { UserStatusEnum, LanguageEnum } from '../../../shared/enums';
import { ProfileResponseDto } from './profile-response.dto';
import { RoleResponseDto } from './role-response.dto';
import { PermissionResponseDto } from './permission-response.dto';

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

  @ApiPropertyOptional({
    description: 'Title',
    example: 'Administrator',
    type: String,
  })
  title: string | null;

  @ApiProperty({
    description: 'First name',
    example: 'John',
    type: String,
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
    type: String,
  })
  lastName: string;

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

  constructor(entity: User) {
    this.id = entity.id;
    this.isAdmin = entity.isAdmin;
    this.title = entity.profile?.title || null;
    this.firstName = entity.profile?.firstName || '';
    this.lastName = entity.profile?.lastName || '';
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
  }
}