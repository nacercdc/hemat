import {
  Entity,
  Column,
  OneToMany,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Assessment } from './assessment.entity';
import { AssessmentDomain } from './assessment-domain.entity';
import { AssessmentSubComponent } from './assessment-sub-component.entity';
import { AssessmentTranslationDto } from '../../shared/dtos';

@Entity('assessment-components')
export class AssessmentComponent extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'Unique code of the domain',
    example: '1',
    type: String,
  })
  @Column({ unique: true })
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

  @ApiPropertyOptional({
    description: 'Assessments related to this domain',
    type: () => Assessment,
  })
  @OneToMany(() => Assessment, (assessment) => assessment.components)
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment;

  @ApiPropertyOptional({
    description: 'Assessments related to this domain',
    type: () => AssessmentTranslationDto,
  })
  @Column('jsonb')
  translations: AssessmentTranslationDto;

  @ApiPropertyOptional({
    description: 'Associated domain',
    type: () => AssessmentDomain,
  })
  @ManyToOne(() => AssessmentDomain, (domain) => domain.components)
  @Index()
  domain: AssessmentDomain;

  @ApiPropertyOptional({
    description: 'Sub-components under this component',
    type: () => [AssessmentSubComponent],
  })
  @OneToMany(
    () => AssessmentSubComponent,
    (subComponent) => subComponent.component,
  )
  subComponents: AssessmentSubComponent;
}
