import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { AssessmentAnswer } from './assessment-answer.entity';
import { AssessmentSubComponent } from './assessment-sub-component.entity';
import { AssessmentMeasurementScale } from './assessment-measurement-scale.entity';

@Entity('roadmaps')
export class Roadmap extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'ID of the associated assessment answer',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Index()
  @Column({ type: 'uuid' })
  assessmentAnswerId: string;

  @ManyToOne(() => AssessmentAnswer, (answer) => answer.roadmaps)
  assessmentAnswer: AssessmentAnswer;

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
    (subComponent) => subComponent.roadmaps,
  )
  subComponent: AssessmentSubComponent;

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
    (measurementScale) => measurementScale.roadmaps,
  )
  measurementScale: AssessmentMeasurementScale;

  @ApiProperty({
    description: 'Target of the roadmap',
    example: 'Increase vaccination coverage',
    type: String,
  })
  @Column({ type: 'varchar', length: 1000 })
  target: string;

  @ApiProperty({
    description: 'Current state of the roadmap based on scale rate',
    example: 3,
    type: Number,
  })
  @Column({ type: 'int' })
  currentState: number;

  @ApiProperty({
    description: 'Activities planned in the roadmap',
    example: 'Conduct outreach programs',
    type: String,
  })
  @Column({ type: 'text' })
  activities: string;

  @ApiProperty({
    description: 'Responsible party for the roadmap',
    example: 'Health Ministry',
    type: String,
  })
  @Column({ type: 'varchar', length: 500 })
  responsible: string;

  @ApiProperty({
    description: 'Resources required for the roadmap',
    example: 'Funding, staff',
    type: String,
  })
  @Column({ type: 'text' })
  resources: string;

  @ApiProperty({
    description: 'Documentation for the roadmap',
    example: 'Project plan',
    type: String,
  })
  @Column({ type: 'text' })
  documentation: string;

  @ApiProperty({
    description: 'Start time of the roadmap',
    example: '2025-06-01T00:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @Column({ type: 'timestamp' })
  startTime: Date;

  @ApiProperty({
    description: 'End time of the roadmap',
    example: '2025-12-31T23:59:59.999Z',
    type: String,
    format: 'date-time',
  })
  @Column({ type: 'timestamp' })
  endTime: Date;
}
