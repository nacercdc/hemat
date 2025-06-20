export const safeDate = (input: unknown): Date | undefined => {
  if (!input) return undefined;
  if (input instanceof Date && !isNaN(input.getTime())) return input;
  const date = new Date(input as string | number);
  return isNaN(date.getTime()) ? undefined : date;
};

export const formatHumanDate = (input: unknown): string | undefined => {
  const date = new Date(input as string | number | Date);
  if (isNaN(date.getTime())) return undefined;

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  return `${month} ${day}${getOrdinal(day)}, ${year}`;
};
