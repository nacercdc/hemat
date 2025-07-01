import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  ParseUUIDPipe,
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
import {
  SupportCreateRequestDto,
  SupportReplyCreateRequestDto,
  SupportResponseDto,
  SupportReplyResponseDto,
} from '../dtos';
import { ExceptionResponseDto } from '@shared/dtos';
import { AuthGuard } from '@nestjs/passport';
// import { Abilities } from '@shared/modules';

@ApiBearerAuth()
@ApiTags('Support')
@ApiBadRequestResponse({ description: 'Bad Request', type: ExceptionResponseDto })
@ApiUnauthorizedResponse({ description: 'Unauthorized', type: ExceptionResponseDto })
@ApiForbiddenResponse({ description: 'Forbidden', type: ExceptionResponseDto })
@ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity', type: ExceptionResponseDto })
@ApiTooManyRequestsResponse({ description: 'Too Many Requests', type: ExceptionResponseDto })
@Controller('support')
@UseGuards(AuthGuard('jwt'))
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @ApiOperation({ summary: 'Get all support tickets' })
  @ApiOkResponse({ description: 'Ok', type: [SupportResponseDto] })
  @Get()
  async getAll(@Request() req: { user: any }) {
    // Only admin can see all, others see their own
    if (req.user.isAdmin) {
      return this.supportService.getAllSupports();
    }
    // Otherwise, filter by issuedBy
    return this.supportService.getAllSupportsByUser(req.user.id);
  }

  @ApiOperation({ summary: 'Get a support ticket by ID' })
  @ApiOkResponse({ description: 'Ok', type: SupportResponseDto })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @Get(':id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string, @Request() req: { user: any }) {
    const ticket = await this.supportService.getSupportById(id);
    if (req.user.isAdmin || ticket.issuedBy?.id === req.user.id) {
      return ticket;
    }
    throw new ForbiddenException('You do not have access to this support ticket');
  }

  @ApiOperation({ summary: 'Create a new support ticket' })
  @ApiCreatedResponse({ description: 'Created', type: SupportResponseDto })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Request() req: { user: any },
    @Body() dto: SupportCreateRequestDto,
  ): Promise<SupportResponseDto> {
    return this.supportService.createSupport(dto, req.user);
  }

  @ApiOperation({ summary: 'Reply to a support ticket' })
  @ApiCreatedResponse({ description: 'Created', type: SupportReplyResponseDto })
  @HttpCode(HttpStatus.CREATED)
  @Post(':id/reply')
  async reply(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Request() req: { user: any },
    @Body() dto: SupportReplyCreateRequestDto,
  ): Promise<SupportReplyResponseDto> {
    const ticket = await this.supportService.getSupportById(id);
    if (req.user.isAdmin || ticket.issuedBy?.id === req.user.id) {
      return this.supportService.replyToSupport(id, dto, req.user);
    }
    throw new ForbiddenException('You do not have access to reply to this support ticket');
  }
} 