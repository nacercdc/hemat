/* eslint-disable @typescript-eslint/no-explicit-any */

export interface RawRuleTypes {
  action: string | string[];
  subject?: string | string[];
  fields?: string[];
  conditions?: any;
  inverted?: boolean;
  reason?: string;
}

export enum PermissionActionEnum {
  READ = "read",
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  REMOVE = "remove",
  RESTORE = "restore",
}

export enum PermissionSubjectEnum {
  ASSESSMENT = "assessment",
  ASSESSMENT_ANSWER = "assessment-answer",
  ASSESSMENT_COMPONENT = "assessment-component",
  ASSESSMENT_DOMAIN = "assessment-domain",
  ASSESSMENT_GROUP = "assessment-group",
  ASSESSMENT_LANGUAGE = "assessment-language",
  ASSESSMENT_MEASUREMENT_SCALE = "assessment-measurement-scale",
  ASSESSMENT_MEMBER = "assessment-member",
  ASSESSMENT_SUB_COMPONENT = "assessment-sub-component",
  COMMENT = "comment",
  COMPONENT = "component",
  COUNTRY = "country",
  DASHBOARD = "dashboard",
  DOMAIN = "domain",
  INVITATION = "invitation",
  LANGUAGE = "language",
  MEASUREMENT_SCALE = "measurement-scale",
  MEASUREMENT_SCALE_SUB_COMPONENT = "measurement-scale-sub-component",
  PERMISSION = "permission",
  PROFILE = "profile",
  REPORT = "report",
  RESPONSE = "response",
  ROADMAP = "roadmap",
  ROLE = "role",
  SUB_COMPONENT = "sub-component",
  USER = "user",
}
