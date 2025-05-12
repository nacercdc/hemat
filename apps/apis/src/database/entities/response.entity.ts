import { Entity, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Assessment } from './assessment.entity';
import { Comment } from './comment.entity';

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
  @JoinColumn({ name: 'assessmentId' })
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
    type: () => [Comment],
  })
  @OneToMany(() => Comment, (comment) => comment.response)
  comments: Comment[];

  @ApiProperty({
    description: 'Whether the response is published',
    example: false,
    type: Boolean,
  })
  @Column({ default: false })
  isPublished: boolean;
}
