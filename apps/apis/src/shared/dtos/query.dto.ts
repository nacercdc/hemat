import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  Filter,
  QueryManyRequest,
  QueryManyResponse,
  QueryOneRequest,
  Sort,
} from '../types';
import {
  FilterOperatorEnum,
  FilterTypeEnum,
  SortDirectionEnum,
} from '../enums';

export class FilterDto implements Filter {
  @ApiProperty({
    description: 'Filter field',
    example: 'name',
    type: String,
  })
  @IsString({ message: 'validation.field.isString' })
  @IsNotEmpty({ message: 'validation.field.isNotEmpty' })
  @Type(() => String)
  field: string;

  @ApiProperty({
    description: 'Filter operator',
    example: FilterOperatorEnum.EQ,
    type: String,
  })
  @IsEnum(FilterOperatorEnum, {
    message: `validation.operator.isEnum args: values:${Object.values(FilterOperatorEnum).join(', ')}`,
  })
  @IsNotEmpty({ message: 'validation.operator.isNotEmpty' })
  @Type(() => String)
  operator: FilterOperatorEnum;

  @ApiPropertyOptional({
    description: 'Filter type',
    example: FilterTypeEnum.AND,
    type: String,
  })
  @IsEnum(FilterTypeEnum, {
    message: `validation.type.isEnum args: values:${Object.values(FilterOperatorEnum).join(', ')}`,
  })
  @IsOptional()
  @Type(() => String)
  type: FilterTypeEnum = FilterTypeEnum.AND;

  @ApiProperty({
    description: 'Filter value',
    example: 'John Doe',
  })
  @IsNotEmpty({ message: 'validation.value.isNotEmpty' })
  value: any;
}

export class SortDto implements Sort {
  @ApiProperty({
    description: 'Sort field',
    example: 'name',
    type: String,
  })
  @IsString({ message: 'validation.field.isString' })
  @IsNotEmpty({ message: 'validation.field.isNotEmpty' })
  @Type(() => String)
  field: string;

  @ApiProperty({
    description: 'Sort direction',
    example: SortDirectionEnum.DESC,
    type: String,
  })
  @IsEnum(SortDirectionEnum, {
    message: `validation.direction.isEnum args: values:${Object.values(SortDirectionEnum).join(', ')}`,
  })
  @IsNotEmpty({ message: 'validation.direction.isNotEmpty' })
  @Type(() => String)
  direction: 'ASC' | 'DESC';
}

export class QueryOneRequestDto implements QueryOneRequest {
  @ApiPropertyOptional({
    description: 'Select',
    type: String,
  })
  @IsString({ message: 'validation.select.isString' })
  @IsOptional()
  @Type(() => String)
  select?: string;

  @ApiPropertyOptional({
    description: 'Include',
    type: String,
  })
  @IsString({ message: 'validation.include.isString' })
  @IsOptional()
  @Type(() => String)
  include?: string;

  @ApiPropertyOptional({
    description: 'With trashed',
    type: Boolean,
  })
  @IsBoolean({ message: 'validation.withTrashed.isBoolean' })
  @IsOptional()
  @Type(() => Boolean)
  withDeleted?: boolean = false;
}

export class QueryManyRequestDto
  extends QueryOneRequestDto
  implements QueryManyRequest
{
  @ApiPropertyOptional({
    description: 'Search value',
    type: String,
  })
  @IsString({ message: 'validation.search.isString' })
  @IsOptional()
  @Type(() => String)
  search?: string;

  @ApiPropertyOptional({
    description: 'Filters',
    type: FilterDto,
  })
  @IsArray({ message: 'validation.filters.isArray' })
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => FilterDto)
  filters?: FilterDto[];

  @ApiPropertyOptional({
    description: 'Sort',
    type: SortDto,
  })
  @IsArray({ message: 'validation.sort.isArray' })
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => SortDto)
  sorts?: SortDto[];

  @ApiPropertyOptional({
    description: 'Limit',
    type: Number,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'validation.limit.isInt' })
  @Min(1, { message: 'validation.limit.min args: min:1' })
  @Max(1000, { message: 'validation.limit.max args: max:1000' })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 1000;

  @ApiPropertyOptional({
    description: 'Page',
    type: Number,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'validation.page.isInt' })
  @Min(1, { message: 'validation.page.min args: min:1' })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;
}

export class QueryManyResponseDto<Entity> implements QueryManyResponse<Entity> {
  @ApiProperty({ description: 'Data', type: Object, isArray: true })
  data: Entity[];

  @ApiProperty({ description: 'Total number of entities', type: Number })
  total: number;
}
