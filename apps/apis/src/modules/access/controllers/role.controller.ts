import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Get,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiUnprocessableEntityResponse,
  ApiTooManyRequestsResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Role } from '../../../database/entities';
import { Abilities, AuthGuard } from '../../../shared/modules';
import {
  PermissionActionEnum,
  PermissionSubjectEnum,
} from '../../../shared/enums';
import {
  ExceptionResponseDto,
  QueryManyRequestDto,
  QueryManyResponseDto,
  QueryOneRequestDto,
} from '../../../shared/dtos';
import { RoleService } from '../services';
import { RoleCreateRequestDto, RoleUpdateRequestDto } from '../dtos';
import { ROLE_FIELD_CONFIG } from '../config/role-field-config';

@ApiBearerAuth()
@ApiTags('Roles')
@ApiBadRequestResponse({
  description: 'Bad Request',
  type: ExceptionResponseDto,
})
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
  type: ExceptionResponseDto,
})
@ApiForbiddenResponse({ description: 'Forbidden', type: ExceptionResponseDto })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ExceptionResponseDto,
})
@ApiTooManyRequestsResponse({
  description: 'Too Many Requests',
  type: ExceptionResponseDto,
})
@UseGuards(AuthGuard)
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({
    summary: 'Find all',
    description: 'Get all roles with pagination',
  })
  @ApiOkResponse({ description: 'Ok', type: QueryManyResponseDto<Role> })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.ROLE,
      },
    ],
  })
  @Get()
  async findAll(@Query() query: QueryManyRequestDto) {
    query.select ??= ROLE_FIELD_CONFIG.baseFields.join(',');
    return this.roleService.findAll({ query });
  }

  @ApiOperation({ summary: 'Find one', description: 'Get a role by ID' })
  @ApiOkResponse({ description: 'Ok', type: Role })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.ROLE,
      },
    ],
  })
  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() query: QueryOneRequestDto,
  ) {
    query.select ??= ROLE_FIELD_CONFIG.baseFields.join(',');
    return this.roleService.findOne(id, { query });
  }

  @ApiOperation({ summary: 'Create', description: 'Create a new role' })
  @ApiCreatedResponse({ description: 'Created', type: Role })
  @HttpCode(HttpStatus.CREATED)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.CREATE,
        subject: PermissionSubjectEnum.ROLE,
      },
    ],
  })
  @Post()
  async create(@Body() payload: RoleCreateRequestDto) {
    return this.roleService.create(payload);
  }

  @ApiOperation({ summary: 'Update', description: 'Update a role by ID' })
  @ApiOkResponse({ description: 'Ok', type: Role })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.UPDATE,
        subject: PermissionSubjectEnum.ROLE,
      },
    ],
  })
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: RoleUpdateRequestDto,
  ) {
    return this.roleService.update({ id }, payload);
  }

  @ApiOperation({ summary: 'Delete', description: 'Delete a role by ID' })
  @ApiOkResponse({ description: 'Ok', type: Role })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.DELETE,
        subject: PermissionSubjectEnum.ROLE,
      },
    ],
  })
  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.roleService.delete({ id });
  }

  @ApiOperation({ summary: 'Restore', description: 'Restore a role by ID' })
  @ApiOkResponse({ description: 'Ok', type: Role })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.RESTORE,
        subject: PermissionSubjectEnum.ROLE,
      },
    ],
  })
  @Post(':id/restore')
  async restore(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.roleService.restore({ id });
  }
}
