import {
  Entity,
  Column,
  ManyToOne,
  Index,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Domain } from './domain.entity';
import { Assessment } from './assessment.entity';
import { User } from './user.entity';

@Entity('reports')
export class Report extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'ID of the associated assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column()
  assessmentId: string;

  @ApiProperty({
    description: 'Associated assessment',
    type: () => Assessment,
  })
  @ManyToOne(() => Assessment, (assessment) => assessment.reports)
  assessment: Assessment;

  @ApiPropertyOptional({
    description: 'Group name for the report',
    example: 'Ethiopia Group 1',
    type: String,
  })
  @Column({ nullable: true })
  groupName: string;

  @ApiPropertyOptional({
    description: 'ID of the team leader',
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
  @OneToOne(() => User, (user) => user.reports)
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @ApiProperty({
    description: 'Associated domain',
    type: () => Domain,
  })
  @ManyToOne(() => Domain)
  @Index()
  domain: Domain;

  @ApiProperty({
    description: 'Content of the report',
    example: 'Detailed report content',
    type: String,
  })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({
    description: 'Whether this is the final report',
    example: false,
    type: Boolean,
  })
  @Column({ default: false })
  isFinal: boolean;
}
