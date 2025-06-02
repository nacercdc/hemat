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
import {
  AuthGuard,
  Abilities,
  PermissionActionEnum,
  PermissionSubjectEnum,
} from '@africa-cdc/shared';
import { ExceptionResponseDto } from '@africa-cdc/shared/dtos';
import { InvitationService } from '../services';
import {
  InvitationCreateRequestDto,
  InvitationUpdateRequestDto,
} from '../dtos';
import { Invitation } from '@africa-cdc/database/entities';

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
@Controller('assessments/:assessmentId/invitations')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @ApiOperation({
    summary: 'Create a new invitation',
    description: 'Send an invitation to a user to join an assessment group',
  })
  @ApiOkResponse({ description: 'Created', type: Invitation })
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
    @Body() payload: InvitationCreateRequestDto,
  ): Promise<Invitation> {
    return this.invitationService.create(assessmentId, payload);
  }

  @ApiOperation({
    summary: 'Get all invitations for an assessment',
    description: 'Retrieve all invitations for a specific assessment',
  })
  @ApiOkResponse({ description: 'Ok', type: [Invitation] })
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
  ): Promise<Invitation[]> {
    return this.invitationService.findAll(assessmentId);
  }

  @ApiOperation({
    summary: 'Accept an invitation',
    description: 'Accept an invitation using email and token',
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
  @HttpCode(200)
  @Post('accept')
  async accept(@Body() payload: InvitationUpdateRequestDto): Promise<{
    success: boolean;
    message: string;
    nextStep?: string;
    registerUrl?: string;
  }> {
    return this.invitationService.accept(payload);
  }
}

