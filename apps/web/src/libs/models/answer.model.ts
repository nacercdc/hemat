export interface MeasurementScale {
  id: string;
  name: string;
  rate: number;
}

export interface Answer {
  id: string;
  evidence: string;
  reference: string;
  notes?: string;
  answerId: string;
  measurementScale: MeasurementScale;
  measurementScaleId: string;
  subComponentId: string;
  componentId: string;
  domainId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export type AnswerIncludable = "measurementScale";
