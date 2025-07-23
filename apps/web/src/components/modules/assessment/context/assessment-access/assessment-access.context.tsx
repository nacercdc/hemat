import React from "react";
import type { Access } from "~/libs/models/assessment.model";

interface IAssessmentAccess {
  access?: Access;
  setAccess: React.Dispatch<React.SetStateAction<Access | undefined>>;
}

export const AssessmentAccess = React.createContext<
  IAssessmentAccess | undefined
>(undefined);
