import { useContext } from "react";
import { AssessmentAccess } from "./assessment-access.context";

export const useAssessmentAccess = () => useContext(AssessmentAccess);
