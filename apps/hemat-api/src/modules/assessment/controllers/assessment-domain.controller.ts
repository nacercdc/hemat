import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  HttpCode,
  UseGuards,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AssessmentComponent, AssessmentDomain } from '@database/entities';
import { AuthGuard, Abilities } from '@shared/modules/auth';
import { PermissionActionEnum, PermissionSubjectEnum } from '@shared/enums';
import { ExceptionResponseDto, FindAllResponseDto } from '@shared/dtos';
import { AssessmentDomainService } from '../services/assessment-domain.service';
import {
  AssessmentDomainDto,
  FindAllAssessmentComponentDto,
  FindAllAssessmentDomainDto,
} from '../dtos';
import { ParseUUIDPipe } from '@nestjs/common';
import { AssessmentRoleGuard } from '../guards/assessment-role.guard';
import { AssessmentAbilityUser } from '../guards/assessment-ability-user.decorator';
import { AssessmentAbilityDto } from '../guards/assessment-ability.dto';
import { MemberRole } from '@shared/enums/member.enum';

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
  @UseGuards(AssessmentRoleGuard)
  @Get('assessments/:assessmentId/domains')
  async findAll(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Query() query: FindAllAssessmentDomainDto,
  ): Promise<FindAllResponseDto<AssessmentDomain>> {
    return this.assessmentDomainService.findAll({ ...query, assessmentId });
  }

  @ApiOperation({
    summary: 'Get all assessment domains',
    description:
      'Retrieve all domains for a specific assessment with translations based on user role',
  })
  @ApiOkResponse({ description: 'Ok', type: Object })
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
    requireAdmin: false,
  })
  @UseGuards(AssessmentRoleGuard)
  @Get('assessments/:assessmentId/assessment-domains')
  async getDomains(
    @AssessmentAbilityUser() user: AssessmentAbilityDto,
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Query('language') language: string = 'en',
  ): Promise<any> {
    const { isAdmin, assessmentRole, assessmentGroupId } = user;

    if (isAdmin) {
      return this.assessmentDomainService.getDomains(language);
    }

    if (assessmentRole === MemberRole.PRIMARY) {
      return this.assessmentDomainService.getDomains(language);
    }

    if (
      assessmentRole === MemberRole.TEAM_LEADER ||
      assessmentRole === MemberRole.MEMBER
    ) {
      if (assessmentGroupId) {
        return this.assessmentDomainService.getDomainsByGroup(
          assessmentId,
          assessmentGroupId,
          language,
        );
      } else {
        throw new ForbiddenException(
          'You must be assigned to a group to view domains',
        );
      }
    }

    throw new ForbiddenException('Invalid role for accessing domains');
  }

  @ApiOperation({
    summary: 'Get assessment domains progress',
    description: 'Get progress for domains in an assessment based on user role',
  })
  @ApiOkResponse({ description: 'Ok', type: Object })
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
    requireAdmin: false,
  })
  @UseGuards(AssessmentRoleGuard)
  @Get('assessments/:assessmentId/domains/progress')
  async getDomainProgress(
    @AssessmentAbilityUser() user: AssessmentAbilityDto,
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Query('language') language: string = 'en',
  ) {
    const { assessmentRole, assessmentGroupId, isAdmin } = user;

    if (isAdmin) {
      return this.assessmentDomainService.getProgress(
        assessmentId,
        user.id,
        language,
      );
    }

    if (!assessmentGroupId) {
      throw new ForbiddenException('Assessment group ID is missing');
    }

    if (assessmentRole === MemberRole.PRIMARY) {
      return this.assessmentDomainService.getProgress(
        assessmentId,
        user.id,
        language,
      );
    } else if (assessmentRole === MemberRole.TEAM_LEADER) {
      return this.assessmentDomainService.getProgress(
        assessmentId,
        user.id,
        language,
        {
          filterByGroupIds: [assessmentGroupId],
          includePrimary: true,
        },
      );
    } else if (assessmentRole === MemberRole.MEMBER) {
      return this.assessmentDomainService.getProgress(
        assessmentId,
        user.id,
        language,
        {
          filterByGroupIds: [assessmentGroupId],
        },
      );
    }

    throw new ForbiddenException('Invalid role for accessing progress');
  }

  @ApiOperation({
    summary: 'Get primary assessment domains progress',
    description:
      'Get progress for domains in an assessment based on primary answers (isPrimary = true)',
  })
  @ApiOkResponse({ description: 'Ok', type: Object })
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
    requireAdmin: false,
  })
  @UseGuards(AssessmentRoleGuard)
  @Get('assessments/:assessmentId/domains/progress/primary')
  async getPrimaryProgress(
    @AssessmentAbilityUser() user: AssessmentAbilityDto,
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Query('language') language: string = 'en',
  ) {
    const { isAdmin } = user;

    if (isAdmin || user.assessmentRole) {
      return this.assessmentDomainService.getProgressPrimary(
        assessmentId,
        language,
      );
    }

    throw new ForbiddenException(
      'You must be a member of this assessment to access primary progress',
    );
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
  @UseGuards(AssessmentRoleGuard)
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
  @UseGuards(AssessmentRoleGuard)
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
  @UseGuards(AssessmentRoleGuard)
  @Get('assessmentDomains/:id/components')
  async findComponents(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() query: FindAllAssessmentComponentDto,
    @Query('language') language?: string,
  ) {
    return this.assessmentDomainService.findComponents(id, {
      ...query,
      language,
    });
  }
}
