import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export class BaseEntity {
  @ApiProperty({
    description: 'ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;
}

export class BaseEntityWithTimestamp extends BaseEntity {
  @ApiProperty({
    description: 'Created at',
    example: '2024-01-10T07:56:08.000000Z',
    type: Date,
  })
  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Updated at',
    example: '2024-01-10T07:56:08.000000Z',
    type: Date,
  })
  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt!: Date;
}

export class BaseEntityWithSoftDelete extends BaseEntityWithTimestamp {
  @ApiPropertyOptional({
    description: 'Deleted at',
    example: null,
    type: Date,
  })
  @DeleteDateColumn({
    type: 'timestamptz',
  })
  deletedAt?: Date | null;
}
