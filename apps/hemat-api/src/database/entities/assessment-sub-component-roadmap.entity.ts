import { Entity, Column, ManyToOne, Index, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './entity';
import { Roadmap } from './roadmap.entity';
import { AssessmentSubComponent } from './assessment-sub-component.entity';
import { AssessmentMeasurementScale } from './assessment-measurement-scale.entity';
import { Answer } from './answer.entity';

@Entity('assessment_sub_component_roadmaps')
@Unique(['roadmapId', 'subComponentId'])
export class AssessmentSubComponentRoadmap extends BaseEntity {
  @ApiProperty({
    description: 'ID of the associated roadmap',
    example: 'a0b2d886-8c4d-4c5d-80df-8cdb54c41046',
    type: String,
  })
  @Index()
  @Column({ type: 'uuid' })
  roadmapId: string;

  @ManyToOne(() => Roadmap, (roadmap) => roadmap.subComponentRoadmaps)
  roadmap: Roadmap;

  @ApiProperty({
    description: 'ID of the associated sub-component',
    example: '6ac728ed-073b-4cd1-9ba8-35a1a900d5c7',
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
    example: '0145fa94-841e-49ee-988f-6a8690bf58fe',
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
    description: 'ID of the associated answer (isPrimary=true)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Index()
  @Column({ type: 'uuid' })
  answerId: string;

  @ManyToOne(() => Answer, (answer) => answer.roadmaps)
  answer: Answer;

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
    description: 'Gap addressed by the roadmap',
    example: 'Lack of cold chain equipment',
    type: String,
  })
  @Column({ type: 'text' })
  gapAddressed: string;

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
