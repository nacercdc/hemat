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
    description: 'Country',
    example: 'Ethiopia',
    type: String,
  })
  country: string | null;

  @ApiPropertyOptional({
    description: 'Job title',
    example: 'Team Lead',
    type: String,
  })
  jobTitle: string | null;

  @ApiPropertyOptional({
    description: 'Profession',
    example: 'Medical Doctor',
    type: String,
  })
  profession: string | null;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+251900000000',
    type: String,
  })
  phoneNumber?: string | null;

  @ApiPropertyOptional({
    description: 'Picture URL',
    type: String,
  })
  url?: string | null;

  constructor(entity: Profile & { url?: string | null }) {
    this.id = entity.id;
    this.title = entity.title;
    this.firstName = entity.firstName;
    this.lastName = entity.lastName;
    this.gender = entity.gender;
    this.country = entity.country;
    this.jobTitle = entity.jobTitle;
    this.profession = entity.profession;
    this.phoneNumber = entity.phoneNumber;
    this.url = entity.url;
  }
}