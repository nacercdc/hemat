import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsUUID } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { FindAllDto } from '@shared/dtos';
import { IsArrayContains } from '@shared/validators';

export class FindAllAssessmentGroupDto extends FindAllDto {
  @ApiPropertyOptional({
    description:
      'Comma separated relations example: members,members.user,invitations,assessment,domains',
    type: String,
  })
  @IsArrayContains(['members', 'members.user', 'invitations', 'assessment', 'domains'])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  include: string[] = [];

  @ApiPropertyOptional({
    description: 'Comma separated ascending sort fields',
    type: String,
  })
  @IsArrayContains(['name', 'updatedAt', 'createdAt'])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  ascending: string[] = [];

  @ApiPropertyOptional({
    description: 'Comma separated descending sort fields',
    type: String,
  })
  @IsArrayContains(['name', 'updatedAt', 'createdAt'])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  descending: string[] = [];

  @ApiPropertyOptional({
    description: 'Filter by specific group IDs (comma separated)',
    type: String,
    example: 'group1,group2,group3',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  @Transform(({ value }) => (value ? value.trim().split(',') : undefined))
  filterByGroupIds?: string[];
}

export class FindOneAssessmentGroupDto {
  @ApiPropertyOptional({
    description:
      'Comma separated relations example: members,members.user,invitations,assessment,domains',
    type: String,
  })
  @IsArrayContains(['members', 'invitations', 'assessment', 'members.user', 'domains'])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  include: string[] = [];
}
