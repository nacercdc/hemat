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
  VIEW = "view",
  CREATE = "create",
  EDIT = "edit",
  DELETE = "delete",
}

export enum PermissionSubjectEnum {
  // TODO: list here all subjects
  USERS = "users",
}
