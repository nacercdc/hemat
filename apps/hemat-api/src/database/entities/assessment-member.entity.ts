import { Entity, Column, ManyToOne, Index, JoinColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MemberRole } from '@shared/enums';
import { BaseEntityWithSoftDelete } from './entity';
import { Assessment } from './assessment.entity';
import { User } from './user.entity';
import { AssessmentGroup } from './assessment-group.entity';

@Entity('assessment_members')
export class AssessmentMember extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'ID of the associated user',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column({ type: 'uuid' })
  @Index()
  userId: string;

  @ApiPropertyOptional({
    description: 'User object',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.assessmentMembers)
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @ApiProperty({
    description: 'ID of the associated assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column({ type: 'uuid' })
  @Index()
  assessmentId: string;

  @ManyToOne(() => Assessment, (assessment) => assessment.members)
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment;

  @ApiProperty({
    description: 'ID of the associated Assessment group',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column({ type: 'uuid' })
  @Index()
  groupId: string;

  @ManyToOne(() => AssessmentGroup, (group) => group.members)
  @JoinColumn({ name: 'groupId' })
  group: AssessmentGroup;

  @ApiProperty({
    description: 'Role of the member',
    enum: MemberRole,
    example: MemberRole.PRIMARY,
    type: String,
  })
  @Column({ type: 'enum', enum: MemberRole })
  role: MemberRole;
}