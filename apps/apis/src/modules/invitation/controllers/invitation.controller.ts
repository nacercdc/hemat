import {
  Controller,
  Post,
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
import { AuthGuard, Abilities } from '../../../shared';
import { PermissionActionEnum, PermissionSubjectEnum } from '../../../shared';
import { ExceptionResponseDto } from '../../../shared/dtos';
import { InvitationService } from '../services';
import {
  InvitationCreateRequestDto,
  InvitationUpdateRequestDto,
  InvitationResponseDto,
} from '../dtos';
import { Invitation } from '../../../database/entities';

@ApiBearerAuth()
@ApiTags('Invitations')
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
@Controller('invitations')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @ApiOperation({
    summary: 'Create a new invitation',
    description: 'Send an invitation to a user to join an assessment group',
  })
  @ApiOkResponse({ description: 'Ok', type: InvitationResponseDto })
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
    @Body() payload: InvitationCreateRequestDto,
  ): Promise<Invitation> {
    return this.invitationService.create(payload);
  }

  @ApiOperation({
    summary: 'Get invitations by assessment ID',
    description: 'Retrieve all invitations for a specific assessment',
  })
  @ApiOkResponse({ description: 'Ok', type: [InvitationResponseDto] })
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
  ): Promise<Invitation[]> {
    return this.invitationService.findByAssessmentId(assessmentId);
  }

  @ApiOperation({
    summary: 'Update an invitation',
    description: 'Update the status of an invitation by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: InvitationResponseDto })
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
    @Body() payload: InvitationUpdateRequestDto,
  ): Promise<Invitation> {
    return this.invitationService.update({ id }, payload);
  }
}
