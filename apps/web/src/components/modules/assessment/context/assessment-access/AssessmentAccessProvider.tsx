"use client";

import { useState } from "react";
import type { Access } from "~/libs/models/assessment.model";
import { AssessmentAccess } from "./assessment-access.context";

export function AssessmentAccessProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [access, setAccess] = useState<Access | undefined>();

  return (
    <AssessmentAccess.Provider value={{ access, setAccess }}>
      {children}
    </AssessmentAccess.Provider>
  );
}
