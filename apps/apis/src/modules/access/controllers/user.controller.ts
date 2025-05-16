import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  Patch,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiUnprocessableEntityResponse,
  ApiTooManyRequestsResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { User } from '../../../database/entities';
import { Abilities, AuthGuard } from '../../../shared/modules';
import {
  PermissionActionEnum,
  PermissionSubjectEnum,
  FilterOperatorEnum,
} from '../../../shared/enums';
import {
  ExceptionResponseDto,
  QueryManyRequestDto,
  QueryManyResponseDto,
  QueryOneRequestDto,
} from '../../../shared/dtos';
import { UserService } from '../services';
import {
  UpdatePasswordRequestDto,
  UserCreateRequestDto,
  UserUpdateRequestDto,
} from '../dtos';
import { USER_FIELD_CONFIG } from '../config/user-field-config';

@ApiBearerAuth()
@ApiTags('Users')
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
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Find all',
    description: 'Get all admin users with pagination',
  })
  @ApiOkResponse({ description: 'Ok', type: QueryManyResponseDto<User> })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.USER,
      },
    ],
  })
  @Get()
  async findAll(@Query() query: QueryManyRequestDto) {
    query.select ??= USER_FIELD_CONFIG.baseFields.join(',');
    return this.userService.findAll({
      query,
      filters: [
        {
          field: 'isAdmin',
          operator: FilterOperatorEnum.EQ,
          value: true,
          skipWhitelist: true,
        },
      ],
    });
  }

  @ApiOperation({ summary: 'Find one', description: 'Get an admin user by ID' })
  @ApiOkResponse({ description: 'Ok', type: User })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.USER,
      },
    ],
  })
  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() query: QueryOneRequestDto,
  ) {
    query.select ??= USER_FIELD_CONFIG.baseFields.join(',');
    return this.userService.findOne(id, {
      query,
      filters: [
        {
          field: 'isAdmin',
          operator: FilterOperatorEnum.EQ,
          value: true,
          skipWhitelist: true,
        },
      ],
    });
  }

  @ApiOperation({ summary: 'Create', description: 'Create a new admin user' })
  @ApiCreatedResponse({ description: 'Created', type: User })
  @HttpCode(HttpStatus.CREATED)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.CREATE,
        subject: PermissionSubjectEnum.USER,
      },
    ],
  })
  @Post()
  async create(@Body() payload: UserCreateRequestDto) {
    return this.userService.create(payload);
  }

  @ApiOperation({
    summary: 'Update',
    description: 'Update an admin user by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: User })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.UPDATE,
        subject: PermissionSubjectEnum.USER,
      },
    ],
  })
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: UserUpdateRequestDto,
  ) {
    return this.userService.update({ id, isAdmin: true }, payload);
  }

  @ApiOperation({
    summary: 'Update password',
    description: "Update admin user's password by ID",
  })
  @ApiOkResponse({ description: 'Ok', type: User })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.UPDATE,
        subject: PermissionSubjectEnum.USER,
      },
    ],
  })
  @Patch(':id/update-password')
  async updatePassword(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: UpdatePasswordRequestDto,
  ) {
    return this.userService.updatePassword(id, payload);
  }

  @ApiOperation({
    summary: 'Delete',
    description: 'Delete an admin user by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: User })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.DELETE,
        subject: PermissionSubjectEnum.USER,
      },
    ],
  })
  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.delete({ id, isAdmin: true });
  }

  @ApiOperation({
    summary: 'Restore',
    description: 'Restore an admin user by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: User })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.RESTORE,
        subject: PermissionSubjectEnum.USER,
      },
    ],
  })
  @Post(':id/restore')
  async restore(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.restore({ id, isAdmin: true });
  }
}
