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
  Request,
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
import { Abilities, AuthGuard, AuthDto } from '@shared/modules';
import { PermissionActionEnum, PermissionSubjectEnum } from '@shared/enums';
import { ExceptionResponseDto, FindAllResponseDto } from '@shared/dtos';
import { RoadmapService } from '../dtos/services';
import {
  FindAllRoadmapDto,
  FindOneRoadmapDto,
  RoadmapCreateRequestDto,
  RoadmapUpdateRequestDto,
} from '../dtos';

@ApiTags('Roadmaps')
@ApiBearerAuth()
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
@Controller('assessments/:assessmentId/roadmaps')
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @ApiOperation({ summary: 'Get all roadmaps' })
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
    @Query() query: FindAllRoadmapDto,
    @Request() req: { user: AuthDto },
  ): Promise<FindAllResponseDto<Roadmap>> {
    return this.roadmapService.findAll(assessmentId, query);
  }

  @ApiOperation({ summary: 'Get a roadmap by id' })
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
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() query: FindOneRoadmapDto,
    @Request() req: { user: AuthDto },
  ): Promise<Roadmap> {
    return this.roadmapService.findOne(assessmentId, id, query);
  }

  @ApiOperation({ summary: 'Create a roadmap' })
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
    @Body() payload: RoadmapCreateRequestDto,
    @Request() req: { user: AuthDto },
  ): Promise<Roadmap> {
    return this.roadmapService.create(assessmentId, payload, req.user.id);
  }

  @ApiOperation({ summary: 'Update a roadmap' })
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
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: RoadmapUpdateRequestDto,
    @Request() req: { user: AuthDto },
  ): Promise<Roadmap> {
    return this.roadmapService.update(assessmentId, id, payload, req.user.id);
  }

  @ApiOperation({ summary: 'Delete a roadmap' })
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
    @Param('id', new ParseUUIDPipe()) id: string,
    @Request() req: { user: AuthDto },
  ): Promise<Roadmap> {
    return this.roadmapService.delete(assessmentId, id, req.user.id);
  }

  @ApiOperation({ summary: 'Restore a roadmap' })
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
    @Param('id', new ParseUUIDPipe()) id: string,
    @Request() req: { user: AuthDto },
  ): Promise<Roadmap> {
    return this.roadmapService.restore(assessmentId, id, req.user.id);
  }
}