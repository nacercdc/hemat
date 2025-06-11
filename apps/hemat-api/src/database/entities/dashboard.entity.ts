import { Entity, Column } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AssessmentStatus } from '@shared/enums';
import { BaseEntityWithSoftDelete } from './entity';

@Entity('dashboard')
export class Dashboard extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'Country of the dashboard',
    example: 'Ethiopia',
    type: String
  })
  @Column()
  country: string;

  @ApiProperty({
    description: 'Status of the assessment',
    enum: AssessmentStatus,
    example: AssessmentStatus.IN_PROGRESS,
    type: String
  })
  @Column({ type: 'enum', enum: AssessmentStatus })
  assessmentStatus: AssessmentStatus;

  @ApiPropertyOptional({
    description: 'External report content',
    example: 'External report details',
    type: String
  })
  @Column({ type: 'text', nullable: true })
  externalReport: string;
}