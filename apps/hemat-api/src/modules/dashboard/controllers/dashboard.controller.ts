import { Controller, Get, Query, Param } from '@nestjs/common';
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

  @ApiOperation({ summary: 'Get average measurement scale rate per template domain across all assessments' })
  @ApiOkResponse({
    description: 'Average rate per template domain',
    schema: {
      example: [
        {
          templateDomainId: 'ab909a31-7873-4b10-8c1b-704656f851b1',
          templateDomainName: 'Public Health Infrastructure',
          assessmentDomainCount: 2,
          subComponentCount: 3,
          answerCount: 3,
          rateCount: 3,
          averageRate: 3.0
        },
        {
          templateDomainId: 'b6aa14f1-f3aa-4c9f-8022-5038b15e39ca',
          templateDomainName: 'Disease Prevention and Control',
          assessmentDomainCount: 2,
          subComponentCount: 2,
          answerCount: 1,
          rateCount: 1,
          averageRate: 2.0
        }
      ]
    }
  })
  @Get('domains/average-rate-by-template')
  async getAverageDomainRatesByTemplate(): Promise<any[]> {
    return this.dashboardService.getAverageDomainRatesByTemplate();
  }

  @ApiOperation({ summary: 'Get average measurement scale rate per template component for a template domain' })
  @ApiOkResponse({
    description: 'Average rate per template component for a template domain',
    schema: {
      example: [
        {
          templateComponentId: 'c1c2c3c4-1234-5678-9abc-def012345678',
          templateComponentName: 'Immunization',
          assessmentComponentCount: 2,
          subComponentCount: 4,
          answerCount: 4,
          rateCount: 4,
          averageRate: 2.5
        },
        {
          templateComponentId: 'd4d5d6d7-2345-6789-abcd-ef0123456789',
          templateComponentName: 'Surveillance',
          assessmentComponentCount: 1,
          subComponentCount: 2,
          answerCount: 1,
          rateCount: 1,
          averageRate: 3.0
        }
      ]
    }
  })
  @Get('domains/:templateDomainId/components/average-rate-by-template')
  async getAverageComponentRatesByTemplateDomain(@Param('templateDomainId') templateDomainId: string): Promise<any[]> {
    return this.dashboardService.getAverageComponentRatesByTemplateDomain(templateDomainId);
  }

  @ApiOperation({ summary: 'Get average measurement scale rate per template subcomponent for a template component' })
  @ApiOkResponse({
    description: 'Average rate per template subcomponent for a template component',
    schema: {
      example: [
        {
          templateSubComponentId: 's1s2s3s4-1234-5678-9abc-def012345678',
          templateSubComponentName: 'Cold Chain Management',
          templateSubComponentDescription: 'Ensures vaccines are stored at the correct temperature.',
          assessmentSubComponentCount: 2,
          measurementScales: [
            { id: 'ms1', name: 'Initial', rate: 1 },
            { id: 'ms2', name: 'Advanced', rate: 3 }
          ],
          answerCount: 2,
          rateCount: 2,
          averageRate: 2.0
        }
      ]
    }
  })
  @Get('components/:templateComponentId/subcomponents/average-rate-by-template')
  async getAverageSubComponentRatesByTemplateComponent(@Param('templateComponentId') templateComponentId: string): Promise<any[]> {
    return this.dashboardService.getAverageSubComponentRatesByTemplateComponent(templateComponentId);
  }
} 