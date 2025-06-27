import { MemberRole } from '@shared/enums/member.enum';

export const rolePermissions: Record<MemberRole, string[]> = {
  [MemberRole.PRIMARY]: ['read', 'create', 'update', 'delete'],
  [MemberRole.TEAM_LEADER]: ['read', 'create', 'update'],
  [MemberRole.MEMBER]: ['read'],
};

export const methodToAction: Record<string, string> = {
  GET: 'read',
  POST: 'create',
  PUT: 'update',
  PATCH: 'update',
  DELETE: 'delete',
};
