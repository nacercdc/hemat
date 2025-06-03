export function pick<T extends {}, K extends keyof T>(obj: T, ...keys: K[]) {
  return Object.fromEntries(
    keys.filter((key) => key in obj).map((key) => [key, obj[key]]),
  ) as Pick<T, K>;
}

export function inclusivePick<T extends {}, K extends string | number | symbol>(
  obj: T,
  ...keys: K[]
) {
  Object.fromEntries(
    keys.map((key) => [key, obj[key as unknown as keyof T]]),
  ) as { [key in K]: key extends keyof T ? T[key] : undefined };
}

export function omit<T extends {}, K extends keyof T>(obj: T, ...keys: K[]) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as K)),
  ) as Omit<T, K>;
}

type ObjPathProxy<TRoot, T> = {
  [P in keyof T]: ObjPathProxy<TRoot, T[P]>;
};

type ObjProxyArg<TRoot, T> =
  | ObjPathProxy<TRoot, T>
  | ((p: ObjPathProxy<TRoot, TRoot>) => ObjPathProxy<TRoot, T>);

const pathSymbol = Symbol('Object path');
function createProxy<T>(path: PropertyKey[] = []): ObjPathProxy<T, T> {
  const proxy = new Proxy(
    { [pathSymbol]: path },
    {
      get(target, key) {
        if (key === pathSymbol) {
          return target[pathSymbol];
        }

        if (typeof key === 'string') {
          const intKey = parseInt(key, 10);

          if (key === intKey.toString()) {
            key = intKey.toString();
          }
        }

        return createProxy([...(path || []), key]);
      },
    },
  );

  return proxy as any as ObjPathProxy<T, T>;
}

export function getPath<TRoot, T>(proxy: ObjProxyArg<TRoot, T>): PropertyKey[] {
  if (typeof proxy === 'function') {
    proxy = proxy(createProxy<TRoot>());
  }

  return (proxy as any)[pathSymbol];
}

export function getNestedValue<T extends object>(
  input: T,
  keys: string[],
): any {
  let value: any = input;
  for (const key of keys) {
    if (typeof value !== 'object') break;

    value = value[key] ?? '';
  }

  return value;
}

export const hasOtherValues = <T>(obj: T, targetKey: keyof T): boolean =>
  Object.entries(obj as object).some(([key, value]) => {
    if (key === targetKey) return false;
    return value !== undefined && value !== null;
  });
