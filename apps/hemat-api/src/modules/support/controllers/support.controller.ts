import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
  Put,
  Delete,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiUnprocessableEntityResponse,
  ApiTooManyRequestsResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { SupportService } from '../services/support.service';
import { AuthUser } from '@shared/modules/auth/decorators';
import { AuthDto } from '@shared/modules/auth/dtos';
import {
  SupportCreateRequestDto,
  SupportReplyCreateRequestDto,
  SupportResponseDto,
  SupportReplyResponseDto,
} from '../dtos';
import { FindAllResponseDto } from '@shared/dtos';
import { ExceptionResponseDto } from '@shared/dtos';
import { Abilities, AuthGuard } from '../../../shared/modules';
import { PermissionActionEnum, PermissionSubjectEnum } from '@shared/enums';
import { SupportQueryDto } from '../dtos/query-support.dto';

@ApiBearerAuth()
@ApiTags('Support')
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
@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @ApiOperation({
    summary: 'Get all support tickets (admin) or only your tickets (user)',
  })
  @ApiOkResponse({ description: 'Ok', type: FindAllResponseDto })
  @Abilities({
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.SUPPORT,
      },
    ],
  })
  @Get()
  async findAll(
    @AuthUser() user: AuthDto,
    @Query() query: SupportQueryDto,
  ): Promise<FindAllResponseDto<any>> {
    if (user.isAdmin) {
      return this.supportService.findAll(query);
    } else {
      return this.supportService.findAllByUser(user.id, query);
    }
  }

  @ApiOperation({
    summary:
      'Get support replies: admins see all, users see only public replies to their tickets',
  })
  @ApiOkResponse({ description: 'Ok', type: FindAllResponseDto })
  @Abilities({
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.SUPPORT_REPLY,
      },
    ],
  })
  @Get('replies')
  async findAllReplies(
    @AuthUser() user: AuthDto,
    @Query() query: SupportQueryDto,
  ): Promise<FindAllResponseDto<any>> {
    // Admins see all replies (public and internal)
    // Normal users see only public replies to tickets they created
    if (user.isAdmin) {
      return this.supportService.findAllReplies(query);
    } else {
      return this.supportService.findAllRepliesByUser(user.id, query);
    }
  }


  @ApiOperation({ summary: 'Get a support reply by ID' })
  @ApiOkResponse({ description: 'Ok', type: SupportReplyResponseDto })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @Abilities({
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.SUPPORT_REPLY,
      },
    ],
  })
  @Get('replies/:id')
  async findOneReply(
    @AuthUser() user: AuthDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<any> {
    const reply = await this.supportService.findOneReply(id);
    if (!user.isAdmin && reply.support.issuedBy.id !== user.id) {
      throw new ForbiddenException('You do not have access to this reply.');
    }
    return reply;
  }

  @ApiOperation({ summary: 'Get a support ticket by ID' })
  @ApiOkResponse({ description: 'Ok', type: SupportResponseDto })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @Abilities({
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.SUPPORT,
      },
    ],
  })
  @Get(':id')
  async findOne(
    @AuthUser() user: AuthDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<any> {
    const ticket = await this.supportService.findOne(id);
    if (!user.isAdmin && ticket.issuedBy.id !== user.id) {
      throw new ForbiddenException('You do not have access to this ticket.');
    }
    return ticket;
  }

  @ApiOperation({ summary: 'Create a new support ticket' })
  @ApiCreatedResponse({ description: 'Created', type: SupportResponseDto })
  @Abilities({
    permissions: [
      {
        action: PermissionActionEnum.CREATE,
        subject: PermissionSubjectEnum.SUPPORT,
      },
    ],
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @AuthUser() user: AuthDto,
    @Body() dto: SupportCreateRequestDto,
  ): Promise<any> {
    return this.supportService.create(dto, user.id);
  }

  @ApiOperation({ summary: 'Update a support ticket by ID' })
  @ApiOkResponse({ description: 'Ok', type: SupportResponseDto })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: ExceptionResponseDto,
  })
  @Abilities({
    permissions: [
      {
        action: PermissionActionEnum.UPDATE,
        subject: PermissionSubjectEnum.SUPPORT,
      },
    ],
  })
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @AuthUser() user: AuthDto,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: SupportCreateRequestDto,
  ): Promise<any> {
    const ticket = await this.supportService.findOne(id);
    if (ticket.issuedBy.id !== user.id) {
      throw new ForbiddenException('Only the ticket owner can update this ticket.');
    }
    return this.supportService.update(id, dto);
  }

  @ApiOperation({ summary: 'Soft delete a support ticket by ID' })
  @ApiOkResponse({ description: 'Ok', type: SupportResponseDto })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: ExceptionResponseDto,
  })
  @Abilities({
    permissions: [
      {
        action: PermissionActionEnum.DELETE,
        subject: PermissionSubjectEnum.SUPPORT,
      },
    ],
  })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async delete(
    @AuthUser() user: AuthDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<any> {
    const ticket = await this.supportService.findOne(id);
    if (!user.isAdmin && ticket.issuedBy.id !== user.id) {
      throw new ForbiddenException('Only the ticket owner or an admin can delete this ticket.');
    }
    return this.supportService.delete(id);
  }

  @ApiOperation({ summary: 'Restore a soft-deleted support ticket by ID' })
  @ApiOkResponse({ description: 'Ok', type: SupportResponseDto })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: ExceptionResponseDto,
  })
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.RESTORE,
        subject: PermissionSubjectEnum.SUPPORT,
      },
    ],
  })
  @HttpCode(HttpStatus.OK)
  @Post(':id/restore')
  async restore(@Param('id', new ParseUUIDPipe()) id: string): Promise<any> {
    return this.supportService.restore(id);
  }

  @ApiOperation({ summary: 'Reply to a support ticket' })
  @ApiCreatedResponse({ description: 'Created', type: SupportReplyResponseDto })
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.CREATE,
        subject: PermissionSubjectEnum.SUPPORT_REPLY,
      },
    ],
  })
  @HttpCode(HttpStatus.CREATED)
  @Post(':id/reply')
  async reply(
    @Param('id', new ParseUUIDPipe()) id: string,
    @AuthUser() user: AuthDto,
    @Body() dto: SupportReplyCreateRequestDto,
  ): Promise<any> {
    return this.supportService.replyToSupport(id, dto, user.id);
  }
} 