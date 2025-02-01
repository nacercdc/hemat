/* eslint-disable @typescript-eslint/array-type */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
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
  readonly eq?: Date | null;
  readonly notEq?: Date | null;
  readonly before?: Date;
  readonly beforeOrEq?: Date;
  readonly after?: Date;
  readonly afterOrEq?: Date;
  readonly between?: DateRange;
  readonly isNull?: boolean;
  readonly isNotNull?: boolean;
}

export interface TimeFilterOperator {
  readonly eq?: string | null;
  readonly notEq?: string | null;
  readonly before?: string;
  readonly beforeOrEq?: string;
  readonly after?: string;
  readonly afterOrEq?: string;
  readonly between?: TimeRange;
  readonly isNull?: boolean;
  readonly isNotNull?: boolean;
}

export interface NumberFilterOperator {
  readonly eq?: number | null;
  readonly notEq?: number | null;
  readonly lt?: number;
  readonly lte?: number;
  readonly gt?: number;
  readonly gte?: number;
  readonly in?: number[];
  readonly notIn?: number[];
  readonly between?: NumberRange;
  readonly isNull?: boolean;
  readonly isNotNull?: boolean;
}

export interface StringFilterOperator {
  readonly eq?: string | null;
  readonly notEq?: string | null;
  readonly contains?: string;
  readonly notContains?: string;
  readonly startsWith?: string;
  readonly notStartsWith?: string;
  readonly endsWith?: string;
  readonly notEndsWith?: string;
  readonly in?: string[];
  readonly notIn?: string[];
  readonly isNull?: boolean;
  readonly isNotNull?: boolean;
}

export interface JsonFilterOperator<T> {
  readonly jsonContains?: JsonContent<T>;
}

export type JsonContent<T> = {
  [P in keyof T]?: P extends "toString"
    ? string | number | boolean | symbol | null
    : JsonContent<T[P]>;
};

export type FilterOperator =
  | BooleanFilterOperator
  | DateFilterOperator
  | NumberFilterOperator
  | StringFilterOperator;

export type FilterProperty<Property> =
  Property extends Promise<infer I>
    ? FilterProperty<I> | FilterOperator
    : Property extends Array<infer I>
      ? FilterProperty<I> | FilterOperator
      : Property extends string
        ? FilterOperator
        : Property extends number
          ? FilterOperator
          : Property extends FilterOperator
            ? FilterOperator
            : Property extends Function
              ? never
              : Property extends Buffer
                ? FilterOperator
                : Property extends Date
                  ? FilterOperator
                  : Property extends object
                    ? Filter<Property> | JsonFilterOperator<Property>
                    : FilterOperator;

export type Filter<Entity> = {
  [P in keyof Entity]?: P extends "toString"
    ? unknown
    : FilterProperty<NonNullable<Entity[P]>>;
};
