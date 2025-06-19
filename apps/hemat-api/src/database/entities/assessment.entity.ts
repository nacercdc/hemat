import {
  Entity,
  Column,
  OneToMany,
  Index,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Response } from './response.entity';
import { AssessmentSubComponent } from './assessment-sub-component.entity';
import { AssessmentMember } from './assessment-member.entity';
import { User } from './user.entity';
import { Report } from './report.entity';
import { Invitation } from './invitation.entity';
import { AssessmentDomain } from './assessment-domain.entity';
import { AssessmentComponent } from './assessment-component.entity';
import { AssessmentMeasurementScale } from './assessment-measurement-scale.entity';
import { Country } from './country.entity';
import { AssessmentStatus } from '@shared/enums';
import { AssessmentGroup } from './assessment-group.entity';
import { Language } from './language.entity';
import { Answer } from './answer.entity';

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
    example: 'HIEs Governance Assessment 2025',
    type: String,
  })
  @Column()
  @Index({ unique: true })
  name: string;

  @ApiProperty({
    description: 'Description of the assessment',
    example: 'Assess HIE governance in Ethiopia',
    type: String,
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    description: 'Country code for the assessment',
    example: 'ET',
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
    example: 'Ethiopia Health Ministry',
    type: String,
  })
  @Column({ type: 'text', nullable: true })
  organization: string | null;

  @ApiProperty({
    description: 'Start date of the assessment',
    example: '2025-04-30',
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
    description: 'Languages for the assessment',
    example: ['am', 'en'],
    type: [String],
  })
  @ManyToMany(() => Language)
  @JoinTable()
  languages: Language[];

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

  @OneToMany(
    () => AssessmentDomain,
    (assessmentDomain) => assessmentDomain.assessment,
  )
  domains: AssessmentDomain[];

  @OneToMany(() => AssessmentComponent, (component) => component.assessment)
  components: AssessmentComponent[];

  @OneToMany(
    () => AssessmentSubComponent,
    (assessmentSubComponent) => assessmentSubComponent.assessment,
  )
  subComponents: AssessmentSubComponent[];

  @OneToMany(
    () => AssessmentMeasurementScale,
    (measurementScales) => measurementScales.assessment,
  )
  measurementScales: AssessmentMeasurementScale[];

  @OneToMany(
    () => AssessmentMember,
    (assessmentMember) => assessmentMember.assessment,
  )
  members: AssessmentMember[] | null;

  @OneToMany(
    () => AssessmentGroup,
    (assessmentGroup) => assessmentGroup.assessment,
  )
  groups: AssessmentGroup[] | null;

  @OneToMany(() => Answer, (answers) => answers.assessment)
  answers: Answer[] | null;

  @OneToMany(() => Invitation, (invitation) => invitation.assessment)
  invitations: Invitation[] | null;

  @OneToMany(() => Response, (response) => response.assessment)
  response: Response[] | null;

  @OneToMany(() => Report, (reports) => reports.assessment)
  reports: Report[] | null;
}