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
import { AssessmentMemberService } from '../dtos/services';
import {
  AssessmentMemberCreateRequestDto,
  AssessmentMemberUpdateRequestDto,
} from '../dtos/assessment-member.dto';
import { AssessmentMember } from '../../../database/entities';
import { FindAllAssessmentMemberDto, FindOneAssessmentMemberDto } from '../dtos';

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
@Controller('assessments/:assessmentId/groups/:groupId/members')
export class AssessmentMemberController {
  constructor(
    private readonly assessmentMemberService: AssessmentMemberService,
  ) {}

  @ApiOperation({
    summary: 'Create an assessment group member',
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
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Body() payload: AssessmentMemberCreateRequestDto,
  ): Promise<AssessmentMember> {
    return this.assessmentMemberService.create(assessmentId, groupId, payload);
  }

  @ApiOperation({
    summary: 'Get an assessment group member by ID',
    description: 'Retrieve a specific assessment group member by its ID',
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
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() query: FindOneAssessmentMemberDto,
  ): Promise<AssessmentMember> {
    return this.assessmentMemberService.findOne(
      assessmentId,
      groupId,
      id,
      query,
    );
  }

  @ApiOperation({
    summary: 'Get all assessment group members',
    description: 'Retrieve all members of an assessment group',
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
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Query() query: FindAllAssessmentMemberDto,
  ): Promise<FindAllResponseDto<AssessmentMember>> {
    return this.assessmentMemberService.findAll(assessmentId, groupId, query);
  }

  @ApiOperation({
    summary: 'Update an assessment group member',
    description: 'Update the role of an assessment group member by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: AssessmentMember })
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
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: AssessmentMemberUpdateRequestDto,
  ): Promise<AssessmentMember> {
    return this.assessmentMemberService.update(
      assessmentId,
      groupId,
      id,
      payload,
    );
  }

  @ApiOperation({
    summary: 'Delete an assessment group member',
    description: 'Soft delete an assessment group member by ID',
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
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<AssessmentMember> {
    return this.assessmentMemberService.delete(assessmentId, groupId, id);
  }
}
