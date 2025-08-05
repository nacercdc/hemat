import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { DashboardService } from '../services/dashboard.service';
import { DashboardQueryDto } from '../dtos/dashboard-query.dto';
import { DomainService } from '../../template/services/domain.service';
import { ComponentService } from '../../template/services/component.service';
import { SubComponentService } from '../../template/services/sub-component.service';
import { Inject } from '@nestjs/common';
import { SubComponentMeasurementScaleService } from '../../template/services/sub-component-mesurment-scale.service';
import { BadRequestException } from '@nestjs/common';
import { AssessmentSubComponentService } from '../../assessment/services/assessment-sub-component.service';
import { MeasurementScaleService } from '../../measurement-scale/services/measurement-scale.service';
import { FindAllMeasurementScaleDto } from '../../measurement-scale/dtos';
import { FindAllResponseDto } from '@shared/dtos';
import { MeasurementScale } from '@database/entities';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    @Inject(DomainService) private readonly domainService: DomainService,
    @Inject(ComponentService)
    private readonly componentService: ComponentService,
    @Inject(SubComponentMeasurementScaleService)
    private readonly subComponentMeasurementScaleService: SubComponentMeasurementScaleService,
    private readonly assessmentSubComponentService: AssessmentSubComponentService,
    private readonly measurementScaleService: MeasurementScaleService,
  ) {}

  @ApiOperation({ summary: 'Get total countries count' })
  @ApiOkResponse({ description: 'Total number of countries', type: Number })
  @Get('countries/count')
  async getCountriesCount(): Promise<{ count: number }> {
    return this.dashboardService.getActiveCountriesCount();
  }

  @ApiOperation({ summary: 'Get active domains count' })
  @ApiOkResponse({
    description: 'Total number of active domains',
    type: Number,
  })
  @Get('domains/count')
  async getActiveDomainsCount(): Promise<{ count: number }> {
    return this.dashboardService.getActiveDomainsCount();
  }

  @ApiOperation({
    summary: 'Get count of countries with completed assessments',
  })
  @ApiOkResponse({
    description:
      'Number of unique countries with at least one completed assessment',
    type: Number,
  })
  @Get('completed-assessment/count')
  async getCompletedAssessmentCountriesCount(): Promise<{ count: number }> {
    return this.dashboardService.getCompletedAssessmentCountriesCount();
  }

  @ApiOperation({
    summary:
      'Get average measurement scale rate per template domain across all assessments',
  })
  @ApiOkResponse({
    description: 'Average rate per template domain',
    schema: {
      example: [
        {
          id: 'ab909a31-7873-4b10-8c1b-704656f851b1',
          name: 'Public Health Infrastructure',
          domainId: '90f809da-d364-40e0-bc68-ef93d37595e9',
          averageRate: 2,
        },
        {
          id: 'b6aa14f1-f3aa-4c9f-8022-5038b15e39ca',
          name: 'Disease Prevention and Control',
          domainId: '90f809da-d364-40e0-bc68-ef93d37595e9',
          averageRate: 0,
        },
      ],
    },
  })
  @Get('domains/average-rate')
  async getAverageDomainRatesByTemplate(
    @Query() query: DashboardQueryDto,
  ): Promise<any[]> {
    return this.dashboardService.getAverageDomainRatesByTemplate(query);
  }

  @Get('domains/average-rate/country/:countryCode')
  async getAverageDomainRatesByTemplateForCountry(
    @Param('countryCode') countryCode: string,
    @Query() query: DashboardQueryDto,
  ): Promise<any[]> {
    return this.dashboardService.getAverageDomainRatesByTemplateForCountry(countryCode, query);
  }

  @ApiOperation({
    summary:
      'Get average measurement scale rate per template component for a template domain',
  })
  @ApiOkResponse({
    description: 'Average rate per template component for a template domain',
    schema: {
      example: [
        {
          id: 'c1c2c3c4-1234-5678-9abc-def012345678',
          name: 'Immunization',
          componentId: 'comp1',
          averageRate: 2,
        },
        {
          id: 'd4d5d6d7-2345-6789-abcd-ef0123456789',
          name: 'Surveillance',
          componentId: 'comp2',
          averageRate: 3,
        },
      ],
    },
  })
  @Get('domains/:templateDomainId/components/average-rate')
  async getAverageComponentRatesByTemplateDomain(
    @Param('templateDomainId') templateDomainId: string,
    @Query() query: DashboardQueryDto,
  ): Promise<any[]> {
    return this.dashboardService.getAverageComponentRatesByTemplateDomain(
      templateDomainId,
      query,
    );
  }

  @Get('domains/:templateDomainId/components/average-rate/country/:countryCode')
  async getAverageComponentRatesByTemplateDomainForCountry(
    @Param('templateDomainId') templateDomainId: string,
    @Param('countryCode') countryCode: string,
    @Query() query: DashboardQueryDto,
  ): Promise<any[]> {
    return this.dashboardService.getAverageComponentRatesByTemplateDomainForCountry(templateDomainId, countryCode, query);
  }

  @ApiOperation({
    summary:
      'Get average measurement scale rate per template subcomponent for a template component',
  })
  @ApiOkResponse({
    description:
      'Average rate per template subcomponent for a template component',
    schema: {
      example: [
        {
          id: 's1s2s3s4-1234-5678-9abc-def012345678',
          name: 'Cold Chain Management',
          description:
            'Ensures vaccines are stored at the correct temperature.',
          subComponentId: 'sub1',
          averageRate: 2,
        },
      ],
    },
  })
  @Get('components/:templateComponentId/subcomponents/average-rate')
  async getAverageSubComponentRatesByTemplateComponent(
    @Param('templateComponentId') templateComponentId: string,
    @Query() query: DashboardQueryDto,
  ): Promise<any[]> {
    return this.dashboardService.getAverageSubComponentRatesByTemplateComponent(
      templateComponentId,
      query,
    );
  }

  @Get('components/:templateComponentId/subcomponents/average-rate/country/:countryCode')
  async getAverageSubComponentRatesByTemplateComponentForCountry(
    @Param('templateComponentId') templateComponentId: string,
    @Param('countryCode') countryCode: string,
    @Query() query: DashboardQueryDto,
  ): Promise<any[]> {
    return this.dashboardService.getAverageSubComponentRatesByTemplateComponentForCountry(templateComponentId, countryCode, query);
  }

  @ApiOperation({ summary: 'Fetch all template domains' })
  @ApiOkResponse({
    description: 'List of template domains',
    schema: {
      example: [
        {
          id: '90f809da-d364-40e0-bc68-ef93d37595e9',
          name: 'Public Health Infrastructure',
        },
        {
          id: 'b6aa14f1-f3aa-4c9f-8022-5038b15e39ca',
          name: 'Disease Prevention and Control',
        },
      ],
    },
  })
  @Get('template/domains')
  async getTemplateDomains(): Promise<any[]> {
    const { data } = await this.domainService.findAll({} as any);
    return data.map((domain) => ({
      id: domain.id,
      name: domain.name,
    }));
  }

  @ApiOperation({ summary: 'Fetch components by template domain' })
  @ApiOkResponse({
    description: 'List of components for a template domain',
    schema: {
      example: [
        {
          id: '7857d20f-548f-4665-9d42-860cfa6422f6',
          name: 'Health Information Systems',
        },
        {
          id: '28473394-f018-41d7-b2d3-89bfb41d9548',
          name: 'Laboratory Services',
        },
      ],
    },
  })
  @Get('template/domains/:templateDomainId/components')
  async getTemplateComponentsByDomain(
    @Param('templateDomainId') templateDomainId: string,
  ): Promise<any[]> {
    const { data } = await this.domainService.findComponents(
      templateDomainId,
      {} as any,
    );
    return data.map((component) => ({
      id: component.id,
      name: component.name,
    }));
  }

  @ApiOperation({
    summary:
      'Fetch subcomponents by template component (with measurement scales)',
  })
  @ApiOkResponse({
    description:
      'List of subcomponents for a template component, including measurement scales',
    schema: {
      example: [
        {
          id: 'a704c71d-5eb4-4aa8-8b45-833202805980',
          name: 'Diagnostic Testing',
          description: 'Laboratory diagnostic testing capabilities',
          measurementScales: [
            {
              id: '55dc06ec-c9a3-467a-9bec-5d3f8701be2f',
              name: 'Initial',
              rate: 1,
              description: 'Basic level of implementation',
            },
            {
              id: 'b74b1dd0-6693-4f18-879f-3b9363c88e06',
              name: 'Developing',
              rate: 2,
              description: 'Developing implementation level',
            },
            {
              id: 'cce7add3-333a-488e-90d1-c8cc86260656',
              name: 'Mature',
              rate: 3,
              description: 'Mature implementation level',
            },
            {
              id: '7f242287-68a8-4041-bf13-f65ceca78872',
              name: 'Advanced',
              rate: 4,
              description: 'Advanced implementation level',
            },
            {
              id: 'b9438dd4-6222-4553-aad0-6e9feb8272d6',
              name: 'Optimizing',
              rate: 5,
              description: 'Optimizing implementation level',
            },
          ],
        },
      ],
    },
  })
  @Get('template/components/:templateComponentId/subcomponents')
  async getTemplateSubComponentsByComponent(
    @Param('templateComponentId') templateComponentId: string,
  ): Promise<any[]> {
    const { data } = await this.componentService.findSubComponents(
      templateComponentId,
      { include: ['measurementScales.measurementScale'] } as any,
    );
    return data.map((subComponent) => ({
      id: subComponent.id,
      name: subComponent.name,
      description: subComponent.description,
      measurementScales: (subComponent.measurementScales || []).map((msc) => ({
        id: msc.measurementScale?.id,
        name: msc.measurementScale?.name,
        rate: msc.measurementScale?.rate,
        description: msc.measurementScale?.description,
      })),
    }));
  }

  @ApiOperation({
    summary:
      'Fetch a specific measurement scale description for a subcomponent',
  })
  @ApiOkResponse({
    description: 'Measurement scale description for a subcomponent',
    schema: {
      example: {
        id: '3191426b-99df-4e07-ab17-b3abf0467d08',
        measurementScaleId: 'b9438dd4-6222-4553-aad0-6e9feb8272d6',
        description: 'Optimizing level for Diagnostic Testing',
        translations: {
          am: {
            description: 'የDiagnostic Testing Optimizing ደረጃ',
          },
          en: {
            description: 'Optimizing level for Diagnostic Testing',
          },
          fr: {
            description: 'Niveau Optimizing pour Diagnostic Testing',
          },
        },
      },
    },
  })
  @Get(
    'template/subcomponents/:subComponentId/measurement-scale/:measurementScaleId',
  )
  async getMeasurementScaleDescriptionBySubComponentAndScale(
    @Param('subComponentId') subComponentId: string,
    @Param('measurementScaleId') measurementScaleId: string,
  ): Promise<any> {
    const msc = await this.subComponentMeasurementScaleService[
      'measurementScaleSubComponentRepository'
    ].findOne({
      where: { subComponentId, measurementScaleId },
    });
    if (!msc) return null;
    return {
      id: msc.id,
      measurementScaleId: msc.measurementScaleId,
      description: msc.description,
    };
  }

  @ApiOperation({
    summary: 'Find all measurement scales',
    description: 'Get all measurement scales with pagination (no authentication required)',
  })
  @ApiOkResponse({
    description: 'Ok',
    type: FindAllResponseDto<MeasurementScale>,
  })
  @Get('measurement-scales')
  async findAllMeasurementScales(@Query() query: FindAllMeasurementScaleDto) {
    return this.measurementScaleService.findAll(query);
  }

  @Get('answers/average-rate')
  async getAverageRateForPrimaryAnswersGrouped() {
    return this.assessmentSubComponentService.getAverageRateForPrimaryAnswersGrouped();
  }

  @ApiOperation({ summary: 'Get all countries with subregion and assessment status' })
  @ApiOkResponse({
    description: 'Array of countries with code, subregion, and assessment status',
    schema: {
      example: [
        { code: 'ET', subregion: 'Eastern Africa', assessmentStatus: 'COMPLETED' },
        { code: 'NG', subregion: 'Western Africa', assessmentStatus: 'DRAFT' },
      ],
    },
  })
  @Get('countries')
  async getCountriesWithSubregionAndAssessmentStatus() {
    return this.dashboardService.getCountriesWithSubregionAndAssessmentStatus();
  }
} 