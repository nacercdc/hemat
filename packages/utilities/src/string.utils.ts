export const isValidHexColor = (color: string) =>
  /^#[0-9A-Fa-f]{6}$/.test(color);
