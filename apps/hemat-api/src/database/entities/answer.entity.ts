import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Assessment } from './assessment.entity';
import { AssessmentGroup } from './assessment-group.entity';
import { User } from './user.entity';
import { AnswerStatus } from '@shared/enums';
import { BaseEntityWithSoftDelete } from './entity';
import { AssessmentSubComponentRoadmap } from './assessment-sub-component-roadmap.entity';
import { AssessmentSubComponentAnswer } from './assessment-sub-component-answer.entity';

@Entity('answers')
export class Answer extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'ID of the associated assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Index()
  @Column({ type: 'uuid' })
  assessmentId: string;

  @ManyToOne(() => Assessment, (assessment) => assessment.answers)
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment;

  @ApiProperty({
    description: 'Status of the answer',
    example: AnswerStatus.INPROGRESS,
    enum: AnswerStatus,
  })
  @Column({
    type: 'enum',
    enum: AnswerStatus,
    default: AnswerStatus.INPROGRESS,
  })
  status: AnswerStatus;

  @ApiProperty({
    description:
      'Indicates if the answer is submitted as PRIMARY for the assessment',
    example: false,
    type: Boolean,
  })
  @Column({ type: 'boolean', default: false })
  isPrimary: boolean;

  @ApiProperty({
    description: 'ID of the associated group (null if isPrimary is true)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    nullable: true,
  })
  @Column({ type: 'uuid', nullable: true })
  @Index()
  groupId: string | null;

  @ManyToOne(() => AssessmentGroup, (group) => group.members, {
    nullable: true,
  })
  @JoinColumn({ name: 'groupId' })
  group: AssessmentGroup | null;

  @ApiProperty({
    description: 'ID of the associated user',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column({ type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => User, (user) => user.answers)
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @ApiProperty({
    description: 'Percentage of sub-components filled for this answer',
    example: 75.0,
    type: Number,
  })
  @Column({ type: 'float', default: 0.0 })
  percentage: number;

  @OneToMany(
    () => AssessmentSubComponentAnswer,
    (subComponent) => subComponent.answer,
  )
  assessmentSubComponentAnswers: AssessmentSubComponentAnswer[];

  @OneToMany(() => AssessmentSubComponentRoadmap, (roadmap) => roadmap.answer)
  roadmaps: AssessmentSubComponentRoadmap[];
}
