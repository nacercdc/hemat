import {
  Entity,
  Column,
  ManyToOne,
  Index,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Domain } from './domain.entity';
import { Assessment } from './assessment.entity';
import { User } from './user.entity';
import { AssessmentGroup } from './assessment-group.entity';

@Entity('reports')
export class Report extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'ID of the associated assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column()
  assessmentId: string;

  @ManyToOne(() => Assessment, (assessment) => assessment.reports)
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment;

  @ApiPropertyOptional({
    description: 'ID of the associated group',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column({ nullable: true })
  @Index()
  assessmentGroupId: string;

  @ManyToOne(() => AssessmentGroup)
  @JoinColumn({ name: 'assessmentGroupId' })
  assessment_groups: AssessmentGroup | null;

  @ApiPropertyOptional({
    description: 'ID of the team leader',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Index()
  @Column()
  userId: string;

  @OneToOne(() => User, (user) => user.reports)
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @ApiProperty({
    description: 'Associated domain',
    type: () => Domain,
  })
  @ManyToOne(() => Domain)
  @Index()
  domain: Domain;

  @ApiProperty({
    description: 'Content of the report',
    example: 'Detailed report content',
    type: String,
  })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({
    description: 'Whether this is the final report',
    example: false,
    type: Boolean,
  })
  @Column({ default: false })
  isFinal: boolean;
}
