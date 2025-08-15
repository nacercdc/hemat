import type { Assessment } from "./assessment.model";

export type StatusType = "pending" | "accepted" | "rejected" | "expired";

export interface Invitation {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  email: string;
  assessmentId: string;
  assessment: Assessment;
  groupId: string;
  role: string;
  token: string;
  status: StatusType;
}

export type InvitationIncludable = "assessment";
export type InvitationFilterable = "status" | "createdAt";
export type InvitationSortable = "createdAt";
