export const cleanPath = (path: string) => path.replace(/^\/|\/$/g, "");
export const getInitials = (string?: string | null): string => {
  if (!string) return "";
  return string
    .split(/\s+/)
    .map((word) => word[0]?.toUpperCase())
    .join("");
};

export const capitalizeFirstLetter = (str: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};
