import { ApiProperty } from '@nestjs/swagger';
import { InvitationStatus, MemberRole } from '../../../shared';

export class InvitationResponseDto {
  @ApiProperty({
    description: 'ID of the invitation',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Name of the invitee',
    example: 'Jane Doe',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Email of the invitee',
    example: 'jane.doe@hiemat.org',
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'ID of the associated assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  assessmentId: string;

  @ApiProperty({
    description: 'ID of the associated group',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  groupId: string;

  @ApiProperty({
    description: 'Role assigned to the invitee',
    enum: MemberRole,
    example: MemberRole.PRIMARY,
    type: String,
  })
  role: MemberRole;

  @ApiProperty({
    description: 'Unique token for the invitation',
    example: 'abc123...',
    type: String,
  })
  token: string;

  @ApiProperty({
    description: 'Status of the invitation',
    enum: InvitationStatus,
    example: InvitationStatus.PENDING,
    type: String,
  })
  status: InvitationStatus;

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
