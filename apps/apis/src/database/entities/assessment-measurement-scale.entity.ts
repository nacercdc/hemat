import { Entity, Column, ManyToOne, Index, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity'; 
import { AssessmentSubComponent } from './assessment-sub-component.entity';
import { Assessment } from './assessment.entity';
import { AssessmentAnswer } from './assessment-answer.entity';

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

  @ApiProperty({
    description: 'ID of the associated assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column()
  @Index()
  assessmentId: string;

  @ApiPropertyOptional({
    description: 'Assessments related to this domain',
    type: () => Assessment,
  })
  @OneToMany(() => Assessment, (assessment) => assessment.measurementScales)
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment;

  @ApiProperty({
    description: 'ID of the associated sub-component',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column()
  @Index()
  subComponentId: string;

  @ApiProperty({
    description: 'Associated sub-component',
    type: () => AssessmentSubComponent,
  })
  @ManyToOne(() => AssessmentSubComponent)
  @JoinColumn({ name: 'subComponentId' })
  subComponent: AssessmentSubComponent;

  @ApiPropertyOptional({
    description: 'Assessment answer object',
    type: () => AssessmentAnswer,
  })
  @OneToOne(() => AssessmentAnswer, (answer) => answer.measurementScale, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  answer: AssessmentAnswer | null;
}
