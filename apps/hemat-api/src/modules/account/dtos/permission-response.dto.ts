import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../../../database/entities';

export class PermissionResponseDto {
  @ApiProperty({
    description: 'Action',
    example: 'read',
    type: String,
  })
  action: string;

  @ApiProperty({
    description: 'Subject',
    example: 'assessment',
    type: String,
  })
  subject: string;

  constructor(entity: Permission) {
    this.action = entity.action;
    this.subject = entity.subject;
  }
}
