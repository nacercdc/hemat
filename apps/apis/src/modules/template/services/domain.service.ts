import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Domain } from '@database/entities';
import { QueryService } from '@shared/services';
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
        .filter([{ field: 'isActive', operator: '=', value: true || false }], {
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

  async findOne(id: string): Promise<Domain> {
    const domain = await this.domainRepository.findOne({ where: { id } });

    if (!domain) {
      throw new NotFoundException(`Domain ${id} not found.`);
    }

    return domain;
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
        .filter([], {
          fields: ['code', 'name'],
          value: query.search,
        })
        .sort({ ascending: query.ascending, descending: query.descending })
        .take(query.take)
        .skip(query.skip)
        .getManyAndCount();
    } catch (err) {
      this.logger.error('findComponentsByDomainId:', err);
      throw new BadRequestException('Failed to fetch components.');
    }
  }
}
