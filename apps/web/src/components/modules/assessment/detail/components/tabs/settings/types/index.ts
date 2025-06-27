export interface AssessmentComponent {
  id: string;
  name: string;
  code: string;
  description: string;
  assessmentId: string;
  domainId: string;
}

export interface AssessmentSubComponentMeasurementScale {
  description: string;
  subComponentId: string;
  measurementScaleId: string;
  translations: Record<string, { description: string }>;
}
