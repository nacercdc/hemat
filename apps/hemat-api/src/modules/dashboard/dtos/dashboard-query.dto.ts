import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class DashboardQueryDto {
  @ApiPropertyOptional({ type: [Number], description: 'Filter by year(s)' })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  years?: number[];

  @ApiPropertyOptional({ type: Number, description: 'Filter by single year' })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    if (value) {
      const num = parseInt(value, 10);
      return isNaN(num) ? undefined : num;
    }
    return undefined;
  })
  year?: number;

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