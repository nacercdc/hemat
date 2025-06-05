import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Permission } from './permission.entity';
import { User } from './user.entity';

@Entity('roles')
export class Role extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'Name',
    example: 'admin',
    type: String,
  })
  @Column({ type: String, unique: true, length: 64 })
  name: string;

  @ApiProperty({
    description: 'Description',
    example: 'Some description',
    type: String,
  })
  @Column({ type: 'text' })
  description: string;

  @ApiPropertyOptional({
    description: 'User objects',
    type: () => User,
    isArray: true,
  })
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @ApiPropertyOptional({
    description: 'Permission objects',
    type: () => Permission,
    isArray: true,
  })
  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({ name: 'roles_permissions' })
  permissions: Permission[];
}
