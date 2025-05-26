import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MemberRole } from '../../../shared';
import { User, Assessment, AssessmentGroup } from '../../../database/entities';

export class MemberResponseDto {
  @ApiProperty({
    description: 'ID of the assessment member',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'ID of the associated user',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  userId: string;

  @ApiPropertyOptional({
    description: 'User object',
    type: () => User,
  })
  user: User | null;

  @ApiProperty({
    description: 'ID of the associated assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  assessmentId: string;

  @ApiProperty({
    description: 'ID of the associated group',
    example: '123e4567-e89b-12d3-a456-426614174001',
    type: String,
  })
  groupId: string;

  @ApiProperty({
    description: 'Role of the member',
    enum: MemberRole,
    example: MemberRole.PRIMARY,
    type: String,
  })
  role: MemberRole;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-05-26T15:42:00.000Z',
    type: String,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Update timestamp',
    example: '2025-05-26T15:42:00.000Z',
    type: String,
  })
  updatedAt: Date;
}
