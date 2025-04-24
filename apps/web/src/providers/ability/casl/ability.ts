import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import type { MongoAbility, MongoQuery, SubjectRawRule } from "@casl/ability";

import type {
  PermissionActionEnum,
  PermissionSubjectEnum,
  RawRuleTypes,
} from "./types";

type AppAbilityTuple = [PermissionActionEnum, PermissionSubjectEnum];

export type AppAbilityType = MongoAbility<AppAbilityTuple, MongoQuery>;

export const AppAbility = createMongoAbility<AppAbilityTuple>();

export default function defineRulesFor(
  permissions: RawRuleTypes[]
): SubjectRawRule<PermissionActionEnum, PermissionSubjectEnum, MongoQuery>[] {
  const { can, rules } = new AbilityBuilder<AppAbilityType>(createMongoAbility);

  for (const permission of permissions) {
    can(
      permission.action as PermissionActionEnum,
      permission.subject as PermissionSubjectEnum
    );
  }

  return rules;
}

export function buildAbilityFor(permissions: RawRuleTypes[]): AppAbilityType {
  return createMongoAbility<AppAbilityTuple>(defineRulesFor(permissions));
}
