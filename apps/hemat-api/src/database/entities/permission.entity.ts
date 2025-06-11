import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { PermissionActionEnum, PermissionSubjectEnum } from '@shared/enums';
import { BaseEntityWithSoftDelete } from './entity';
import { Role } from './role.entity';
import { User } from './user.entity';

@Entity('permissions')
export class Permission extends BaseEntityWithSoftDelete {
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

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  @ManyToMany(() => User, (user) => user.permissions)
  @JoinTable()
  users: User[];
}
