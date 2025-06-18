import {
  Entity,
  Column,
  OneToMany,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Roadmap } from './roadmap.entity';
import { Assessment } from './assessment.entity';
import { AssessmentSubComponent } from './assessment-sub-component.entity';
import { AssessmentMeasurementScale } from './assessment-measurement-scale.entity';
import { User } from './user.entity';
import { AssessmentGroup } from './assessment-group.entity';

@Entity('assessment_answers')
export class AssessmentAnswer extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'ID of the associated assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Index()
  @Column({ type: 'uuid' })
  assessmentId: string;

  @ManyToOne(() => Assessment, (assessment) => assessment.answers)
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment;

  @ApiProperty({
    description: 'ID of the associated user',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column()
  @Index()
  userId: string;

  @ManyToOne(() => User, (user) => user.answers)
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @ApiProperty({
    description: 'ID of the associated sub-component',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Index()
  @Column({ type: 'uuid' })
  subComponentId: string;

  @ManyToOne(
    () => AssessmentSubComponent,
    (subComponent) => subComponent.answers,
  )
  @JoinColumn({ name: 'subComponentId' })
  subComponent: AssessmentSubComponent | null;

  @ApiProperty({
    description: 'ID of the associated measurement scale',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Index()
  @Column({ type: 'uuid' })
  measurementScaleId: string;

  @ManyToOne(
    () => AssessmentMeasurementScale,
    (measurementScale) => measurementScale.answers,
  )
  @JoinColumn({ name: 'measurementScaleId' })
  measurementScale: AssessmentMeasurementScale | null;

  @ApiProperty({
    description: 'Evidence supporting the answer',
    type: String,
  })
  @Column({ type: 'text' })
  evidence: string;

  @ApiProperty({
    description: 'Reference for the answer',
    type: String,
  })
  @Column({ type: 'text' })
  reference: string;

  @ApiPropertyOptional({
    description: 'Notes for the answer',
    example: 'Additional context for the rating',
    type: String,
  })
  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @ApiProperty({
    description:
      'Indicates if the answer is submitted as PRIMARY for the assessment',
    example: false,
    type: Boolean,
  })
  @Column({ type: 'boolean', default: false })
  isPrimary: boolean;

  @ApiPropertyOptional({
    description: 'ID of the associated group (null if isPrimary is true)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column({ type: 'uuid', nullable: true })
  @Index()
  groupId: string | null;

  @ManyToOne(() => AssessmentGroup, (group) => group.answers, {
    nullable: true,
  })
  @JoinColumn({ name: 'groupId' })
  group: AssessmentGroup | null;

  @OneToMany(() => Roadmap, (roadmap) => roadmap.assessmentAnswer)
  roadmaps: Roadmap[];
}