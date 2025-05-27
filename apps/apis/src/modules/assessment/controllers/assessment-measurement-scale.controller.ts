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
import { AssessmentMeasurementScale } from '../../../database/entities';
import { AuthGuard, Abilities } from '../../../shared/modules';
import {
  PermissionActionEnum,
  PermissionSubjectEnum,
} from '../../../shared/enums';
import { ExceptionResponseDto } from '../../../shared/dtos';
import { AssessmentMeasurementScaleService } from '../services';
import { AssessmentMeasurementScaleDto } from '../dtos';

@ApiBearerAuth()
@ApiTags('Assessment Measurement Scales')
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
export class AssessmentMeasurementScaleController {
  constructor(
    private readonly assessmentMeasurementScaleService: AssessmentMeasurementScaleService,
  ) {}

  @ApiOperation({
    summary: 'Get all measurement scales for a sub-component',
    description:
      'Retrieve all measurement scales associated with a sub-component',
  })
  @ApiOkResponse({ description: 'Ok', type: [AssessmentMeasurementScale] })
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
  @Get('sub-components/:subComponentId/measurement-scales')
  async findMeasurementScalesBySubComponent(
    @Param('subComponentId', new ParseUUIDPipe()) subComponentId: string,
  ) {
    return this.assessmentMeasurementScaleService.findAllBySubComponent(
      subComponentId,
    );
  }

  @ApiOperation({
    summary: 'Update an assessment measurement scale',
    description:
      'Update an assessment measurement scale by ID for a sub-component',
  })
  @ApiOkResponse({ description: 'Ok', type: AssessmentMeasurementScale })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: ExceptionResponseDto,
  })
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
  @Put('sub-components/:subComponentId/measurement-scales/:id')
  async updateMeasurementScale(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('subComponentId', new ParseUUIDPipe()) subComponentId: string,
    @Body() payload: AssessmentMeasurementScaleDto,
  ) {
    return this.assessmentMeasurementScaleService.update(
      id,
      subComponentId,
      payload,
    );
  }
}
