import { Entity, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { User } from './user.entity';
import { Support } from './support.entity';
import { SupportVisibilityEnum, SupportPriorityEnum, SupportStatusEnum } from '@shared/enums';

@Entity('support_replies')
export class SupportReply extends BaseEntityWithSoftDelete {
  @ApiProperty({ description: 'Support ticket', type: () => Support })
  @ManyToOne(() => Support, (support) => support.replies, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  support: Support;

  @ApiProperty({ description: 'User who replied', type: () => User })
  @ManyToOne(() => User, { nullable: false })
  repliedBy: User;

  @ApiProperty({ description: 'ID of the user who replied', example: '123e4567-e89b-12d3-a456-426614174000' })
  @Column()
  repliedById: string;

  @ApiProperty({
    description: 'Reply description',
    example: 'We are looking into your issue.',
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    description: 'Visibility of the reply',
    enum: SupportVisibilityEnum,
    default: SupportVisibilityEnum.PUBLIC,
  })
  @Column({
    type: 'enum',
    enum: SupportVisibilityEnum,
    default: SupportVisibilityEnum.PUBLIC,
  })
  visibility: SupportVisibilityEnum;

  @ApiProperty({
    description: 'Priority of the reply',
    enum: SupportPriorityEnum,
    default: SupportPriorityEnum.NORMAL,
  })
  @Column({
    type: 'enum',
    enum: SupportPriorityEnum,
    default: SupportPriorityEnum.NORMAL,
  })
  priority: SupportPriorityEnum;

  @ApiProperty({
    description: 'Status of the reply',
    enum: SupportStatusEnum,
    default: SupportStatusEnum.OPEN,
  })
  @Column({
    type: 'enum',
    enum: SupportStatusEnum,
    default: SupportStatusEnum.OPEN,
  })
  status: SupportStatusEnum;
} 