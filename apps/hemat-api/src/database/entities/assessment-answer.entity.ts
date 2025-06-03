import {
  Entity,
  Column,
  OneToMany,
  Index,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Roadmap } from './roadmap.entity';
import { Assessment } from './assessment.entity';
import { AssessmentSubComponent } from './assessment-sub-component.entity';
import { AssessmentMeasurementScale } from './assessment-measurement-scale.entity';
import { User } from './user.entity';

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

  @ApiProperty({
    description: 'Associated assessment',
    type: () => Assessment,
  })
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

  @ApiPropertyOptional({
    description: 'User object',
    type: () => User,
  })
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

  @ApiPropertyOptional({
    description: 'SubComponent object',
    type: () => AssessmentSubComponent,
  })
  @OneToOne(() => AssessmentSubComponent, (subComponent) => subComponent.answer)
  @JoinColumn({ name: 'subComponentId' })
  subComponent: AssessmentSubComponent | null;

  @ApiProperty({
    description: 'ID of the associated measurement',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column()
  measurementScaleId: string;

  @ApiPropertyOptional({
    description: 'Measurement scale object',
    type: () => AssessmentMeasurementScale,
  })
  @OneToOne(
    () => AssessmentMeasurementScale,
    (measurement) => measurement.answer,
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
    description: 'Roadmaps linked to this answer',
    type: () => [Roadmap],
  })
  @OneToMany(() => Roadmap, (roadmap) => roadmap.answers)
  roadmaps: Roadmap[];
}
