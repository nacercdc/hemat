import {
  Entity,
  Column,
  OneToMany,
  Index,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Roadmap } from './roadmap.entity';
import { EvidenceType } from '../../shared';
import { Assessment } from './assessment.entity';
import { User } from './user.entity';
import { SubComponent } from './sub-component.entity';
import { Measurement } from './measurement.entity';

@Entity('answers')
export class Answer extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'ID of the associated assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Index()
  @Column()
  assessmentId: string;

  @ApiProperty({
    description: 'Associated assessment',
    type: () => Assessment,
  })
  @ManyToOne(() => Assessment, (assessment) => assessment.answers)
  @Index()
  assessment: Assessment;

  @ApiProperty({
    description: 'ID of the user submitting the answer',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Index()
  @Column()
  userId: string;

  @ApiPropertyOptional({
    description: 'User object',
    type: () => User,
  })
  @OneToOne(() => User, (user) => user.answers)
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @ApiProperty({
    description: 'Group name submitting the answer',
    example: 'Ethiopia Group 1',
    type: String,
  })
  @Column()
  groupName: string;

  @ApiProperty({
    description: 'ID of the associated sub-component',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column()
  subComponentId: string;

  @ApiPropertyOptional({
    description: 'SubComponent object',
    type: () => SubComponent,
  })
  @OneToOne(() => SubComponent, (subComponent) => subComponent.answers)
  @JoinColumn({ name: 'subComponentId' })
  subComponent: SubComponent | null;

  @ApiProperty({
    description: 'ID of the associated measurement',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column()
  measurementId: string;

  @ApiPropertyOptional({
    description: 'Measurement object',
    type: () => Measurement,
  })
  @OneToOne(() => Measurement, (measurement) => measurement.answers)
  @JoinColumn({ name: 'measurementId' })
  measurement: Measurement | null;

  @ApiProperty({
    description: 'Rate assigned in the answer',
    example: 4,
    type: Number,
  })
  @Column()
  rate: number;

  @ApiPropertyOptional({
    description: 'Notes for the answer',
    example: 'Additional context for the rating',
    type: String,
  })
  @Column({ type: 'text', nullable: true })
  notes: string;

  @ApiProperty({
    description: 'Evidence supporting the answer',
    example: { type: EvidenceType.TEXT, value: 'Evidence description' },
    type: Object,
  })
  @Column({ type: 'jsonb' })
  evidence: { type: EvidenceType; value: string };

  @ApiProperty({
    description: 'Reference for the answer',
    example: { type: EvidenceType.LINK, value: 'https://example.com' },
    type: Object,
  })
  @Column({ type: 'jsonb' })
  reference: { type: EvidenceType; value: string };

  @ApiProperty({
    description: 'Roadmaps linked to this answer',
    type: () => [Roadmap],
  })
  @OneToMany(() => Roadmap, (roadmap) => roadmap.answer)
  roadmaps: Roadmap[];
}
