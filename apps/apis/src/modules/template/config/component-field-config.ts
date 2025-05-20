// component-field-config.ts
export const COMPONENT_FIELD_CONFIG = {
  includeRelations: ['domain', 'subComponents'],
  selectableFields: [
    'id',
    'code',
    'name',
    'description',
    'isActive',
    'domainId',
    'subComponents.id',
    'subComponents.code',
    'subComponents.name',
  ],
  searchableFields: ['name', 'description', 'code'],
  filterableFields: ['isActive', 'domainId'],
  sortableFields: ['name', 'code'],
  baseFields: [
    'id',
    'code',
    'name',
    'description',
    'isActive',
    'domainId',
    'subComponents.id',
    'subComponents.code',
    'subComponents.name',
  ],
};
