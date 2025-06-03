export const MEASUREMENT_SCALE_FIELD_CONFIG = {
  includeRelations: [],
  selectableFields: [
    'id',
    'name',
    'description',
    'translations',
    'color',
    'rate',
  ],
  searchableFields: ['name', 'description'],
  filterableFields: ['rate'],
  sortableFields: ['rate', 'name'],
  baseFields: ['id', 'name', 'description', 'translations', 'color', 'rate'],
};
