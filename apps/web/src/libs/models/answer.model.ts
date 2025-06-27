interface MeasurementScale {
  id: string;
  name: string;
  rate: number;
}

export interface Answer {
  id: string;
  evidence: string;
  reference: string;
  measurementScale: MeasurementScale;
  subComponentId: string;
  createdAt: string;
}

export type AnswerIncludable = "measurementScale";
