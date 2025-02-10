import get from "lodash.get";

export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  ...keys: K[]
) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as K))
  ) as Omit<T, K>;
}

export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  ...keys: K[]
) {
  return Object.fromEntries(
    keys.filter((key) => key in obj).map((key) => [key, obj[key]])
  ) as Pick<T, K>;
}

export type DeepKeyOf<T> = T extends object
  ? {
      [K in Exclude<keyof T, symbol>]:
        | K
        | (T[K] extends object ? `${K}.${DeepKeyOf<T[K]>}` : never);
    }[Exclude<keyof T, symbol>]
  : never;

export const getValueFromPath = <T>(entity: T, path: DeepKeyOf<T>): string => {
  return get(entity, path) as string;
};
