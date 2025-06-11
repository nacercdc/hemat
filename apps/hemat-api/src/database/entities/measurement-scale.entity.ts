import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MeasurementScaleTranslationDto } from '@shared/dtos';
import { BaseEntityWithSoftDelete } from './entity';
import { MeasurementScaleSubComponent } from './measurement-scale-sub-component.entity';

@Entity('measurement_scales')
export class MeasurementScale extends BaseEntityWithSoftDelete {
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
  @Column()
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

  @OneToMany(
    () => MeasurementScaleSubComponent,
    (measurementScaleSubComponent) =>
      measurementScaleSubComponent.measurementScale,
  )
  measurementScaleSubComponents: MeasurementScaleSubComponent[];
}
