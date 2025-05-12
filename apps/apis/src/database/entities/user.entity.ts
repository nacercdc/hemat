import {
  Entity,
  Column,
  OneToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BaseEntityWithSoftDelete } from './entity';
import { Profile } from './profile.entity';
import { Role } from './role.entity';
import { Permission } from './permission.entity';
import { UserStatusEnum, LanguageEnum } from '../../shared';
import { AssessmentMember } from './assessment-member.entity';
import { AssessmentAnswer } from './assessment-answer.entity';
import { Assessment } from './assessment.entity';
import { Report } from './report.entity';

@Entity('users')
export class User extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'Indicates whether user is an admin user or not',
    example: false,
    type: Boolean,
  })
  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @ApiProperty({ description: 'Full name of the user', example: 'Admin User' })
  @Column({ type: 'varchar' })
  name: string;

  @ApiProperty({
    description: 'Unique email address of the user',
    example: 'admin@hiemat.org',
  })
  @Column({ type: 'varchar', unique: true })
  email: string;

  @ApiProperty({
    description: 'Hashed password (not exposed in API responses)',
    example: '$2b$10$...',
  })
  @Column({ type: 'varchar' })
  password: string;

  @ApiProperty({
    description: 'Indicates whether user is disabled or not',
    example: false,
    type: Boolean,
  })
  @Column({ type: 'boolean', default: false })
  disabled: boolean;

  @ApiPropertyOptional({
    description: 'Disabled at',
    example: null,
    type: Date,
  })
  @Column({ type: 'timestamptz', nullable: true })
  disabledAt: Date | null;

  @ApiProperty({
    description: 'Status',
    enum: UserStatusEnum,
    example: UserStatusEnum.ACTIVE,
    type: String,
  })
  @Column({
    type: 'enum',
    enum: UserStatusEnum,
    default: UserStatusEnum.INACTIVE,
  })
  status: UserStatusEnum;

  @ApiPropertyOptional({
    description: 'Last logged in at',
    example: '2024-01-10T07:56:08.000000Z',
    type: Date,
  })
  @Column({ type: 'timestamptz', nullable: true })
  lastLoggedInAt: Date | null;

  @ApiPropertyOptional({
    description: 'Last password updated at',
    example: '2024-01-10T07:56:08.000000Z',
    type: Date,
  })
  @Column({ type: 'timestamptz', nullable: true })
  lastPasswordUpdatedAt: Date | null;

  @ApiProperty({
    description: 'Language',
    example: LanguageEnum.EN,
    type: String,
  })
  @Column({ type: String, length: 4, default: LanguageEnum.EN })
  lang: LanguageEnum;

  @ApiPropertyOptional({
    description: 'Role objects',
    type: () => Role,
    isArray: true,
  })
  @ManyToMany(() => Role, (role) => role.users, {
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
  })
  @JoinTable({ name: 'users_roles' })
  roles: Role[];

  @ApiProperty({
    description: 'Direct permissions assigned to the user',
    type: () => [Permission],
  })
  @ManyToMany(() => Permission, { cascade: true })
  @JoinTable()
  permissions: Permission[];

  @Exclude()
  @Column({ type: String, nullable: true })
  refreshToken: string | null;

  @ApiPropertyOptional({
    description: 'Profile object',
    type: () => Profile,
  })
  @OneToOne(() => Profile, (profile) => profile.user, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  profile: Profile | null;

  @ApiPropertyOptional({
    description: 'AssessmentMember object',
    type: () => AssessmentMember,
  })
  @OneToMany(
    () => AssessmentMember,
    (assessmentMember) => assessmentMember.user,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  assessmentMembers: AssessmentMember[] | null;

  @ApiPropertyOptional({
    description: 'AssessmentAnswer Object',
    type: () => [AssessmentAnswer],
  })
  @OneToMany(() => AssessmentAnswer, (answer) => answer.user)
  answers: AssessmentAnswer[] | null;

  @ApiPropertyOptional({
    description: 'Assessment object',
    type: () => Assessment,
  })
  @OneToMany(() => Assessment, (assessment) => assessment.user)
  assessments: Assessment[] | null;

  @ApiPropertyOptional({
    description: 'Report Object',
    type: () => [Report],
  })
  @OneToMany(() => Report, (reports) => reports.user)
  reports: Report[] | null;
}
