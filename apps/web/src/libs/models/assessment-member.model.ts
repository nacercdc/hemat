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
}

export interface AssessmentGroup {
  name: string;
  members: Member[];
}
