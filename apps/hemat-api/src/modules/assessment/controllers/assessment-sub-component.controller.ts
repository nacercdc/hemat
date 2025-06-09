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
import { AssessmentSubComponent, AssessmentAnswer } from '@database/entities';
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
    summary: 'Get all answers for a sub-component',
    description: 'Retrieve all answers for a specific sub-component',
  })
  @ApiOkResponse({
    description: 'Ok',
    type: FindAllResponseDto<AssessmentAnswer>,
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
  })
  @Get(':id/answers')
  async findAnswers(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Request() req: { user: AuthDto },
    @Query() query: FindAllAssessmentAnswerDto,
  ): Promise<FindAllResponseDto<AssessmentAnswer>> {
    return this.assessmentAnswerService.findAllBySubComponent(
      id,
      req.user.id,
      query,
    );
  }
}
