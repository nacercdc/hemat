import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiUnprocessableEntityResponse,
  ApiTooManyRequestsResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Permission } from '@database/entities';
import { Abilities, AuthGuard } from '@shared/modules';
import { PermissionActionEnum, PermissionSubjectEnum } from '@shared/enums';
import { ExceptionResponseDto, FindAllResponseDto } from '@shared/dtos';
import { PermissionService } from '../services';
import {
  FindAllPermissionDto,
  FindOnePermissionDto,
} from '../dtos/query-permission.dto';

@ApiBearerAuth()
@ApiTags('Permissions')
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
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiOperation({
    summary: 'Find all',
    description: 'Get all permissions with pagination',
  })
  @ApiOkResponse({ description: 'Ok', type: FindAllResponseDto<Permission> })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.PERMISSION,
      },
    ],
  })
  @Get()
  async findAll(@Query() query: FindAllPermissionDto) {
    return this.permissionService.findAll(query);
  }

  @ApiOperation({ summary: 'Find one', description: 'Get a permission by ID' })
  @ApiOkResponse({ description: 'Ok', type: Permission })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.PERMISSION,
      },
    ],
  })
  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() query: FindOnePermissionDto,
  ) {
    return this.permissionService.findOne(id, query);
  }
}