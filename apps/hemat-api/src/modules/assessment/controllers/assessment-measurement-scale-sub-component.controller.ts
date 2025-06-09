import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  HttpCode,
  UseGuards,
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
  FindAllAssessmentMeasurementScaleSubComponentDto,
} from '../dtos';
import { ParseUUIDPipe } from '@nestjs/common';

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
@Controller('sub-components/:subComponentId/measurement-scales')
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
    @Query() query: FindAllAssessmentMeasurementScaleSubComponentDto,
  ): Promise<FindAllResponseDto<AssessmentMeasurementScaleSubComponentDto>> {
    return this.assessmentMeasurementScaleSubComponentService.findAll({
      ...query,
    });
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
  })
  @Get(':measurementScaleId')
  async findOne(
    @Param('subComponentId', new ParseUUIDPipe()) subComponentId: string,
    @Param('measurementScaleId', new ParseUUIDPipe())
    measurementScaleId: string,
  ): Promise<AssessmentMeasurementScaleSubComponentDto> {
    const measurementScale =
      await this.assessmentMeasurementScaleSubComponentService.findOne(
        subComponentId,
        measurementScaleId,
      );
    return {
      description: measurementScale.description,
      translations: measurementScale.translations,
      subComponentId: measurementScale.subComponentId,
      measurementScaleId: measurementScale.measurementScaleId,
    };
  }

  @ApiOperation({
    summary: 'Update a measurement scale for a sub-component',
    description:
      'Update the description and translations of a measurement scale associated with a specific sub-component',
  })
  @ApiOkResponse({
    description: 'Updated measurement scale for the sub-component',
    type: AssessmentMeasurementScaleSubComponentDto,
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
    @Body() payload: AssessmentMeasurementScaleSubComponentDto,
  ): Promise<AssessmentMeasurementScaleSubComponentDto> {
    const updatedMeasurementScale =
      await this.assessmentMeasurementScaleSubComponentService.update(
        subComponentId,
        measurementScaleId,
        payload,
      );
    return {
      description: updatedMeasurementScale.description,
      translations: updatedMeasurementScale.translations,
      subComponentId: updatedMeasurementScale.subComponentId,
      measurementScaleId: updatedMeasurementScale.measurementScaleId,
    };
  }
}
