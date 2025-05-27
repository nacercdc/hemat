import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  HttpCode,
  UseGuards,
  ParseUUIDPipe,
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
import { AssessmentSubComponent } from '@africa-cdc/database/entities';
import { AuthGuard, Abilities } from '@africa-cdc/shared/modules';
import {
  PermissionActionEnum,
  PermissionSubjectEnum,
} from '@africa-cdc/shared/enums';
import { ExceptionResponseDto } from '@africa-cdc/shared/dtos';
import { AssessmentSubComponentService } from '../services';
import { AssessmentSubComponentDto } from '../dtos';

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
  ) {}

  @ApiOperation({
    summary: 'Get all assessment sub-components',
    description: 'Retrieve all sub-components for a specific assessment',
  })
  @ApiOkResponse({ description: 'Ok', type: [AssessmentSubComponent] })
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
  ): Promise<AssessmentSubComponent[]> {
    return this.assessmentSubComponentService.findAll(assessmentId);
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
  ): Promise<AssessmentSubComponent> {
    return this.assessmentSubComponentService.findOne(assessmentId, id);
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
}
