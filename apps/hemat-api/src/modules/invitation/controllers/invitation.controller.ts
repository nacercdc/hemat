import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpCode,
  UseGuards,
  ParseUUIDPipe,
  Query,
  Request,
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
import { PermissionActionEnum, PermissionSubjectEnum } from '@shared/enums';
import { ExceptionResponseDto, FindAllResponseDto } from '@shared/dtos';
import { InvitationService } from '../services';
import {
  FindAllInvitationDto,
  FindOneInvitationDto,
  InvitationCreateBulkRequestDto,
  InvitationUpdateRequestDto,
} from '../dtos';
import { Invitation } from '@database/entities';
import { Abilities, AuthDto, AuthGuard } from '@shared/modules';
import { AssessmentRoleGuard } from '../../assessment/guards/assessment-role.guard';
import { AssessmentAbilityUser } from '../../assessment/guards/assessment-ability-user.decorator';
import { AssessmentAbilityDto } from '../../assessment/guards/assessment-ability.dto';

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
@Controller('assessments')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @ApiOperation({
    summary: 'Get invitations for the logged-in user',
    description:
      'Retrieve all invitations for the authenticated user across all assessments',
  })
  @ApiOkResponse({ description: 'Ok' })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Get('me/invitations')
  async findUserInvitations(
    @Request() req: { user: AuthDto },
    @Query() query: FindAllInvitationDto,
  ): Promise<FindAllResponseDto<Invitation>> {
    return this.invitationService.findUserInvitations(req.user, query);
  }
  @ApiOperation({
    summary: 'Get an invitation by ID Without Assessment Context',
    description:
      'Retrieve a specific invitation by its ID without assessment context (must match logged-in user’s email)',
  })
  @ApiOkResponse({ description: 'Ok', type: Invitation })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Get('invitations/:id')
  async findOneInvitation(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() query: FindOneInvitationDto,
    @Request() req: { user: AuthDto },
  ): Promise<Invitation> {
    return this.invitationService.findOneInvitation(id, query, req.user.email);
  }

  @ApiOperation({
    summary: 'Create new invitations',
    description: 'Send multiple invitations to join assessment groups',
  })
  @ApiOkResponse({ description: 'Created', type: [Invitation] })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @ApiBadRequestResponse({
    description: 'Bad request',
    type: ExceptionResponseDto,
  })
  @HttpCode(201)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.CREATE,
        subject: PermissionSubjectEnum.INVITATION,
      },
    ],
    requireAdmin: false,
  })
  @UseGuards(AuthGuard, AssessmentRoleGuard)
  @Post(':assessmentId/invitations')
  async create(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Body() payload: InvitationCreateBulkRequestDto,
    @AssessmentAbilityUser() user: AssessmentAbilityDto,
  ): Promise<Invitation[]> {
    return this.invitationService.createBulk(assessmentId, payload, user);
  }

  @ApiOperation({
    summary: 'Get all invitations for an assessment',
    description: 'Retrieve all invitations for a specific assessment',
  })
  @ApiOkResponse({ description: 'Ok' })
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
  @UseGuards(AuthGuard, AssessmentRoleGuard)
  @Get(':assessmentId/invitations')
  async findAll(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Query() query: FindAllInvitationDto,
  ): Promise<FindAllResponseDto<Invitation>> {
    return this.invitationService.findAll(assessmentId, query);
  }

  @ApiOperation({
    summary: 'Get an invitation by ID',
    description: 'Retrieve a specific invitation by its ID',
  })
  @ApiOkResponse({ description: 'Ok', type: Invitation })
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
  @UseGuards(AuthGuard, AssessmentRoleGuard)
  @Get(':assessmentId/invitations/:id')
  async findOne(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() query: FindOneInvitationDto,
  ): Promise<Invitation> {
    return this.invitationService.findOne(assessmentId, id, query);
  }

  @ApiOperation({
    summary: 'Accept an invitation',
    description:
      'Accept an invitation using invitation ID, email, and optional token',
  })
  @ApiOkResponse({
    description: 'Ok',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        nextStep: { type: 'string', nullable: true },
        registerUrl: { type: 'string', nullable: true },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @ApiBadRequestResponse({
    description: 'Bad request',
    type: ExceptionResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
    type: ExceptionResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ExceptionResponseDto,
  })
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Post(':assessmentId/invitations/accept')
  async accept(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Body() payload: InvitationUpdateRequestDto,
    @Request() req: { user: AuthDto },
  ): Promise<{
    success: boolean;
    message: string;
    nextStep?: string;
    registerUrl?: string;
  }> {
    return this.invitationService.accept(assessmentId, payload, req.user);
  }
}