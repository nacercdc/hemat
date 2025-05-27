import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { CrudService } from '../../../shared/services';
import { Component, Domain } from '../../../database/entities';
import { COMPONENT_FIELD_CONFIG } from '../config/component-field-config';

@Injectable()
export class ComponentService extends CrudService<Component> {
  private readonly loggerService = new Logger(ComponentService.name);
  protected includes = COMPONENT_FIELD_CONFIG.includeRelations;
  protected selectable = COMPONENT_FIELD_CONFIG.selectableFields;
  protected searchable = COMPONENT_FIELD_CONFIG.searchableFields;
  protected filterable = COMPONENT_FIELD_CONFIG.filterableFields;
  protected sortable = COMPONENT_FIELD_CONFIG.sortableFields;

  constructor(
    @InjectRepository(Component)
    private readonly componentRepository: Repository<Component>,
  ) {
    super(componentRepository);
  }
}
