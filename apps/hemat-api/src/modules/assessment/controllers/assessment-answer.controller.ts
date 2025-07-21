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
import { Answer } from '@database/entities';
import { Abilities, AuthGuard, AuthDto } from '@shared/modules';
import { PermissionActionEnum, PermissionSubjectEnum } from '@shared/enums';
import { ExceptionResponseDto, FindAllResponseDto } from '@shared/dtos';
import { AssessmentAnswerService } from '../services';
import {
  FindAllAssessmentAnswerDto,
  FindOneAssessmentAnswerDto,
  AssessmentAnswerCreateRequestDto,
  AssessmentAnswerUpdateRequestDto,
} from '../dtos';

@ApiTags('Assessment Answers')
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
@Controller('assessments/:assessmentId/answers')
export class AssessmentAnswerController {
  constructor(
    private readonly assessmentAnswerService: AssessmentAnswerService,
  ) {}

  @ApiOperation({
    summary: 'Find all assessment answers',
    description:
      'Get all answers for a specific assessment submitted by the authenticated user or all answers for TEAM_LEADER or PRIMARY',
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
        subject: PermissionSubjectEnum.ASSESSMENT_ANSWER,
      },
    ],
  })
  @Get()
  async findAll(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Request() req: { user: AuthDto },
    @Query() query: FindAllAssessmentAnswerDto,
  ): Promise<FindAllResponseDto<Answer>> {
    return this.assessmentAnswerService.findAll(
      assessmentId,
      req.user.id,
      query,
    );
  }

  @ApiOperation({
    summary: 'Find one assessment answer',
    description:
      'Get an assessment answer by ID submitted by the authenticated user or accessible by TEAM_LEADER or PRIMARY',
  })
  @ApiOkResponse({ description: 'Ok', type: Answer })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.ASSESSMENT_ANSWER,
      },
    ],
  })
  @Get(':id')
  async findOne(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Request() req: { user: AuthDto },
    @Query() query: FindOneAssessmentAnswerDto,
  ): Promise<Answer> {
    return this.assessmentAnswerService.findOne(
      assessmentId,
      req.user.id,
      id,
      query,
    );
  }

  @ApiOperation({
    summary: 'Create an assessment answer',
    description:
      'Create a new assessment answer for the authenticated user (PRIMARY or TEAM_LEADER only)',
  })
  @ApiCreatedResponse({ description: 'Created', type: Answer })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: ExceptionResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Forbidden: Only Primary or Team Leader roles can submit',
    type: ExceptionResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Abilities({
    permissions: [
      {
        action: PermissionActionEnum.CREATE,
        subject: PermissionSubjectEnum.ASSESSMENT_ANSWER,
      },
    ],
  })
  @Post()
  async create(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Request() req: { user: AuthDto },
    @Body() payload: AssessmentAnswerCreateRequestDto,
  ): Promise<Answer> {
    return this.assessmentAnswerService.create(
      assessmentId,
      req.user.id,
      payload,
    );
  }

  @ApiOperation({
    summary: 'Update an assessment answer',
    description:
      'Update an assessment answer by ID for the authenticated user (PRIMARY or TEAM_LEADER only)',
  })
  @ApiOkResponse({ description: 'Ok', type: Answer })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: ExceptionResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Forbidden: Only Primary or Team Leader roles can update',
    type: ExceptionResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.UPDATE,
        subject: PermissionSubjectEnum.ASSESSMENT_ANSWER,
      },
    ],
  })
  @Put(':id')
  async update(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Request() req: { user: AuthDto },
    @Body() payload: AssessmentAnswerUpdateRequestDto,
  ): Promise<Answer> {
    return this.assessmentAnswerService.update(
      assessmentId,
      req.user.id,
      id,
      payload,
    );
  }

  @ApiOperation({
    summary: 'Submit all answers for the assessment',
    description:
      'Submit (finalize) answers for the assessment. Only allowed if all subcomponents for the assessment are answered with isPrimary=true and status is COMPLETED.',
  })
  @ApiOkResponse({ description: 'Ok', type: Answer })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ExceptionResponseDto })
  @ApiForbiddenResponse({ description: 'Forbidden', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    permissions: [
      {
        action: PermissionActionEnum.UPDATE,
        subject: PermissionSubjectEnum.ASSESSMENT_ANSWER,
      },
    ],
  })
  @Patch('submit')
  async submitAssessmentAnswers(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Request() req: { user: AuthDto },
  ): Promise<any> {
    return this.assessmentAnswerService.submitAssessmentAnswers(
      assessmentId,
      req.user.id,
    );
  }
}