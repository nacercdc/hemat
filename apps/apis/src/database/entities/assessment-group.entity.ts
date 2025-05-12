import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Report } from './report.entity';
import { AssessmentMember } from './assessment-member.entity';
import { Invitation } from './invitation.entity';

@Entity('assessment_groups')
export class AssessmentGroup extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'Name of the Assessment group',
    example: 'Ethiopia Group 1',
    type: String,
  })
  @Column()
  name: string;

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
