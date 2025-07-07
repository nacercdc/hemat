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
    return new QueryService<Component>(this.componentRepository)
      .join(query.include)
      .filter(this.filters(query), {
        fields: ['code', 'name'],
        value: query.search,
      })
      .sort({ ascending: query.ascending, descending: query.descending })
      .take(query.take)
      .skip(query.skip)
      .getManyAndCount();
  }

  async findOne(
    id: string,
    query: FindOneComponentDto,
  ): Promise<Component & { subComponentsCount: number }> {
    const component = await this.componentRepository.findOne({
      where: { id },
      relations: query.include,
    });

    if (!component) {
      throw new NotFoundException(`Component ${id} not found.`);
    }

    const subComponentsCount = await this.subComponentRepository.count({
      where: { componentId: id },
    });

    return {
      ...component,
      subComponentsCount,
    };
  }

  async create(payload: ComponentCreateRequestDto): Promise<Component> {
    return this.dataSource.transaction(async (manager) => {
      const domain = await manager.getRepository(Domain).findOne({
        where: { id: payload.domainId },
      });

      if (!domain) {
        throw new NotFoundException(`Domain ${payload.domainId} not found.`);
      }

      // Get the parent domain's code
      const domainCode = domain.code;
      // Count existing components for this domain
      const count = await manager.getRepository(Component).count({ where: { domain: { id: domain.id } } });
      const code = `${domainCode}.${count + 1}`;

      // Set code in translations for each language if translations exist
      let translations = payload.translations;
      if (translations && typeof translations === 'object') {
        translations = { ...translations };
        for (const lang of Object.keys(translations)) {
          translations[lang] = { ...translations[lang], code };
        }
      }

      const component = manager.getRepository(Component).create({
        ...payload,
        code,
        translations,
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
      // Remove code from payload if present
      const { code, ...rest } = payload as any;
      Object.assign(component, { ...rest, domain });

      // Ensure code in translations matches the main code
      if (component.translations && typeof component.translations === 'object') {
        for (const lang of Object.keys(component.translations)) {
          component.translations[lang] = { ...component.translations[lang], code: component.code };
        }
      }
      return await manager.getRepository(Component).save(component);
    });
  }

  async delete(id: string): Promise<Component> {
    const component = await this.componentRepository.findOne({
      where: { id },
      relations: ['subComponents'],
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
      relations: ['subComponents'],
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
    const component = await this.componentRepository.findOne({
      where: { id },
    });
    if (!component) {
      throw new NotFoundException(`Component ${id} not found.`);
    }

    const filters = this.filters(query);
    filters.push({
      field: 'componentId',
      operator: '=',
      value: id,
    });

    return await new QueryService<SubComponent>(this.subComponentRepository)
      .filter(filters, {
        fields: ['code', 'name'],
        value: query.search,
      })
      .join(query.include)
      .sort({ ascending: query.ascending, descending: query.descending })
      .take(query.take)
      .skip(query.skip)
      .getManyAndCount();
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
