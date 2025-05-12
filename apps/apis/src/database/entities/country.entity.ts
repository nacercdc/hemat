import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Assessment } from './assessment.entity';

@Entity('countries')
export class Country {
  @ApiProperty({
    description: 'Code',
    example: 'en',
    type: String,
  })
  @PrimaryColumn({ type: String })
  code: string;

  @ApiProperty({
    description: 'Name',
    example: 'Ethiopia',
    type: String,
  })
  @Column({ type: String })
  name: string;

  @ApiProperty({
    description: 'Phone code',
    example: '+251',
    type: String,
  })
  @Column({ type: String })
  phoneCode: string;

  @ApiPropertyOptional({
    description: 'Phone code',
    type: String,
  })
  @Column({ type: 'text' })
  description: string | null;

  @ApiProperty({
    description: 'Created at',
    example: '2024-01-10T07:56:08.000000Z',
    type: Date,
  })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @ApiProperty({
    description: 'Updated at',
    example: '2024-01-10T07:56:08.000000Z',
    type: Date,
  })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @ApiPropertyOptional({
    description: 'Assessments related to this domain',
    type: () => Assessment,
  })
  @OneToMany(() => Assessment, (assessment) => assessment.country)
  assessments: Assessment[];
}
