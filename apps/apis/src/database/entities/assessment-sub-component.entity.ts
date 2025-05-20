import {
  Entity,
  ManyToOne,
  Index,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Assessment } from './assessment.entity';
import { AssessmentComponent } from './assessment-component.entity';
import { AssessmentTranslationDto } from '../../shared/dtos';
import { AssessmentAnswer } from './assessment-answer.entity';
import { Roadmap } from './roadmap.entity';
import { AssessmentMeasurementScaleSubComponent } from './assessment-measurement-scale-sub-component.entity';

@Entity('assessment_sub_components')
export class AssessmentSubComponent extends BaseEntityWithSoftDelete {
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

  @ApiProperty({
    description: 'Associated assessment',
    type: () => Assessment,
  })
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

  @ApiProperty({
    description: 'Associated component',
    type: () => AssessmentComponent,
  })
  @ManyToOne(() => AssessmentComponent, (component) => component.subComponents)
  @JoinColumn({ name: 'componentId' })
  component: AssessmentComponent;

  @ApiPropertyOptional({
    description: 'Assessment answer object',
    type: () => AssessmentAnswer,
  })
  @OneToOne(() => AssessmentAnswer, (answer) => answer.subComponent, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  answer: AssessmentAnswer | null;

  @ApiPropertyOptional({
    description: 'Assessment roadmap object',
    type: () => Roadmap,
  })
  @OneToMany(() => Roadmap, (roadmap) => roadmap.subComponents, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  roadmap: Roadmap | null;

  @ApiPropertyOptional({
    description: 'Assessments related to this domain',
    type: () => AssessmentTranslationDto,
  })
  @Column('jsonb')
  translations: AssessmentTranslationDto;

  @ApiProperty({
    description: 'Associated sub-component',
    type: () => AssessmentMeasurementScaleSubComponent,
  })
  @ManyToOne(() => AssessmentMeasurementScaleSubComponent)
  messurmentScales: AssessmentMeasurementScaleSubComponent[];
}
