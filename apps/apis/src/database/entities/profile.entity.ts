import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { User } from './user.entity';
import { GenderEnum } from '../../shared';

@Entity('profiles')
export class Profile extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column({ type: 'uuid' })
  userId: string;

  @ApiPropertyOptional({
    description: 'User object',
    type: () => User,
  })
  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @ApiProperty({
    description: 'Title of the user',
    type: String,
    example: 'Manager',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'First name',
    type: String,
    example: 'John',
  })
  @Column({ type: String, length: 64 })
  firstName: string;

  @ApiProperty({
    description: 'Last name',
    type: String,
    example: 'Doe',
  })
  @Column({ type: String, length: 64 })
  lastName: string;

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
  @Column({ type: String, length: 100, nullable: true })
  country: string | null;

  @ApiPropertyOptional({
    description: 'Job title of the user',
    example: 'Team Lead',
  })
  @Column({ nullable: true })
  jobTitle: string;

  @ApiPropertyOptional({ description: 'Profile status', example: 'active' })
  @Column({ nullable: true })
  status: string;
}
