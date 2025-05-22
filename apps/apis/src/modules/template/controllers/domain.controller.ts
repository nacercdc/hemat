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
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiUnprocessableEntityResponse,
  ApiTooManyRequestsResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Domain } from '../../../database/entities';
import { Abilities, AuthGuard } from '../../../shared/modules';
import {
  PermissionActionEnum,
  PermissionSubjectEnum,
} from '../../../shared/enums';
import {
  ExceptionResponseDto,
  QueryManyRequestDto,
  QueryManyResponseDto,
  QueryOneRequestDto,
} from '../../../shared/dtos';
import { DomainService } from '../services';
import { DomainCreateRequestDto, DomainUpdateRequestDto } from '../dtos';
import { DOMAIN_FIELD_CONFIG } from '../config/domain-field-config';

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
  @ApiOkResponse({ description: 'Ok', type: QueryManyResponseDto<Domain> })
  @HttpCode(200)
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
  async findAll(@Query() query: QueryManyRequestDto) {
    query.select ??= DOMAIN_FIELD_CONFIG.baseFields.join(',');
    query.include ??= DOMAIN_FIELD_CONFIG.includeRelations.join(',');
    return this.domainService.findAll({ query });
  }

  @ApiOperation({ summary: 'Find one', description: 'Get a domain by ID' })
  @ApiOkResponse({ description: 'Ok', type: Domain })
  @HttpCode(200)
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
    @Query() query: QueryOneRequestDto,
  ) {
    query.select ??= DOMAIN_FIELD_CONFIG.baseFields.join(',');
    query.include ??= DOMAIN_FIELD_CONFIG.includeRelations.join(',');
    return this.domainService.findOne(id, { query });
  }

  @ApiOperation({ summary: 'Create', description: 'Create a new domain' })
  @ApiCreatedResponse({ description: 'Created', type: Domain })
  @HttpCode(201)
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
  @HttpCode(200)
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
    return this.domainService.update({ id }, payload);
  }

  @ApiOperation({ summary: 'Delete', description: 'Delete a domain by ID' })
  @ApiOkResponse({ description: 'Ok', type: Object })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(200)
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
    const deletedEntity = await this.domainService.delete({ id });
    return { message: 'Domain deleted successfully', data: deletedEntity };
  }

  @ApiOperation({ summary: 'Restore', description: 'Restore a domain by ID' })
  @ApiOkResponse({ description: 'Ok', type: Object })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(200)
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
    const restoredEntity = await this.domainService.restore({ id });
    return { message: 'Domain restored successfully', data: restoredEntity };
  }
}
