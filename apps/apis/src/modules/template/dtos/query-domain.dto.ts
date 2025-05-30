import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { FindAllDto } from '@shared/dtos';
import { IsArrayContains } from '@shared/validators';

export class FindAllDomainDto extends FindAllDto {
  @ApiPropertyOptional({
    description:
      'Comma-separated ascending sort fields (e.g., code,name,description)',
    type: String,
  })
  @IsArrayContains(['code', 'name', 'description', 'createdAt'])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  ascending?: string[];

  @ApiPropertyOptional({
    description:
      'Comma-separated descending sort fields (e.g., code,name,description)',
    type: String,
  })
  @IsArrayContains(['code', 'name', 'description', 'createdAt'])
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value ? value.trim().split(',') : []))
  descending?: string[];
}
