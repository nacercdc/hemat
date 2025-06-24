import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GenderEnum } from '@shared/enums';
import { BaseEntityWithSoftDelete } from './entity';
import { User } from './user.entity';

@Entity('profiles')
export class Profile extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column({ type: 'uuid' })
  userId: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @ApiProperty({
    description: 'Title of the user',
    type: String,
    example: 'Manager',
  })
  @Column({ type: 'varchar', nullable: true, length: 150 })
  title: string | null;

  @ApiProperty({
    description: 'First name',
    type: String,
    example: 'John',
  })
  @Column({ type: 'varchar', length: 50 })
  firstName: string;

  @ApiProperty({
    description: 'Middle name',
    type: String,
    example: 'John',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  middleName: string | null;

  @ApiProperty({
    description: 'Last name',
    type: String,
    example: 'Doe',
  })
  @Column({ type: 'varchar', length: 50 })
  lastName: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+251900000000',
    type: String,
  })
  @Column({ type: String, length: 15, unique: true, nullable: true })
  phoneNumber: string | null;

  @ApiPropertyOptional({
    description: 'Gender',
    enum: GenderEnum,
    example: GenderEnum.MALE,
    type: String,
  })
  @Column({ type: 'enum', enum: GenderEnum, nullable: true })
  gender: GenderEnum | null;

  @ApiPropertyOptional({
    description: 'Birth date',
    type: Date,
    example: '2000-10-25',
  })
  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date | null;

  @ApiPropertyOptional({
    description: 'Country',
    example: 'Ethiopia',
    type: String,
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string | null;

  @ApiPropertyOptional({
    description: 'Job title of the user',
    example: 'Team Lead',
  })
  @Column({ type: 'varchar', nullable: true })
  jobTitle: string;
}