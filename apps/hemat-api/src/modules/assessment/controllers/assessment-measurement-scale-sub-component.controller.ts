import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  HttpCode,
  UseGuards,
  Query,
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
import { AssessmentMeasurementScaleSubComponent } from '../../../database/entities';
import { AuthGuard, Abilities } from '../../../shared/modules';
import {
  PermissionActionEnum,
  PermissionSubjectEnum,
} from '../../../shared/enums';
import { ExceptionResponseDto, FindAllResponseDto } from '../../../shared/dtos';
import { AssessmentMeasurementScaleSubComponentService } from '../services';
import {
  AssessmentMeasurementScaleSubComponentDto,
  AssessmentMeasurementScaleSubComponentUpdateDto,
  FindAllAssessmentMeasurementScaleSubComponentDto,
  BatchUpdateAssessmentMeasurementScaleSubComponentDto,
} from '../dtos';
import { ParseUUIDPipe } from '@nestjs/common';
import { AssessmentAbilityUser } from '../guards/assessment-ability-user.decorator';
import { AssessmentAbilityDto } from '../guards/assessment-ability.dto';

@ApiBearerAuth()
@ApiTags('Assessment Measurement Scale Sub-Components')
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
@Controller('assessment-sub-components/:subComponentId/measurement-scales')
export class AssessmentMeasurementScaleSubComponentController {
  constructor(
    private readonly assessmentMeasurementScaleSubComponentService: AssessmentMeasurementScaleSubComponentService,
  ) {}

  @ApiOperation({
    summary: 'Get all measurement scales for a sub-component',
    description:
      'Retrieve all measurement scales associated with a specific sub-component, including their descriptions and translations',
  })
  @ApiOkResponse({
    description: 'List of measurement scales for the sub-component',
    type: [AssessmentMeasurementScaleSubComponentDto],
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
  @Get()
  async findAll(
    @Param('subComponentId', new ParseUUIDPipe()) subComponentId: string,
    @Query() query: Omit<FindAllAssessmentMeasurementScaleSubComponentDto, 'subComponentId'>,
    @Query('language') language?: string,
  ): Promise<FindAllResponseDto<AssessmentMeasurementScaleSubComponentDto>> {
    const queryWithSubComponentId: FindAllAssessmentMeasurementScaleSubComponentDto & { language?: string } = {
      ...query,
      subComponentId,
      language,
    };
    return this.assessmentMeasurementScaleSubComponentService.findAll(queryWithSubComponentId);
  }

  @ApiOperation({
    summary: 'Get a specific measurement scale for a sub-component',
    description:
      'Retrieve a single measurement scale associated with a specific sub-component by measurementScaleId',
  })
  @ApiOkResponse({
    description: 'Measurement scale for the sub-component',
    type: AssessmentMeasurementScaleSubComponentDto,
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
    requireAdmin: false,
  })
  @Get(':measurementScaleId')
  async findOne(
    @AssessmentAbilityUser() user: AssessmentAbilityDto,
    @Param('subComponentId', new ParseUUIDPipe()) subComponentId: string,
    @Param('measurementScaleId', new ParseUUIDPipe())
    measurementScaleId: string,
    @Query('language') language?: string,
  ): Promise<AssessmentMeasurementScaleSubComponent> {
    const { isAdmin } = user;
    if (isAdmin || user.assessmentRole) {
    return this.assessmentMeasurementScaleSubComponentService.findOne(
      subComponentId,
      measurementScaleId,
      language,
    );
  }
  throw new ForbiddenException('You do not have access to this resource');
  }

  @ApiOperation({
    summary: 'Update a measurement scale for a sub-component',
    description:
      'Update the description and translations of a measurement scale associated with a specific sub-component',
  })
  @ApiOkResponse({
    description: 'Updated measurement scale for the sub-component',
    type: AssessmentMeasurementScaleSubComponent,
  })
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
  @Put(':measurementScaleId')
  async update(
    @Param('subComponentId', new ParseUUIDPipe()) subComponentId: string,
    @Param('measurementScaleId', new ParseUUIDPipe())
    measurementScaleId: string,
    @Body() payload: AssessmentMeasurementScaleSubComponentUpdateDto,
  ): Promise<AssessmentMeasurementScaleSubComponent> {
    return this.assessmentMeasurementScaleSubComponentService.update(
      subComponentId,
      measurementScaleId,
      payload,
    );
  }

  @ApiOperation({
    summary: 'Batch update measurement scales for a sub-component',
    description: 'Batch update the description and translations of multiple measurement scales associated with a specific sub-component',
  })
  @ApiOkResponse({
    description: 'Updated measurement scales for the sub-component',
    type: AssessmentMeasurementScaleSubComponent,
    isArray: true,
  })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ExceptionResponseDto })
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
  @Put()
  async batchUpdate(
    @Param('subComponentId', new ParseUUIDPipe()) subComponentId: string,
    @Body() payload: BatchUpdateAssessmentMeasurementScaleSubComponentDto[],
  ): Promise<AssessmentMeasurementScaleSubComponent[]> {
    return this.assessmentMeasurementScaleSubComponentService.batchUpdate(
      subComponentId,
      payload,
    );
  }
}
