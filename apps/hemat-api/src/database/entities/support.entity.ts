import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityWithTimestamp } from './entity';
import { User } from './user.entity';
import { SupportStatusEnum } from '@shared/enums';
import { SupportReply } from './support-reply.entity';

@Entity('supports')
export class Support extends BaseEntityWithTimestamp {
  @ApiProperty({ description: 'Support ticket title', example: 'Cannot login' })
  @Column({ type: String, length: 255 })
  title: string;

  @ApiProperty({ description: 'Support ticket description', example: 'I am unable to login with my credentials.' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ description: 'User who issued the support ticket', type: () => User })
  @ManyToOne(() => User, { nullable: false, eager: true })
  issuedBy: User;

  @ApiProperty({ description: 'Status of the support ticket', enum: SupportStatusEnum, default: SupportStatusEnum.OPEN })
  @Column({ type: 'enum', enum: SupportStatusEnum, default: SupportStatusEnum.OPEN })
  status: SupportStatusEnum;

  @OneToMany(() => SupportReply, (reply) => reply.support)
  replies: SupportReply[];
} 