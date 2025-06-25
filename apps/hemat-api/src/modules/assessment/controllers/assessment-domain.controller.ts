import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  HttpCode,
  UseGuards,
  Query,
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
import { AssessmentComponent, AssessmentDomain } from '@database/entities';
import { AuthGuard, Abilities } from '@shared/modules';
import { PermissionActionEnum, PermissionSubjectEnum } from '@shared/enums';
import { ExceptionResponseDto, FindAllResponseDto } from '@shared/dtos';
import { AssessmentDomainService } from '../services';
import {
  AssessmentDomainDto,
  FindAllAssessmentComponentDto,
  FindAllAssessmentDomainDto,
} from '../dtos';
import { ParseUUIDPipe } from '@nestjs/common';

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
@Controller()
export class AssessmentDomainController {
  constructor(
    private readonly assessmentDomainService: AssessmentDomainService,
  ) {}

  @ApiOperation({
    summary: 'Get all assessment domains',
    description:
      'Retrieve all domains for a specific assessment with pagination, sorting, and search',
  })
  @ApiOkResponse({
    description: 'Ok',
    type: FindAllResponseDto<AssessmentDomain>,
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
  @Get('assessments/:assessmentId/domains')
  async findAll(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Query() query: FindAllAssessmentDomainDto,
  ): Promise<FindAllResponseDto<AssessmentDomain>> {
    return this.assessmentDomainService.findAll({ ...query, assessmentId });
  }

  @ApiOperation({
    summary: 'Get assessment domains progress',
    description: 'Get all domains for an assessment with progress for each member/group/role',
  })
  @ApiOkResponse({ description: 'Ok', type: Object })
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
  @Get('assessments/:assessmentId/domains/progress')
  async findAllWithProgress(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
  ) {
    return this.assessmentDomainService.findAllWithProgress(assessmentId);
  }

  @ApiOperation({
    summary: 'Get assessment domains primary progress',
    description: 'Get assessment-level (primary) progress for each domain (isPrimary === true, groupId === null)',
  })
  @ApiOkResponse({ description: 'Ok', type: Object })
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
  @Get('assessments/:assessmentId/domains/primary-progress')
  async findPrimaryProgress(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
  ) {
    return this.assessmentDomainService.findPrimaryProgress(assessmentId);
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
  @Get('assessments/:assessmentId/domains/:id')
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
  @Put('assessments/:assessmentId/domains/:id')
  async update(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: AssessmentDomainDto,
  ): Promise<AssessmentDomain> {
    return this.assessmentDomainService.update(assessmentId, id, payload);
  }

  @ApiOperation({
    summary: 'Get all assessment components for a domain',
    description:
      'Retrieve all components for a specific assessment domain with pagination, sorting, and search',
  })
  @ApiOkResponse({
    description: 'Ok',
    type: FindAllResponseDto<AssessmentComponent>,
  })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(200)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.ASSESSMENT_COMPONENT,
      },
    ],
  })
  @Get('assessmentDomains/:id/components')
  async findComponents(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() query: FindAllAssessmentComponentDto,
  ) {
    return this.assessmentDomainService.findComponents(id, query);
  }

  @ApiOperation({
    summary: 'Get assessment domains group progress',
    description: 'Get group-level progress for each domain for a specific groupId',
  })
  @ApiOkResponse({ description: 'Ok', type: Object })
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
  @Get('assessments/:assessmentId/domains/group-progress/:groupId')
  async findGroupProgress(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
  ) {
    return this.assessmentDomainService.findGroupProgress(assessmentId, groupId);
  }
}
