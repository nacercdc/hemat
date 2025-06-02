import {
  Entity,
  Column,
  OneToMany,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Response } from './response.entity';
import { AssessmentSubComponent } from './assessment-sub-component.entity';
import { AssessmentMember } from './assessment-member.entity';
import { AssessmentAnswer } from './assessment-answer.entity';
import { User } from './user.entity';
import { Report } from './report.entity';
import { Invitation } from './invitation.entity';
import { AssessmentDomain } from './assessment-domain.entity';
import { AssessmentComponent } from './assessment-component.entity';
import { AssessmentMeasurementScale } from './assessment-measurement-scale.entity';
import { Country } from './country.entity';
import { AssessmentStatus } from '../../shared';
import { AssessmentGroup } from './assessment-group.entity';

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
  @ManyToOne(() => User, (user) => user.assessments)
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @ApiProperty({
    description: 'Name of the assessment (must be unique)',
    example: 'Health Assessment 2025',
    type: String,
  })
  @Column()
  @Index({ unique: true })
  name: string;

  @ApiProperty({
    description: 'Description of the assessment',
    example: 'Annual public health assessment',
    type: String,
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    description: 'ID of the associated user',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column({ type: String })
  @Index()
  countryCode: string;

  @ApiPropertyOptional({
    description: 'Country object',
    type: () => Country,
  })
  @ManyToOne(() => Country, (country) => country.assessments)
  @JoinColumn({ name: 'countryCode' })
  country: Country | null;

  @ApiPropertyOptional({
    description: 'Organization of the assessment',
    example: 'WHO',
    type: String,
  })
  @Column({ type: 'text', nullable: true })
  organization: string | null;

  @ApiProperty({
    description: 'Start date of the assessment',
    example: '2025-05-01',
    type: Date,
  })
  @Column()
  startDate: Date;

  @ApiProperty({
    description: 'End date of the assessment',
    example: '2025-05-30',
    type: Date,
  })
  @Column()
  endDate: Date;
  @ApiProperty({
    description: 'Language',
    example: ['en'],
    type: String,
    isArray: true,
  })
  @Column('text', { array: true, default: ['en'] })
  languages: string[];

  @ApiProperty({
    description: 'Status of the assessment',
    example: AssessmentStatus.DRAFT,
    enum: AssessmentStatus,
  })
  @Column({
    type: 'enum',
    enum: AssessmentStatus,
    default: AssessmentStatus.DRAFT,
  })
  status: AssessmentStatus;

  @ApiProperty({
    description: 'Associated domain',
    type: () => [AssessmentDomain],
  })
  @OneToMany(
    () => AssessmentDomain,
    (assessmentDomain) => assessmentDomain.assessment,
  )
  domains: AssessmentDomain[];

  @ApiPropertyOptional({
    description: 'Components under this domain',
    type: () => [AssessmentComponent],
  })
  @OneToMany(() => AssessmentComponent, (component) => component.assessment)
  components: AssessmentComponent[];

  @ApiProperty({
    description: 'Sub-components linked to this assessment',
    type: () => [AssessmentSubComponent],
  })
  @OneToMany(
    () => AssessmentSubComponent,
    (assessmentSubComponent) => assessmentSubComponent.assessment,
  )
  subComponents: AssessmentSubComponent[];

  @ApiProperty({
    description: 'Sub-components linked to this assessment',
    type: () => [AssessmentMeasurementScale],
  })
  @OneToMany(
    () => AssessmentMeasurementScale,
    (measurementScales) => measurementScales.assessment,
  )
  measurementScales: AssessmentMeasurementScale[];

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
    description: 'Assessment member group',
    type: () => [AssessmentGroup],
  })
  @OneToMany(
    () => AssessmentGroup,
    (assessmentGroup) => assessmentGroup.assessment,
  )
  groups: AssessmentGroup[] | null;

  @ApiPropertyOptional({
    description: 'Assessment answer of the assessment',
    type: () => [AssessmentAnswer],
  })
  @OneToMany(() => AssessmentAnswer, (answers) => answers.assessment)
  answers: AssessmentAnswer[] | null;

  @ApiPropertyOptional({
    description: 'Invitation of the assessment',
    type: () => [Invitation],
  })
  @OneToMany(() => Invitation, (invitation) => invitation.assessment)
  invitations: Invitation[] | null;

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