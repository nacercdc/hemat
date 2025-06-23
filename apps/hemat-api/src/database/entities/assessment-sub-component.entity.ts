import {
  Entity,
  ManyToOne,
  Index,
  Column,
  JoinColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubComponentTranslationDto } from '@shared/dtos';
import { BaseEntityWithSoftDelete } from './entity';
import { Assessment } from './assessment.entity';
import { AssessmentComponent } from './assessment-component.entity';
import { Roadmap } from './roadmap.entity';
import { AssessmentMeasurementScaleSubComponent } from './assessment-measurement-scale-sub-component.entity';
import { AssessmentSubComponentAnswer } from './assessment-sub-component-answer.entity';
import { AssessmentSubComponentRoadmap } from './assessment-sub-component-roadmap.entity';

@Entity('assessment_sub_components')
@Unique(['code', 'assessmentId'])
export class AssessmentSubComponent extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'Unique code of the sub-component',
    example: '1.A.1',
    type: String,
  })
  @Column()
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
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    description: 'ID of the associated assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column({ type: 'uuid' })
  @Index()
  assessmentId: string;

  @ManyToOne(() => Assessment, (assessment) => assessment.subComponents)
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment;

  @ApiProperty({
    description: 'ID of the associated component',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column({ type: 'uuid' })
  @Index()
  componentId: string;

  @ManyToOne(() => AssessmentComponent, (component) => component.subComponents)
  @JoinColumn({ name: 'componentId' })
  component: AssessmentComponent;

  @OneToMany(
    () => AssessmentSubComponentAnswer,
    (answer) => answer.subComponent,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  answers: AssessmentSubComponentAnswer[];

  @OneToMany(() => AssessmentSubComponentRoadmap, (roadmap) => roadmap.subComponent, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  roadmaps: AssessmentSubComponentRoadmap | null;

  @ApiPropertyOptional({
    description: 'Assessments related to this domain',
    type: () => SubComponentTranslationDto,
  })
  @Column('jsonb')
  translations: Record<string, SubComponentTranslationDto> = {};

  @OneToMany(
    () => AssessmentMeasurementScaleSubComponent,
    (measurementScale) => measurementScale.subComponent,
  )
  measurementScales: AssessmentMeasurementScaleSubComponent[];
}
