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
  ApiBody,
} from '@nestjs/swagger';
import { User } from '@database/entities';
import { Abilities, AuthGuard } from '@shared/modules';
import { PermissionActionEnum, PermissionSubjectEnum } from '@shared/enums';
import { ExceptionResponseDto, FindAllResponseDto } from '@shared/dtos';
import { UserService } from '../services';
import {
  FindAllUserDto,
  FindOneUserDto,
  UserCreateRequestDto,
  UserUpdateRequestDto,
  UpdatePasswordRequestDto,
} from '../dtos';
import { IsEnum, IsString } from 'class-validator';

export class UserStatusActionDto {
  @IsString()
  @IsEnum(['activate', 'deactivate'], { message: 'action must be activate or deactivate' })
  action: 'activate' | 'deactivate';
}

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
    description: 'Get all users with pagination',
  })
  @ApiOkResponse({ description: 'Ok', type: FindAllResponseDto<User> })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
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
  async findAll(@Query() query: FindAllUserDto) {
    return this.userService.findAll(query);
  }

  @ApiOperation({ summary: 'Find one', description: 'Get user by ID' })
  @ApiOkResponse({ description: 'Ok', type: User })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
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
    @Query() query: FindOneUserDto,
  ) {
    return this.userService.findOne(id, query);
  }

  @ApiOperation({ summary: 'Create', description: 'Create a new user' })
  @ApiCreatedResponse({ description: 'Created', type: User })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: ExceptionResponseDto,
  })
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
    description: 'Update user by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: User })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: ExceptionResponseDto,
  })
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
    return this.userService.update(id, payload);
  }

  @ApiOperation({
    summary: 'Update password',
    description: "Update user's password by ID",
  })
  @ApiOkResponse({ description: 'Ok', type: User })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: ExceptionResponseDto,
  })
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
    description: 'Soft delete user by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: User })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: ExceptionResponseDto,
  })
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
    return this.userService.delete(id);
  }

  @ApiOperation({
    summary: 'Restore',
    description: 'Restore user by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: User })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: ExceptionResponseDto,
  })
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
    return this.userService.restore(id);
  }

  @ApiOperation({
    summary: 'Set user status',
    description: 'Activate or deactivate user by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: User })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: ExceptionResponseDto,
  })
  @ApiBody({
    description: 'Action to perform on user status',
    schema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['activate', 'deactivate'],
          example: 'activate',
        },
      },
      required: ['action'],
      examples: {
        Activate: {
          summary: 'Activate user',
          value: { action: 'activate' },
        },
        Deactivate: {
          summary: 'Deactivate user',
          value: { action: 'deactivate' },
        },
      },
    },
  })
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
  @Patch(':id/status')
  async setStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: UserStatusActionDto,
  ) {
    return this.userService.setStatus(id, payload.action);
  }
}