import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Component, Domain, SubComponent } from '@database/entities';
import { Filter, QueryService } from '@shared/services';
import {
  FindAllComponentDto,
  FindOneComponentDto,
  ComponentCreateRequestDto,
  ComponentUpdateRequestDto,
  FindAllSubComponentDto,
  FindAllDomainDto,
} from '../dtos';
import { FindAllResponseDto } from '@shared/dtos';

@Injectable()
export class ComponentService {
  private readonly logger = new Logger(ComponentService.name);

  constructor(
    @InjectRepository(Component)
    private readonly componentRepository: Repository<Component>,
    @InjectRepository(SubComponent)
    private readonly subComponentRepository: Repository<SubComponent>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    query: FindAllComponentDto,
  ): Promise<FindAllResponseDto<Component>> {
    try {
      return await new QueryService<Component>(this.componentRepository)
        .join(query.include)
        .filter(this.filters(query), {
          fields: ['code', 'name'],
          value: query.search,
        })
        .sort({ ascending: query.ascending, descending: query.descending })
        .take(query.take)
        .skip(query.skip)
        .getManyAndCount();
    } catch (err) {
      this.logger.error('findAll:', err);
      throw new BadRequestException('Failed to fetch components.');
    }
  }

  async findOne(id: string, query: FindOneComponentDto): Promise<Component> {
    const component = await this.componentRepository.findOne({
      where: { id },
      relations: query.include,
    });

    if (!component) {
      throw new NotFoundException(`Component ${id} not found.`);
    }

    return component;
  }

  async create(payload: ComponentCreateRequestDto): Promise<Component> {
    return this.dataSource.transaction(async (manager) => {
      const domain = await manager.getRepository(Domain).findOne({
        where: { id: payload.domainId },
      });

      if (!domain) {
        throw new NotFoundException(`Domain ${payload.domainId} not found.`);
      }

      const component = manager.getRepository(Component).create({
        ...payload,
        domain,
      });

      return await manager.getRepository(Component).save(component);
    });
  }

  async update(
    id: string,
    payload: ComponentUpdateRequestDto,
  ): Promise<Component> {
    return this.dataSource.transaction(async (manager) => {
      const component = await manager.getRepository(Component).findOne({
        where: { id },
        relations: ['domain'],
      });

      if (!component) {
        throw new NotFoundException(`Component ${id} not found.`);
      }

      let domain = component.domain;
      if (payload.domainId && payload.domainId !== component.domain.id) {
        const newDomain = await manager.getRepository(Domain).findOne({
          where: { id: payload.domainId },
        });

        if (!newDomain) {
          throw new NotFoundException(`Domain ${payload.domainId} not found.`);
        }
        domain = newDomain;
      }

      Object.assign(component, { ...payload, domain });
      return await manager.getRepository(Component).save(component);
    });
  }

  async delete(id: string): Promise<Component> {
    const component = await this.componentRepository.findOne({
      where: { id },
    });

    if (!component) {
      throw new NotFoundException(`Component ${id} not found.`);
    }

    return await this.componentRepository.softRemove(component);
  }

  async restore(id: string): Promise<Component> {
    const component = await this.componentRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!component) {
      throw new NotFoundException(`Component ${id} not found.`);
    }

    return await this.componentRepository.recover(component);
  }

  async findSubComponents(
    id: string,
    query: FindAllSubComponentDto,
  ): Promise<FindAllResponseDto<SubComponent>> {
    try {
      const component = await this.componentRepository.findOne({
        where: { id },
      });
      if (!component) {
        throw new NotFoundException(`Component ${id} not found.`);
      }

      return await new QueryService<SubComponent>(this.subComponentRepository)
        .filter([], {
          fields: ['code', 'name'],
          value: query.search,
        })
        .join(query.include)
        .sort({ ascending: query.ascending, descending: query.descending })
        .take(query.take)
        .skip(query.skip)
        .getManyAndCount();
    } catch (err) {
      this.logger.error('findSubComponentsByComponentId:', err);
      throw new BadRequestException('Failed to fetch subcomponents.');
    }
  }

  private filters(query: FindAllDomainDto): Filter[] {
    const filters: Filter[] = [];
    if (typeof query.isActive === 'boolean') {
      filters.push({
        field: 'isActive',
        operator: '=',
        value: query.isActive,
      });
    }

    return filters;
  }
}
