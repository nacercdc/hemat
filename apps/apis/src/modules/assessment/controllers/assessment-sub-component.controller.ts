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
import { AssessmentSubComponent } from '../../../database/entities';
import { AuthGuard, Abilities } from '../../../shared/modules';
import {
  PermissionActionEnum,
  PermissionSubjectEnum,
} from '../../../shared/enums';
import { ExceptionResponseDto } from '../../../shared/dtos';
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
@Controller()
export class AssessmentSubComponentController {
  constructor(
    private readonly assessmentSubComponentService: AssessmentSubComponentService,
  ) {}

  @ApiOperation({
    summary: 'Get all assessment sub-components',
    description: 'Retrieve all sub-components for an assessment',
  })
  @ApiOkResponse({ description: 'Ok', type: [AssessmentSubComponent] })
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
  @Get('assessments/:assessmentId/sub-components')
  async findSubComponents(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
  ) {
    return this.assessmentSubComponentService.findAll(assessmentId);
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
  @Put('assessments/:assessmentId/sub-components/:id')
  async updateSubComponent(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: AssessmentSubComponentDto,
  ) {
    return this.assessmentSubComponentService.update(assessmentId, id, payload);
  }
}
