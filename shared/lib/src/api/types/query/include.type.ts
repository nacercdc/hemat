/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/array-type */
export type IncludeProperty<Property> =
  Property extends Promise<infer I>
    ? IncludeProperty<NonNullable<I>> | boolean
    : Property extends Array<infer I>
      ? IncludeProperty<NonNullable<I>> | boolean
      : Property extends string
        ? never
        : Property extends number
          ? never
          : Property extends boolean
            ? never
            : Property extends Function
              ? never
              : Property extends Buffer
                ? never
                : Property extends Date
                  ? never
                  : Property extends object
                    ? Include<Property> | boolean
                    : boolean;

export type Include<Entity> = {
  [P in keyof Entity]?: P extends "toString"
    ? unknown
    : IncludeProperty<NonNullable<Entity[P]>>;
};
