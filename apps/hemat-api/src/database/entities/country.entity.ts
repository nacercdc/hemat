// src/entities/country.entity.ts
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
    description: 'ISO 3166-1 alpha-2 code',
    example: 'DZ',
    type: String,
  })
  @PrimaryColumn({ type: 'varchar', length: 2 })
  code: string;

  @ApiProperty({
    description: 'Name of the country',
    example: 'Algeria',
    type: String,
  })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({
    description: 'Numeric code (ISO 3166-1 numeric)',
    example: '012',
    type: String,
  })
  @Column({ type: 'varchar', length: 3 })
  numericCode: string;

  @ApiProperty({
    description: 'International phone code',
    example: '213',
    type: String,
  })
  @Column({ type: 'varchar', length: 10 })
  phoneCode: string;

  @ApiProperty({
    description: 'Native name of the country',
    example: 'الجزائر',
    type: String,
  })
  @Column({ type: 'varchar', length: 100 })
  native: string;

  @ApiProperty({
    description: 'Translations of the country name in multiple languages',
    example: { fr: 'Algérie', es: 'Argelia' },
    type: Object,
  })
  @Column({ type: 'jsonb', default: {} })
  translations: Record<string, string>;

  @ApiProperty({
    description: 'Latitude of the country',
    example: '28.00000000',
    type: String,
  })
  @Column({ type: 'varchar', length: 20 })
  latitude: string;

  @ApiProperty({
    description: 'Longitude of the country',
    example: '3.00000000',
    type: String,
  })
  @Column({ type: 'varchar', length: 20 })
  longitude: string;

  @ApiProperty({
    description: 'Country flag emoji',
    example: '🇩🇿',
    type: String,
  })
  @Column({ type: 'varchar', length: 10 })
  emoji: string;

  @ApiProperty({
    description: 'Unicode representation of the country flag emoji',
    example: 'U+1F1E9 U+1F1FF',
    type: String,
  })
  @Column({ type: 'varchar', length: 20 })
  emojiU: string;

  @ApiPropertyOptional({
    description: 'Description of the country',
    type: String,
  })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiProperty({
    description: 'Timestamp when the country was created',
    example: '2024-01-10T07:56:08.000Z',
    type: Date,
  })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @ApiProperty({
    description: 'Timestamp when the country was last updated',
    example: '2024-01-10T07:56:08.000Z',
    type: Date,
  })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @ApiPropertyOptional({
    description: 'Assessments related to this country',
    type: () => Assessment,
  })
  @OneToMany(() => Assessment, (assessment) => assessment.country)
  assessments: Assessment[];
}
