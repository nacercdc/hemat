import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Domain } from './domain.entity';
import { Response } from './response.entity';
import { AssessmentSubComponent } from './assessment-sub-component.entity';
import { AssessmentMember } from './assessment-member.entity';
import { LanguageEnum } from '../../shared';
import { Answer } from './answer.entity';
import { User } from './user.entity';
import { Report } from './report.entity';
import { Invitation } from './invitation.entity';

@Entity('assessments')
export class Assessment extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'ID of the associated user',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column()
  @Index()
  userId: string;

  @ApiPropertyOptional({
    description: 'User object',
    type: () => User,
  })
  @OneToOne(() => User, (user) => user.assessment)
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @ApiProperty({
    description: 'Name of the assessment',
    example: 'Health Assessment 2025',
    type: String,
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Description of the assessment',
    example: 'Annual public health assessment',
    type: String,
  })
  @Column()
  description: string;

  @ApiProperty({
    description: 'Country of the assessment',
    example: 'Ethiopia',
    type: String,
  })
  @Column()
  country: string;

  @ApiProperty({
    description: 'Date of the assessment',
    example: '2025-05-02',
    type: Date,
  })
  @Column()
  date: Date;

  @ApiProperty({
    description: 'Language of the assessment',
    enum: LanguageEnum,
    example: LanguageEnum.EN,
    type: String,
  })
  @Column({ type: 'enum', enum: LanguageEnum, default: LanguageEnum.EN })
  language: LanguageEnum;

  @ApiProperty({
    description: 'Associated domain',
    type: () => Domain,
  })
  @ManyToOne(() => Domain, (domain) => domain.assessments)
  @Index()
  domain: Domain;

  @ApiProperty({
    description: 'Sub-components linked to this assessment',
    type: () => [AssessmentSubComponent],
  })
  @OneToMany(
    () => AssessmentSubComponent,
    (assessmentSubComponent) => assessmentSubComponent.assessment,
  )
  subComponents: AssessmentSubComponent[];

  @ApiPropertyOptional({
    description: 'Members of the assessment',
    type: () => [AssessmentMember],
  })
  @OneToMany(
    () => AssessmentMember,
    (assessmentMember) => assessmentMember.assessment,
  )
  members: AssessmentMember[] | null;

  @ApiPropertyOptional({
    description: 'Answers of the assessment',
    type: () => [Answer],
  })
  @OneToMany(() => Answer, (answers) => answers.assessment)
  answers: Answer[] | null;

  @ApiPropertyOptional({
    description: 'Invitation of the assessment',
    type: () => [Invitation],
  })
  @OneToMany(() => Invitation, (invitation) => invitation.assessment)
  invitation: Invitation[] | null;

  @ApiPropertyOptional({
    description: 'Response of the assessment',
    type: () => [Response],
  })
  @OneToMany(() => Response, (response) => response.assessment)
  response: Response[] | null;

  @ApiPropertyOptional({
    description: 'Report of the assessment',
    type: () => [Report],
  })
  @OneToMany(() => Report, (reports) => reports.assessment)
  reports: Report[] | null;
}
