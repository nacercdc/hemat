import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
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
import { Domain, Component } from '@database/entities';
import { Abilities, AuthGuard } from '@shared/modules';
import { PermissionActionEnum, PermissionSubjectEnum } from '@shared/enums';
import { ExceptionResponseDto, FindAllResponseDto } from '@shared/dtos';
import { DomainService } from '../services';
import {
  FindAllDomainDto,
  DomainCreateRequestDto,
  DomainUpdateRequestDto,
  FindAllComponentDto,
  FindOneDomainDto,
} from '../dtos';

@ApiBearerAuth()
@ApiTags('Domains')
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
@Controller('domains')
export class DomainController {
  constructor(private readonly domainService: DomainService) {}

  @ApiOperation({
    summary: 'Find all',
    description: 'Get all domains with pagination',
  })
  @ApiOkResponse({ description: 'Ok', type: FindAllResponseDto<Domain> })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.DOMAIN,
      },
    ],
  })
  @Get()
  async findAll(@Query() query: FindAllDomainDto) {
    return this.domainService.findAll(query);
  }

  @ApiOperation({ summary: 'Find one', description: 'Get a domain by ID' })
  @ApiOkResponse({ description: 'Ok', type: Domain })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.DOMAIN,
      },
    ],
  })
  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() query: FindOneDomainDto,
  ) {
    return this.domainService.findOne(id, query);
  }

  @ApiOperation({ summary: 'Create', description: 'Create a new domain' })
  @ApiCreatedResponse({ description: 'Created', type: Domain })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: ExceptionResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.CREATE,
        subject: PermissionSubjectEnum.DOMAIN,
      },
    ],
  })
  @Post()
  async create(@Body() payload: DomainCreateRequestDto) {
    return this.domainService.create(payload);
  }

  @ApiOperation({ summary: 'Update', description: 'Update a domain by ID' })
  @ApiOkResponse({ description: 'Ok', type: Domain })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: ExceptionResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.UPDATE,
        subject: PermissionSubjectEnum.DOMAIN,
      },
    ],
  })
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: DomainUpdateRequestDto,
  ) {
    return this.domainService.update(id, payload);
  }

  @ApiOperation({
    summary: 'Delete',
    description: 'Soft delete a domain by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: Domain })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: ExceptionResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.DELETE,
        subject: PermissionSubjectEnum.DOMAIN,
      },
    ],
  })
  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.domainService.delete(id);
  }

  @ApiOperation({ summary: 'Restore', description: 'Restore a domain by ID' })
  @ApiOkResponse({ description: 'Ok', type: Domain })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: ExceptionResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.RESTORE,
        subject: PermissionSubjectEnum.DOMAIN,
      },
    ],
  })
  @Post(':id/restore')
  async restore(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.domainService.restore(id);
  }

  @ApiOperation({
    summary: 'Find components',
    description: 'Get all components for a domain by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: [Component] })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.COMPONENT,
      },
    ],
  })
  @Get(':id/components')
  async findComponents(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() query: FindAllComponentDto,
  ) {
    return this.domainService.findComponents(id, query);
  }
}
