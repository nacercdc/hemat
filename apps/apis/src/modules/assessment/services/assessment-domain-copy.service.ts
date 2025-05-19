import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  Domain,
  Component,
  SubComponent,
  AssessmentDomain,
  AssessmentComponent,
  AssessmentSubComponent,
} from '../../../database/entities';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AssessmentDomainCopyService {
  private readonly loggerService = new Logger(AssessmentDomainCopyService.name);

  constructor(
    @InjectRepository(Domain)
    private readonly domainRepository: Repository<Domain>,
    @InjectRepository(AssessmentDomain)
    private readonly assessmentDomainRepository: Repository<AssessmentDomain>,
    @InjectRepository(Component)
    private readonly componentRepository: Repository<Component>,
    @InjectRepository(AssessmentComponent)
    private readonly assessmentComponentRepository: Repository<AssessmentComponent>,
    @InjectRepository(SubComponent)
    private readonly subComponentRepository: Repository<SubComponent>,
    @InjectRepository(AssessmentSubComponent)
    private readonly assessmentSubComponentRepository: Repository<AssessmentSubComponent>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Copies a Domain to an AssessmentDomain and its Components and SubComponents.
   * @param templateDomainId The ID of the template Domain to copy
   * @param assessmentId The ID of the Assessment to link to
   * @returns The created AssessmentDomain entity
   */
  async copyDomainToAssessmentDomain(
    templateDomainId: string,
    assessmentId: string,
  ): Promise<AssessmentDomain> {
    try {
      // Validate templateDomainId and fetch domain with components and subcomponents
      const templateDomain = await this.domainRepository.findOne({
        where: { id: templateDomainId },
        relations: ['components', 'components.subComponents'],
      });
      if (!templateDomain) {
        throw new BadRequestException('Template domain not found');
      }

      // Create and save AssessmentDomain and related entities using transaction
      const assessmentDomain = await this.dataSource.transaction(
        async (manager) => {
          // Create AssessmentDomain
          const assessmentDomain = new AssessmentDomain();
          assessmentDomain.id = uuidv4();
          assessmentDomain.code = templateDomain.code;
          assessmentDomain.name = templateDomain.name;
          assessmentDomain.description = templateDomain.description;
          assessmentDomain.assessmentId = assessmentId;

          await manager.save(AssessmentDomain, assessmentDomain);

          // Copy Components to AssessmentComponents
          const assessmentComponents = templateDomain.components.map(
            (component) => {
              const assessmentComponent = new AssessmentComponent();
              assessmentComponent.id = uuidv4();
              assessmentComponent.code = component.code;
              assessmentComponent.name = component.name;
              assessmentComponent.description = component.description;
              assessmentComponent.assessmentId = assessmentId;
              return assessmentComponent;
            },
          );

          await manager.save(AssessmentComponent, assessmentComponents);

          // Copy SubComponents to AssessmentSubComponents
          const assessmentSubComponents = templateDomain.components.flatMap(
            (component) => {
              const parentComponent = assessmentComponents.find(
                (c) => c.code === component.code,
              );
              if (!parentComponent) return [];

              return (component.subComponents || []).map((subComponent) => {
                const assessmentSubComponent = new AssessmentSubComponent();
                assessmentSubComponent.id = uuidv4();
                assessmentSubComponent.code = subComponent.code;
                assessmentSubComponent.name = subComponent.name;
                assessmentSubComponent.description = subComponent.description;
                assessmentSubComponent.assessmentId = assessmentId;
                assessmentSubComponent.componentId = parentComponent.id;
                return assessmentSubComponent;
              });
            },
          );

          await manager.save(AssessmentSubComponent, assessmentSubComponents);

          return assessmentDomain;
        },
      );

      this.loggerService.log(
        `AssessmentDomain created successfully: ${assessmentDomain.id} for Assessment: ${assessmentId}`,
      );
      return assessmentDomain;
    } catch (err) {
      this.loggerService.error(
        'Failed to copy domain to assessment domain',
        err.stack || err,
      );
      throw new BadRequestException(
        'Failed to copy domain to assessment domain: ' + (err.message || err),
      );
    }
  }
}
