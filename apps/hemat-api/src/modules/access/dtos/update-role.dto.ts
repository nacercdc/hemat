import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsUUID,
  IsString,
  Length,
  IsNotEmpty,
} from 'class-validator';
import { IsExists, IsUnique } from '../../../shared/validators';
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends CreateRoleDto {
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
