import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiUnprocessableEntityResponse,
  ApiTooManyRequestsResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SubComponentMeasurementScaleService } from '../services';
import {
  SubComponentMeasurementScaleDto,
  UpdateSubComponentMeasurementScaleDto,
  FindAllSubComponentMeasurementScaleDto,
} from '../dtos';
import { MeasurementScaleSubComponent } from '../../../database/entities';
import { AuthGuard, Abilities } from '../../../shared/modules';
import {
  PermissionActionEnum,
  PermissionSubjectEnum,
} from '../../../shared/enums';
import { ExceptionResponseDto, FindAllResponseDto } from '@shared/dtos';

@ApiBearerAuth()
@ApiTags('SubComponent Measurement Scales')
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
export class SubComponentMeasurementScaleController {
  constructor(
    private readonly subComponentMeasurementScaleService: SubComponentMeasurementScaleService,
  ) {}

  @ApiOperation({
    summary: 'Associate a measurement scale with a sub-component',
  })
  @ApiCreatedResponse({
    description: 'Created',
    type: MeasurementScaleSubComponent,
  })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
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
        subject: PermissionSubjectEnum.SUB_COMPONENT,
      },
    ],
  })
  @Post()
  async create(
    @Param('subComponentId', new ParseUUIDPipe()) subComponentId: string,
    @Body() payload: SubComponentMeasurementScaleDto,
  ): Promise<MeasurementScaleSubComponent> {
    return this.subComponentMeasurementScaleService.create(
      subComponentId,
      payload,
    );
  }

  @ApiOperation({
    summary:
      'Update the description and/or translations of a measurement scale for a sub-component',
  })
  @ApiOkResponse({
    description: 'Updated',
    type: MeasurementScaleSubComponent,
  })
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
        subject: PermissionSubjectEnum.SUB_COMPONENT,
      },
    ],
  })
  @Put(':measurementScaleId')
  async update(
    @Param('subComponentId', new ParseUUIDPipe()) subComponentId: string,
    @Param('measurementScaleId', new ParseUUIDPipe())
    measurementScaleId: string,
    @Body() payload: UpdateSubComponentMeasurementScaleDto,
  ): Promise<MeasurementScaleSubComponent> {
    return this.subComponentMeasurementScaleService.update(
      subComponentId,
      measurementScaleId,
      payload,
    );
  }
}