import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Profile } from '../../../database/entities';
import { GenderEnum } from '../../../shared/enums';

export class ProfileResponseDto {
  @ApiProperty({
    description: 'Profile ID',
    example: '1fcdc123-6906-4789-b75a-983260bc135d',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Title',
    example: 'Manager',
    type: String,
    nullable: true,
  })
  title: string | null;

  @ApiProperty({
    description: 'First name',
    example: 'John',
    type: String,
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
    type: String,
  })
  lastName: string;

  @ApiPropertyOptional({
    description: 'Gender',
    enum: GenderEnum,
    example: GenderEnum.MALE,
    type: String,
  })
  gender: GenderEnum | null;

  @ApiPropertyOptional({
    description: 'Birth date',
    example: '2000-10-25',
    type: Date,
  })
  dateOfBirth: Date | null;

  @ApiPropertyOptional({
    description: 'Country',
    example: 'Ethiopia',
    type: String,
  })
  country: string | null;

  @ApiProperty({
    description: 'Job title',
    example: 'Team Lead',
    type: String,
  })
  jobTitle: string;

  constructor(entity: Profile) {
    this.id = entity.id;
    this.title = entity.title;
    this.firstName = entity.firstName;
    this.lastName = entity.lastName;
    this.gender = entity.gender;
    this.dateOfBirth = entity.dateOfBirth;
    this.country = entity.country;
    this.jobTitle = entity.jobTitle;
  }
}