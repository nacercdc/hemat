/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import type { OrderByDirection } from "@react-native-firebase/firestore";
import { QUERY_OPERATORS } from "../types/query.type";
import type { IOrderBy, IWhere, ObjectLiteral } from "../types/query.type";
import type { Filter, FilterOperator, OrderBy } from "../types/filter.type";

export class FilterService<Entity extends ObjectLiteral> {
  private filters = new Set<Filter<Entity>>();

  constructor(filters?: Filter<Entity>) {
    this.set(filters);
  }

  set(filters?: Filter<Entity>): this {
    this.filters.clear();

    if (!filters) return this;

    this.filters.add(filters);

    return this;
  }

  add(filters?: Filter<Entity>): this {
    if (!filters) return this;

    this.filters.add(filters);

    return this;
  }

  get(): Filter<Entity>[] {
    return [...this.filters];
  }

  getConditions() {
    return this.get()
      .map((filters) => this.toConditions(filters))
      .flat(1);
  }

  private toConditions(filters: Filter<Entity>): IWhere[] {
    const entries = Object.entries(filters ?? {});
    const conditions: IWhere[] = [];

    for (const [key, value] of entries) {
      if (!value) continue;

      const condition = this.prepareCondition(key, value);
      conditions.push(...condition);
    }

    return conditions;
  }

  private prepareCondition(
    field: string,
    filters: FilterOperator | Filter<Entity>
  ): IWhere[] {
    const entries = Object.entries(filters ?? {});

    const conditions: IWhere[] = [];
    for (const [key, value] of entries) {
      const operator = QUERY_OPERATORS[key] ?? null;

      if (operator) {
        conditions.push({ field, operator, value });
        continue;
      }

      if (typeof value === "object") {
        const condition = this.prepareCondition(`${field}.${key}`, value);
        conditions.push(...condition);
      }
    }

    return conditions;
  }
}

export class OrderService<Entity extends ObjectLiteral> {
  private orders = new Set<OrderBy<Entity>>();

  constructor(orders?: OrderBy<Entity>) {
    this.set(orders);
  }

  set(orders?: OrderBy<Entity>): this {
    this.orders.clear();

    if (!orders) return this;

    this.orders.add(orders);

    return this;
  }

  add(orders?: OrderBy<Entity>): this {
    if (!orders) return this;

    this.orders.add(orders);

    return this;
  }

  get(): OrderBy<Entity>[] {
    return [...this.orders];
  }

  getConditions() {
    return this.get()
      .map((orders) => this.toConditions(orders))
      .flat(1);
  }

  private toConditions(orders: OrderBy<Entity>): IOrderBy[] {
    const entries = Object.entries(orders ?? {});
    const conditions: IOrderBy[] = [];

    for (const [key, value] of entries) {
      if (!value) continue;

      const condition = this.prepareCondition(key, value);
      conditions.push(...condition);
    }

    return conditions;
  }

  private prepareCondition(
    field: string,
    orders: OrderByDirection | OrderBy<Entity>
  ): IOrderBy[] {
    const entries = Object.entries(orders ?? {});

    const conditions: IOrderBy[] = [];
    for (const [key, direction] of entries) {
      if (typeof direction === "object") {
        const condition = this.prepareCondition(`${field}.${key}`, direction);
        conditions.push(...condition);
      }
      if (
        typeof direction === "string" &&
        ["asc", "desc"].includes(direction)
      ) {
        conditions.push({ field, direction: direction as OrderByDirection });
        continue;
      }
    }

    return conditions;
  }
}
