import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Component } from './component.entity';
import { MeasurementScaleSubComponent } from './measurement-scale-sub-component.entity';

@Entity('sub_components')
export class SubComponent extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'Unique code of the sub-component',
    example: '1.A.1',
    type: String,
  })
  @Column({ unique: true })
  code: string;

  @ApiProperty({
    description: 'Name of the sub-component',
    example: 'Vaccine Distribution',
    type: String,
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Description of the sub-component',
    example: 'Sub-component for vaccine distribution',
    type: String,
  })
  @Column()
  description: string;

  @ApiPropertyOptional({
    description: 'ID of the associated component',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column()
  componentId: string;

  @ApiProperty({
    description: 'Associated component',
    type: () => Component,
  })
  @ManyToOne(() => Component, (component) => component.subComponents)
  @Index()
  @JoinColumn({ name: 'componentId' })
  component: Component;

  @ApiProperty({
    description: 'MeasurementScaleSubComponent linked to this SubComponent',
    type: () => [MeasurementScaleSubComponent],
  })
  @OneToMany(
    () => MeasurementScaleSubComponent,
    (measurementScaleSubComponent) => measurementScaleSubComponent.subComponent,
  )
  measurementScaleSubComponents: MeasurementScaleSubComponent[];
}
