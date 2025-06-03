import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../database/entities';
import { PermissionResponseDto } from './permission-response.dto';

export class RoleResponseDto {
  @ApiProperty({
    description: 'Role ID',
    example: '2ea5a011-065b-42a3-a5f1-9905e690cc28',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Name',
    example: 'admin',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Description',
    example: 'Admin role',
    type: String,
  })
  description: string;

  @ApiProperty({
    description: 'Permissions',
    type: [PermissionResponseDto],
  })
  permissions: PermissionResponseDto[];

  constructor(entity: Role) {
    this.id = entity.id;
    this.name = entity.name;
    this.description = entity.description;
    this.permissions = (entity.permissions || []).map(
      (permission) => new PermissionResponseDto(permission),
    );
  }
}
