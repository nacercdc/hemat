import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  HttpCode,
  UseGuards,
  Query,
  HttpStatus,
  ForbiddenException,
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
import {
  AssessmentComponent,
  AssessmentSubComponent,
} from '@database/entities';
import { AuthGuard, Abilities } from '@shared/modules';
import { PermissionActionEnum, PermissionSubjectEnum } from '@shared/enums';
import { ExceptionResponseDto, FindAllResponseDto } from '@shared/dtos';
import { AssessmentComponentService } from '../services';
import {
  AssessmentComponentDto,
  FindAllAssessmentComponentDto,
  FindAllAssessmentSubComponentDto,
} from '../dtos';
import { ParseUUIDPipe } from '@nestjs/common';
import { AssessmentAbilityUser } from '../guards/assessment-ability-user.decorator';
import { AssessmentAbilityDto } from '../guards/assessment-ability.dto';
import { AssessmentRoleGuard } from '../guards/assessment-role.guard';

@ApiBearerAuth()
@ApiTags('Assessment Components')
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
@Controller()
export class AssessmentComponentController {
  constructor(
    private readonly assessmentComponentService: AssessmentComponentService,
  ) {}

  @ApiOperation({
    summary: 'Get all assessment components',
    description:
      'Retrieve all components for a specific assessment with pagination, sorting, and search',
  })
  @ApiOkResponse({
    description: 'Ok',
    type: FindAllResponseDto<AssessmentComponent>,
  })
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
  @Get('assessments/:assessmentId/components')
  async findAll(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Query() query: FindAllAssessmentComponentDto,
  ): Promise<FindAllResponseDto<AssessmentComponent>> {
    return this.assessmentComponentService.findAll({ ...query, assessmentId });
  }

  @ApiOperation({
    summary: 'Get a single assessment component',
    description: 'Retrieve a specific component by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: AssessmentComponent })
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
  @Get('assessments/:assessmentId/components/:id')
  async findOne(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<AssessmentComponent> {
    return this.assessmentComponentService.findOne(assessmentId, id);
  }

  @ApiOperation({
    summary: 'Update an assessment component',
    description: 'Update an assessment component by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: AssessmentComponent })
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
  @Put('assessments/:assessmentId/components/:id')
  async update(
    @Param('assessmentId', new ParseUUIDPipe()) assessmentId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: AssessmentComponentDto,
  ): Promise<AssessmentComponent> {
    return this.assessmentComponentService.update(assessmentId, id, payload);
  }

  @ApiOperation({
    summary: 'Find sub components',
    description: 'Get all sub components for a component by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: [AssessmentSubComponent] })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.ASSESSMENT_SUB_COMPONENT,
      },
    ],
    requireAdmin: false,
  })
  @UseGuards(AssessmentRoleGuard)
  @Get('assessmentSubcomponents/:id/subcomponents')
  async findSubComponents(
    @AssessmentAbilityUser() user: AssessmentAbilityDto,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() query: FindAllAssessmentSubComponentDto,
    @Query('language') language?: string,
  ) {
    const { isAdmin } = user;

    if (isAdmin || user.assessmentRole) {
      return this.assessmentComponentService.findSubComponents(id, {
        ...query,
        language,
      });
    }
    throw new ForbiddenException('You do not have access to this resource');
  }
}
