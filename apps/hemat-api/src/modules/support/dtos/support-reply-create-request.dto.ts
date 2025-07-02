import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SupportVisibilityEnum, SupportPriorityEnum, SupportStatusEnum } from '@shared/enums';

export class SupportReplyCreateRequestDto {
  @ApiProperty({ description: 'Reply description', example: 'We are looking into your issue.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Visibility of the reply', enum: SupportVisibilityEnum, default: SupportVisibilityEnum.PUBLIC })
  @IsEnum(SupportVisibilityEnum)
  visibility: SupportVisibilityEnum;

  @ApiProperty({ description: 'Priority of the reply', enum: SupportPriorityEnum, default: SupportPriorityEnum.NORMAL })
  @IsEnum(SupportPriorityEnum)
  priority: SupportPriorityEnum;

  @ApiProperty({ description: 'Status of the reply', enum: SupportStatusEnum, default: SupportStatusEnum.OPEN })
  @IsEnum(SupportStatusEnum)
  status: SupportStatusEnum;
} 