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
import { AssessmentAnswer } from '@database/entities';
import { Abilities, AuthGuard } from '@shared/modules';
import { PermissionActionEnum, PermissionSubjectEnum } from '@shared/enums';
import { ExceptionResponseDto, FindAllResponseDto } from '@shared/dtos';
import { AssessmentAnswerService } from '../services';
import {
  FindAllAssessmentAnswerDto,
  FindOneAssessmentAnswerDto,
  AssessmentAnswerCreateRequestDto,
  AssessmentAnswerUpdateRequestDto,
} from '../dtos';

@ApiBearerAuth()
@ApiTags('Assessment Answers')
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
@Controller('assessments/:assessmentId/groups/:groupId/answers')
export class AssessmentAnswerController {
  constructor(
    private readonly assessmentAnswerService: AssessmentAnswerService,
  ) {}

  @ApiOperation({
    summary: 'Find all assessment answers',
    description:
      'Get all answers for a specific assessment and group with pagination',
  })
  @ApiOkResponse({
    description: 'Ok',
    type: FindAllResponseDto<AssessmentAnswer>,
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
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Query() query: FindAllAssessmentAnswerDto,
  ) {
    return this.assessmentAnswerService.findAll(assessmentId, groupId, query);
  }

  @ApiOperation({
    summary: 'Find one assessment answer',
    description: 'Get an assessment answer by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: AssessmentAnswer })
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
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() query: FindOneAssessmentAnswerDto,
  ) {
    return this.assessmentAnswerService.findOne(
      assessmentId,
      groupId,
      id,
      query,
    );
  }

  @ApiOperation({
    summary: 'Create an assessment answer',
    description: 'Create a new assessment answer',
  })
  @ApiCreatedResponse({ description: 'Created', type: AssessmentAnswer })
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
        subject: PermissionSubjectEnum.ASSESSMENT_ANSWER,
      },
    ],
  })
  @Post()
  async create(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Body() payload: AssessmentAnswerCreateRequestDto,
  ) {
    return this.assessmentAnswerService.create(assessmentId, groupId, payload);
  }

  @ApiOperation({
    summary: 'Update an assessment answer',
    description: 'Update an assessment answer by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: AssessmentAnswer })
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
        subject: PermissionSubjectEnum.ASSESSMENT_ANSWER,
      },
    ],
  })
  @Put(':id')
  async update(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: AssessmentAnswerUpdateRequestDto,
  ) {
    return this.assessmentAnswerService.update(
      assessmentId,
      groupId,
      id,
      payload,
    );
  }

  @ApiOperation({
    summary: 'Delete an assessment answer',
    description: 'Soft delete an assessment answer by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: AssessmentAnswer })
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
        subject: PermissionSubjectEnum.ASSESSMENT_ANSWER,
      },
    ],
  })
  @Delete(':id')
  async delete(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.assessmentAnswerService.delete(assessmentId, groupId, id);
  }

  @ApiOperation({
    summary: 'Restore an assessment answer',
    description: 'Restore a soft-deleted assessment answer by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: AssessmentAnswer })
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
        subject: PermissionSubjectEnum.ASSESSMENT_ANSWER,
      },
    ],
  })
  @Post(':id/restore')
  async restore(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.assessmentAnswerService.restore(assessmentId, groupId, id);
  }
}
