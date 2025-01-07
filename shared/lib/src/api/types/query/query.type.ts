import type { Filter } from "./filter.type";
import type { Include } from "./include.type";
import type { Select } from "./select.type";
import type { Sort } from "./sort.type";

export interface QueryOneRequest<Entity> {
  select?: Select<Entity>;
  include?: Include<Entity>;
  filters?: Filter<Entity> | Filter<Entity>[];
  sort?: Sort<Entity>;
}

export interface QueryManyRequest<Entity> extends QueryOneRequest<Entity> {
  limit?: number;
  page?: number;
}

export interface InfiniteQueryManyRequest<Entity>
  extends QueryOneRequest<Entity> {
  limit?: number;
}

export interface QueryManyResponse<Entity> {
  data: Entity[];
  total: number;
}
