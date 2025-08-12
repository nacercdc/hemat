import type { Assessment } from "./assessment.model";
import type { User } from "./user.model";

export type StatusType =
  | "draft"
  | "pending"
  | "closed"
  | "ready"
  | "inprogress"
  | "completed";

export interface Roadmap {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface RoadmapDomain {
  id: string;
  name: string;
  code: string;
  description: string;
  components: RoadmapComponent[];
}

export interface RoadmapComponent {
  id: string;
  code: string;
  name: string;
  description: string;
  subComponents: RoadmapSubComponent[];
}

export interface RoadmapSubComponent {
  id: string;
  name: string;
  code: string;
  description: string;
  roadmap?: {
    id: string;
    target: number;
    currentState: number;
    activities: string;
    responsible: string;
    resources: string;
    gapAddressed: string;
    startTime: string;
    endTime: string;
  };
}

export interface RoadmapList {
  id: string;
  assessmentId: string;
  userId: string;
  isPrimary: true;
  percentage: 0;
  status: StatusType;
  createdAt: string;
  updatedAt: string;
  assessment: Assessment;
  user: User;
}

export type RoadmapAnswerIncludable = "measurementScale";
export type RoadmapListIncludable = "assessment" | "user";
export type RoadmapListFilterable = "status" | "createdAt";
export type RoadmapListSortable = "createdAt";
