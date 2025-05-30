import { Entity, Column, ManyToOne, Index, JoinColumn, Unique } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { SubComponent } from './sub-component.entity';
import { MeasurementScale } from './measurement-scale.entity';
import { MeasurementScaleSubcomponentTranslationDto } from '@africa-cdc/shared/dtos';

@Entity('measurement_scale_sub_components')
@Unique(['subComponentId', 'measurementScaleId'])
export class MeasurementScaleSubComponent extends BaseEntityWithSoftDelete {
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
    type: () => SubComponent,
  })
  @ManyToOne(() => SubComponent)
  @JoinColumn({ name: 'subComponentId' })
  subComponent: SubComponent;

  @ApiProperty({
    description: 'ID of the associated measurement',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column()
  @Index()
  measurementScaleId: string;

  @ApiProperty({
    description: 'Associated measurement',
    type: () => MeasurementScale,
  })
  @ManyToOne(
    () => MeasurementScale,
    (measurementScale) => measurementScale.measurementScaleSubComponents,
  )
  @JoinColumn({ name: 'measurementScaleId' })
  measurementScale: MeasurementScale;

  @ApiProperty({
    description: 'Description for this sub-component and scale combination',
    example: 'This scale indicates a basic level of implementation.',
    type: String,
  })
  @Column({ type: 'text' })
  description: string;

  @ApiPropertyOptional({
    description: 'Assessments related to this Measuremnt scale Subcomponent',
    type: () => MeasurementScaleSubcomponentTranslationDto,
  })
  @Column('jsonb')
  translations: Record<string, MeasurementScaleSubcomponentTranslationDto> = {};
}
