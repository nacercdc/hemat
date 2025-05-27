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
import { AssessmentComponent } from '../../../database/entities';
import { AuthGuard, Abilities } from '../../../shared/modules';
import {
  PermissionActionEnum,
  PermissionSubjectEnum,
} from '../../../shared/enums';
import { ExceptionResponseDto } from '../../../shared/dtos';
import { AssessmentComponentService } from '../services';
import { AssessmentComponentDto } from '../dtos';

@ApiBearerAuth()
@ApiTags('Assessment Components')
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
export class AssessmentComponentController {
  constructor(
    private readonly assessmentComponentService: AssessmentComponentService,
  ) {}

  @ApiOperation({
    summary: 'Get all assessment components',
    description: 'Retrieve all components for an assessment',
  })
  @ApiOkResponse({ description: 'Ok', type: [AssessmentComponent] })
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
  @Get('assessments/:assessmentId/components')
  async findComponents(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
  ) {
    return this.assessmentComponentService.findAll(assessmentId);
  }

  @ApiOperation({
    summary: 'Update an assessment component',
    description: 'Update an assessment component by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: AssessmentComponent })
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
  @Put('assessments/:assessmentId/components/:id')
  async updateComponent(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: AssessmentComponentDto,
  ) {
    return this.assessmentComponentService.update(assessmentId, id, payload);
  }
}
