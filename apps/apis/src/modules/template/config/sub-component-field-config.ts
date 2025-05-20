export const SUB_COMPONENT_FIELD_CONFIG = {
  includeRelations: ['component', 'measurementScaleSubComponents'],
  selectableFields: [
    'id',
    'code',
    'name',
    'description',
    'isActive',
    'componentId',
  ],
  searchableFields: ['name', 'description', 'code'],
  filterableFields: ['isActive', 'componentId'],
  sortableFields: ['name', 'code'],
  baseFields: ['id', 'code', 'name', 'description', 'isActive', 'componentId'],
};

