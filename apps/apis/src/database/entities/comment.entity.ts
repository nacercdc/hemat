import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Response } from './response.entity';

@Entity('comments')
export class Comment extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'ID of the user who made the comment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column()
  userId: string;

  @ApiProperty({
    description: 'Comment content',
    example: 'Great work',
    type: String,
  })
  @Column({ type: 'text' })
  comment: string;

  @ApiProperty({
    description: 'ID of the associated response',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column()
  responseId: string;

  @ApiProperty({
    description: 'Associated response',
    type: () => Response,
  })
  @ManyToOne(() => Response, (response) => response.comments)
  @JoinColumn({ name: 'responseId' })
  response: Response;
}
