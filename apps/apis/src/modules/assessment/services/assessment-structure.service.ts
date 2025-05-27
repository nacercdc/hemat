import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  AssessmentDomain,
  AssessmentComponent,
  AssessmentSubComponent,
  AssessmentMeasurementScale,
  AssessmentMeasurementScaleSubComponent,
} from '../../../database/entities';
import {
  AssessmentDomainUpdateRequestDto,
  AssessmentComponentUpdateRequestDto,
  AssessmentSubComponentUpdateRequestDto,
  AssessmentMeasurementScaleUpdateRequestDto,
  AssessmentMeasurementScaleSubComponentUpdateRequestDto,
} from '../dtos';

@Injectable()
export class AssessmentStructureService {
  private readonly logger = new Logger(AssessmentStructureService.name);

  constructor(
    @InjectRepository(AssessmentDomain)
    private readonly assessmentDomainRepository: Repository<AssessmentDomain>,
    @InjectRepository(AssessmentComponent)
    private readonly assessmentComponentRepository: Repository<AssessmentComponent>,
    @InjectRepository(AssessmentSubComponent)
    private readonly assessmentSubComponentRepository: Repository<AssessmentSubComponent>,
    @InjectRepository(AssessmentMeasurementScale)
    private readonly assessmentMeasurementScaleRepository: Repository<AssessmentMeasurementScale>,
    @InjectRepository(AssessmentMeasurementScaleSubComponent)
    private readonly assessmentMeasurementScaleSubComponentRepository: Repository<AssessmentMeasurementScaleSubComponent>,
  ) {}

  async findDomains(assessmentId: string): Promise<AssessmentDomain[]> {
    return this.assessmentDomainRepository.find({
      where: { assessmentId },
    });
  }

  async getDomain(id: string): Promise<AssessmentDomain> {
    const domain = await this.assessmentDomainRepository.findOne({
      where: { id },
    });
    if (!domain) {
      throw new NotFoundException('Assessment domain not found');
    }
    return domain;
  }

  async updateDomain(
    id: string,
    payload: AssessmentDomainUpdateRequestDto,
  ): Promise<AssessmentDomain> {
    const domain = await this.getDomain(id);
    try {
      Object.assign(domain, {
        code: payload.code ?? domain.code,
        name: payload.name ?? domain.name,
        description: payload.description ?? domain.description,
        translations: payload.translations ?? domain.translations,
      });
      return await this.assessmentDomainRepository.save(domain);
    } catch (err) {
      this.logger.error(
        `Failed to update assessment domain: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException('Failed to update assessment domain');
    }
  }

  async findComponents(assessmentId: string): Promise<AssessmentComponent[]> {
    return this.assessmentComponentRepository.find({
      where: { assessmentId },
    });
  }

  async getComponent(id: string): Promise<AssessmentComponent> {
    const component = await this.assessmentComponentRepository.findOne({
      where: { id },
    });
    if (!component) {
      throw new NotFoundException('Assessment component not found');
    }
    return component;
  }

  async updateComponent(
    id: string,
    payload: AssessmentComponentUpdateRequestDto,
  ): Promise<AssessmentComponent> {
    const component = await this.getComponent(id);
    try {
      Object.assign(component, {
        code: payload.code ?? component.code,
        name: payload.name ?? component.name,
        description: payload.description ?? component.description,
        translations: payload.translations ?? component.translations,
        domainId: payload.domainId ?? component.domainId,
      });
      return await this.assessmentComponentRepository.save(component);
    } catch (err) {
      this.logger.error(
        `Failed to update assessment component: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException('Failed to update assessment component');
    }
  }

  async findSubComponents(
    assessmentId: string,
  ): Promise<AssessmentSubComponent[]> {
    return this.assessmentSubComponentRepository.find({
      where: { assessmentId },
    });
  }

  async getSubComponent(id: string): Promise<AssessmentSubComponent> {
    const subComponent = await this.assessmentSubComponentRepository.findOne({
      where: { id },
    });
    if (!subComponent) {
      throw new NotFoundException('Assessment sub-component not found');
    }
    return subComponent;
  }

  async updateSubComponent(
    id: string,
    payload: AssessmentSubComponentUpdateRequestDto,
  ): Promise<AssessmentSubComponent> {
    const subComponent = await this.getSubComponent(id);
    try {
      Object.assign(subComponent, {
        code: payload.code ?? subComponent.code,
        name: payload.name ?? subComponent.name,
        description: payload.description ?? subComponent.description,
        translations: payload.translations ?? subComponent.translations,
        componentId: payload.componentId ?? subComponent.componentId,
      });
      return await this.assessmentSubComponentRepository.save(subComponent);
    } catch (err) {
      this.logger.error(
        `Failed to update assessment sub-component: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException(
        'Failed to update assessment sub-component',
      );
    }
  }

  async findMeasurementScalesBySubComponent(
    subComponentId: string,
  ): Promise<AssessmentMeasurementScale[]> {
    const subComponent = await this.assessmentSubComponentRepository.findOne({
      where: { id: subComponentId },
    });
    if (!subComponent) {
      throw new NotFoundException('Assessment sub-component not found');
    }
    const measurementScaleSubComponents =
      await this.assessmentMeasurementScaleSubComponentRepository.find({
        where: { subComponentId },
      });
    const measurementScaleIds = measurementScaleSubComponents.map(
      (ms) => ms.measurementScaleId,
    );
    return this.assessmentMeasurementScaleRepository.find({
      where: { id: In(measurementScaleIds) },
    });
  }

  async getMeasurementScale(id: string): Promise<AssessmentMeasurementScale> {
    const measurementScale =
      await this.assessmentMeasurementScaleRepository.findOne({
        where: { id },
      });
    if (!measurementScale) {
      throw new NotFoundException('Assessment measurement scale not found');
    }
    return measurementScale;
  }

  async updateMeasurementScale(
    id: string,
    subComponentId: string,
    payload: AssessmentMeasurementScaleUpdateRequestDto,
  ): Promise<AssessmentMeasurementScale> {
    const measurementScale = await this.getMeasurementScale(id);
    const subComponent = await this.assessmentSubComponentRepository.findOne({
      where: { id: subComponentId },
    });
    if (!subComponent) {
      throw new NotFoundException('Assessment sub-component not found');
    }
    const association =
      await this.assessmentMeasurementScaleSubComponentRepository.findOne({
        where: { subComponentId, measurementScaleId: id },
      });
    if (!association) {
      throw new BadRequestException(
        'Measurement scale is not associated with the specified sub-component',
      );
    }
    try {
      Object.assign(measurementScale, {
        name: payload.name ?? measurementScale.name,
        description: payload.description ?? measurementScale.description,
        color: payload.color ?? measurementScale.color,
        rate: payload.rate ?? measurementScale.rate,
        translations: payload.translations ?? measurementScale.translations,
      });
      return await this.assessmentMeasurementScaleRepository.save(
        measurementScale,
      );
    } catch (err) {
      this.logger.error(
        `Failed to update assessment measurement scale: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException(
        'Failed to update assessment measurement scale',
      );
    }
  }

  async findMeasurementScaleSubComponents(
    assessmentId: string,
  ): Promise<AssessmentMeasurementScaleSubComponent[]> {
    const subComponents = await this.assessmentSubComponentRepository.find({
      where: { assessmentId },
    });
    const subComponentIds = subComponents.map((sc) => sc.id);
    return this.assessmentMeasurementScaleSubComponentRepository.find({
      where: { subComponentId: In(subComponentIds) },
      relations: ['measurementScale'],
    });
  }

  async getMeasurementScaleSubComponent(
    id: string,
  ): Promise<AssessmentMeasurementScaleSubComponent> {
    const measurementScaleSubComponent =
      await this.assessmentMeasurementScaleSubComponentRepository.findOne({
        where: { id },
        relations: ['measurementScale'],
      });
    if (!measurementScaleSubComponent) {
      throw new NotFoundException(
        'Assessment measurement scale sub-component not found',
      );
    }
    return measurementScaleSubComponent;
  }

  async updateMeasurementScaleSubComponent(
    id: string,
    payload: AssessmentMeasurementScaleSubComponentUpdateRequestDto,
  ): Promise<AssessmentMeasurementScaleSubComponent> {
    const measurementScaleSubComponent =
      await this.getMeasurementScaleSubComponent(id);
    try {
      Object.assign(measurementScaleSubComponent, {
        description:
          payload.description ?? measurementScaleSubComponent.description,
        translations:
          payload.translations ?? measurementScaleSubComponent.translations,
        subComponentId:
          payload.subComponentId ?? measurementScaleSubComponent.subComponentId,
        measurementScaleId:
          payload.measurementScaleId ??
          measurementScaleSubComponent.measurementScaleId,
      });
      return await this.assessmentMeasurementScaleSubComponentRepository.save(
        measurementScaleSubComponent,
      );
    } catch (err) {
      this.logger.error(
        `Failed to update assessment measurement scale sub-component: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException(
        'Failed to update assessment measurement scale sub-component',
      );
    }
  }
}
