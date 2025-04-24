"use client";

import { createContext } from "react";
import { createContextualCan } from "@casl/react";

import type { AppAbilityType } from "./ability";

export const AbilityContext = createContext<AppAbilityType>(
  {} as AppAbilityType
);

export default createContextualCan(AbilityContext.Consumer);
