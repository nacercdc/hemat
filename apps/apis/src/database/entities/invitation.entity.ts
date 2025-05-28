import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { InvitationStatus, MemberRole } from '../../shared';
import { Assessment } from './assessment.entity';
import { AssessmentGroup } from './assessment-group.entity';

@Entity('invitations')
export class Invitation extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'Email of the invitee',
    example: 'jane.doe@hiemat.org',
    type: String,
  })
  @Column()
  email: string;

  @ApiProperty({
    description: 'ID of the associated assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column({ type: 'uuid' })
  @Index()
  assessmentId: string;

  @ApiPropertyOptional({
    description: 'Assessment object',
    type: () => Assessment,
  })
  @ManyToOne(() => Assessment, (assessment) => assessment.invitations)
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment | null;

  @ApiProperty({
    description: 'ID of the associated group',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column({ type: 'uuid' })
  @Index()
  groupId: string;

  @ApiPropertyOptional({
    description: 'Group object',
    type: () => AssessmentGroup,
  })
  @ManyToOne(() => AssessmentGroup, (group) => group.invitations)
  @JoinColumn({ name: 'groupId' })
  group: AssessmentGroup | null;

  @ApiProperty({
    description: 'Role assigned to the invitee',
    enum: MemberRole,
    example: MemberRole.PRIMARY,
    type: String,
  })
  @Column({ type: String, enum: MemberRole })
  role: MemberRole;

  @ApiProperty({
    description: 'Unique token for the invitation',
    example: 'abc123...',
    type: String,
  })
  @Column()
  token: string;

  @ApiProperty({
    description: 'Status of the invitation',
    enum: InvitationStatus,
    example: InvitationStatus.PENDING,
    type: String,
  })
  @Column({
    type: String,
    enum: InvitationStatus,
    default: InvitationStatus.PENDING,
  })
  status: InvitationStatus;
}
