import {
  Entity,
  Column,
  OneToMany,
  Index,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Assessment } from './assessment.entity';
import { AssessmentDomain } from './assessment-domain.entity';
import { AssessmentSubComponent } from './assessment-sub-component.entity';
import { ComponentTranslationDto } from '../../shared/dtos';

@Entity('assessment-components')
@Unique(['code', 'assessmentId'])
export class AssessmentComponent extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'Unique code of the domain',
    example: '1',
    type: String,
  })
  @Column()
  code: string;

  @ApiProperty({
    description: 'Name of the domain',
    example: 'Public Health',
    type: String,
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Description of the domain',
    example: 'Domain covering public health initiatives',
    type: String,
  })
  @Column()
  description: string;

  @ApiProperty({
    description: 'ID of the associated assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column()
  @Index()
  assessmentId: string;

  @ManyToOne(() => Assessment, (assessment) => assessment.components)
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment;

  @ApiPropertyOptional({
    description: 'Assessments related to this domain',
    type: () => ComponentTranslationDto,
  })
  @Column('jsonb')
  translations: Record<string, ComponentTranslationDto> = {};

  @ApiProperty({
    description: 'ID of the original template component',
    example: 'template-component-uuid',
    type: String,
    required: false,
  })
  @Column({ type: 'uuid', nullable: true })
  templateComponentId?: string;

  @ApiProperty({
    description: 'ID of the associated domain',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column({ type: 'uuid' })
  @Index()
  domainId: string;

  @ManyToOne(() => AssessmentDomain, (domain) => domain.components)
  @JoinColumn({ name: 'domainId' })
  domain: AssessmentDomain;

  @OneToMany(
    () => AssessmentSubComponent,
    (subComponent) => subComponent.component,
  )
  subComponents: AssessmentSubComponent;
}
