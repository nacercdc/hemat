import type { MeasurementScale } from "./answer.model";

export interface RoadmapAnswer {
  id: string;
  startTime: string;
  endTime: string;
  gapAddressed: string;
  activities: string;
  responsible: string;
  resources: string;
  measurementScale: MeasurementScale;
  measurementScaleId: string;
  subComponentId: string;
  componentId: string;
  documentUrl?: string;
  domainId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export type RoadmapAnswerIncludable = "measurementScale";
