// src/sub-components/controllers/sub-component-measurement-scale.controller.ts

import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpCode,
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
import { SubComponentMeasurementScaleDto } from '../dtos';
import { MeasurementScaleSubComponent } from '../../../database/entities';
import { AuthGuard, Abilities } from '../../../shared/modules';
import {
  PermissionActionEnum,
  PermissionSubjectEnum,
} from '../../../shared/enums';
import { ExceptionResponseDto } from '../../../shared/dtos';

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

  @ApiOperation({ summary: 'Get all measurement scales for a sub-component' })
  @ApiOkResponse({ description: 'Ok', type: [MeasurementScaleSubComponent] })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(200)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.SUB_COMPONENT,
      },
    ],
  })
  @Get()
  async findAll(
    @Param('subComponentId', new ParseUUIDPipe()) subComponentId: string,
  ): Promise<MeasurementScaleSubComponent[]> {
    return this.subComponentMeasurementScaleService.findAll(subComponentId);
  }

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
  @HttpCode(201)
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
}
