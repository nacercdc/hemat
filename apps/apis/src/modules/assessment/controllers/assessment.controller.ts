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
import { Assessment } from '../../../database/entities';
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
import { AssessmentService } from '../services';
import {
  AssessmentCreateRequestDto,
  AssessmentUpdateRequestDto,
} from '../dtos';
import { ASSESSMENT_FIELD_CONFIG } from '../config/assessment-field-config';

@ApiBearerAuth()
@ApiTags('Assessments')
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
@Controller('assessments')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @ApiOperation({
    summary: 'Find all',
    description: 'Get all assessments with pagination',
  })
  @ApiOkResponse({ description: 'Ok', type: QueryManyResponseDto<Assessment> })
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
  async findAll(@Query() query: QueryManyRequestDto) {
    query.select ??= ASSESSMENT_FIELD_CONFIG.baseFields.join(',');
    query.include ??= ''; // Avoid fetching relations by default
    return this.assessmentService.findAll({ query });
  }

  @ApiOperation({ summary: 'Find one', description: 'Get an assessment by ID' })
  @ApiOkResponse({ description: 'Ok', type: Assessment })
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
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() query: QueryOneRequestDto,
  ) {
    query.select ??= ASSESSMENT_FIELD_CONFIG.baseFields.join(',');
    query.include ??= ''; // Avoid fetching relations by default
    return this.assessmentService.findOne(id, { query });
  }

  @ApiOperation({ summary: 'Create', description: 'Create a new assessment' })
  @ApiCreatedResponse({ description: 'Created', type: Assessment })
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
  async create(@Body() payload: AssessmentCreateRequestDto) {
    return this.assessmentService.create(payload);
  }

  @ApiOperation({
    summary: 'Update',
    description: 'Update an assessment by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: Assessment })
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
    @Body() payload: AssessmentUpdateRequestDto,
  ) {
    return this.assessmentService.update({ id }, payload);
  }

  @ApiOperation({
    summary: 'Delete',
    description: 'Delete an assessment by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: Object })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(200)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.DELETE,
        subject: PermissionSubjectEnum.ASSESSMENT,
      },
    ],
  })
  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const deletedEntity = await this.assessmentService.delete({ id });
    return { message: 'Assessment deleted successfully', data: deletedEntity };
  }

  @ApiOperation({
    summary: 'Restore',
    description: 'Restore an assessment by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: Object })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(200)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.RESTORE,
        subject: PermissionSubjectEnum.ASSESSMENT,
      },
    ],
  })
  @Post(':id/restore')
  async restore(@Param('id', new ParseUUIDPipe()) id: string) {
    const restoredEntity = await this.assessmentService.restore({ id });
    return {
      message: 'Assessment restored successfully',
      data: restoredEntity,
    };
  }
}
