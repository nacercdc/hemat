import { Entity, Column, OneToOne } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Assessment } from './assessment.entity';

@Entity('responses')
export class Response extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'ID of the associated assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column()
  assessmentId: string;

  @ApiPropertyOptional({
    description: 'Assessment object',
    type: () => Assessment,
  })
  @OneToOne(() => Assessment, (assessment) => assessment.response)
  assessment: Assessment | null;

  @ApiProperty({
    description: 'Compiled response content',
    example: 'Response from Africa CDC',
    type: String,
  })
  @Column()
  content: string;

  @ApiPropertyOptional({
    description: 'Comments on the response',
    example: [
      { userId: '123e4567-e89b-12d3-a456-426614174000', comment: 'Great work' },
    ],
    type: Array,
  })
  @Column({ type: 'jsonb', nullable: true })
  comments: { userId: string; comment: string }[];

  @ApiProperty({
    description: 'Whether the response is published',
    example: false,
    type: Boolean,
  })
  @Column({ default: false })
  isPublished: boolean;
}
