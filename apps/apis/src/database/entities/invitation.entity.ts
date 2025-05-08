import { Entity, Column, OneToOne } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { InvitationStatus, MemberRole } from '../../shared';
import { Assessment } from './assessment.entity';

@Entity('invitations')
export class Invitation extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'Name of the invitee',
    example: 'Jane Doe',
    type: String,
  })
  @Column()
  name: string;

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
  @Column()
  assessmentId: string;

  @ApiPropertyOptional({
    description: 'Assessment object',
    type: () => Assessment,
  })
  @OneToOne(() => Assessment, (assessment) => assessment.invitation)
  assessment: Assessment | null;

  @ApiProperty({
    description: 'Group name within the assessment',
    example: 'Ethiopia Group 1',
    type: String,
  })
  @Column()
  groupName: string;

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
