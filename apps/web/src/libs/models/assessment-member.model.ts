import { User } from "./user.model";

export interface MemberInvitation {
  id?: string;
  email: string[];
  role?: string;
  assessment_id: string;
  group?: string;
}

export interface Member {
  email: string;
  isLeader?: boolean;
  name: string;
  role?: string;
  userId?: string;
  user?: User;
}

export interface AssessmentGroup {
  assessmentId: string | null;
  createdAt: string | null;
  deletedAt: string | null;
  updatedAt: string | null;
  id?: string;
  name: string;
  members: Member[];
}

export interface MemberMoveTo {
  userId: string;
  toGroupId?: string;
  promoteUserId?: string;
}

export type AssessmentGroupIncludeAble = "members" | "members.user";
