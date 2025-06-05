export type ExistExclude = {
  property: string;
  column?: string;
};

export type ExistOptions = {
  tableName: string;
  columns: [string, ...string[]];
  exclude?: ExistExclude | string;
};

export type ValueType =
  | 'string'
  | 'number'
  | 'bigint'
  | 'boolean'
  | 'symbol'
  | 'undefined'
  | 'object'
  | 'function';
