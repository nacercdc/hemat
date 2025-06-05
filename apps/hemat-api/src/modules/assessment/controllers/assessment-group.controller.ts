import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
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
import { AuthGuard, Abilities } from '../../../shared/modules';
import {
  PermissionActionEnum,
  PermissionSubjectEnum,
} from '../../../shared/enums';
import { ExceptionResponseDto, FindAllResponseDto } from '../../../shared/dtos';
import { AssessmentGroupService } from '../services';
import { AssessmentGroupRequestDto, FindAllAssessmentGroupDto, FindOneAssessmentGroupDto } from '../dtos';
import { AssessmentGroup } from '../../../database/entities';

@ApiBearerAuth()
@ApiTags('Assessment Groups')
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
@Controller('assessments/:assessmentId/groups')
export class AssessmentGroupController {
  constructor(
    private readonly assessmentGroupService: AssessmentGroupService,
  ) {}

  @ApiOperation({
    summary: 'Create a new assessment group',
    description: 'Create a new assessment group for an assessment',
  })
  @ApiOkResponse({ description: 'Ok', type: AssessmentGroup })
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
    @Body() payload: AssessmentGroupRequestDto,
  ): Promise<AssessmentGroup> {
    return this.assessmentGroupService.create(assessmentId, payload);
  }

  @ApiOperation({
    summary: 'Get an assessment group by ID',
    description:
      'Retrieve a specific assessment group by its ID for an assessment',
  })
  @ApiOkResponse({ description: 'Ok', type: AssessmentGroup })
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
    @Query() query: FindOneAssessmentGroupDto,
  ): Promise<AssessmentGroup> {
    return this.assessmentGroupService.findOne(assessmentId, id, query);
  }

  @ApiOperation({
    summary: 'Get all assessment groups',
    description: 'Retrieve all assessment groups for a specific assessment',
  })
  @ApiOkResponse({ description: 'Ok', type: [AssessmentGroup] })
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
    @Query() query: FindAllAssessmentGroupDto,
  ): Promise<FindAllResponseDto<AssessmentGroup>> {
    return this.assessmentGroupService.findAll(assessmentId, query);
  }

  @ApiOperation({
    summary: 'Update an assessment group',
    description: 'Update an assessment group by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: AssessmentGroup })
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
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: AssessmentGroupRequestDto,
  ): Promise<AssessmentGroup> {
    return this.assessmentGroupService.update(assessmentId, id, payload);
  }

  @ApiOperation({
    summary: 'Delete an assessment group',
    description: 'Soft delete an assessment group by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: AssessmentGroup })
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
  async delete(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<AssessmentGroup> {
    return this.assessmentGroupService.delete(assessmentId, id);
  }
}
