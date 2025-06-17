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
import { Abilities, AuthGuard } from '@shared/modules';

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
        subject: PermissionSubjectEnum.ASSESSMENT,
      },
    ],
  })
  @Post()
  async create(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Body() payload: InvitationCreateBulkRequestDto,
  ): Promise<Invitation[]> {
    return this.invitationService.createBulk(assessmentId, payload);
  }

  @ApiOperation({
    summary: 'Get all invitations for an assessment',
    description: 'Retrieve all invitations for a specific assessment',
  })
  // @ApiOkResponse({ description: 'Ok', type: FindAllResponseDto(Invitation) })
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
  @Get(':id')
  async findOne(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() query: FindOneInvitationDto,
  ): Promise<Invitation> {
    return this.invitationService.findOne(assessmentId, id, query);
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