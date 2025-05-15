export enum FilterTypeEnum {
  OR = 'or',
  AND = 'and',
}

export enum FilterOperatorEnum {
  EQ = 'eq',
  NOT_EQ = 'not-eq',
  GT = 'gt',
  GTE = 'gte',
  LT = 'lt',
  LTE = 'lte',
  LIKE = 'like',
  ILIKE = 'ilike',
  IN = 'in',
  NOT_IN = 'not-in',
  BETWEEN = 'between',
  NOT_BETWEEN = ' not-between',
  IS_NULL = 'is-null',
  IS_NOT_NULL = 'is-not-null',
  JSON_EQ = 'json-eq',
  JSON_NOT_EQ = 'json-not-eq',
}

export enum SortDirectionEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}
