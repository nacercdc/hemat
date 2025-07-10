import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  HttpCode,
  UseGuards,
  Query,
  Request,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiUnprocessableEntityResponse,
  ApiTooManyRequestsResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  AssessmentSubComponent,
  AssessmentSubComponentAnswer,
  AssessmentSubComponentRoadmap,
} from '@database/entities';
import { AuthGuard, Abilities } from '@shared/modules';
import { PermissionActionEnum, PermissionSubjectEnum } from '@shared/enums';
import { ExceptionResponseDto, FindAllResponseDto } from '@shared/dtos';
import { ParseUUIDPipe } from '@nestjs/common';
import { AuthDto } from '@shared/modules';
import {
  AssessmentSubComponentService,
  AssessmentAnswerService,
} from '../services';
import {
  AssessmentSubComponentDto,
  FindAllAssessmentSubComponentDto,
  FindOneAssessmentSubComponentDto,
  FindAllAssessmentAnswerDto,
} from '../dtos';
import { AssessmentRoleGuard } from '../guards/assessment-role.guard';
import { AssessmentAbilityUser } from '../guards/assessment-ability-user.decorator';
import { AssessmentAbilityDto } from '../guards/assessment-ability.dto';
import { MemberRole } from '@shared/enums';

@ApiBearerAuth()
@ApiTags('Assessment Sub-Components')
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
@Controller('assessments/:assessmentId/sub-components')
export class AssessmentSubComponentController {
  constructor(
    private readonly assessmentSubComponentService: AssessmentSubComponentService,
    private readonly assessmentAnswerService: AssessmentAnswerService,
  ) {}

  @ApiOperation({
    summary: 'Get filled status for an assessment',
    description:
      'Check if an assessment has sub-component answers. Returns sub-component IDs (ordered by code) and the latest answer.',
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
          componentId: 'a1b2c3d4-5678-9abc-def0-1234567890ab',
          measurementScaleId: 'e4f4g4h5-4567-7d8e-1f2a-4b5c6d7e8f9g',
          answerId: 'f5g5h5i6-5678-8e9f-2a3b-5c6d7e8f9g0h',
          evidence: 'Documented evidence for the answer.',
          reference: 'Reference material for the answer.',
          notes: 'Additional notes for this answer.',
          domainId: 'g6h6i6j7-6789-9f0a-3b4c-6d7e8f9g0h1i',
          createdAt: '2024-06-01T12:34:56.789Z',
          updatedAt: '2024-06-01T12:35:56.789Z',
          deletedAt: null,
          subComponent: {
            id: 'b1e1c1d2-1234-4a5b-8c9d-1e2f3a4b5c6d',
            code: '1.A.1',
            name: 'Vaccine Distribution',
            description: 'Sub-component for vaccine distribution',
            assessmentId: 'h7i7j7k8-7890-0a1b-4c5d-7e8f9g0h1i2j',
            componentId: 'a1b2c3d4-5678-9abc-def0-1234567890ab',
            translations: {
              en: {
                name: 'Vaccine Distribution',
                code: '1.A.1',
                description: 'Sub-component for vaccine distribution',
              },
            },
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
  @HttpCode(200)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.ASSESSMENT,
      },
    ],
  })
  @Get('filled-status')
  async getFilledStatus(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @AssessmentAbilityUser() user: AssessmentAbilityDto,
  ): Promise<{ ids: string[]; latest: any }> {
    return this.assessmentSubComponentService.getFilledStatusByAssessment(
      assessmentId,
      user,
    );
  }

  @ApiOperation({
    summary: 'Get all assessment sub-components',
    description:
      'Retrieve all sub-components for a specific assessment with pagination, sorting, and search',
  })
  @ApiOkResponse({
    description: 'Ok',
    type: FindAllResponseDto<AssessmentSubComponent>,
  })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(200)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.ASSESSMENT,
      },
    ],
  })
  @Get()
  async findAll(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Query() query: FindAllAssessmentSubComponentDto,
  ): Promise<FindAllResponseDto<AssessmentSubComponent>> {
    return this.assessmentSubComponentService.findAll({
      ...query,
      assessmentId,
    });
  }

  @ApiOperation({
    summary: 'Get all primary answers for all sub-components in an assessment',
    description:
      'Retrieve all primary answers (isPrimary = true) for all sub-components in the assessment. Accessible by any assessment member.',
  })
  @ApiOkResponse({ description: 'Ok', type: [AssessmentSubComponentAnswer] })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(200)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.ASSESSMENT_ANSWER,
      },
    ],
    requireAdmin: false,
  })
  @UseGuards(AssessmentRoleGuard)
  @Get('primary-answers')
  async findAllPrimaryAnswers(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @AssessmentAbilityUser() user: AssessmentAbilityDto,
  ): Promise<AssessmentSubComponentAnswer[]> {
    return this.assessmentSubComponentService.findAllPrimaryAnswers(
      assessmentId,
    );
  }

  @ApiOperation({
    summary: 'Get a single assessment sub-component',
    description:
      'Retrieve a single sub-component by ID for a specific assessment',
  })
  @ApiOkResponse({ description: 'Ok', type: AssessmentSubComponent })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(200)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.ASSESSMENT,
      },
    ],
  })
  @Get(':id')
  async findOne(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() query: FindOneAssessmentSubComponentDto,
  ): Promise<AssessmentSubComponent> {
    return this.assessmentSubComponentService.findOne(assessmentId, id, query);
  }

  @ApiOperation({
    summary: 'Update an assessment sub-component',
    description: 'Update an assessment sub-component by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: AssessmentSubComponent })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(200)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.UPDATE,
        subject: PermissionSubjectEnum.ASSESSMENT,
      },
    ],
  })
  @Put(':id')
  async update(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: AssessmentSubComponentDto,
  ): Promise<AssessmentSubComponent> {
    return this.assessmentSubComponentService.update(assessmentId, id, payload);
  }

  @ApiOperation({
    summary: 'Get answer for a sub-component',
    description:
      'Retrieve answer for a specific sub-component based on user role',
  })
  @ApiOkResponse({
    description: 'Ok',
    type: AssessmentSubComponentAnswer,
  })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(200)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.ASSESSMENT_ANSWER,
      },
    ],
    requireAdmin: false,
  })
  @UseGuards(AssessmentRoleGuard)
  @Get(':id/answer')
  async findAnswers(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('id', new ParseUUIDPipe()) subComponentId: string,
    @AssessmentAbilityUser() user: AssessmentAbilityDto,
    @Query() query: FindAllAssessmentAnswerDto,
  ): Promise<AssessmentSubComponentAnswer> {
    const { assessmentRole, assessmentGroupId, isAdmin } = user;

    if (isAdmin) {
      return this.assessmentSubComponentService.getSubComponentAnswer(
        assessmentId,
        subComponentId,
        user,
        query,
      );
    }

    if (assessmentRole === MemberRole.PRIMARY) {
      return this.assessmentSubComponentService.getSubComponentAnswer(
        assessmentId,
        subComponentId,
        user,
        query,
      );
    } else if (assessmentRole === MemberRole.TEAM_LEADER) {
      if (!assessmentGroupId) {
        throw new ForbiddenException(
          'You must be assigned to a group to view answers',
        );
      }
      return this.assessmentSubComponentService.getSubComponentAnswer(
        assessmentId,
        subComponentId,
        user,
        query,
      );
    }

    throw new ForbiddenException(
      'Only Primary users, Team Leaders, and Admins can view answers',
    );
  }

  @ApiOperation({
    summary: 'Get primary answer for a sub-component',
    description:
      'Retrieve the primary answer for a specific sub-component. Only accessible by Primary role users.',
  })
  @ApiOkResponse({
    description: 'Ok',
    type: AssessmentSubComponentAnswer,
  })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(200)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.ASSESSMENT_ANSWER,
      },
    ],
    requireAdmin: false,
  })
  @UseGuards(AssessmentRoleGuard)
  @Get(':id/primary-answer')
  async findPrimaryAnswers(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @AssessmentAbilityUser() user: AssessmentAbilityDto,
  ): Promise<AssessmentSubComponentAnswer> {
    const { assessmentRole, isAdmin, id: userId } = user;

    let answer: AssessmentSubComponentAnswer;
    if (isAdmin) {
      answer = await this.assessmentSubComponentService.findPrimaryAnswer(id, userId);
    } else {
      if (assessmentRole !== MemberRole.PRIMARY) {
        throw new ForbiddenException(
          'Only Primary users and Admins can view primary answers',
        );
      }
      answer = await this.assessmentSubComponentService.findPrimaryAnswer(id, userId);
    }
    // Revert: return the answer object as-is
    return answer;
  }

  @ApiOperation({
    summary: 'Get roadmap answer for a sub-component',
    description: 'Retrieve roadmap answer for a specific sub-component for the current user',
  })
  @ApiOkResponse({ description: 'Ok', type: AssessmentSubComponentRoadmap })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(200)
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
  @UseGuards(AssessmentRoleGuard)
  @Get(':id/roadmap-answer')
  async getRoadmapAnswer(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('id', new ParseUUIDPipe()) subComponentId: string,
    @AssessmentAbilityUser() user: AssessmentAbilityDto,
  ): Promise<AssessmentSubComponentRoadmap> {
    return this.assessmentSubComponentService.getSubComponentRoadmapAnswer(
      assessmentId,
      subComponentId,
      user,
    );
  }
} 
