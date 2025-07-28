import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  UseGuards,
  ParseUUIDPipe,
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
  ApiUnprocessableEntityResponse,
  ApiTooManyRequestsResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard, Abilities } from '../../../shared/modules';
import {
  PermissionActionEnum,
  PermissionSubjectEnum,
} from '../../../shared/enums';
import { ExceptionResponseDto, FindAllResponseDto } from '../../../shared/dtos';
import { AssessmentGroupService } from '../services';
import {
  AssessmentGroupUpdateRequestDto,
  FindAllAssessmentGroupDto,
  FindOneAssessmentGroupDto,
} from '../dtos';
import { AssessmentGroup } from '../../../database/entities';
import { AssessmentRoleGuard } from '../guards/assessment-role.guard';
import { AssessmentAbilityUser } from '../guards/assessment-ability-user.decorator';
import { AssessmentAbilityDto } from '../guards/assessment-ability.dto';
import { MemberRole } from '../../../shared/enums';
import { AssessmentDomainDto } from '../dtos/assessment-domain.dto';

@ApiBearerAuth()
@ApiTags('Assessment Groups')
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
@Controller('assessments/:assessmentId/groups')
export class AssessmentGroupController {
  constructor(
    private readonly assessmentGroupService: AssessmentGroupService,
  ) {}

  @ApiOperation({
    summary: 'Get an assessment group by ID',
    description:
      'Retrieve a specific assessment group by its ID for an assessment',
  })
  @ApiOkResponse({ description: 'Ok', type: AssessmentGroup })
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
    requireAdmin: false, // Allow non-admins to proceed to AssessmentRoleGuard
  })
  @UseGuards(AssessmentRoleGuard)
  @Get(':id')
  async findOne(
    @AssessmentAbilityUser() user: AssessmentAbilityDto,
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() query: FindOneAssessmentGroupDto,
  ): Promise<AssessmentGroup> {
    const { isAdmin, assessmentRole, assessmentGroupId } = user;

    // Admins can see any group
    if (isAdmin) {
      return this.assessmentGroupService.findOne(assessmentId, id, query);
    }

    // Primary members can see any group
    if (assessmentRole === MemberRole.PRIMARY) {
      return this.assessmentGroupService.findOne(assessmentId, id, query);
    }

    // Team leaders and members can only see their own group
    if (
      assessmentRole === MemberRole.TEAM_LEADER ||
      assessmentRole === MemberRole.MEMBER
    ) {
      if (assessmentGroupId === id) {
        return this.assessmentGroupService.findOne(assessmentId, id, query);
      } else {
        throw new ForbiddenException('You can only access your own group');
      }
    }

    throw new ForbiddenException('Invalid role for accessing groups');
  }

  @ApiOperation({
    summary: 'Get all assessment groups',
    description: 'Retrieve all assessment groups for a specific assessment',
  })
  @ApiOkResponse({ description: 'Ok', type: [AssessmentGroup] })
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
    requireAdmin: false, // Allow non-admins to proceed to AssessmentRoleGuard
  })
  @UseGuards(AssessmentRoleGuard)
  @Get()
  async findAll(
    @AssessmentAbilityUser() user: AssessmentAbilityDto,
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Query() query: FindAllAssessmentGroupDto,
  ): Promise<FindAllResponseDto<AssessmentGroup>> {
    const { isAdmin, assessmentRole, assessmentGroupId } = user;

    // Admins can see all groups
    if (isAdmin) {
      return this.assessmentGroupService.findAll(assessmentId, query);
    }

    // Primary members can see all groups
    if (assessmentRole === MemberRole.PRIMARY) {
      return this.assessmentGroupService.findAll(assessmentId, query);
    }

    // Team leaders and members can only see their own group
    if (
      assessmentRole === MemberRole.TEAM_LEADER ||
      assessmentRole === MemberRole.MEMBER
    ) {
      if (assessmentGroupId) {
        // Filter to only show their group
        return this.assessmentGroupService.findAll(assessmentId, {
          ...query,
          filterByGroupIds: [assessmentGroupId],
        });
      } else {
        throw new ForbiddenException(
          'You must be assigned to a group to view groups',
        );
      }
    }

    throw new ForbiddenException('Invalid role for accessing groups');
  }

  @ApiOperation({
    summary: 'Update an assessment group',
    description: 'Update an assessment group by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: AssessmentGroup })
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
    @Body() payload: AssessmentGroupUpdateRequestDto,
  ): Promise<AssessmentGroup> {
    return this.assessmentGroupService.update(assessmentId, id, payload);
  }

  @ApiOperation({
    summary: 'Delete an assessment group',
    description: 'Soft delete an assessment group by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: AssessmentGroup })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(200)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.DELETE,
        subject: PermissionSubjectEnum.ASSESSMENT,
      },
    ],
  })
  @Delete(':id')
  async delete(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<AssessmentGroup> {
    return this.assessmentGroupService.delete(assessmentId, id);
  }

  @ApiOperation({
    summary: 'Attach domains to a group',
    description:
      'Assign or update domains for a group. Replaces all domains for the group with the provided list.',
  })
  @ApiOkResponse({ description: 'Ok', type: AssessmentGroup })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(200)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.UPDATE,
        subject: PermissionSubjectEnum.ASSESSMENT_GROUP,
      },
    ],
    requireAdmin: false,
  })
  @UseGuards(AuthGuard, AssessmentRoleGuard)
  @Post(':groupId/domains')
  async attachDomains(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Body('domainIds') domainIds: string[],
    @AssessmentAbilityUser() user: AssessmentAbilityDto,
  ): Promise<AssessmentGroup> {
    return this.assessmentGroupService.attachDomains(
      assessmentId,
      groupId,
      domainIds,
      user,
    );
  }

  @ApiOperation({
    summary: 'Detach domains from a group',
    description:
      'Remove a specific domain from a group. Only removes the specified domain, leaving other domains intact.',
  })
  @ApiOkResponse({ description: 'Ok', type: AssessmentGroup })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(200)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.UPDATE,
        subject: PermissionSubjectEnum.ASSESSMENT_GROUP,
      },
    ],
    requireAdmin: false,
  })
  @UseGuards(AuthGuard, AssessmentRoleGuard)
  @Delete(':groupId/domains')
  async detachDomains(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Body('domainId') domainId: string,
    @AssessmentAbilityUser() user: AssessmentAbilityDto,
  ): Promise<AssessmentGroup> {
    return this.assessmentGroupService.detachDomains(
      assessmentId,
      groupId,
      [domainId],
      user,
    );
  }

  @ApiOperation({
    summary: 'Get domains of an assessment group',
    description: 'Retrieve all domains associated with a specific assessment group',
  })
  @ApiOkResponse({ description: 'Ok', type: [AssessmentDomainDto] })
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
  @Get(':groupId/domains')
  async getDomainsForGroup(
    @AssessmentAbilityUser() user: AssessmentAbilityDto,
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
  ) {
    // Permission logic: allow if user can access the group (same as findOne)
    const { isAdmin, assessmentRole, assessmentGroupId } = user;
    if (
      isAdmin ||
      assessmentRole === MemberRole.PRIMARY ||
      (assessmentRole === MemberRole.TEAM_LEADER && assessmentGroupId === groupId) ||
      (assessmentRole === MemberRole.MEMBER && assessmentGroupId === groupId)
    ) {
      return this.assessmentGroupService.getDomainsForGroup(assessmentId, groupId);
    }
    throw new ForbiddenException('You can only access your own group');
  }
}
