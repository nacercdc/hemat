import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AssessmentLanguage } from './assessment-language.entity';

@Entity('languages')
export class Language {
  @ApiProperty({
    description: 'Code',
    example: 'en',
    type: String,
  })
  @PrimaryColumn({ type: String })
  code: string;

  @ApiProperty({
    description: 'Name',
    example: 'English',
    type: String,
  })
  @Column({ type: String })
  name: string;

  @ApiProperty({
    description: 'Native',
    example: 'English',
    type: String,
  })
  @Column({ type: String })
  native: string;

  @ApiProperty({
    description: 'Created at',
    example: '2024-01-10T07:56:08.000000Z',
    type: Date,
  })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @ApiProperty({
    description: 'Updated at',
    example: '2024-01-10T07:56:08.000000Z',
    type: Date,
  })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @ApiPropertyOptional({
    description: 'Assessments related to this domain',
    type: () => AssessmentLanguage,
  })
  @OneToMany(() => AssessmentLanguage, (assessment) => assessment.language)
  assessments: AssessmentLanguage[];
}
