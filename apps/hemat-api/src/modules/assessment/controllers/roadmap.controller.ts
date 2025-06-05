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
import { Roadmap } from '@database/entities';
import { Abilities, AuthGuard } from '@shared/modules';
import { PermissionActionEnum, PermissionSubjectEnum } from '@shared/enums';
import { ExceptionResponseDto, FindAllResponseDto } from '@shared/dtos';
import { RoadmapService } from '../services';
import {
  FindAllRoadmapDto,
  FindOneRoadmapDto,
  RoadmapCreateRequestDto,
  RoadmapUpdateRequestDto,
} from '../dtos';

@ApiBearerAuth()
@ApiTags('Roadmaps')
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
@Controller('assessments/:assessmentId/groups/:groupId/roadmaps')
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @ApiOperation({
    summary: 'Find all roadmaps',
    description:
      'Get all roadmaps for a specific assessment and group with pagination',
  })
  @ApiOkResponse({ description: 'Ok', type: FindAllResponseDto<Roadmap> })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.ROADMAP,
      },
    ],
  })
  @Get()
  async findAll(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Query() query: FindAllRoadmapDto,
  ) {
    return this.roadmapService.findAll(assessmentId, groupId, query);
  }

  @ApiOperation({
    summary: 'Find one roadmap',
    description: 'Get a roadmap by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: Roadmap })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.ROADMAP,
      },
    ],
  })
  @Get(':id')
  async findOne(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() query: FindOneRoadmapDto,
  ) {
    return this.roadmapService.findOne(assessmentId, groupId, id, query);
  }

  @ApiOperation({
    summary: 'Create a roadmap',
    description: 'Create a new roadmap',
  })
  @ApiCreatedResponse({ description: 'Created', type: Roadmap })
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
        subject: PermissionSubjectEnum.ROADMAP,
      },
    ],
  })
  @Post()
  async create(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Body() payload: RoadmapCreateRequestDto,
  ) {
    return this.roadmapService.create(assessmentId, groupId, payload);
  }

  @ApiOperation({
    summary: 'Update a roadmap',
    description: 'Update a roadmap by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: Roadmap })
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
        subject: PermissionSubjectEnum.ROADMAP,
      },
    ],
  })
  @Put(':id')
  async update(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: RoadmapUpdateRequestDto,
  ) {
    return this.roadmapService.update(assessmentId, groupId, id, payload);
  }

  @ApiOperation({
    summary: 'Delete a roadmap',
    description: 'Soft delete a roadmap by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: Roadmap })
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
        subject: PermissionSubjectEnum.ROADMAP,
      },
    ],
  })
  @Delete(':id')
  async delete(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.roadmapService.delete(assessmentId, groupId, id);
  }

  @ApiOperation({
    summary: 'Restore a roadmap',
    description: 'Restore a soft-deleted roadmap by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: Roadmap })
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
        subject: PermissionSubjectEnum.ROADMAP,
      },
    ],
  })
  @Post(':id/restore')
  async restore(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.roadmapService.restore(assessmentId, groupId, id);
  }
}
