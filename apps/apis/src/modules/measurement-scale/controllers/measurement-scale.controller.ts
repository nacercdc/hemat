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
  HttpStatus,
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
import { MeasurementScale } from '../../../database/entities';
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
import { MeasurementScaleService } from '../services';
import {
  MeasurementScaleCreateRequestDto,
  MeasurementScaleUpdateRequestDto,
} from '../dtos';
import { MEASUREMENT_SCALE_FIELD_CONFIG } from '../configs';

@ApiBearerAuth()
@ApiTags('Measurement Scales')
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
@Controller('measurement-scales')
export class MeasurementScaleController {
  constructor(
    private readonly measurementScaleService: MeasurementScaleService,
  ) {}

  @ApiOperation({
    summary: 'Find all',
    description: 'Get all measurement scales with pagination',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved measurement scales',
    type: QueryManyResponseDto<MeasurementScale>,
  })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.MEASUREMENT_SCALE,
      },
    ],
  })
  @Get()
  async findAll(@Query() query: QueryManyRequestDto) {
    query.select ??= MEASUREMENT_SCALE_FIELD_CONFIG.baseFields.join(',');
    return this.measurementScaleService.findAll({ query });
  }

  @ApiOperation({
    summary: 'Find one',
    description: 'Get a measurement scale by ID',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved measurement scale',
    type: MeasurementScale,
  })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.READ,
        subject: PermissionSubjectEnum.MEASUREMENT_SCALE,
      },
    ],
  })
  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() query: QueryOneRequestDto,
  ) {
    query.select ??= MEASUREMENT_SCALE_FIELD_CONFIG.baseFields.join(',');
    return this.measurementScaleService.findOne(id, { query });
  }

  @ApiOperation({
    summary: 'Create',
    description: 'Create a new measurement scale',
  })
  @ApiCreatedResponse({
    description: 'Successfully created measurement scale',
    type: MeasurementScale,
  })
  @HttpCode(201)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.CREATE,
        subject: PermissionSubjectEnum.MEASUREMENT_SCALE,
      },
    ],
  })
  @Post()
  async create(@Body() payload: MeasurementScaleCreateRequestDto) {
    return this.measurementScaleService.create(payload);
  }

  @ApiOperation({
    summary: 'Update',
    description: 'Update a measurement scale by ID',
  })
  @ApiOkResponse({
    description: 'Successfully updated measurement scale',
    type: MeasurementScale,
  })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.UPDATE,
        subject: PermissionSubjectEnum.MEASUREMENT_SCALE,
      },
    ],
  })
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: MeasurementScaleUpdateRequestDto,
  ) {
    return this.measurementScaleService.update({ id }, payload);
  }

  @ApiOperation({
    summary: 'Delete',
    description: 'Delete a measurement scale by ID',
  })
  @ApiOkResponse({
    description: 'Successfully deleted measurement scale',
    type: MeasurementScale,
  })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.DELETE,
        subject: PermissionSubjectEnum.MEASUREMENT_SCALE,
      },
    ],
  })
  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.measurementScaleService.delete({ id });
  }

  @ApiOperation({
    summary: 'Restore',
    description: 'Restore a measurement scale by ID',
  })
  @ApiOkResponse({
    description: 'Successfully restored measurement scale',
    type: MeasurementScale,
  })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Abilities({
    isAdmin: true,
    permissions: [
      {
        action: PermissionActionEnum.RESTORE,
        subject: PermissionSubjectEnum.MEASUREMENT_SCALE,
      },
    ],
  })
  @Post(':id/restore')
  async restore(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.measurementScaleService.restore({ id });
  }
}
