import {
  Entity,
  Column,
  OneToOne,
  OneToMany,
  Index,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Report } from './report.entity';
import { AssessmentMember } from './assessment-member.entity';
import { Invitation } from './invitation.entity';
import { Assessment } from './assessment.entity';

@Entity('assessment_groups')
@Unique(['name', 'assessmentId'])
export class AssessmentGroup extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'Name of the Assessment group',
    example: 'Ethiopia Group 1',
    type: String,
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'ID of the associated assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column({ type: 'uuid' })
  @Index()
  assessmentId: string;

  @ApiProperty({
    description: 'Associated assessment',
    type: () => Assessment,
  })
  @ManyToOne(() => Assessment, (assessment) => assessment.members)
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment;

  @ApiPropertyOptional({
    description: 'Members of the assessment',
    type: () => [AssessmentMember],
  })
  @OneToMany(() => AssessmentMember, (member) => member.group)
  members: AssessmentMember[] | null;

  @ApiPropertyOptional({
    description: 'Invitation of the assessment',
    type: () => [Invitation],
  })
  @OneToMany(() => Invitation, (invitation) => invitation.group)
  invitations: Invitation[] | null;

  @ApiPropertyOptional({
    description: 'Report Object',
    type: () => [Report],
  })
  @OneToMany(() => Report, (reports) => reports.assessment_groups)
  reports: Report[] | null;
}
