import {
  Entity,
  Column,
  OneToMany,
  Index,
  JoinColumn,
  ManyToOne,
  Unique,
  ManyToMany,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Assessment } from './assessment.entity';
import { AssessmentComponent } from './assessment-component.entity';
import { DomainTranslationDto } from '../../shared/dtos';
import { AssessmentGroup } from './assessment-group.entity';

@Entity('assessment-domains')
@Unique(['code', 'assessmentId'])
export class AssessmentDomain extends BaseEntityWithSoftDelete {
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
  @Column({ type: 'uuid' })
  @Index()
  assessmentId: string;

  @ManyToOne(() => Assessment, (assessment) => assessment.domains)
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment;

  @OneToMany(() => AssessmentComponent, (component) => component.domain)
  components: AssessmentComponent[];

  @ApiPropertyOptional({
    description: 'Assessments related to this domain',
    type: () => DomainTranslationDto,
  })
  @Column('jsonb')
  translations: Record<string, DomainTranslationDto> = {};

  @ManyToMany(() => AssessmentGroup, (group) => group.domains)
  groups: AssessmentGroup[];
}
