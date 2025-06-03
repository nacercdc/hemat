import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  DeepPartial,
  FindOptionsRelations,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { QueryManyResponseDto } from '../../dtos';
import { FilterOperatorEnum } from '../../enums';
import {
  DeepPartialEntity,
  Filter,
  QueryManyRequest,
  QueryOneRequest,
} from '../../types';
import { QueryService } from './query.service';

type FindAllOptions = {
  filters?: Filter[];
  query?: QueryManyRequest;
};

type FindOneOptions = {
  filters?: Filter[];
  query?: QueryOneRequest;
};

type FindOrFailOptions<Entity> = {
  where: FindOptionsWhere<Entity>;
  relations?: FindOptionsRelations<Entity>;
  withDeleted?: boolean;
};

@Injectable()
export class CrudService<Entity extends ObjectLiteral> {
  private readonly logger = new Logger(CrudService.name);

  protected includes: string[] = [];
  protected selectable: string[] = [];
  protected searchable: string[] = [];
  protected filterable: string[] = [];
  protected sortable: string[] = [];

  constructor(private readonly repository: Repository<Entity>) {}

  /**
   * @description Get only one entity
   * @public
   *
   * @param {string} id
   * @param {FindOneOptions} options
   * @returns {Promise<Entity | null>}
   * @throws {BadRequestException}
   * @throws {NotFoundException}
   */
  public async findOne(
    id: string,
    options?: FindOneOptions,
  ): Promise<Entity | null> {
    let entity: Entity | null = null;

    try {
      const filters: Filter[] = [
        {
          field: 'id',
          operator: FilterOperatorEnum.EQ,
          value: id,
          skipWhitelist: true,
        },
      ];

      filters.push(...(options?.filters ?? []));
      const query = options?.query ?? {};
      entity = await this.queryBuilder()
        .join(query?.include)
        .select(query?.select)
        .filter(filters)
        .withDeleted(query?.withDeleted)
        .getOne();
    } catch (err) {
      this.logger.error('findOne:', err);
      throw new BadRequestException(
        err?.message ?? 'common.exception.failedToRetrieveEntity',
      );
    }

    if (!entity) {
      throw new NotFoundException('common.exception.entityNotFound');
    }

    return entity;
  }

  /**
   * @description Get all entities
   * @public
   *
   * @param {FindAllOptions} options
   * @returns {Promise<QueryManyResponseDto<Entity>>}
   * @throws {BadRequestException}
   */
  public async findAll(
    options?: FindAllOptions,
  ): Promise<QueryManyResponseDto<Entity>> {
    try {
      const query = options?.query ?? {};

      if (options?.filters) {
        query?.filters
          ? query.filters.unshift(...options.filters)
          : (query.filters = options.filters);
      }

      const [data, total] = await this.queryBuilder()
        .join(query?.include)
        .select(query?.select)
        .filter(query?.filters, query?.search)
        .sort(query?.sorts)
        .withDeleted(query?.withDeleted)
        .take(query?.limit)
        .skip(query?.page)
        .getManyAndCount();

      return { data, total };
    } catch (err) {
      this.logger.error('findAll:', err);
      throw new BadRequestException(
        err?.message ?? 'common.exception.failedToRetrieveEntities',
      );
    }
  }

  /**
   * @description Create an entity
   * @public
   *
   * @param {DeepPartial<Entity>} payload
   * @returns {Promise<Entity>}
   * @throws {BadRequestException}
   */
  public async create(payload: DeepPartial<Entity>): Promise<Entity> {
    const entity = this.repository.create(payload);
    await this.repository.insert(entity).catch((err) => {
      this.logger.error('create:', err);
      throw new BadRequestException('common.exception.failedToSaveEntity');
    });

    return entity;
  }

  /**
   * @description Update an entity
   * @public
   *
   * @param {FindOptionsWhere<Entity>} where
   * @param {DeepPartialEntity<Entity>} payload
   * @returns {Promise<Entity>}
   * @throws {NotFoundException}
   * @throws {BadRequestException}
   */
  public async update(
    where: FindOptionsWhere<Entity>,
    payload: DeepPartialEntity<Entity>,
  ): Promise<Entity> {
    const entity = await this.findOrFail({ where });

    if (payload.id) {
      delete payload.id;
    }

    await this.repository.update(entity.id, payload).catch((err) => {
      this.logger.error('update:', err);
      throw new BadRequestException('common.exception.failedToUpdateEntity');
    });

    return {
      ...entity,
      ...payload,
    };
  }

  /**
   * @description Delete an entity
   * @public
   *
   * @param {FindOptionsWhere<Entity>} where
   * @returns {Promise<Entity>}
   * @throws {NotFoundException}
   * @throws {BadRequestException}
   */
  public async delete(where: FindOptionsWhere<Entity>): Promise<Entity> {
    const entity = await this.findOrFail({ where });
    await this.repository.softRemove(entity).catch((err) => {
      this.logger.error('delete:', err);
      throw new BadRequestException('common.exception.failedToDeleteEntity');
    });

    return entity;
  }

  /**
   * @description Restore an entity
   * @public
   *
   * @param {FindOptionsWhere<Entity>} where
   * @returns {Promise<Entity>}
   * @throws {NotFoundException}
   * @throws {BadRequestException}
   */
  public async restore(where: FindOptionsWhere<Entity>): Promise<Entity> {
    const entity = await this.findOrFail({ where, withDeleted: true });
    await this.repository.restore(entity).catch((err) => {
      this.logger.error('restore:', err);
      throw new BadRequestException('common.exception.failedToRestoreEntity');
    });

    return entity;
  }

  /**
   * @description Remove an entity permanently
   * @public
   *
   * @param {FindOptionsWhere<Entity>} where
   * @returns {Promise<Entity>}
   * @throws {NotFoundException}
   * @throws {BadRequestException}
   */
  public async remove(where: FindOptionsWhere<Entity>): Promise<Entity> {
    const entity = await this.findOrFail({ where });
    await this.repository.remove(entity).catch((err) => {
      this.logger.error('remove:', err);
      throw new BadRequestException('common.exception.failedToRemoveEntity');
    });

    return entity;
  }

  /**
   * @description Find entity by a given column and value
   * @protected
   *
   * @param {FindOrFailOptions<Entity>} payload
   * @returns {Promise<Entity>}
   * @throws {NotFoundException}
   */
  protected async findOrFail({
    where,
    relations,
    withDeleted = false,
  }: FindOrFailOptions<Entity>): Promise<Entity> {
    const entity = await this.repository.findOne({
      where,
      relations,
      withDeleted,
    });

    if (!entity) {
      this.logger.log('findOrFail: Entity not found.');
      throw new NotFoundException('common.exception.entityNotFound');
    }

    return entity;
  }

  /**
   * @description Init query service
   * @private
   *
   * @returns {QueryService<Entity>}
   */
  private queryBuilder(): QueryService<Entity> {
    const tableName = this.repository.metadata.tableName;
    const queryBuilder = this.repository.createQueryBuilder(tableName);
    return new QueryService<Entity>(tableName, queryBuilder, {
      includes: this.includes,
      selectable: this.selectable,
      searchable: this.searchable,
      filterable: this.filterable,
      sortable: this.sortable,
    });
  }
}
