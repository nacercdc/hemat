import {
  Entity,
  Column,
  OneToMany,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { AssessmentSubComponentRoadmap } from './assessment-sub-component-roadmap.entity';
import { AnswerStatus } from '@shared/enums';
import { Assessment } from './assessment.entity';
import { User } from './user.entity';

@Entity('roadmaps')
export class Roadmap extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'ID of the associated assessment',
    example: '62de3f94-7550-443f-972e-5553c0180cf2',
    type: String,
  })
  @Index()
  @Column({ type: 'uuid' })
  assessmentId: string;

  @ManyToOne(() => Assessment, (assessment) => assessment.roadmaps)
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment;

  @ApiProperty({
    description: 'ID of the user who created the roadmap',
    example: '07c59665-17d1-4d68-97e8-9b1e2eea1bd9',
    type: String,
  })
  @Index()
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.roadmaps)
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @ApiProperty({
    description: 'Whether the roadmap is primary',
    example: true,
    type: Boolean,
  })
  @Column({ type: 'boolean', default: true })
  isPrimary: boolean;

  @ApiProperty({
    description: 'Percentage completion of the roadmap',
    example: 33.33,
    type: Number,
  })
  @Column({ type: 'float', default: 0 })
  percentage: number;

  @ApiProperty({
    description: 'Status of the roadmap',
    example: AnswerStatus.INPROGRESS,
    enum: AnswerStatus,
  })
  @Column({
    type: 'enum',
    enum: AnswerStatus,
    default: AnswerStatus.INPROGRESS,
  })
  status: AnswerStatus;

  @OneToMany(
    () => AssessmentSubComponentRoadmap,
    (subComponentRoadmap) => subComponentRoadmap.roadmap,
  )
  subComponentRoadmaps: AssessmentSubComponentRoadmap[];
}
