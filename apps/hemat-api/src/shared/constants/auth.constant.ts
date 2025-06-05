import { PermissionActionEnum, PermissionSubjectEnum } from '../enums';

export const ABILITIES = 'abilities';

export const DEFAULT_ROLES = {
  SUPER_ADMIN: 'super-administrator',
};
export const COMMON_PERMISSION_ACTIONS: Record<string, PermissionActionEnum> = {
  READ: PermissionActionEnum.READ,
  CREATE: PermissionActionEnum.CREATE,
  UPDATE: PermissionActionEnum.UPDATE,
  DELETE: PermissionActionEnum.DELETE,
  REMOVE: PermissionActionEnum.REMOVE,
  RESTORE: PermissionActionEnum.RESTORE,
};

export const PERMISSION_SUBJECTS: Record<string, PermissionSubjectEnum> = {
  ASSESSMENT: PermissionSubjectEnum.ASSESSMENT,
  ASSESSMENT_ANSWER: PermissionSubjectEnum.ASSESSMENT_ANSWER,
  ASSESSMENT_COMPONENT: PermissionSubjectEnum.ASSESSMENT_COMPONENT,
  ASSESSMENT_DOMAIN: PermissionSubjectEnum.ASSESSMENT_DOMAIN,
  ASSESSMENT_GROUP: PermissionSubjectEnum.ASSESSMENT_GROUP,
  ASSESSMENT_LANGUAGE: PermissionSubjectEnum.ASSESSMENT_LANGUAGE,
  ASSESSMENT_MEASUREMENT_SCALE:
    PermissionSubjectEnum.ASSESSMENT_MEASUREMENT_SCALE,
  ASSESSMENT_MEMBER: PermissionSubjectEnum.ASSESSMENT_MEMBER,
  ASSESSMENT_SUB_COMPONENT: PermissionSubjectEnum.ASSESSMENT_SUB_COMPONENT,
  COMMENT: PermissionSubjectEnum.COMMENT,
  COMPONENT: PermissionSubjectEnum.COMPONENT,
  COUNTRY: PermissionSubjectEnum.COUNTRY,
  DASHBOARD: PermissionSubjectEnum.DASHBOARD,
  DOMAIN: PermissionSubjectEnum.DOMAIN,
  INVITATION: PermissionSubjectEnum.INVITATION,
  LANGUAGE: PermissionSubjectEnum.LANGUAGE,
  MEASUREMENT_SCALE: PermissionSubjectEnum.MEASUREMENT_SCALE,
  MEASUREMENT_SCALE_SUB_COMPONENT:
    PermissionSubjectEnum.MEASUREMENT_SCALE_SUB_COMPONENT,
  PERMISSION: PermissionSubjectEnum.PERMISSION,
  PROFILE: PermissionSubjectEnum.PROFILE,
  REPORT: PermissionSubjectEnum.REPORT,
  RESPONSE: PermissionSubjectEnum.RESPONSE,
  ROADMAP: PermissionSubjectEnum.ROADMAP,
  ROLE: PermissionSubjectEnum.ROLE,
  SUB_COMPONENT: PermissionSubjectEnum.SUB_COMPONENT,
  USER: PermissionSubjectEnum.USER,
};

export const APPROVE_PERMISSION_ACTIONS: Record<string, PermissionActionEnum> =
  {
    APPROVE: PermissionActionEnum.APPROVE,
    REJECT: PermissionActionEnum.REJECT,
  };
