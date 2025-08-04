import type { Assessment } from "./assessment.model";
import type { User } from "./user.model";

export interface Roadmap {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface RoadmapList {
  id: string;
  assessmentId: string;
  userId: string;
  isPrimary: true;
  percentage: 0;
  status: string;
  createdAt: string;
  updatedAt: string;
  assessment: Assessment;
  user: User;
}

export type RoadmapAnswerIncludable = "measurementScale";
export type RoadmapListIncludable = "assessment" | "user";
export type RoadmapListFilterable = "status" | "createdAt";
export type RoadmapListSortable = "createdAt";
