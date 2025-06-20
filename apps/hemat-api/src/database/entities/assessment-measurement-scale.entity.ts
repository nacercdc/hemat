import {
  Entity,
  Column,
  ManyToOne,
  Index,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Assessment } from './assessment.entity';
import { AssessmentMeasurementScaleSubComponent } from './assessment-measurement-scale-sub-component.entity';
import { MeasurementScaleTranslationDto } from 'src/shared/dtos';
import { Roadmap } from './roadmap.entity';
import { AssessmentSubComponentAnswer } from './assessment-sub-component-answer.entity';
import { AssessmentSubComponentRoadmap } from './assessment-sub-component-roadmap.entity';

@Entity('assessment_measurement_scale')
export class AssessmentMeasurementScale extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'Name of the measurement',
    example: 'Effectiveness',
    type: String,
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Description of the measurement',
    example: 'Measures the effectiveness of interventions',
    type: String,
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    description: 'Color associated with the measurement',
    example: '#FF0000',
    type: String,
  })
  @Column()
  color: string;

  @ApiProperty({
    description: 'Rate of the measurement',
    example: 5,
    type: Number,
  })
  @Column()
  rate: number;

  @ApiPropertyOptional({
    description: 'Assessments related to this Measurement scale',
    type: () => MeasurementScaleTranslationDto,
  })
  @Column('jsonb')
  translations: Record<string, MeasurementScaleTranslationDto> = {};

  @ApiProperty({
    description: 'ID of the associated assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column()
  @Index()
  assessmentId: string;

  @ManyToOne(() => Assessment, (assessment) => assessment.measurementScales)
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment;

  @OneToMany(
    () => AssessmentMeasurementScaleSubComponent,
    (subComponent) => subComponent.measurementScale,
  )
  subComponents: AssessmentMeasurementScaleSubComponent[];

  @OneToMany(
    () => AssessmentSubComponentAnswer,
    (answer) => answer.measurementScale,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  answers: AssessmentSubComponentAnswer[];

  @OneToMany(
    () => AssessmentSubComponentRoadmap,
    (roadmap) => roadmap.measurementScale,
  )
  roadmaps: AssessmentSubComponentRoadmap[];
}
