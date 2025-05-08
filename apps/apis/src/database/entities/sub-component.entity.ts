import { Entity, Column, ManyToOne, OneToMany, Index, OneToOne } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Component } from './component.entity';
import { AssessmentSubComponent } from './assessment-sub-component.entity';
import { Answer } from './answer.entity';
import { Roadmap } from './roadmap.entity';
import { MeasurementScaleDescription } from './measurement-scale-description.entity';

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
    description: 'Maximum score for the sub-component',
    example: 100,
    type: Number,
  })
  @Column({ nullable: true })
  maxScore?: number;

  @ApiProperty({
    description: 'Associated component',
    type: () => Component,
  })
  @ManyToOne(() => Component, (component) => component.subComponents)
  @Index()
  component: Component;

  @ApiProperty({
    description: 'Assessments linked to this sub-component',
    type: () => [AssessmentSubComponent],
  })
  @OneToMany(
    () => AssessmentSubComponent,
    (assessmentSubComponent) => assessmentSubComponent.subComponent,
  )
  assessments: AssessmentSubComponent[];

  @ApiPropertyOptional({
    description: 'Answer object',
    type: () => Answer,
  })
  @OneToOne(() => Answer, (answers) => answers.subComponent)
  answers: Answer | null;

  @ApiProperty({
    description: 'Roadmaps linked to this Roadmap',
    type: () => [Roadmap],
  })
  @OneToMany(() => Roadmap, (roadmap) => roadmap.subComponent)
  roadmaps: Roadmap[];

  @ApiProperty({
    description: 'MeasurementScaleDescription linked to this SubComponent',
    type: () => [MeasurementScaleDescription],
  })
  @OneToMany(
    () => MeasurementScaleDescription,
    (measurementScaleDescription) => measurementScaleDescription.subComponent,
  )
  measurementScaleDescription: MeasurementScaleDescription[];
}
