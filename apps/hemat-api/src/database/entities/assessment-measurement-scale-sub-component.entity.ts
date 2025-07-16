import { Entity, Column, Index, JoinColumn, Unique, ManyToOne } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MeasurementScaleSubComponentTranslationDto } from '@shared/dtos';
import { BaseEntityWithSoftDelete } from './entity';
import { AssessmentSubComponent } from './assessment-sub-component.entity';
import { AssessmentMeasurementScale } from './assessment-measurement-scale.entity';

@Entity('assessment_measurement_scale_sub_components')
@Unique(['subComponentId', 'measurementScaleId'])
export class AssessmentMeasurementScaleSubComponent extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'ID of the associated sub-component',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column()
  @Index()
  subComponentId: string;

  @ManyToOne(
    () => AssessmentSubComponent,
    (subComponent) => subComponent.measurementScales,
  )
  @JoinColumn({ name: 'subComponentId' })
  subComponent: AssessmentSubComponent;

  @ApiProperty({
    description: 'ID of the associated measurement',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column()
  @Index()
  measurementScaleId: string;

  @ManyToOne(
    () => AssessmentMeasurementScale,
    (measurementScale) => measurementScale.subComponents,
  )
  @JoinColumn({ name: 'measurementScaleId' })
  measurementScale: AssessmentMeasurementScale;

  @ApiProperty({
    description: 'Description for this sub-component and scale combination',
    example: 'This scale indicates a basic level of implementation.',
    type: String,
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    description: 'ID of the original template measurement scale sub-component',
    example: 'template-measurement-scale-sub-component-uuid',
    type: String,
    required: false,
  })
  @Column({ type: 'uuid', nullable: true })
  templateMeasurementScaleSubComponentId?: string;

  @ApiPropertyOptional({
    description: 'Assessments related to this Measurement scale SubComponent',
    type: () => MeasurementScaleSubComponentTranslationDto,
  })
  @Column('jsonb')
  translations: Record<string, MeasurementScaleSubComponentTranslationDto> = {};
}
