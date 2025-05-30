// domain-field-config.ts
export const DOMAIN_FIELD_CONFIG = {
  includeRelations: ['components'],
  selectableFields: [
    'id',
    'code',
    'name',
    'description',
    'isActive',
    'translations',
    'components.id',
    'components.code',
    'components.name',
  ],
  searchableFields: ['name', 'description', 'code'],
  filterableFields: ['isActive'],
  sortableFields: ['name', 'code'],
  baseFields: [
    'id',
    'code',
    'name',
    'description',
    'isActive',
    'translations',
    'components.id',
    'components.code',
    'components.name',
  ],
};
