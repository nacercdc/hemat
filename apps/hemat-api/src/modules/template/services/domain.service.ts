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
  FindOneDomainDto,
} from '../dtos';
import { FindAllResponseDto } from '@shared/dtos';
import { Component } from '@database/entities';
import { Not, IsNull } from 'typeorm';

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
    return new QueryService<Domain>(this.domainRepository)
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
    query: FindOneDomainDto,
  ): Promise<Domain & { componentsCount: number; subComponentsCount: number }> {
    const domain = await this.domainRepository.findOne({
      where: { id },
      relations: query.include,
    });

    if (!domain) {
      throw new NotFoundException(`Domain ${id} not found.`);
    }

    const [componentsCount, subComponentsCount] = await Promise.all([
      this.componentRepository.count({
        where: { domainId: id },
      }),
      this.componentRepository.count({
        where: { domainId: id, subComponents: { id: Not(IsNull()) } },
        relations: ['subComponents'],
      }),
    ]);

    return {
      ...domain,
      componentsCount,
      subComponentsCount,
    };
  }

  async create(payload: DomainCreateRequestDto): Promise<Domain> {
    // Count existing domains for incremental code
    const count = await this.domainRepository.count();
    const code = (count + 1).toString();
    // Set code in translations for each language if translations exist
    let translations = payload.translations;
    if (translations && typeof translations === 'object') {
      translations = { ...translations };
      for (const lang of Object.keys(translations)) {
        translations[lang] = { ...translations[lang], code };
      }
    }
    const domain = this.domainRepository.create({ ...payload, code, translations });
    return await this.domainRepository.save(domain);
  }

  async update(id: string, payload: DomainUpdateRequestDto): Promise<Domain> {
    const domain = await this.domainRepository.findOne({ where: { id } });
    if (!domain) {
      throw new NotFoundException(`Domain ${id} not found.`);
    }

    // Remove code from payload if present
    const { code, ...rest } = payload as any;
    Object.assign(domain, rest);

    // Ensure code in translations matches the main code
    if (domain.translations && typeof domain.translations === 'object') {
      for (const lang of Object.keys(domain.translations)) {
        domain.translations[lang] = { ...domain.translations[lang], code: domain.code };
      }
    }

    return await this.domainRepository.save(domain);
  }

  async delete(id: string): Promise<Domain> {
    const domain = await this.domainRepository.findOne({
      where: { id },
      relations: ['components', 'components.subComponents'],
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
      relations: ['components', 'components.subComponents'],
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
    const domain = await this.domainRepository.findOne({ where: { id } });
    if (!domain) {
      throw new NotFoundException(`Domain ${id} not found.`);
    }

    const filters = this.filters(query);
    filters.push({
      field: 'domainId',
      operator: '=',
      value: id,
    });

    return await new QueryService<Component>(this.componentRepository)
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
