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
  NotFoundException,
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
  ApiBody,
} from '@nestjs/swagger';W
import { AuthGuard, Abilities } from '../../../shared/modules';
import {
  PermissionActionEnum,
  PermissionSubjectEnum,
} from '../../../shared/enums';
import { ExceptionResponseDto, FindAllResponseDto } from '../../../shared/dtos';
import { AssessmentMemberService } from '../services';
import {
  AssessmentMemberCreateRequestDto,
  AssessmentMemberUpdateRequestDto,
  AssessmentMemberMoveSimpleDto,
} from '../dtos/assessment-member.dto';
import { AssessmentMember } from '../../../database/entities';
import {
  FindAllAssessmentMemberDto,
  FindOneAssessmentMemberDto,
} from '../dtos';
import { Not } from 'typeorm';
import { MemberRole } from '../../../shared/enums';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

@ApiBearerAuth()
@ApiTags('Assessment Members')
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
@Controller('assessments/:assessmentId/members')
export class AssessmentMemberController {
  constructor(
    private readonly assessmentMemberService: AssessmentMemberService,
  ) {}

  @ApiOperation({
    summary: 'Create an assessment member',
    description: 'Add a user to an assessment group with a specific role',
  })
  @ApiOkResponse({ description: 'Ok', type: AssessmentMember })
  @HttpCode(201)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.CREATE,
        subject: PermissionSubjectEnum.ASSESSMENT,
      },
    ],
  })
  @Post()
  async create(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Body() payload: AssessmentMemberCreateRequestDto,
  ): Promise<AssessmentMember> {
    return this.assessmentMemberService.create(assessmentId, payload);
  }

  @ApiOperation({
    summary: 'Get an assessment member by user ID',
    description: 'Retrieve a specific assessment member by its user ID',
  })
  @ApiOkResponse({ description: 'Ok', type: AssessmentMember })
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
    @Query() query: FindOneAssessmentMemberDto,
  ): Promise<AssessmentMember> {
    return this.assessmentMemberService.findOne(assessmentId, id, query);
  }

  @ApiOperation({
    summary: 'Get all assessment members',
    description: 'Retrieve all members of an assessment',
  })
  @ApiOkResponse({ description: 'Ok', type: [AssessmentMember] })
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
    @Query() query: FindAllAssessmentMemberDto,
  ): Promise<FindAllResponseDto<AssessmentMember>> {
    return this.assessmentMemberService.findAll(assessmentId, query);
  }

  @ApiOperation({
    summary: 'Move an assessment member to a group',
    description:
      'Move a single member to a new group. Example:\n{\n  "userId": "397ffc1c-e36b-45cc-a6a6-d00cb08bf69e",\n  "toGroupId": "9620d61c-3de2-4861-94f4-7aa8f2a8adf9",\n  "promoteUserId": "9b5cc889-f40a-45d4-8d22-8ae30c04a3cd"\n}',
  })
  @ApiBody({
    type: AssessmentMemberMoveSimpleDto,
    schema: {
      example: {
        userId: '397ffc1c-e36b-45cc-a6a6-d00cb08bf69e',
        toGroupId: '9620d61c-3de2-4861-94f4-7aa8f2a8adf9',
        promoteUserId: '9b5cc889-f40a-45d4-8d22-8ae30c04a3cd',
      },
    },
  })
  @Post('move')
  async moveMember(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Body() payload: AssessmentMemberMoveSimpleDto,
  ): Promise<AssessmentMember> {
    return this.assessmentMemberService.moveMember(assessmentId, payload);
  }

  @ApiOperation({
    summary: 'Update an assessment member',
    description:
      'Update the role of an assessment member by ID.\n\nExample: Update MEMBER to TEAM_LEADER, promote another MEMBER in the group.\nRequest body:\n{\n  "role": "TEAM_LEADER",\n  "promoteUserId": "other-member-uuid"\n}\n\nExample: Update PRIMARY to TEAM_LEADER, promote a TEAM_LEADER in any group to PRIMARY.\nRequest body:\n{\n  "role": "TEAM_LEADER",\n  "promoteUserId": "team-leader-uuid"\n}\n',
  })
  @ApiBody({
    schema: {
      example: {
        role: 'TEAM_LEADER',
        promoteUserId: 'other-member-uuid',
      },
    },
  })
  @Put(':id')
  async update(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: AssessmentMemberUpdateRequestDto,
  ): Promise<AssessmentMember> {
    return this.assessmentMemberService.update(assessmentId, id, payload);
  }

  @ApiOperation({
    summary: 'Delete an assessment member',
    description: 'Soft delete an assessment member by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: AssessmentMember })
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
  ): Promise<AssessmentMember> {
    return this.assessmentMemberService.delete(assessmentId, id);
  }
}