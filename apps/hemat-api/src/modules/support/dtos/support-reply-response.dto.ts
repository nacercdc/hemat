import { ApiProperty } from '@nestjs/swagger';
import { SupportVisibilityEnum, SupportPriorityEnum, SupportStatusEnum } from '@shared/enums';
import { User } from '@database/entities';

export class SupportReplyResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  supportId: string;

  @ApiProperty({ type: () => User })
  repliedBy: User;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ enum: SupportVisibilityEnum })
  visibility: SupportVisibilityEnum;

  @ApiProperty({ enum: SupportPriorityEnum })
  priority: SupportPriorityEnum;

  @ApiProperty({ enum: SupportStatusEnum })
  status: SupportStatusEnum;
} 