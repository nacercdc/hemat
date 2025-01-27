/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/array-type */
export type SelectProperty<Property> =
  Property extends Promise<infer I>
    ? SelectProperty<I> | boolean
    : Property extends Array<infer I>
      ? SelectProperty<I> | boolean
      : Property extends string
        ? boolean
        : Property extends number
          ? boolean
          : Property extends boolean
            ? boolean
            : Property extends Function
              ? never
              : Property extends Buffer
                ? boolean
                : Property extends Date
                  ? boolean
                  : Property extends object
                    ? Select<Property>
                    : boolean;

export type Select<Entity> = {
  [P in keyof Entity]?: P extends "toString"
    ? unknown
    : SelectProperty<NonNullable<Entity[P]>>;
};
