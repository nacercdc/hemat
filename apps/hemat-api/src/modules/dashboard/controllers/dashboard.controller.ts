import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { DashboardService } from '../services/dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: 'Get total countries count' })
  @ApiOkResponse({ description: 'Total number of countries', type: Number })
  @Get('countries/count')
  async getCountriesCount(): Promise<{ count: number }> {
    return this.dashboardService.getActiveCountriesCount();
  }

  @ApiOperation({ summary: 'Get active domains count' })
  @ApiOkResponse({ description: 'Total number of active domains', type: Number })
  @Get('domains/count')
  async getActiveDomainsCount(): Promise<{ count: number }> {
    return this.dashboardService.getActiveDomainsCount();
  }

  @ApiOperation({ summary: 'Get count of countries with completed assessments' })
  @ApiOkResponse({ description: 'Number of unique countries with at least one completed assessment', type: Number })
  @Get('completed-assessment-countries/count')
  async getCompletedAssessmentCountriesCount(): Promise<{ count: number }> {
    return this.dashboardService.getCompletedAssessmentCountriesCount();
  }
} 