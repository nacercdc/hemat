import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { CrudService } from '../../../shared/services';
import { SubComponent, Component } from '../../../database/entities';
import { SUB_COMPONENT_FIELD_CONFIG } from '../config/sub-component-field-config';

@Injectable()
export class SubComponentService extends CrudService<SubComponent> {
  private readonly loggerService = new Logger(SubComponentService.name);
  protected includes = SUB_COMPONENT_FIELD_CONFIG.includeRelations;
  protected selectable = SUB_COMPONENT_FIELD_CONFIG.selectableFields;
  protected searchable = SUB_COMPONENT_FIELD_CONFIG.searchableFields;
  protected filterable = SUB_COMPONENT_FIELD_CONFIG.filterableFields;
  protected sortable = SUB_COMPONENT_FIELD_CONFIG.sortableFields;

  constructor(
    @InjectRepository(SubComponent)
    private readonly subComponentRepository: Repository<SubComponent>,
    @InjectRepository(Component)
    private readonly componentRepository: Repository<Component>,
  ) {
    super(subComponentRepository);
  }
}
