import {
  Controller,
  Get,
  Post,
  Put,
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
import { AssessmentRoadmapService } from '../services';
import {
  FindAllRoadmapDto,
  FindOneRoadmapDto,
  RoadmapCreateRequestDto,
  RoadmapUpdateRequestDto,
} from '../dtos';
import { RoadmapDomainProgress } from '../types/assessment-progress.type';

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
export class AssessmentRoadmapController {
  constructor(private readonly roadmapService: AssessmentRoadmapService) {}

  @ApiOperation({
    summary: 'Get roadmap progress per domain',
    description:
      'Get roadmap progress per domain for the primary roadmap of an assessment (team leader)',
  })
  @ApiOkResponse({ description: 'Ok' })
  @Get('progress')
  async getProgress(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Request() req: { user: AuthDto },
    @Query('language') language?: string,
  ): Promise<RoadmapDomainProgress[]> {
    return this.roadmapService.getProgress(
      assessmentId,
      req.user.id,
      language || 'en',
    );
  }

  @ApiOperation({
    summary: 'Find all roadmaps',
    description:
      'Get all roadmaps for a specific assessment by the authenticated user (Primary role only)',
  })
  @ApiOkResponse({
    description: 'Ok',
    type: FindAllResponseDto,
  })
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
    @Request() req: { user: AuthDto },
    @Query() query: FindAllRoadmapDto,
  ): Promise<FindAllResponseDto<Roadmap>> {
    return this.roadmapService.findAll(assessmentId, req.user.id, query);
  }

  @ApiOperation({
    summary: 'Find one roadmap',
    description:
      'Get a roadmap by ID for the authenticated user (Primary role only)',
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
    @Param('id', new ParseUUIDPipe()) id: string,
    @Request() req: { user: AuthDto },
    @Query() query: FindOneRoadmapDto,
  ): Promise<Roadmap> {
    return this.roadmapService.findOne(assessmentId, req.user.id, id, query);
  }

  @ApiOperation({
    summary: 'Create a roadmap',
    description:
      'Create a new roadmap for the authenticated user (Primary role only)',
  })
  @ApiCreatedResponse({ description: 'Created', type: Roadmap })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: ExceptionResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Forbidden: Only Primary role can submit',
    type: ExceptionResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Abilities({
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
    @Request() req: { user: AuthDto },
    @Body() payload: RoadmapCreateRequestDto,
  ): Promise<Roadmap> {
    return this.roadmapService.create(assessmentId, req.user.id, payload);
  }

  @ApiOperation({
    summary: 'Update a roadmap',
    description:
      'Update a roadmap by ID for the authenticated user (Primary role only)',
  })
  @ApiOkResponse({ description: 'Ok', type: Roadmap })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: ExceptionResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Forbidden: Only Primary role can update',
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
    @Request() req: { user: AuthDto },
    @Body() payload: RoadmapUpdateRequestDto,
  ): Promise<Roadmap> {
    return this.roadmapService.update(assessmentId, req.user.id, id, payload);
  }
}
