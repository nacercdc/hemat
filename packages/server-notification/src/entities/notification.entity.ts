import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  Channel,
  NotificationStatus,
} from '../interface/notification.interface';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() userId: string;

  @Column({ type: 'enum', enum: Channel })
  channel: Channel;

  @Column({ nullable: true })
  vendorUsed?: string; // e.g. 'sendgrid' or 'twilio'

  @Column({ type: 'json', nullable: true })
  payloadSnapshot?: Record<string, any>; // redacted copy for audit

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  @Column({ type: 'int', default: 0 })
  attempts: number;

  @Column({ type: 'text', nullable: true })
  lastError?: string;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
