// src/assessment-group/controllers/member.controller.ts
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
import { MemberService } from '../services';
import {
  MemberCreateRequestDto,
  MemberUpdateRequestDto,
  MemberResponseDto,
} from '../dtos';
import { AssessmentMember } from '../../../database/entities';

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
@Controller('assessment-members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @ApiOperation({
    summary: 'Create a new assessment member',
    description: 'Add a user to an assessment group with a specific role',
  })
  @ApiOkResponse({ description: 'Ok', type: MemberResponseDto })
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
    @Body() payload: MemberCreateRequestDto,
  ): Promise<AssessmentMember> {
    return this.memberService.create(payload);
  }

  @ApiOperation({
    summary: 'Get members by group ID',
    description: 'Retrieve all members of a specific group',
  })
  @ApiOkResponse({ description: 'Ok', type: [MemberResponseDto] })
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
  @Get('group/:groupId')
  async findByGroupId(
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
  ): Promise<AssessmentMember[]> {
    return this.memberService.findByGroupId(groupId);
  }

  @ApiOperation({
    summary: 'Update an assessment member',
    description: 'Update the role of an assessment member by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: MemberResponseDto })
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
    @Body() payload: MemberUpdateRequestDto,
  ): Promise<AssessmentMember> {
    return this.memberService.update({ id }, payload);
  }

  @ApiOperation({
    summary: 'Delete an assessment member',
    description: 'Soft delete an assessment member by ID',
  })
  @ApiOkResponse({ description: 'Ok' })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(204)
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
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.memberService.delete({ id });
  }
}
