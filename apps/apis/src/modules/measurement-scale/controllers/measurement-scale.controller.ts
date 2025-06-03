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
import { MeasurementScale } from '@database/entities';
import { Abilities, AuthGuard } from '@shared/modules';
import { PermissionActionEnum, PermissionSubjectEnum } from '@shared/enums';
import { ExceptionResponseDto, FindAllResponseDto } from '@shared/dtos';
import { MeasurementScaleService } from '../services';
import {
  FindAllMeasurementScaleDto,
  MeasurementScaleCreateRequestDto,
  MeasurementScaleUpdateRequestDto,
} from '../dtos';

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
    description: 'Ok',
    type: FindAllResponseDto<MeasurementScale>,
  })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
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
  async findAll(@Query() query: FindAllMeasurementScaleDto) {
    return this.measurementScaleService.findAll(query);
  }

  @ApiOperation({
    summary: 'Find one',
    description: 'Get a measurement scale by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: MeasurementScale })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
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
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.measurementScaleService.findOne(id);
  }

  @ApiOperation({
    summary: 'Create',
    description: 'Create a new measurement scale',
  })
  @ApiCreatedResponse({ description: 'Created', type: MeasurementScale })
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
  @ApiOkResponse({ description: 'Ok', type: MeasurementScale })
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
        subject: PermissionSubjectEnum.MEASUREMENT_SCALE,
      },
    ],
  })
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: MeasurementScaleUpdateRequestDto,
  ) {
    return this.measurementScaleService.update(id, payload);
  }

  @ApiOperation({
    summary: 'Delete',
    description: 'Soft delete a measurement scale by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: MeasurementScale })
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
        subject: PermissionSubjectEnum.MEASUREMENT_SCALE,
      },
    ],
  })
  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.measurementScaleService.delete(id);
  }

  @ApiOperation({
    summary: 'Restore',
    description: 'Restore a measurement scale by ID',
  })
  @ApiOkResponse({ description: 'Ok', type: MeasurementScale })
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
        subject: PermissionSubjectEnum.MEASUREMENT_SCALE,
      },
    ],
  })
  @Post(':id/restore')
  async restore(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.measurementScaleService.restore(id);
  }
}