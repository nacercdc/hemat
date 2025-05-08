import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Answer } from './answer.entity';
import { SubComponent } from './sub-component.entity';
import { Measurement } from './measurement.entity';

@Entity('roadmaps')
export class Roadmap extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'ID of the associated answer',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column()
  answerId: string;

  @ApiProperty({
    description: 'Associated answer',
    type: () => Answer,
  })
  @ManyToOne(() => Answer, (answer) => answer.roadmaps)
  @Index()
  answer: Answer;

  @ApiProperty({
    description: 'ID of the associated sub-component',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column()
  subComponentId: string;

  @ApiProperty({
    description: 'Associated sub-component',
    type: () => SubComponent,
  })
  @ManyToOne(() => SubComponent, (subComponent) => subComponent.roadmaps)
  subComponent: SubComponent;

  @ApiProperty({
    description: 'ID of the associated measurement',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column()
  measurementId: string;

  @ApiProperty({
    description: 'Associated measurement',
    type: () => Measurement,
  })
  @ManyToOne(() => Measurement, (measurement) => measurement.roadmaps)
  measurement: Measurement;

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
