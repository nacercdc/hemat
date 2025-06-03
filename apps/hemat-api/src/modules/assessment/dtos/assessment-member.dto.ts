import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { MemberRole } from '@shared/enums';

export class AssessmentMemberCreateRequestDto {
  @ApiProperty({
    description: 'ID of the user to be added as a member',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.userId.isNotEmpty' })
  @IsUUID('4', { message: 'validation.userId.isUUID' })
  @Type(() => String)
  userId: string;

  @ApiProperty({
    description: 'Role of the member in the assessment group',
    enum: MemberRole,
    example: MemberRole.PRIMARY,
    type: String,
  })
  @IsNotEmpty({ message: 'validation.role.isNotEmpty' })
  @IsEnum(MemberRole, { message: 'validation.role.isEnum' })
  @Type(() => String)
  role: MemberRole;
}

export class AssessmentMemberUpdateRequestDto {
  @ApiPropertyOptional({
    description: 'Role of the member in the assessment group',
    enum: MemberRole,
    example: MemberRole.MEMBER,
    type: String,
  })
  @IsOptional()
  @IsEnum(MemberRole, { message: 'validation.role.isEnum' })
  @Type(() => String)
  role?: MemberRole;
}
