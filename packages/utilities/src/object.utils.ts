/* eslint-disable @typescript-eslint/no-explicit-any */

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
  return getValue(entity, path as any) as string;
};

export function flattenParams(
  params: object,
  prefix?: string
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const key in params) {
    const value = (params as any)[key] ?? null;

    if (!value) continue;

    const newKey = prefix ? `${prefix}[${key}]` : key;

    if (typeof value === "object" && value !== null) {
      Object.assign(result, flattenParams(value, newKey));
    } else {
      result[newKey] = value;
    }
  }

  return result;
}
function getValue<T>(obj: T, path: string): unknown {
  return path.split(".").reduce((acc, part) => {
    if (acc && typeof acc === "object") {
      return acc[part];
    }
    return undefined;
  }, obj as any);
}
