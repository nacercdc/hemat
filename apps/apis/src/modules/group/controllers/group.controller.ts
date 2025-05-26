// src/assessment-group/controllers/group.controller.ts
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
import { ExceptionResponseDto } from '../../../shared/dtos';
import { GroupService } from '../services';
import {
  GroupCreateRequestDto,
  GroupUpdateRequestDto,
  GroupResponseDto,
} from '../dtos';
import { AssessmentGroup } from '../../../database/entities';

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
@Controller('assessment-groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({
    summary: 'Create a new assessment group',
    description: 'Create a new group for an assessment',
  })
  @ApiOkResponse({ description: 'Ok', type: GroupResponseDto })
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
    @Body() payload: GroupCreateRequestDto,
  ): Promise<AssessmentGroup> {
    return this.groupService.create(payload);
  }

  @ApiOperation({
    summary: 'Get groups by assessment ID',
    description: 'Retrieve all groups for a specific assessment',
  })
  @ApiOkResponse({ description: 'Ok', type: [GroupResponseDto] })
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
  @Get('assessment/:assessmentId')
  async findByAssessmentId(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
  ): Promise<AssessmentGroup[]> {
    return this.groupService.findByAssessmentId(assessmentId);
  }

  @ApiOperation({
    summary: 'Update an assessment group',
    description: 'Update an assessment group by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: GroupResponseDto })
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
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: GroupUpdateRequestDto,
  ): Promise<AssessmentGroup> {
    return this.groupService.update({ id }, payload);
  }

  @ApiOperation({
    summary: 'Delete an assessment group',
    description: 'Soft delete an assessment group by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: GroupResponseDto })
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
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<AssessmentGroup> {
    return this.groupService.delete({ id });
  }
}
