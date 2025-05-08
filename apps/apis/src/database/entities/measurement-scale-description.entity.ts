import { Entity, Column, ManyToOne, Index, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { SubComponent } from './sub-component.entity';
import { Measurement } from './measurement.entity';

@Entity('measurement_scale_descriptions')
export class MeasurementScaleDescription extends BaseEntityWithSoftDelete {
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
  measurementId: string;

  @ApiProperty({
    description: 'Associated measurement',
    type: () => Measurement,
  })
  @ManyToOne(() => Measurement, (measurement) => measurement.roadmaps)
  @JoinColumn({ name: 'measurementId' })
  measurement: Measurement;

  @ApiProperty({
    description: 'Description for this sub-component and scale combination',
    example: 'This scale indicates a basic level of implementation.',
    type: String,
  })
  @Column({ type: 'text' })
  description: string;
}
