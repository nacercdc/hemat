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
import { AssessmentDomain } from '@africa-cdc/database/entities';
import { AuthGuard, Abilities } from '@africa-cdc/shared/modules';
import {
  PermissionActionEnum,
  PermissionSubjectEnum,
} from '@africa-cdc/shared/enums';
import { ExceptionResponseDto } from '@africa-cdc/shared/dtos';
import { AssessmentDomainService } from '../services';
import { AssessmentDomainDto } from '../dtos';

@ApiBearerAuth()
@ApiTags('Assessment Domains')
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
@Controller('assessments/:assessmentId/domains')
export class AssessmentDomainController {
  constructor(
    private readonly assessmentDomainService: AssessmentDomainService,
  ) {}

  @ApiOperation({
    summary: 'Get all assessment domains',
    description: 'Retrieve all domains for a specific assessment',
  })
  @ApiOkResponse({ description: 'Ok', type: [AssessmentDomain] })
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
  ): Promise<AssessmentDomain[]> {
    return this.assessmentDomainService.findAll(assessmentId);
  }

  @ApiOperation({
    summary: 'Get one assessment domain',
    description: 'Retrieve a specific domain for an assessment',
  })
  @ApiOkResponse({ description: 'Ok', type: AssessmentDomain })
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
  ): Promise<AssessmentDomain> {
    return this.assessmentDomainService.findOne(assessmentId, id);
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
  @Put(':id')
  async update(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: AssessmentDomainDto,
  ): Promise<AssessmentDomain> {
    return this.assessmentDomainService.update(assessmentId, id, payload);
  }
}
