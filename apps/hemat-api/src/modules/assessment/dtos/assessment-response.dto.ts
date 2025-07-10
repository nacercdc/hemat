import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccessDto } from './access.dto';
import { Country } from '../../../database/entities/country.entity';

export class AssessmentResponseDto {
  @ApiProperty({
    description: 'Assessment ID',
    type: String,
    example: 'e50c093e-aed8-47e4-b031-ced87a2f8746',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the assessment',
    type: String,
    example: 'HIE High Assessment 2026',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the assessment',
    type: String,
    example: 'Assess HIE governance in Ethiopia',
  })
  description: string;

  @ApiProperty({
    description: 'Country code for the assessment',
    type: String,
    example: 'ET',
  })
  countryCode: string;

  @ApiPropertyOptional({
    description: 'Organization conducting the assessment',
    type: String,
    example: 'Ethiopia Health Ministry',
  })
  organization?: string;

  @ApiProperty({
    description: 'Start date of the assessment',
    type: String,
    example: '2025-04-30',
  })
  startDate: string;

  @ApiProperty({
    description: 'End date of the assessment',
    type: String,
    example: '2025-12-30',
  })
  endDate: string;

  @ApiProperty({
    description: 'Country object for the assessment',
    type: () => Country,
    example: {
      code: 'ET',
      name: 'Ethiopia',
      numericCode: '231',
      phoneCode: '251',
      native: 'ኢትዮጵያ',
      translations: { fr: 'Éthiopie' },
      latitude: '8.00000000',
      longitude: '38.00000000',
      emoji: '🇪🇹',
      emojiU: 'U+1F1EA U+1F1F9',
      description: null,
      createdAt: '2025-07-07T06:10:57.405Z',
      updatedAt: '2025-07-07T06:10:57.405Z',
    },
  })
  country: Country;

  @ApiProperty({
    description: 'Languages for the assessment',
    type: [Object],
    example: [
      {
        code: 'am',
        name: 'Amharic',
        native: 'አማርኛ',
        createdAt: '2025-07-07T06:10:57.414Z',
        updatedAt: '2025-07-07T06:10:57.414Z',
        deletedAt: null,
      },
    ],
  })
  languages: any[];

  @ApiProperty({
    description: 'Status of the assessment',
    type: String,
    example: 'in_progress',
  })
  status: string;

  @ApiProperty({
    description: 'Access information for the current user',
    type: AccessDto,
    required: false,
    nullable: true,
    example: {
      role: 'team-leader',
      groupId: '0921fbc0-2301-422b-aad0-dfa13af5aa9c',
      groupName: 'HIE High Assessment 2026 Group 1',
      domains: [
        {
          id: 'aff56f94-a457-4043-8607-412ddc54d4f2',
          name: 'Disease Prevention and Control',
        },
      ],
    },
  })
  access?: AccessDto | null;
}
