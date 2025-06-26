import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AssessmentSubComponent } from './assessment-sub-component.entity';
import { AssessmentMeasurementScale } from './assessment-measurement-scale.entity';
import { Answer } from './answer.entity';
import { BaseEntityWithSoftDelete } from './entity';

@Entity('assessment_sub_component_answers')
export class AssessmentSubComponentAnswer extends BaseEntityWithSoftDelete {
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
    description: 'ID of the associated answer',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Index()
  @Column({ type: 'uuid' })
  answerId: string;

  @ManyToOne(() => Answer, (answer) => answer.id)
  @JoinColumn({ name: 'answerId' })
  answer: Answer;

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
    description: 'ID of the associated component',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Index()
  @Column({ type: 'uuid' })
  componentId: string;

  @ApiProperty({
    description: 'ID of the associated domain',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Index()
  @Column({ type: 'uuid' })
  domainId: string;
}
