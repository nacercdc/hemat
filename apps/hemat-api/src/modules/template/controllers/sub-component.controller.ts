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
import { SubComponent } from '@database/entities';
import { Abilities, AuthGuard } from '@shared/modules';
import { PermissionActionEnum, PermissionSubjectEnum } from '@shared/enums';
import { ExceptionResponseDto, FindAllResponseDto } from '@shared/dtos';
import { SubComponentService } from '../services';
import {
  FindAllSubComponentDto,
  FindOneSubComponentDto,
  SubComponentCreateRequestDto,
  SubComponentUpdateRequestDto,
  SubComponentMeasurementScaleDto,
} from '../dtos';

@ApiBearerAuth()
@ApiTags('SubComponents')
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
@Controller('sub-components')
export class SubComponentController {
  constructor(private readonly subComponentService: SubComponentService) {}

  @ApiOperation({
    summary: 'Find all',
    description: 'Get all sub-components with pagination',
  })
  @ApiOkResponse({ description: 'Ok', type: FindAllResponseDto<SubComponent> })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.SUB_COMPONENT,
      },
    ],
  })
  @Get()
  async findAll(@Query() query: FindAllSubComponentDto) {
    return this.subComponentService.findAll(query);
  }

  @ApiOperation({
    summary: 'Find one',
    description: 'Get a sub-component by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: SubComponent })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.SUB_COMPONENT,
      },
    ],
  })
  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() query: FindOneSubComponentDto,
  ) {
    return this.subComponentService.findOne(id, query);
  }

  @ApiOperation({
    summary: 'Create',
    description: 'Create a new sub-component',
  })
  @ApiCreatedResponse({ description: 'Created', type: SubComponent })
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
        subject: PermissionSubjectEnum.SUB_COMPONENT,
      },
    ],
  })
  @Post()
  async create(@Body() payload: SubComponentCreateRequestDto) {
    return this.subComponentService.create(payload);
  }

  @ApiOperation({
    summary: 'Update',
    description: 'Update a sub-component by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: SubComponent })
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
        subject: PermissionSubjectEnum.SUB_COMPONENT,
      },
    ],
  })
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: SubComponentUpdateRequestDto,
  ) {
    return this.subComponentService.update(id, payload);
  }

  @ApiOperation({
    summary: 'Delete',
    description: 'Soft delete a sub-component by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: SubComponent })
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
        subject: PermissionSubjectEnum.SUB_COMPONENT,
      },
    ],
  })
  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.subComponentService.delete(id);
  }

  @ApiOperation({
    summary: 'Restore',
    description: 'Restore a sub-component by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: SubComponent })
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
        subject: PermissionSubjectEnum.SUB_COMPONENT,
      },
    ],
  })
  @Post(':id/restore')
  async restore(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.subComponentService.restore(id);
  }
}