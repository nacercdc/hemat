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
import { AssessmentMeasurementScaleSubComponent } from '../../../database/entities';
import { AuthGuard, Abilities } from '../../../shared/modules';
import {
  PermissionActionEnum,
  PermissionSubjectEnum,
} from '../../../shared/enums';
import { ExceptionResponseDto } from '../../../shared/dtos';
import { AssessmentMeasurementScaleSubComponentService } from '../services';
import { AssessmentMeasurementScaleSubComponentDto } from '../dtos';

@ApiBearerAuth()
@ApiTags('Assessment Measurement Scale Sub-Components')
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
@Controller('sub-components/:subComponentId/measurement-scales')
export class AssessmentMeasurementScaleSubComponentController {
  constructor(
    private readonly assessmentMeasurementScaleSubComponentService: AssessmentMeasurementScaleSubComponentService,
  ) {}

  @ApiOperation({
    summary: 'Get all assessment measurement scale sub-components',
    description:
      'Retrieve all measurement scale sub-components for a specific assessment',
  })
  @ApiOkResponse({
    description: 'Ok',
    type: [AssessmentMeasurementScaleSubComponent],
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
    @Param('subComponentId', new ParseUUIDPipe()) subComponentId: string,
  ): Promise<AssessmentMeasurementScaleSubComponent[]> {
    return this.assessmentMeasurementScaleSubComponentService.findAll(
      subComponentId,
    );
  }

  @ApiOperation({
    summary: 'Get one assessment measurement scale sub-component',
    description:
      'Retrieve one measurement scale sub-component for a specific assessment',
  })
  @ApiOkResponse({
    description: 'Ok',
    type: AssessmentMeasurementScaleSubComponent,
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
  @Get(':id')
  async findOne(
    @Param('subComponentId', new ParseUUIDPipe()) subComponentId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<AssessmentMeasurementScaleSubComponent> {
    return this.assessmentMeasurementScaleSubComponentService.findOne(
      subComponentId,
      id,
    );
  }

  @ApiOperation({
    summary: 'Update an assessment measurement scale sub-component',
    description:
      'Update an assessment measurement scale sub-component by ID for a specific assessment',
  })
  @ApiOkResponse({
    description: 'Ok',
    type: AssessmentMeasurementScaleSubComponent,
  })
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
    @Param('subComponentId', new ParseUUIDPipe()) subComponentId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: AssessmentMeasurementScaleSubComponentDto,
  ): Promise<AssessmentMeasurementScaleSubComponent> {
    return this.assessmentMeasurementScaleSubComponentService.update(
      subComponentId,
      id,
      payload,
    );
  }
}
