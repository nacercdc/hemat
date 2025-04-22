export const cleanPath = (path: string) => path.replace(/^\/|\/$/g, "");
export const getInitials = (string?: string | null): string => {
  if (!string) return "";
  return string
    .split(/\s+/)
    .map((word) => word[0]?.toUpperCase())
    .join("");
};
