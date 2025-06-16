import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Domain } from '@database/entities';
import { Filter, QueryService } from '@shared/services';
import {
  FindAllDomainDto,
  DomainCreateRequestDto,
  DomainUpdateRequestDto,
  FindAllComponentDto,
} from '../dtos';
import { FindAllResponseDto } from '@shared/dtos';
import { Component } from '@database/entities';

@Injectable()
export class DomainService {
  private readonly logger = new Logger(DomainService.name);

  constructor(
    @InjectRepository(Domain)
    private readonly domainRepository: Repository<Domain>,
    @InjectRepository(Component)
    private readonly componentRepository: Repository<Component>,
  ) {}

  async findAll(query: FindAllDomainDto): Promise<FindAllResponseDto<Domain>> {
    try {
      return await new QueryService<Domain>(this.domainRepository)
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
      throw new BadRequestException('Failed to fetch domains.');
    }
  }

  async findOne(id: string): Promise<Domain & { componentsCount: number; subComponentsCount: number }> {
    const domain = await this.domainRepository.findOne({ where: { id } });

    if (!domain) {
      throw new NotFoundException(`Domain ${id} not found.`);
    }

    const [componentsCount, subComponentsCount] = await Promise.all([
      this.componentRepository.count({ where: { domainId: id } }),
      this.componentRepository
        .createQueryBuilder('component')
        .innerJoin('component.subComponents', 'subComponent')
        .where('component.domainId = :domainId', { domainId: id })
        .select('COUNT(DISTINCT subComponent.id)', 'count')
        .getRawOne()
        .then(result => parseInt(result.count, 10) || 0),
    ]);

    return {
      ...domain,
      componentsCount,
      subComponentsCount,
    };
  }

  async create(payload: DomainCreateRequestDto): Promise<Domain> {
    const domain = this.domainRepository.create(payload);
    return await this.domainRepository.save(domain);
  }

  async update(id: string, payload: DomainUpdateRequestDto): Promise<Domain> {
    const domain = await this.domainRepository.findOne({
      where: { id },
    });

    if (!domain) {
      throw new NotFoundException(`Domain ${id} not found.`);
    }

    Object.assign(domain, payload);
    return await this.domainRepository.save(domain);
  }

  async delete(id: string): Promise<Domain> {
    const domain = await this.domainRepository.findOne({
      where: { id },
    });

    if (!domain) {
      throw new NotFoundException(`Domain ${id} not found.`);
    }

    // Check if domain has any components
    const componentsCount = await this.componentRepository.count({
      where: { domainId: id },
    });

    if (componentsCount > 0) {
      throw new BadRequestException(
        `Cannot delete domain "${domain.name}" because it has ${componentsCount} components. Please delete all components first.`
      );
    }

    return await this.domainRepository.softRemove(domain);
  }

  async restore(id: string): Promise<Domain> {
    const domain = await this.domainRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!domain) {
      throw new NotFoundException(`Domain ${id} not found.`);
    }

    return await this.domainRepository.recover(domain);
  }

  async findComponents(
    id: string,
    query: FindAllComponentDto,
  ): Promise<FindAllResponseDto<Component>> {
    try {
      const domain = await this.domainRepository.findOne({ where: { id } });
      if (!domain) {
        throw new NotFoundException(`Domain ${id} not found.`);
      }

      return await new QueryService<Component>(this.componentRepository)
        .filter(this.filters(query), {
          fields: ['code', 'name'],
          value: query.search,
        })
        .join(query.include)
        .sort({ ascending: query.ascending, descending: query.descending })
        .take(query.take)
        .skip(query.skip)
        .getManyAndCount();
    } catch (err) {
      this.logger.error('findComponentsByDomainId:', err);
      throw new BadRequestException('Failed to fetch components.');
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
