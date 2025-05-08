import {
  Entity,
  Column,
  ManyToOne,
  Index,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Assessment } from './assessment.entity';
import { MemberRole } from '../../shared';
import { User } from './user.entity';

@Entity('assessment_members')
export class AssessmentMember extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'ID of the associated user',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column()
  @Index()
  userId: string;

  @ApiPropertyOptional({
    description: 'User object',
    type: () => User,
  })
  @OneToOne(() => User, (user) => user.assessmentMember)
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @ApiProperty({
    description: 'ID of the associated assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column()
  @Index()
  assessmentId: string;

  @ApiProperty({
    description: 'Associated assessment',
    type: () => Assessment,
  })
  @ManyToOne(() => Assessment, (assessment) => assessment.members)
  @Index()
  assessment: Assessment;

  @ApiProperty({
    description: 'Group name within the assessment',
    example: 'Ethiopia Group 1',
    type: String,
  })
  @Column()
  groupName: string;

  @ApiProperty({
    description: 'Role of the member',
    enum: MemberRole,
    example: MemberRole.PRIMARY,
    type: String,
  })
  @Column({ type: 'enum', enum: MemberRole })
  role: MemberRole;
}
