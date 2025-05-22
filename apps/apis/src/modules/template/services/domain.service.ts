import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { CrudService } from '../../../shared/services';
import { Domain } from '../../../database/entities';
import { DOMAIN_FIELD_CONFIG } from '../config/domain-field-config';

@Injectable()
export class DomainService extends CrudService<Domain> {
  private readonly loggerService = new Logger(DomainService.name);
  protected includes = DOMAIN_FIELD_CONFIG.includeRelations;
  protected selectable = DOMAIN_FIELD_CONFIG.selectableFields;
  protected searchable = DOMAIN_FIELD_CONFIG.searchableFields;
  protected filterable = DOMAIN_FIELD_CONFIG.filterableFields;
  protected sortable = DOMAIN_FIELD_CONFIG.sortableFields;

  constructor(
    @InjectRepository(Domain)
    private readonly domainRepository: Repository<Domain>,
  ) {
    super(domainRepository);
  }
}
