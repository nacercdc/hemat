import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { MemberRole } from '../../../shared';

export class MemberCreateRequestDto {
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
    description: 'ID of the associated assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.assessmentId.isNotEmpty' })
  @IsUUID('4', { message: 'validation.assessmentId.isUUID' })
  @Type(() => String)
  assessmentId: string;

  @ApiProperty({
    description: 'ID of the associated group',
    example: '123e4567-e89b-12d3-a456-426614174001',
    type: String,
  })
  @IsNotEmpty({ message: 'validation.groupId.isNotEmpty' })
  @IsUUID('4', { message: 'validation.groupId.isUUID' })
  @Type(() => String)
  groupId: string;

  @ApiProperty({
    description: 'Role of the member',
    enum: MemberRole,
    example: MemberRole.PRIMARY,
    type: String,
  })
  @IsNotEmpty({ message: 'validation.role.isNotEmpty' })
  @IsEnum(MemberRole, { message: 'validation.role.isEnum' })
  @Type(() => String)
  role: MemberRole;
}
