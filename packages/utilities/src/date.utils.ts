/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const getTokenExpireMilliseconds = (time?: string): number => {
  const minutes = getTokenExpireInMinutes(time);
  const now = new Date();
  return now.setMinutes(now.getMinutes() + minutes);
};

export const getTokenExpireInMinutes = (time?: string) => {
  let minutes = 15;
  let unit = "m";
  const match = time?.match(/^(\d+)([msd])$/);
  if (match) {
    const matchIndex1 = match[1];
    let number = 0;
    if (matchIndex1) number = parseInt(matchIndex1, 10);
    unit = match[2] ?? unit;
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

export const formatDateToYYYYMMDD = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    throw new Error("Invalid date passed to formatDateToYYYYMMDD");
  }
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseYYYYMMDDToDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year!, month! - 1, day);
};

export const formatToMonthDayYear = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
