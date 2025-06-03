import { ObjectLiteral } from 'typeorm';

export interface Filter {
  field: string;
  operator:
    | '='
    | '<>'
    | '>'
    | '>='
    | '<'
    | '<='
    | 'IN'
    | 'NOT IN'
    | 'BETWEEN'
    | 'NOT BETWEEN'
    | 'LIKE'
    | 'ILIKE'
    | 'IS NULL'
    | 'IS NOT NULL';
  value: any;
  type?: 'or' | 'and';
}

export type SortDirection = 'ASC' | 'DESC';
export interface Sort {
  field: string;
  direction: SortDirection;
}
export interface SortOption {
  ascending?: string[];
  descending?: string[];
}
export interface SearchOption {
  fields: [string, ...string[]];
  value?: string | null;
}
export interface WhereCondition {
  condition: string;
  parameters?: ObjectLiteral;
}
export interface ManyAndCount<Entity> {
  data: Entity[];
  total: number;
}
