import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsEnum } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { FindAllDto } from '@shared/dtos';
import { IsArrayContains } from '@shared/validators';
import { UserStatusEnum } from '@shared/enums';

export class FindAllUserDto extends FindAllDto {
  @ApiPropertyOptional({
    description: 'Comma-separated relations (e.g., roles,profile,permissions)',
    type: String,
  })
  @IsArrayContains(['roles', 'profile', 'permissions', 'assessments'])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  include: string[] = [];

  @ApiPropertyOptional({
    description:
      'Comma-separated ascending sort fields (e.g., name,email,createdAt)',
    type: String,
  })
  @IsArrayContains(['name', 'email', 'createdAt', 'updatedAt'])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  ascending: string[] = [];

  @ApiPropertyOptional({
    description:
      'Comma-separated descending sort fields (e.g., name,email,createdAt)',
    type: String,
  })
  @IsArrayContains(['name', 'email', 'createdAt', 'updatedAt'])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  descending: string[] = [];

  @ApiPropertyOptional({
    description: 'Filter records by user status',
    enum: UserStatusEnum,
    example: UserStatusEnum.ACTIVE,
  })
  @IsOptional()
  @IsEnum(UserStatusEnum, { message: 'validation.status.isEnum' })
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim() : undefined))
  status?: UserStatusEnum;
}

export class FindOneUserDto {
  @ApiPropertyOptional({
    description: 'Comma-separated relations (e.g., roles,profile,permissions)',
    type: String,
  })
  @IsArrayContains(['roles', 'profile', 'permissions', 'assessments'])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  include: string[] = [];
}
