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
  group: string | undefined;
  invitations: Invitations[];
}

export interface Member {
  isAdmin?: boolean;
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
export interface DeleteGroupMember {
  userId: string | undefined;
  assessmentId: string | null;
}
export interface MemberUpdateRole {
  role?: string;
}

export type AssessmentGroupIncludeAble =
  | "members"
  | "members.user"
  | "invitations";
