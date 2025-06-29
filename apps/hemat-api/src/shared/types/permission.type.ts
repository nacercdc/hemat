import { PermissionActionEnum, PermissionSubjectEnum } from '../enums';

export interface PermissionRule {
  action: PermissionActionEnum;
  subject: PermissionSubjectEnum;
}

export interface AbilityParams {
  isAdmin?: boolean;
  roles?: [string, ...string[]];
  permissions?: [PermissionRule, ...PermissionRule[]];
  requireAdmin?: boolean;
}
