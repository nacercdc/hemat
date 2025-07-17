import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { User } from './user.entity';
import { SupportStatusEnum } from '@shared/enums';
import { SupportReply } from './support-reply.entity';

@Entity('supports')
export class Support extends BaseEntityWithSoftDelete {
  @ApiProperty({ description: 'Support ticket title', example: 'Cannot login' })
  @Column({ type: String, length: 255 })
  title: string;

  @ApiProperty({ description: 'Support ticket description', example: 'I am unable to login with my credentials.' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ description: 'ID of the user who issued the support ticket', example: '123e4567-e89b-12d3-a456-426614174000' })
  @Column()
  issuedById: string;

  @ApiProperty({ description: 'User who issued the support ticket', type: () => User })
  @ManyToOne(() => User, { nullable: false })
  issuedBy: User;

  @ApiProperty({ description: 'Status of the support ticket', enum: SupportStatusEnum, default: SupportStatusEnum.OPEN })
  @Column({ type: 'enum', enum: SupportStatusEnum, default: SupportStatusEnum.OPEN })
  status: SupportStatusEnum;

  @OneToMany(() => SupportReply, (reply) => reply.support)
  replies: SupportReply[];
} 