import { Brackets, ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { Filter, Sort } from '../../types';
import { FilterOperatorEnum, FilterTypeEnum } from '../../enums';

interface FieldOptions {
  includes?: string[];
  selectable?: string[];
  searchable?: string[];
  filterable?: string[];
  sortable?: string[];
}

interface WhereCondition {
  condition: string;
  parameters?: ObjectLiteral;
}

export class QueryService<Entity extends ObjectLiteral> {
  private table: string;
  private query: SelectQueryBuilder<Entity>;
  private includes: string[] = [];
  private selectable: string[] = [];
  private searchable: string[] = [];
  private filterable: string[] = [];
  private sortable: string[] = [];

  constructor(
    table: string,
    query: SelectQueryBuilder<Entity>,
    options?: FieldOptions,
  ) {
    this.table = table;
    this.query = query;
    this.includes = options?.includes ?? [];
    this.selectable = options?.selectable ?? [];
    this.searchable = options?.searchable ?? [];
    this.filterable = options?.filterable ?? [];
    this.sortable = options?.sortable ?? [];
  }

  /**
   * @description Get one entity.
   * @public
   * @returns {Promise<Entity | null>}
   */
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
  public getManyAndCount(): Promise<[Entity[], number]> {
    return this.query.getManyAndCount();
  }

  /**
   * @description Set join condition.
   * @public
   * @param {string=} relations
   * @returns {this}
   */
  public join(relations?: string): this {
    if (!relations) return this;

    relations
      .trim()
      .split(',')
      .forEach((relation) => {
        if (!this.includes.includes(relation)) {
          throw new Error(`${relation} field is not whitelisted.`);
        }

        let prev: string = '';
        relation.split('.').forEach((alias, index) => {
          const property =
            index === 0 ? `${this.table}.${alias}` : `${prev}.${alias}`;

          prev = alias;
          this.query.leftJoinAndSelect(property, alias);
        });
      });

    return this;
  }

  /**
   * @description Set select condition.
   * @public
   * @param {string=} selection
   * @returns {this}
   */
  public select(selection?: string): this {
    if (!selection) return this;

    const columns = selection
      .trim()
      .split(',')
      .map((column) => {
        if (!this.selectable.includes(column)) {
          throw new Error(`${column} field is not whitelisted.`);
        }

        if (column.includes('.')) {
          return column.split('.').slice(0).slice(-2).join('.');
        }

        return `${this.table}.${column}`;
      });

    this.query.select(columns);

    return this;
  }

  /**
   * @description Set where condition.
   * @public
   * @param {Filter[]} filters
   * @param {string=} search
   * @returns {this}
   */
  public filter(filters: Filter[] = [], search?: string): this {
    const andFilters: Filter[] = [];
    const orFilters: Filter[] = [];

    filters.forEach((filter) => {
      if (!this.filterable.includes(filter.field) && !filter?.skipWhitelist) {
        throw new Error(`${filter.field} field is not whitelisted.`);
      }

      filter.type === FilterTypeEnum.OR
        ? orFilters.push(filter)
        : andFilters.push(filter);
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

    if (search) {
      const brackets = new Brackets((q) => {
        this.searchable.forEach((field, index) => {
          const { condition, parameters } = this.whereCondition({
            field,
            operator: FilterOperatorEnum.ILIKE,
            value: `%${search}%`,
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
  public sort(options: Sort[] = []): this {
    options.forEach(({ field, direction }, index) => {
      if (!this.sortable.includes(field)) {
        throw new Error(`${field} field is not whitelisted.`);
      }

      const column = field.includes('.') ? field : `${this.table}.${field}`;

      index === 0
        ? this.query.orderBy(column, direction)
        : this.query.addOrderBy(column, direction);
    });

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
   * @description Set maximum number of entities to take.
   * @public
   * @param {number=} value
   * @returns {this}
   */
  public take(value?: number): this {
    if (!value) return this;
    this.query.take(value);
    return this;
  }

  /**
   * @description Set number of entities to skip.
   * @public
   * @param {number=} value
   * @returns {this}
   */
  public skip(value?: number): this {
    if (!value) return this;
    this.query.skip(value > 0 ? value - 1 : 0);
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
    const column = this.getColumnName(field, operator);
    const param = field.split('.').at(-1) ?? 'value';

    switch (operator) {
      case FilterOperatorEnum.EQ:
        return {
          condition: `${column} = :${param}`,
          parameters: { [param]: value },
        };
      case FilterOperatorEnum.NOT_EQ:
        return {
          condition: `${column} <> :${param}`,
          parameters: { [param]: value },
        };
      case FilterOperatorEnum.GT:
        return {
          condition: `${column} > :${param}`,
          parameters: { [param]: value },
        };
      case FilterOperatorEnum.GTE:
        return {
          condition: `${column} >= :${param}`,
          parameters: { [param]: value },
        };
      case FilterOperatorEnum.LT:
        return {
          condition: `${column} < :${param}`,
          parameters: { [param]: value },
        };
      case FilterOperatorEnum.LTE:
        return {
          condition: `${column} <= :${param}`,
          parameters: { [param]: value },
        };
      case FilterOperatorEnum.IN: {
        if (Array.isArray(value)) {
          return {
            condition: `${column} IN (:...${param})`,
            parameters: { [param]: value },
          };
        }

        throw new Error('Invalid value for operator in');
      }
      case FilterOperatorEnum.NOT_IN: {
        if (Array.isArray(value)) {
          return {
            condition: `${column} NOT IN (:...${param})`,
            parameters: { [param]: value },
          };
        }

        throw new Error('Invalid value for operator not-in');
      }
      case FilterOperatorEnum.BETWEEN: {
        if (Array.isArray(value) && value.length > 1) {
          return {
            condition: `${column} BETWEEN :min AND :max`,
            parameters: { min: value[0], max: value[1] },
          };
        }

        throw new Error('Invalid value for operator between');
      }
      case FilterOperatorEnum.NOT_BETWEEN: {
        if (Array.isArray(value) && value.length > 1) {
          return {
            condition: `${column} NOT BETWEEN :min AND :max`,
            parameters: { min: value[0], max: value[1] },
          };
        }

        throw new Error('Invalid value for operator between');
      }
      case FilterOperatorEnum.LIKE: {
        return {
          condition: `${column} LIKE :${param}`,
          parameters: { [param]: value },
        };
      }
      case FilterOperatorEnum.ILIKE: {
        return {
          condition: `${column} ILIKE :${param}`,
          parameters: { [param]: value },
        };
      }
      case FilterOperatorEnum.IS_NULL:
        return { condition: `${column} IS NULL` };
      case FilterOperatorEnum.IS_NOT_NULL:
        return { condition: `${column} IS NOT NULL` };
      case FilterOperatorEnum.JSON_EQ: {
        return {
          condition: `${column} = :${param}`,
          parameters: { [param]: value },
        };
      }
      case FilterOperatorEnum.JSON_NOT_EQ: {
        return {
          condition: `${column} <> :${param}`,
          parameters: { [param]: value },
        };
      }
      default:
        throw new Error(`Operator ${operator} not found`);
    }
  }

  /**
   * @description Get column names.
   * @private
   * @param {string} field
   * @param {FilterOperatorEnum} operator
   * @returns {string}
   */
  private getColumnName(field: string, operator: FilterOperatorEnum): string {
    if (!field.includes('.')) {
      return `${this.table}.${field}`;
    }

    if (
      field.includes('.') &&
      [FilterOperatorEnum.JSON_EQ, FilterOperatorEnum.JSON_NOT_EQ].includes(
        operator,
      )
    ) {
      const columns = field.split('.');
      const key = columns.pop();
      const column = `${columns.join('.')}->>'${key}'`;

      return columns.length === 1 ? `${this.table}.${column}` : column;
    }

    return field;
  }
}
