import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubComponentTranslationDto } from '@shared/dtos';
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

  @ApiProperty({
    description: 'Whether the sub-component is active',
    example: true,
    type: Boolean,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Assessments related to this Sub component',
    type: () => SubComponentTranslationDto,
  })
  @Column('jsonb')
  translations: Record<string, SubComponentTranslationDto> = {};

  @ApiPropertyOptional({
    description: 'ID of the associated component',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column()
  componentId: string;

  @ManyToOne(() => Component, (component) => component.subComponents)
  @Index()
  @JoinColumn({ name: 'componentId' })
  component: Component;

  @OneToMany(
    () => MeasurementScaleSubComponent,
    (measurementScale) => measurementScale.subComponent,
  )
  measurementScales: MeasurementScaleSubComponent[];
}
