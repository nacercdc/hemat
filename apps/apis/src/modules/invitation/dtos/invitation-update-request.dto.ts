import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { InvitationStatus } from '../../../shared';

export class InvitationUpdateRequestDto {
  @ApiPropertyOptional({
    description: 'Status of the invitation',
    enum: InvitationStatus,
    example: InvitationStatus.ACCEPTED,
    type: String,
  })
  @IsOptional()
  @IsEnum(InvitationStatus, { message: 'validation.status.isEnum' })
  @Type(() => String)
  status?: InvitationStatus;
}
