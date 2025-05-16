import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsUUID,
  IsString,
  IsArray,
  Length,
  IsNotEmpty,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { IsExists, IsUnique } from '../../../shared/validators';
import { PermissionActionEnum, PermissionSubjectEnum } from '../../../shared';

const permissionAction = Object.values(PermissionActionEnum).length || 5;
const permissionSubject = Object.values(PermissionSubjectEnum).length || 3;
const permissionLimit = permissionAction * permissionSubject;

export class RoleCreateRequestDto {
  @ApiProperty({
    description: 'Name',
    example: 'admin',
    minLength: 2,
    maxLength: 64,
    type: String,
  })
  @Length(2, 64, { message: 'validation.name.length args: min:2 | max:64' })
  @IsString({ message: 'validation.name.isString' })
  @IsUnique(
    { tableName: 'roles', columns: ['name'] },
    { message: 'validation.name.isUnique' },
  )
  @IsNotEmpty({ message: 'validation.name.isNotEmpty' })
  @Type(() => String)
  name: string;

  @ApiProperty({
    description: 'Description',
    example: 'Admin role',
    minLength: 2,
    maxLength: 1200,
    type: String,
  })
  @Length(2, 1200, {
    message: 'validation.description.length args: min:2 | max:1200',
  })
  @IsString({ message: 'validation.description.isString' })
  @IsNotEmpty({ message: 'validation.description.isNotEmpty' })
  @Type(() => String)
  description: string;

  @ApiProperty({
    description: 'Permissions',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    minItems: 1,
    maxItems: permissionLimit,
    uniqueItems: true,
    type: String,
    isArray: true,
  })
  @IsArray({ message: 'validation.permissionsIds.isArray' })
  @IsUUID('all', { each: true, message: 'validation.permissionsIds.isUUID' })
  @ArrayMinSize(1, {
    message: 'validation.permissionsIds.isArrayMinSize args: value:1',
  })
  @ArrayMaxSize(permissionLimit, {
    message: `validation.permissionsIds.isArrayMaxSize args: value:${permissionLimit}`,
  })
  @IsExists(
    { tableName: 'permissions', columns: ['id'] },
    { message: 'validation.permissionsIds.isExists' },
  )
  @Type(() => String)
  permissionsIds: string[];
}

export class RoleUpdateRequestDto extends RoleCreateRequestDto {
  @ApiProperty({
    description: 'Role Id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsUUID('all', { message: 'validation.id.isUUID' })
  @IsNotEmpty({ message: 'validation.id.isNotEmpty' })
  @Type(() => String)
  id: string;

  @ApiProperty({
    description: 'Name',
    example: 'admin',
    minLength: 2,
    maxLength: 64,
    type: String,
  })
  @Length(2, 64, { message: 'validation.name.length args: min:2 | max:64' })
  @IsString({ message: 'validation.name.isString' })
  @IsUnique(
    { tableName: 'roles', columns: ['name'], exclude: 'id' },
    { message: 'validation.name.isUnique' },
  )
  @IsNotEmpty({ message: 'validation.name.isNotEmpty' })
  @Type(() => String)
  name: string;
}
