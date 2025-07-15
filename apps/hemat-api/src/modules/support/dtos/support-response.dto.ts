import { ApiProperty } from '@nestjs/swagger';
import { SupportStatusEnum } from '@shared/enums';
import { User } from '@database/entities';
import { SupportReplyResponseDto } from './support-reply-response.dto';

export class SupportResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  issuedById: string;

  @ApiProperty({ type: () => User })
  issuedBy: User;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ enum: SupportStatusEnum })
  status: SupportStatusEnum;

  @ApiProperty({ type: () => [SupportReplyResponseDto] })
  replies: SupportReplyResponseDto[];
} 