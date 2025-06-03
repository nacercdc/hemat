export const isValidHexColor = (color: string) =>
  /^#[0-9A-Fa-f]{6}$/.test(color);

export const toLocaleStringFormat = (value?: number | null) => {
  return !value || value === 0
    ? "0.00"
    : Number(value.toFixed(2)).toLocaleString();
};

export const isNill = (value: string | number | boolean | object) => {
  return value === undefined || value === null || value === "";
};

export const cleanPath = (path: string) => path.replace(/^\/|\/$/g, "");
