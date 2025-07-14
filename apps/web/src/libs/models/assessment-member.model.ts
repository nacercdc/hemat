import type { User } from "./user.model";

export interface Invitations {
  email: string;
  role: string;
  assessmentId?: string;
  createdAt?: string;
  groupId?: string;
  status?: string | undefined;
}
export interface MemberInvitationGroup {
  group: string | null;
  invitations: Invitations[];
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
  invitations: Invitations[];
}

export interface MemberMoveTo {
  userId: string | undefined;
  toGroupId?: string;
  promoteUserId?: string;
}

export type AssessmentGroupIncludeAble =
  | "members"
  | "members.user"
  | "invitations";
