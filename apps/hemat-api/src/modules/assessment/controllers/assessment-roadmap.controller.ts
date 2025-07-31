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
  Patch,
  ForbiddenException,
  UseInterceptors,
  UploadedFile,
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
  ApiConsumes,
  ApiBody,
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
import { AssessmentRoleGuard } from '../guards/assessment-role.guard';
import { AssessmentAbilityUser } from '../guards/assessment-ability-user.decorator';
import { AssessmentAbilityDto } from '../guards/assessment-ability.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaResponseDto } from '@etm/server-media-upload';

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
@Controller('assessments')
export class AssessmentRoadmapController {
  constructor(private readonly roadmapService: AssessmentRoadmapService) {}

  @ApiOperation({
    summary: 'Get all roadmap information',
    description: 'Get all roadmap information with assessment and user objects, percentage, status, and timestamps. Admins can see all roadmaps, assessment users can only see their own roadmaps.',
  })
  @ApiOkResponse({
    description: 'Ok',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          assessmentId: { type: 'string' },
          userId: { type: 'string' },
          isPrimary: { type: 'boolean' },
          percentage: { type: 'number' },
          status: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          assessment: { 
            type: 'object',
            description: 'Full assessment object'
          },
          user: { 
            type: 'object',
            description: 'Full user object'
          }
        }
      }
    }
  })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.ROADMAP,
      },
    ],
    requireAdmin: false,
  })
  @Get('roadmaps/info')
  async getRoadmapInfo(
    @AssessmentAbilityUser() user: AssessmentAbilityDto,
    @Request() req: { user: AuthDto },
  ): Promise<any[]> {
    const { isAdmin, assessmentRole } = user;
    
    try {
      // If admin or has assessment role, get all roadmaps
      if (isAdmin || assessmentRole) {
        return await this.roadmapService.getRoadmapInfo(req.user.id, true);
      }
      
      // For regular users, get filtered roadmaps
      return await this.roadmapService.getRoadmapInfo(req.user.id, false);
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({
    summary: 'Get filled status for roadmap sub-components',
    description:
      'Check if an assessment has roadmap sub-component entries. Returns sub-component IDs (ordered) and the latest roadmap entry.',
  })
  @ApiOkResponse({
    description: 'Ok',
    schema: {
      type: 'object',
      properties: {
        ids: { type: 'array', items: { type: 'string' } },
        latest: { type: 'object' },
      },
      example: {
        ids: [
          'b1e1c1d2-1234-4a5b-8c9d-1e2f3a4b5c6d',
          'c2d2e2f3-2345-5b6c-9d0e-2f3a4b5c6d7e',
        ],
        latest: {
          id: 'd3e3f3g4-3456-6c7d-0e1f-3a4b5c6d7e8f',
          subComponentId: 'b1e1c1d2-1234-4a5b-8c9d-1e2f3a4b5c6d',
          roadmapId: 'a1b2c3d4-5678-9abc-def0-1234567890ab',
          measurementScaleId: 'e4f4g4h5-4567-7d8e-1f2a-4b5c6d7e8f9g',
          answerId: 'f5g5h5i6-5678-8e9f-2a3b-5c6d7e8f9g0h',
          target: '100',
          currentState: '80',
          activities: 'Some activities',
          responsible: 'Someone',
          resources: 'Some resources',
          createdAt: '2024-06-01T12:34:56.789Z',
          updatedAt: '2024-06-01T12:35:56.789Z',
          deletedAt: null,
          subComponent: {
            id: 'b1e1c1d2-1234-4a5b-8c9d-1e2f3a4b5c6d',
            code: '1.A.1',
            name: 'Vaccine Distribution',
            description: 'Sub-component for vaccine distribution',
            createdAt: '2024-05-30T10:00:00.000Z',
            updatedAt: '2024-05-30T10:00:00.000Z',
            deletedAt: null,
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @UseGuards(AssessmentRoleGuard)
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.ROADMAP,
      },
    ],
    requireAdmin: false,
  })
  @Get(':assessmentId/roadmaps/filled-status')
  async getFilledStatus(
    @AssessmentAbilityUser() user: AssessmentAbilityDto,
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Request() req: { user: AuthDto },
  ): Promise<{ ids: string[]; latest: any }> {
    const { isAdmin } = user;

    if (isAdmin || user.assessmentRole) {
      return this.roadmapService.getFilledStatusByAssessment(
        assessmentId,
        req.user.id,
      );
    }

    throw new ForbiddenException('You do not have access to this resource');
  }

  @ApiOperation({
    summary: 'Get roadmap progress per domain',
    description:
      'Get roadmap progress per domain for the primary roadmap of an assessment (team leader)',
  })
  @ApiOkResponse({ description: 'Ok' })
  @Get(':assessmentId/roadmaps/progress')
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
  @Get(':assessmentId/roadmaps')
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
  @Get(':assessmentId/roadmaps/:id')
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
  @Post(':assessmentId/roadmaps')
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
  @Put(':assessmentId/roadmaps/:id')
  async update(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Request() req: { user: AuthDto },
    @Body() payload: RoadmapUpdateRequestDto,
  ): Promise<Roadmap> {
    return this.roadmapService.update(assessmentId, req.user.id, id, payload);
  }

  @ApiOperation({
    summary: 'Submit all roadmaps for the assessment',
    description:
      'Submit (finalize) roadmaps for the assessment. Only allowed if all subcomponents for the assessment are filled and roadmap status is COMPLETED.',
  })
  @ApiOkResponse({ description: 'Ok', type: Roadmap })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: ExceptionResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
    type: ExceptionResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    permissions: [
      {
        action: PermissionActionEnum.UPDATE,
        subject: PermissionSubjectEnum.ROADMAP,
      },
    ],
  })
  @Patch(':assessmentId/roadmaps/submit')
  async submitAssessmentRoadmap(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Request() req: { user: AuthDto },
  ): Promise<any> {
    return this.roadmapService.submitAssessmentRoadmap(
      assessmentId,
      req.user.id,
    );
  }

  @ApiOperation({
    summary: 'Upload document for sub-component roadmap',
    description: 'Upload a document file for a specific sub-component roadmap entry. This will replace any existing document.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Document file (PDF, DOC, DOCX, XLS, XLSX. Max size: 10MB)',
        },
      },
      required: ['file'],
    },
  })
  @ApiOkResponse({ 
    description: 'Document uploaded successfully', 
    type: MediaResponseDto 
  })
  @ApiBadRequestResponse({
    description: 'Invalid file format or size exceeded',
    type: ExceptionResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Sub-component roadmap entry not found',
    type: ExceptionResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Forbidden: You do not have permission to upload documents for this roadmap',
    type: ExceptionResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    permissions: [
      {
        action: PermissionActionEnum.UPDATE,
        subject: PermissionSubjectEnum.ROADMAP,
      },
    ],
  })
  @Post(':assessmentId/roadmaps/sub-component/:id/document')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('id', new ParseUUIDPipe()) subComponentRoadmapId: string,
    @Request() req: { user: AuthDto },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.roadmapService.uploadDocument(assessmentId, req.user.id, subComponentRoadmapId, file);
  }
}
