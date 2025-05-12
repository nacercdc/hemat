import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Assessment } from './assessment.entity';
import { Language } from './language.entity';
import { BaseEntityWithSoftDelete } from './entity';

@Entity('assessment-languages')
export class AssessmentLanguage extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'Code',
    example: 'en',
    type: String,
  })
  @Column({ type: String })
  @Index()
  languageCode: string;

  @ApiPropertyOptional({
    description: 'Assessments related to this domain',
    type: () => Language,
  })
  @ManyToOne(() => Language, (language) => language.assessments)
  @JoinColumn({ name: 'languageCode' })
  language: Language;

  @ApiProperty({
    description: 'ID of the associated assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column({ type: 'uuid' })
  @Index()
  assessmentId: string;

  @ApiPropertyOptional({
    description: 'Assessments related to this domain',
    type: () => Assessment,
  })
  @ManyToOne(() => Assessment, (assessment) => assessment.languages)
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment;
}
