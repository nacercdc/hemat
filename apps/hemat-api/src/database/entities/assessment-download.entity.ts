import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Assessment } from './assessment.entity';
import { User } from './user.entity';
import { AssessmentDomain } from './assessment-domain.entity';
import { DownloadStatus } from '@shared/enums';

@Entity('assessment_downloads')
export class AssessmentDownload extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'ID of the associated assessment',
    example: '52e26065-618b-4435-b19a-0bdc0099c000',
    type: String,
  })
  @Index()
  @Column({ type: 'uuid' })
  assessmentId: string;

  @ManyToOne(() => Assessment, (assessment) => assessment.downloads)
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment;

  @ApiProperty({
    description:
      'ID of the associated domain (optional, for domain-specific downloads)',
    example: '062989a6-5b83-4391-846f-2864bc525dc4',
    type: String,
    nullable: true,
  })
  @Index()
  @Column({ type: 'uuid', nullable: true })
  domainId: string | null;

  @ManyToOne(() => AssessmentDomain, { nullable: true })
  @JoinColumn({ name: 'domainId' })
  domain: AssessmentDomain | null;

  @ApiProperty({
    description: 'ID of the user requesting the download',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Index()
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({
    description: 'Status of the download request',
    example: DownloadStatus.PENDING,
    enum: DownloadStatus,
  })
  @Column({
    type: 'enum',
    enum: DownloadStatus,
    default: DownloadStatus.PENDING,
  })
  status: DownloadStatus;

  @ApiProperty({
    description: 'File path or identifier for the generated Excel file',
    example:
      'downloads/assessment_52e26065-618b-4435-b19a-0bdc0099c000_domain_062989a6-5b83-4391-846f-2864bc525dc4.xlsx',
    type: String,
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  filePath: string | null;

  @ApiProperty({
    description: 'Error message if download generation failed',
    example: 'Failed to generate Excel file',
    type: String,
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  errorMessage: string | null;

  @ApiProperty({
    description: 'Redis job ID for the download task',
    example: 'job_123456',
    type: String,
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  jobId: string | null;
}
