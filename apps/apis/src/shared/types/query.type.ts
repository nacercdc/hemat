import { FilterOperatorEnum, FilterTypeEnum } from '../enums';

export interface Filter {
  field: string;
  operator: FilterOperatorEnum;
  value: any;
  type?: FilterTypeEnum;
  skipWhitelist?: boolean;
}

export interface Sort {
  field: string;
  direction: 'ASC' | 'DESC';
}

export interface QueryOneRequest {
  select?: string;
  include?: string;
  withDeleted?: boolean;
}

export interface QueryManyRequest extends QueryOneRequest {
  search?: string;
  filters?: Filter[];
  sorts?: Sort[];
  limit?: number;
  page?: number;
}

export interface QueryManyResponse<Entity> {
  data: Entity[];
  total: number;
}

export type DeepPartialEntity<T> = _QueryDeepPartialEntity<
  Record<string, any> extends T ? unknown : T
> & { id?: string };

type _QueryDeepPartialEntity<T> = {
  [P in keyof T]?:
    | (T[P] extends Array<infer U>
        ? Array<_QueryDeepPartialEntity<U>>
        : T[P] extends ReadonlyArray<infer U>
          ? ReadonlyArray<_QueryDeepPartialEntity<U>>
          : _QueryDeepPartialEntity<T[P]>)
    | (() => string);
};
