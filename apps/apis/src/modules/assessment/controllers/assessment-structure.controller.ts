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
import {
  AssessmentDomain,
  AssessmentComponent,
  AssessmentSubComponent,
  AssessmentMeasurementScale,
  AssessmentMeasurementScaleSubComponent,
} from '../../../database/entities';
import { AuthGuard, Abilities } from '../../../shared/modules';
import {
  PermissionActionEnum,
  PermissionSubjectEnum,
} from '../../../shared/enums';
import { ExceptionResponseDto } from '../../../shared/dtos';
import { AssessmentStructureService } from '../services';
import {
  AssessmentDomainUpdateRequestDto,
  AssessmentComponentUpdateRequestDto,
  AssessmentSubComponentUpdateRequestDto,
  AssessmentMeasurementScaleUpdateRequestDto,
  AssessmentMeasurementScaleSubComponentUpdateRequestDto,
} from '../dtos';

@ApiBearerAuth()
@ApiTags('Assessment Structures')
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
export class AssessmentStructureController {
  constructor(
    private readonly assessmentStructureService: AssessmentStructureService,
  ) {}

  // Assessment Domain Endpoints
  @ApiOperation({
    summary: 'Get all assessment domains',
    description: 'Retrieve all domains for an assessment',
  })
  @ApiOkResponse({ description: 'Ok', type: [AssessmentDomain] })
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
  @Get('assessments/:assessmentId/domains')
  async findDomains(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
  ) {
    return this.assessmentStructureService.findDomains(assessmentId);
  }

  @ApiOperation({
    summary: 'Update an assessment domain',
    description: 'Update an assessment domain by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: AssessmentDomain })
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
  @Put('assessments/:assessmentId/domains/:id')
  async updateDomain(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: AssessmentDomainUpdateRequestDto,
  ) {
    return this.assessmentStructureService.updateDomain(id, payload);
  }

  // Assessment Component Endpoints
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
    return this.assessmentStructureService.findComponents(assessmentId);
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
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: AssessmentComponentUpdateRequestDto,
  ) {
    return this.assessmentStructureService.updateComponent(id, payload);
  }

  // Assessment SubComponent Endpoints
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
    return this.assessmentStructureService.findSubComponents(assessmentId);
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
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: AssessmentSubComponentUpdateRequestDto,
  ) {
    return this.assessmentStructureService.updateSubComponent(id, payload);
  }

  // Assessment Measurement Scale Endpoints
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
    return this.assessmentStructureService.findMeasurementScalesBySubComponent(
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
    @Body() payload: AssessmentMeasurementScaleUpdateRequestDto,
  ) {
    return this.assessmentStructureService.updateMeasurementScale(
      id,
      subComponentId,
      payload,
    );
  }

  // Assessment Measurement Scale SubComponent Endpoints
  @ApiOperation({
    summary: 'Get all assessment measurement scale sub-components',
    description:
      'Retrieve all measurement scale sub-components for an assessment',
  })
  @ApiOkResponse({
    description: 'Ok',
    type: [AssessmentMeasurementScaleSubComponent],
  })
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
  @Get('assessments/:assessmentId/measurement-scale-sub-components')
  async findMeasurementScaleSubComponents(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
  ) {
    return this.assessmentStructureService.findMeasurementScaleSubComponents(
      assessmentId,
    );
  }

  @ApiOperation({
    summary: 'Update an assessment measurement scale sub-component',
    description: 'Update an assessment measurement scale sub-component by ID',
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
  @Put('assessments/:assessmentId/measurement-scale-sub-components/:id')
  async updateMeasurementScaleSubComponent(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: AssessmentMeasurementScaleSubComponentUpdateRequestDto,
  ) {
    return this.assessmentStructureService.updateMeasurementScaleSubComponent(
      id,
      payload,
    );
  }
}
