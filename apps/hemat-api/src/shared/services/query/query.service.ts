import {
  Brackets,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import {
  Filter,
  Sort,
  SortOption,
  SearchOption,
  WhereCondition,
  ManyAndCount,
} from './query.type';

export class QueryService<Entity extends ObjectLiteral> {
  private readonly table: string;
  private readonly query: SelectQueryBuilder<Entity>;

  constructor(private readonly repository: Repository<Entity>) {
    const tableName = this.repository.metadata.tableName;
    this.table = tableName;
    this.query = this.repository.createQueryBuilder(tableName);
  }

  public getOne(): Promise<Entity | null> {
    return this.query.getOne();
  }

  /**
   * @description Get many entities.
   * @public
   * @returns {Promise<Entity[]>}
   */
  public getMany(): Promise<Entity[]> {
    return this.query.getMany();
  }

  /**
   * @description Get many entities and total count.
   * @public
   * @returns {Promise<[Entity[], number]>}
   */
  public async getManyAndCount(): Promise<ManyAndCount<Entity>> {
    const [data, total] = await this.query.getManyAndCount();
    return { data, total };
  }

  /**
   * @description Set join condition.
   * @public
   * @param {string=} relations
   * @returns {this}
   */
  public join(relations: string[] = []): this {
    relations.forEach((relation) => {
      let prev: string = '';
      relation.split('.').forEach((alias, index) => {
        const property =
          index === 0 ? `${this.table}.${alias}` : `${prev}.${alias}`;

        prev = alias;
        console.log(property);

        this.query.leftJoinAndSelect(property, alias);
      });
    });

    return this;
  }

  /**
   * @description Set where condition.
   * @public
   * @param {Filter[]} filters
   * @param {string=} search
   * @returns {this}
   */
  public filter(filters: Filter[] = [], search?: SearchOption): this {
    const andFilters: Filter[] = [];
    const orFilters: Filter[] = [];

    filters.forEach((filter) => {
      filter.type === 'or' ? orFilters.push(filter) : andFilters.push(filter);
    });

    if (andFilters.length) {
      andFilters.forEach(({ field, operator, value }, index) => {
        const { condition, parameters } = this.whereCondition({
          field,
          operator,
          value,
        });
        index === 0
          ? this.query.where(condition, parameters)
          : this.query.andWhere(condition, parameters);
      });
    }

    if (orFilters.length) {
      const brackets = new Brackets((q) => {
        orFilters.forEach(({ field, operator, value }, index) => {
          const { condition, parameters } = this.whereCondition({
            field,
            operator,
            value,
          });
          index === 0
            ? q.where(condition, parameters)
            : q.orWhere(condition, parameters);
        });
      });

      andFilters.length
        ? this.query.andWhere(brackets)
        : this.query.where(brackets);
    }

    if (search?.value) {
      const brackets = new Brackets((q) => {
        search.fields.forEach((field, index) => {
          const { condition, parameters } = this.whereCondition({
            field,
            operator: 'ILIKE',
            value: `%${search.value}%`,
          });

          index === 0
            ? q.where(condition, parameters)
            : q.orWhere(condition, parameters);
        });
      });

      andFilters.length || orFilters.length
        ? this.query.andWhere(brackets)
        : this.query.where(brackets);
    }

    return this;
  }

  /**
   * @description Set order by condition.
   * @public
   * @param {Sort[]} options
   * @returns {this}
   */
  public sort({ ascending, descending }: SortOption): this {
    const sorts: Sort[] = [];
    ascending?.forEach((field) => {
      sorts.push({ field, direction: 'ASC' });
    });

    descending?.forEach((field) => {
      if (!ascending?.includes(field)) {
        sorts.push({ field, direction: 'DESC' });
      }
    });

    sorts.forEach(({ field, direction }, index) => {
      const column = field.includes('.') ? field : `${this.table}.${field}`;

      index === 0
        ? this.query.orderBy(column, direction)
        : this.query.addOrderBy(column, direction);
    });

    return this;
  }

  /**
   * @description Set maximum number of entities to take.
   * @public
   * @param {number} value
   * @returns {this}
   */
  public take(value: number): this {
    this.query.take(value);
    return this;
  }

  /**
   * @description Set number of entities to skip.
   * @public
   * @param {number} value
   * @returns {this}
   */
  public skip(value: number): this {
    this.query.skip(value);
    return this;
  }

  /**
   * @description Set with deleted condition.
   * @public
   * @param {boolean=} value
   * @returns {this}
   */
  public withDeleted(value?: boolean): this {
    if (value) {
      this.query.withDeleted();
    }

    return this;
  }

  /**
   * @description Prepare where condition.
   * @private
   * @param {Omit<Filter, 'type'>} options
   * @returns {WhereCondition}
   */
  private whereCondition(options: Omit<Filter, 'type'>): WhereCondition {
    const { field, operator, value } = options;
    const column = `${this.table}.${field}`;
    const param = field.split('.').at(-1) ?? 'value';

    if (['IN', 'NOT IN'].includes(operator)) {
      if (!Array.isArray(value)) {
        throw new Error('Invalid value for operator in');
      }

      return {
        condition: `${column} ${operator} (:...${param})`,
        parameters: { [param]: value },
      };
    }

    if (['BETWEEN', 'NOT BETWEEN'].includes(operator)) {
      if (Array.isArray(value) && value.length > 1) {
        throw new Error('Invalid value for operator between');
      }

      return {
        condition: `${column} ${operator} :min AND :max`,
        parameters: { min: value[0], max: value[1] },
      };
    }

    if (['IS NULL', 'IS NOT NULL'].includes(operator)) {
      return { condition: `${column} ${operator}` };
    }

    return {
      condition: `${column} ${operator} :${param}`,
      parameters: { [param]: value },
    };
  }
}
