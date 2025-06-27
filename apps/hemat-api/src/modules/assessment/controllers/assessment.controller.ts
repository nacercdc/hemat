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
  Request,
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
import { Assessment } from '@database/entities';
import { Abilities, AuthDto, AuthGuard } from '@shared/modules';
import { PermissionActionEnum, PermissionSubjectEnum } from '@shared/enums';
import { ExceptionResponseDto, FindAllResponseDto } from '@shared/dtos';
import { AssessmentService } from '../services';
import {
  FindAllAssessmentDto,
  FindOneAssessmentDto,
  AssessmentCreateRequestDto,
  AssessmentUpdateRequestDto,
  AssessmentDto,
} from '../dtos';
import { AssessmentRoleGuard } from '../guards/assessment-role.guard';

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

  @ApiOperation({ summary: 'Find one', description: 'Get an assessment by ID' })
  @ApiOkResponse({ description: 'Ok', type: Assessment })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, AssessmentRoleGuard)
  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Request() req: { user: AuthDto },
    @Query() query: FindOneAssessmentDto,
  ) {
    return this.assessmentService.findOneWithMember(id, req.user.id, query);
  }

  @ApiOperation({
    summary: 'Find all',
    description: 'Get all assessments with pagination',
  })
  @ApiOkResponse({ description: 'Ok', type: FindAllResponseDto<Assessment> })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, AssessmentRoleGuard)
  @Get()
  async findAll(@Request() req: { user: AuthDto }, @Query() query: FindAllAssessmentDto) {
    return this.assessmentService.findAll(query, req.user);
  }

  @ApiOperation({ summary: 'Create', description: 'Create a new assessment' })
  @ApiCreatedResponse({ description: 'Created', type: Assessment })
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
        subject: PermissionSubjectEnum.ASSESSMENT,
      },
    ],
  })
  @Post()
  async create(
    @Request() req: { user: AuthDto },
    @Body() payload: AssessmentCreateRequestDto,
  ): Promise<AssessmentDto> {
    const assessment = await this.assessmentService.create(req.user.id, payload);
    return new AssessmentDto(assessment);
  }

  @ApiOperation({
    summary: 'Update',
    description: 'Update an assessment by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: Assessment })
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
        subject: PermissionSubjectEnum.ASSESSMENT,
      },
    ],
  })
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: AssessmentUpdateRequestDto,
  ) {
    return this.assessmentService.update(id, payload);
  }

  @ApiOperation({
    summary: 'Delete',
    description: 'Soft delete an assessment by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: Assessment })
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
        subject: PermissionSubjectEnum.ASSESSMENT,
      },
    ],
  })
  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.assessmentService.delete(id);
  }

  @ApiOperation({
    summary: 'Restore',
    description: 'Restore a soft-deleted assessment by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: Assessment })
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
        subject: PermissionSubjectEnum.ASSESSMENT,
      },
    ],
  })
  @Post(':id/restore')
  async restore(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.assessmentService.restore(id);
  }
}
