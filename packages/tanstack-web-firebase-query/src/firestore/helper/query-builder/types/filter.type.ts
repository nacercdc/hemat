import type { OrderByDirection } from "firebase/firestore";

export interface DateRange {
  readonly start: Date;
  readonly end: Date;
}

export interface TimeRange {
  readonly start: string;
  readonly end: string;
}

export interface NumberRange {
  readonly start: number;
  readonly end: number;
}

export interface BooleanFilterOperator {
  readonly eq: boolean;
}

export interface DateFilterOperator {
  readonly eq?: Date;
  readonly notEq?: Date;
  readonly lt?: Date;
  readonly lte?: Date;
  readonly gt?: Date;
  readonly gte?: Date;
  readonly between?: DateRange;
  readonly in?: Date[];
  readonly notIn?: Date[];
  readonly arrayContains?: Date;
  readonly arrayContainsAny?: Date;
}

export interface TimeFilterOperator {
  readonly eq?: string;
  readonly notEq?: string;
  readonly lt?: string;
  readonly lte?: string;
  readonly gt?: string;
  readonly gte?: string;
  readonly between?: TimeRange;
  readonly in?: string[];
  readonly notIn?: string[];
  readonly arrayContains?: string;
  readonly arrayContainsAny?: string;
}

export interface NumberFilterOperator {
  readonly eq?: number;
  readonly notEq?: number;
  readonly lt?: number;
  readonly lte?: number;
  readonly gt?: number;
  readonly gte?: number;
  readonly in?: number[];
  readonly notIn?: number[];
  readonly between?: NumberRange;
  readonly arrayContains?: number;
  readonly arrayContainsAny?: number;
}

export interface StringFilterOperator {
  readonly eq?: string;
  readonly notEq?: string;
  readonly in?: string[];
  readonly notIn?: string[];
  readonly arrayContains?: string;
  readonly arrayContainsAny?: string;
}

export type FilterOperator =
  | BooleanFilterOperator
  | DateFilterOperator
  | NumberFilterOperator
  | StringFilterOperator;

export type FilterProperty<Property> =
  Property extends Promise<infer I>
    ? FilterProperty<I> | FilterOperator
    : Property extends (infer I)[]
      ? FilterProperty<I> | FilterOperator
      : Property extends string
        ? StringFilterOperator
        : Property extends number
          ? NumberFilterOperator
          : Property extends Date
            ? DateFilterOperator
            : Property extends object
              ? Filter<Property>
              : FilterOperator;

export type Filter<Entity> = {
  [P in keyof Entity]?: P extends "toString"
    ? unknown
    : FilterProperty<NonNullable<Entity[P]>>;
};

export type OrderByProperty<Property> =
  Property extends Promise<infer I>
    ? OrderByProperty<NonNullable<I>>
    : Property extends (infer I)[]
      ? OrderByProperty<NonNullable<I>>
      : Property extends string
        ? OrderByDirection
        : Property extends number
          ? OrderByDirection
          : Property extends boolean
            ? OrderByDirection
            : Property extends Date
              ? OrderByDirection
              : Property extends object
                ? OrderBy<Property> | OrderByDirection
                : OrderByDirection;

export type OrderBy<Entity> = {
  [P in keyof Entity]?: P extends "toString"
    ? unknown
    : OrderByProperty<NonNullable<Entity[P]>>;
};
