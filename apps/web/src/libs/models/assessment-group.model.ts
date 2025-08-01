import type { Domain } from "./domain.model";

export interface Group {
  id: string;
  name: string;
  assessmentId: string;
  domains: Domain[];
}

export interface AssessmentDomains {
  domains: string;
}

export interface AssignDomainToAssessmentGroup {
  domainIds: string[];
}
export interface GroupDomainDelete {
  domainIds: string;
}
export type GroupIncludeAble = "domains";
