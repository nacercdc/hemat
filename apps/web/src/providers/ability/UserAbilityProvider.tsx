"use client";

import React, { useEffect, useState } from "react";

import type { RawRuleTypes } from "./casl/types";
import { buildAbilityFor } from "./casl/ability";
import { AbilityContext } from "./casl/Can";
import { useGetMe } from "../me/useGetMe";

interface Props {
  children: React.ReactNode;
}
export default function UserAbilityProvider({ children }: Props) {
  const [rolesPermissions, setRolesPermissions] = useState<RawRuleTypes[]>([]);
  const { data: currentUser, ...currentUserState } = useGetMe();
  useEffect(() => {
    if (currentUserState.isSuccess && currentUser) {
      const permissions = [
        ...new Map(
          currentUser.roles
            .flatMap((role) => role.permissions)
            .concat(currentUser.permissions)
            .map((perm) => [`${perm.action}:${perm.subject}`, perm])
        ).values(),
      ];
      setRolesPermissions(permissions);
    }
  }, [currentUserState.isSuccess, currentUser]);

  return (
    <AbilityContext.Provider value={buildAbilityFor(rolesPermissions)}>
      {children}
    </AbilityContext.Provider>
  );
}
