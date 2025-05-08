import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Role } from './role.entity';
import { User } from './user.entity';
import { PermissionActionEnum, PermissionSubjectEnum } from '../../shared';

@Entity('permissions')
export class Permission extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'Unique name of the permission',
    example: 'read:assessment$',
  })
  @Column({ unique: true })
  name: string;

  @ApiProperty({
    description: 'Action',
    enum: PermissionActionEnum,
    example: PermissionActionEnum.READ,
    type: String,
  })
  @Column({ type: String, length: 64 })
  action: PermissionActionEnum;

  @ApiProperty({
    description: 'Subject',
    enum: PermissionSubjectEnum,
    example: PermissionSubjectEnum.USER,
    type: String,
  })
  @Column({ type: String, length: 64 })
  subject: PermissionSubjectEnum;

  @ApiProperty({
    description: 'Description',
    example: 'Some description',
    type: String,
  })
  @Column({ type: 'text' })
  description: string;

  @ApiPropertyOptional({
    description: 'Role objects',
    type: () => [Role],
    isArray: true,
  })
  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  @ApiProperty({
    description: 'Users Objects',
    type: () => [User],
  })
  @ManyToMany(() => User, (user) => user.permissions)
  @JoinTable()
  users: User[];
}
