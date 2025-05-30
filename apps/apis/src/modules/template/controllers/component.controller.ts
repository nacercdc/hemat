import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
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
import { Component } from '@database/entities';
import { Abilities, AuthGuard } from '@shared/modules';
import { PermissionActionEnum, PermissionSubjectEnum } from '@shared/enums';
import { ExceptionResponseDto, FindAllResponseDto } from '@shared/dtos';
import { ComponentService } from '../services';
import {
  FindAllComponentDto,
  FindOneComponentDto,
  ComponentCreateRequestDto,
  ComponentUpdateRequestDto,
} from '../dtos';

@ApiBearerAuth()
@ApiTags('Components')
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
@Controller('components')
export class ComponentController {
  constructor(private readonly componentService: ComponentService) {}

  @ApiOperation({
    summary: 'Find all',
    description: 'Get all components with pagination',
  })
  @ApiOkResponse({ description: 'Ok', type: FindAllResponseDto<Component> })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.COMPONENT,
      },
    ],
  })
  @Get()
  async findAll(@Query() query: FindAllComponentDto) {
    return this.componentService.findAll(query);
  }

  @ApiOperation({ summary: 'Find one', description: 'Get a component by ID' })
  @ApiOkResponse({ description: 'Ok', type: Component })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.COMPONENT,
      },
    ],
  })
  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() query: FindOneComponentDto,
  ) {
    return this.componentService.findOne(id, query);
  }

  @ApiOperation({ summary: 'Create', description: 'Create a new component' })
  @ApiCreatedResponse({ description: 'Created', type: Component })
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
        subject: PermissionSubjectEnum.COMPONENT,
      },
    ],
  })
  @Post()
  async create(@Body() payload: ComponentCreateRequestDto) {
    return this.componentService.create(payload);
  }

  @ApiOperation({ summary: 'Update', description: 'Update a component by ID' })
  @ApiOkResponse({ description: 'Ok', type: Component })
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
        subject: PermissionSubjectEnum.COMPONENT,
      },
    ],
  })
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: ComponentUpdateRequestDto,
  ) {
    return this.componentService.update(id, payload);
  }

  @ApiOperation({
    summary: 'Delete',
    description: 'Soft delete a component by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: Component })
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
        subject: PermissionSubjectEnum.COMPONENT,
      },
    ],
  })
  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.componentService.delete(id);
  }

  @ApiOperation({
    summary: 'Restore',
    description: 'Restore a component by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: Component })
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
        subject: PermissionSubjectEnum.COMPONENT,
      },
    ],
  })
  @Post(':id/restore')
  async restore(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.componentService.restore(id);
  }
}