import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AuthDto } from '@shared/modules/auth/dtos';
import { MemberRole } from '@shared/enums/member.enum';

export class AssessmentAbilityDto extends AuthDto {
  @ApiProperty({
    description: 'Role of the user in the assessment',
    enum: MemberRole,
    example: MemberRole.PRIMARY,
    nullable: true,
  })
  @IsEnum(MemberRole)
  @IsOptional()
  assessmentRole?: MemberRole;

  @ApiProperty({
    description: 'Group ID the user belongs to in the assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  assessmentGroupId?: string;
}
