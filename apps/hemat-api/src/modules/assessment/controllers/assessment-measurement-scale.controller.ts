import {
  Controller,
  Get,
  Put,
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
import { AssessmentMeasurementScale } from '@database/entities';
import { AuthGuard, Abilities } from '@shared/modules';
import { PermissionActionEnum, PermissionSubjectEnum } from '@shared/enums';
import { ExceptionResponseDto, FindAllResponseDto } from '@shared/dtos';
import { AssessmentMeasurementScaleService } from '../services';
import {
  AssessmentMeasurementScaleDto,
  FindAllAssessmentMeasurementScaleDto,
} from '../dtos';

@ApiBearerAuth()
@ApiTags('Assessment Measurement Scales')
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
@Controller('assessments/:assessmentId/measurement-scales')
export class AssessmentMeasurementScaleController {
  constructor(
    private readonly assessmentMeasurementScaleService: AssessmentMeasurementScaleService,
  ) {}

  @ApiOperation({
    summary: 'Get all measurement scales for a sub-component',
    description:
      'Retrieve all measurement scales associated with a specific sub-component',
  })
  @ApiOkResponse({ description: 'Ok', type: [AssessmentMeasurementScale] })
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
    @Query() query: FindAllAssessmentMeasurementScaleDto,
  ): Promise<FindAllResponseDto<AssessmentMeasurementScale>> {
    return this.assessmentMeasurementScaleService.findAll({
      ...query,
      assessmentId,
    });
  }

  @ApiOperation({
    summary: 'Get a single measurement scale',
    description:
      'Retrieve a single measurement scale by ID for a specific sub-component',
  })
  @ApiOkResponse({ description: 'Ok', type: AssessmentMeasurementScale })
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
  ): Promise<AssessmentMeasurementScale> {
    return this.assessmentMeasurementScaleService.findOne(assessmentId, id);
  }
  @ApiOperation({
    summary: 'Update an assessment measurement scale',
    description:
      'Update an assessment measurement scale by ID for a specific sub-component',
  })
  @ApiOkResponse({ description: 'Ok', type: AssessmentMeasurementScale })
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
    @Body() payload: AssessmentMeasurementScaleDto,
  ): Promise<AssessmentMeasurementScale> {
    return this.assessmentMeasurementScaleService.update(
      assessmentId,
      id,
      payload,
    );
  }
}
