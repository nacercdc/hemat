/* eslint-disable @typescript-eslint/no-explicit-any */
export const serializeFormData = <T extends Record<string, any>>(
  data: Record<string, any>
): T => {
  Object.keys(data ?? {}).forEach((key) => {
    const value = data[key] ?? null;
    if (typeof value === "object") {
      data[key] = serializeFormData(value);
    }

    if (typeof value === "string") {
      data[key] = value.trim();
    }

    if (value === "" || value === null || value === undefined) {
      delete data[key];
    }
  });
  return data as T;
};
