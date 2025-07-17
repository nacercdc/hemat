import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { PermissionSubjectEnum, PermissionActionEnum } from '../../shared/enums/permission.enum';
import { BaseEntityWithSoftDelete } from './entity';

@Entity('activity_logs')
export class ActivityLog extends BaseEntityWithSoftDelete {
  @ApiProperty({ description: 'User ID', example: 'uuid' })
  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  @ApiProperty({ description: 'Entity type', enum: PermissionSubjectEnum })
  @Column({ type: 'enum', enum: PermissionSubjectEnum })
  entity: PermissionSubjectEnum;

  @ApiProperty({ description: 'Entity ID', example: 'uuid' })
  @Column({ type: 'uuid' })
  entityId: string;

  @ApiProperty({ description: 'Action', enum: PermissionActionEnum })
  @Column({ type: 'enum', enum: PermissionActionEnum })
  action: PermissionActionEnum;
} 