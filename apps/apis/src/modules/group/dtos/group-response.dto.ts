import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AssessmentMember } from '../../../database/entities';

export class GroupResponseDto {
  @ApiProperty({
    description: 'ID of the assessment group',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Name of the assessment group',
    example: 'Ethiopia Group 1',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'ID of the associated assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  assessmentId: string;

  @ApiPropertyOptional({
    description: 'Members of the group',
    type: () => [AssessmentMember],
  })
  members: AssessmentMember[] | null;
}
