import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AccessDomainDto {
  @ApiProperty({ description: 'Domain ID', type: String })
  id: string;

  @ApiProperty({ description: 'Domain name', type: String })
  name: string;
}

export class AccessDto {
  @ApiProperty({ description: 'Role of the user in the assessment', type: String })
  role: string;

  @ApiProperty({ description: 'Group ID', type: String })
  groupId: string;

  @ApiProperty({ description: 'Group name', type: String })
  groupName: string;

  @ApiPropertyOptional({
    description: 'Domains attached to the group',
    type: [AccessDomainDto],
    nullable: true,
  })
  domains: AccessDomainDto[] | null;
} 