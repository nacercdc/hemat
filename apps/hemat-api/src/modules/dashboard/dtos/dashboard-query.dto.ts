import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class DashboardQueryDto {
  @ApiPropertyOptional({ type: [Number], description: 'Filter by year(s)' })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  years?: number[];

  @ApiPropertyOptional({ type: String, description: 'User ID for access filtering' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ type: String, description: 'Group ID for access filtering' })
  @IsOptional()
  @IsUUID()
  groupId?: string;

  @ApiPropertyOptional({ type: String, description: 'Role for access filtering' })
  @IsOptional()
  @IsString()
  role?: string;
} 