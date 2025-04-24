"use client";

import React, { useEffect, useState } from "react";

import type { RawRuleTypes } from "./casl/types";
import { buildAbilityFor } from "./casl/ability";
import { AbilityContext } from "./casl/Can";
import { mapPermissions as _ } from "./casl/utils/split-array.util";

interface Props {
  children: React.ReactNode;
}
export default function UserAbilityProvider({ children }: Props) {
  const [rolePermissions, _setRolePermissions] = useState<RawRuleTypes[]>([]);

  useEffect(() => {
  // TODO: populate "can" configs
  }, []);

  return (
    <AbilityContext.Provider value={buildAbilityFor(rolePermissions)}>
      {children}
    </AbilityContext.Provider>
  );
}
