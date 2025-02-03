export function omit<T extends Record<string, unknown>, K extends keyof T>(obj: T, ...keys: K[]) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as K))
  ) as Omit<T, K>;
}

export function pick<T extends Record<string, unknown>, K extends keyof T>(obj: T, ...keys: K[]) {
  return Object.fromEntries(
    keys.filter((key) => key in obj).map((key) => [key, obj[key]])
  ) as Pick<T, K>;
}
