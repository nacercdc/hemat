export const getTokenExpireMilliseconds = (time?: string): number => {
  const minutes = getTokenExpireInMinutes(time);
  const now = new Date();
  return now.setMinutes(now.getMinutes() + minutes);
};

export const getTokenExpireInMinutes = (time?: string) => {
  let minutes = 15; // default: 15 minutes
  let unit = "m";
  const match = time?.match(/^(\d+)([msd])$/);
  if (match) {
    const matchIndex1 = match[1]; // Extracted number
    let number = 0;
    if (matchIndex1) number = parseInt(matchIndex1, 10);
    unit = match[2] ?? unit; // Extracted unit
    if (unit === "s") {
      minutes = number / 60;
    }
    if (unit === "m") {
      minutes = number;
    }
    if (unit === "d") {
      minutes = number * 24 * 60;
    }
  }
  return minutes;
};

export const rFC2822ToISO8601 = (rFC2822Date: string | Date) => {
  const date = new Date(rFC2822Date);
  if (!rFC2822Date) {
    return null;
  }
  return date.toISOString().split("T")[0];
};
