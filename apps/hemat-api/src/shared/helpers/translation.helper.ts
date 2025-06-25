// Translation helper for entities supporting both translation structures
// Usage: getTranslated(entity, language, field, fallback)

export function getTranslated(
  obj: any,
  language: string | undefined,
  field: string,
  fallback: string
): string {
  if (!language || !obj || !obj.translations) return fallback;
  // New structure: { am: { name, description } }
  if (obj.translations[language] && obj.translations[language][field]) {
    return obj.translations[language][field];
  }
  // Old structure: { name: { am }, description: { am } }
  if (obj.translations[field] && obj.translations[field][language]) {
    return obj.translations[field][language];
  }
  return fallback;
} 