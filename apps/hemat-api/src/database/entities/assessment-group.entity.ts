import {
  Entity,
  Column,
  OneToMany,
  Index,
  ManyToOne,
  JoinColumn,
  Unique,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Report } from './report.entity';
import { AssessmentMember } from './assessment-member.entity';
import { Invitation } from './invitation.entity';
import { Assessment } from './assessment.entity';
import { Answer } from './answer.entity';
import { AssessmentDomain } from './assessment-domain.entity';

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

  @ManyToOne(() => Assessment, (assessment) => assessment.members)
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment;

  @OneToMany(() => AssessmentMember, (member) => member.group)
  members: AssessmentMember[] | null;

  @OneToMany(() => Invitation, (invitation) => invitation.group)
  invitations: Invitation[] | null;

  @OneToMany(() => Report, (reports) => reports.assessment_groups)
  reports: Report[] | null;

  @ApiProperty({
    description: 'Assessment answers associated with this group',
    type: () => [Answer],
  })
  @OneToMany(() => Answer, (answer) => answer.group)
  answers: Answer[] | null;

  @ManyToMany(() => AssessmentDomain)
  @JoinTable({
    name: 'assessment_group_domains',
    joinColumn: { name: 'groupId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'domainId', referencedColumnName: 'id' },
  })
  domains: AssessmentDomain[];
}
