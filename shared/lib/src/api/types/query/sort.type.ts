/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/array-type */
export type SortDirection = "ASC" | "DESC" | "asc" | "desc";
export type SortProperty<Property> =
  Property extends Promise<infer I>
    ? SortProperty<NonNullable<I>>
    : Property extends Array<infer I>
      ? SortProperty<NonNullable<I>>
      : Property extends Function
        ? never
        : Property extends string
          ? SortDirection
          : Property extends number
            ? SortDirection
            : Property extends boolean
              ? SortDirection
              : Property extends Buffer
                ? SortDirection
                : Property extends Date
                  ? SortDirection
                  : Property extends object
                    ? Sort<Property> | SortDirection
                    : SortDirection;

export type Sort<Entity> = {
  [P in keyof Entity]?: P extends "toString"
    ? unknown
    : SortProperty<NonNullable<Entity[P]>>;
};
