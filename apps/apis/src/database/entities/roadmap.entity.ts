import { Entity, Column, ManyToOne, Index, OneToMany } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { AssessmentAnswer } from './assessment-answer.entity';
import { SubComponent } from './sub-component.entity';
import { MeasurementScale } from './measurement-scale.entity';
import { AssessmentSubComponent } from '.';

@Entity('roadmaps')
export class Roadmap extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'ID of the associated Assessment answer',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column()
  assessmentAnswerId: string;

  @ApiPropertyOptional({
    description: 'Associated AssessmentAnswer',
    type: () => [AssessmentAnswer],
  })
  @OneToMany(() => AssessmentAnswer, (answers) => answers.roadmaps)
  answers: AssessmentAnswer[] | null;

  @ApiProperty({
    description: 'ID of the associated sub-component',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column()
  subComponentId: string;

  @ApiProperty({
    description: 'Associated sub-component',
    type: () => AssessmentSubComponent,
  })
  @ManyToOne(
    () => AssessmentSubComponent,
    (subComponent) => subComponent.roadmap,
  )
  subComponents: AssessmentSubComponent;

  @ApiProperty({
    description: 'ID of the associated measurement',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column()
  measurementId: string;

  @ApiProperty({
    description: 'Associated measurement',
    type: () => MeasurementScale,
  })
  @ManyToOne(
    () => MeasurementScale,
    (measurementScale) => measurementScale.roadmap,
  )
  measurementScales: MeasurementScale;

  @ApiProperty({
    description: 'Target of the roadmap',
    example: 'Increase vaccination coverage',
    type: String,
  })
  @Column()
  target: string;

  @ApiProperty({
    description: 'Activities planned in the roadmap',
    example: 'Conduct outreach programs',
    type: String,
  })
  @Column()
  activities: string;

  @ApiProperty({
    description: 'Responsible party for the roadmap',
    example: 'Health Ministry',
    type: String,
  })
  @Column()
  responsible: string;

  @ApiProperty({
    description: 'Resources required for the roadmap',
    example: 'Funding, staff',
    type: String,
  })
  @Column()
  resources: string;

  @ApiProperty({
    description: 'Documentation for the roadmap',
    example: 'Project plan',
    type: String,
  })
  @Column()
  documentation: string;

  @ApiProperty({
    description: 'Start time of the roadmap',
    example: '2025-06-01',
    type: Date,
  })
  @Column()
  startTime: Date;

  @ApiProperty({
    description: 'End time of the roadmap',
    example: '2025-12-31',
    type: Date,
  })
  @Column()
  endTime: Date;
}
