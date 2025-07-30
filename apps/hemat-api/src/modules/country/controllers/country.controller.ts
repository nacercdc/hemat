import {
  Controller,
  Get,
  Param,
  Query,
  HttpCode,
  UseGuards,
  HttpStatus,
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
import { AuthGuard } from '@shared/modules';
import { ExceptionResponseDto, FindAllResponseDto } from '@shared/dtos';
import { CountryService } from '../services/country.service';
import { FindAllCountryDto } from '../dtos';
import { Country } from '@database/entities';

@ApiBearerAuth()
@ApiTags('Countries')
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
@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @ApiOperation({
    summary: 'Find all',
    description: 'Get all countries',
  })
  @ApiOkResponse({ description: 'Ok', type: FindAllResponseDto<Country> })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Query() query: FindAllCountryDto) {
    return this.countryService.findAll(query);
  }

  @ApiOperation({ summary: 'Find one', description: 'Get a country by code' })
  @ApiOkResponse({ description: 'Ok', type: Country })
  @ApiNotFoundResponse({ description: 'Not found', type: ExceptionResponseDto })
  @HttpCode(HttpStatus.OK)
  @Get(':code')
  async findOne(@Param('code') code: string) {
    return this.countryService.findOne(code);
  }
}
