import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
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
import { Language } from '@database/entities';
import { Abilities, AuthGuard } from '@shared/modules';
import { PermissionActionEnum, PermissionSubjectEnum } from '@shared/enums';
import { ExceptionResponseDto, FindAllResponseDto } from '@shared/dtos';
import { LanguageService } from '../services';
import {
  FindAllLanguageDto,
  FindOneLanguageDto,
  LanguageCreateRequestDto,
  LanguageUpdateRequestDto,
} from '../dtos';

@ApiBearerAuth()
@ApiTags('Languages')
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
@Controller('languages')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @ApiOperation({
    summary: 'Find all',
    description: 'Get all languages with pagination',
  })
  @ApiOkResponse({ description: 'Ok', type: FindAllResponseDto<Language> })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.LANGUAGE,
      },
    ],
  })
  @Get()
  async findAll(@Query() query: FindAllLanguageDto) {
    return this.languageService.findAll(query);
  }

  @ApiOperation({ summary: 'Find one', description: 'Get a language by code' })
  @ApiOkResponse({ description: 'Ok', type: Language })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.LANGUAGE,
      },
    ],
  })
  @Get(':code')
  async findOne(
    @Param('code') code: string,
    @Query() query: FindOneLanguageDto,
  ) {
    return this.languageService.findOne(query, code);
  }

  @ApiOperation({ summary: 'Create', description: 'Create a new language' })
  @ApiCreatedResponse({ description: 'Created', type: Language })
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
        subject: PermissionSubjectEnum.LANGUAGE,
      },
    ],
  })
  @Post()
  async create(@Body() payload: LanguageCreateRequestDto) {
    return this.languageService.create(payload);
  }

  @ApiOperation({
    summary: 'Update',
    description: 'Update a language by code',
  })
  @ApiOkResponse({ description: 'Ok', type: Language })
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
        subject: PermissionSubjectEnum.LANGUAGE,
      },
    ],
  })
  @Put(':code')
  async update(
    @Param('code') code: string,
    @Body() payload: LanguageUpdateRequestDto,
  ) {
    return this.languageService.update(code, payload);
  }

  @ApiOperation({
    summary: 'Delete',
    description: 'Soft delete a language by code',
  })
  @ApiOkResponse({ description: 'Ok', type: Language })
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
        subject: PermissionSubjectEnum.LANGUAGE,
      },
    ],
  })
  @Delete(':code')
  async delete(@Param('code') code: string) {
    return this.languageService.delete(code);
  }

  @ApiOperation({
    summary: 'Restore',
    description: 'Restore a soft-deleted language by code',
  })
  @ApiOkResponse({ description: 'Ok', type: Language })
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
        subject: PermissionSubjectEnum.LANGUAGE,
      },
    ],
  })
  @Post(':code/restore')
  async restore(@Param('code') code: string) {
    return this.languageService.restore(code);
  }
}
