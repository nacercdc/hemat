/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-explicit-any */
export type RawHeaders = Record<string, string>;

export type ObjectLiteral = Record<string, any>;

export type Method =
  | "get"
  | "GET"
  | "delete"
  | "DELETE"
  | "head"
  | "HEAD"
  | "options"
  | "OPTIONS"
  | "post"
  | "POST"
  | "put"
  | "PUT"
  | "patch"
  | "PATCH"
  | "purge"
  | "PURGE"
  | "link"
  | "LINK"
  | "unlink"
  | "UNLINK";

export type CommonRequestHeadersList =
  | "Accept"
  | "Content-Length"
  | "User-Agent"
  | "Content-Encoding"
  | "Authorization";

export type ContentType =
  | string
  | "text/html"
  | "text/plain"
  | "multipart/form-data"
  | "application/json"
  | "application/x-www-form-urlencoded"
  | "application/octet-stream";

export type RequestHeaders = Partial<
  RawHeaders &
    Record<CommonRequestHeadersList, string> & {
      "Content-Type": ContentType;
    }
>;

export enum FilterTypeEnum {
  OR = "or",
  AND = "and",
}

export enum FilterOperatorEnum {
  EQ = "eq",
  NOT_EQ = "not-eq",
  IN = "in",
  NOT_IN = "not-in",
  IS_NULL = "is-null",
  IS_NOT_NULL = "is-not-null",
  GT = "gt",
  GTE = "gte",
  LT = "lt",
  LTE = "lte",
  BETWEEN = "between",
  CONTAINS = "contains",
  NOT_CONTAINS = "not-contains",
  STARTS_WITH = "starts-with",
  NOT_STARTS_WITH = "not-starts-with",
  ENDS_WITH = "ends-with",
  NOT_ENDS_WITH = "not-ends-with",
  JSON_CONTAINS = "json-contains",
}

export enum SortDirectionEnum {
  ASC = "ascending",
  DESC = "descending",
}

export type SortDirectionType = SortDirectionEnum.ASC | SortDirectionEnum.DESC;

export interface Filter<Filtrable> {
  field: Filtrable;
  operator: FilterOperatorEnum;
  type?: FilterTypeEnum;
  value: any;
}

export type Sort<Sortable> = Partial<Record<SortDirectionType, Sortable>>;

export interface QueryOneRequest<Include> {
  include?: Include[];
  withTrashed?: boolean;
}

export interface QueryManyRequest<Include, Filterable, Sortable>
  extends QueryOneRequest<Include> {
  filters?: Filter<Filterable>[];
  sorts?: Sort<Sortable>;
  search?: string;
  limit?: number;
  page?: number;
}

export interface QueryManyResponse<Entity> {
  data: Entity[];
  total: number;
}

export interface RequestConfig {
  baseURL?: string;
  headers?: RequestHeaders;
  isProtected?: boolean;
  id?: string;
  multipart?: boolean;
}
