export const isHtmlStringEmpty = (html: string): boolean => {
  const parser = new DOMParser();

  const doc = parser.parseFromString(html, "text/html");

  const textContent = doc.body.textContent || "";

  return textContent.trim() === "";
};
