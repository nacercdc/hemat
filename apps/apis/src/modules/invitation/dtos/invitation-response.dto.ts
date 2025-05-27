import { ApiProperty } from '@nestjs/swagger';
import { InvitationStatus, MemberRole } from '../../../shared';

export class InvitationResponseDto {
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
}
