import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { MemberRole } from '../../../shared';

export class MemberUpdateRequestDto {
  @ApiPropertyOptional({
    description: 'Role of the member',
    enum: MemberRole,
    example: MemberRole.MEMBER,
    type: String,
  })
  @IsOptional()
  @IsEnum(MemberRole, { message: 'validation.role.isEnum' })
  @Type(() => String)
  role?: MemberRole;
}
