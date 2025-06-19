export interface AssessmentDomain {
  id: string;
  name: string;
  code: string;
  description: string;
  assessmentId: string;
}

export interface AssessmentComponent {
  id: string;
  name: string;
  code: string;
  description: string;
  assessmentId: string;
  domainId: string;
}
export interface AssessmentSubComponent {
  id: string;
  name: string;
  code: string;
  description: string;
  componentId: string;
  assessmentId: string;
}

export interface AssessmentMeasurementScale {
  id: string;
  name: string;
  code: string;
  description: string;
  assessmentId: string;
}

export interface AssessmentSubComponentMeasurementScale {
  description: string;
  subComponentId: string;
  measurementScaleId: string;
  translations: Record<string, { description: string }>;
}
