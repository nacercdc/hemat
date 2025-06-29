export interface AssessmentDomainProgress {
  id: string;
  name: string;
  percentage: number;
}

export interface AssessmentGroupProgress {
  id: string;
  name: string;
  domains: AssessmentDomainProgress[];
}

export interface AssessmentPrimaryProgress {
  assessmentId: string;
  domains: AssessmentDomainProgress[];
}

export interface DomainSubComponentCount {
  domainId: string;
  domainName: string;
  subComponentCount: number;
}

export interface DomainAnswerCount {
  domainId: string;
  answerCount: number;
}

export interface GroupDomainAnswerCount {
  domainId: string;
  domainName: string;
  groupId: string;
  groupName: string;
  answerCount: number;
}

export interface ProgressQueryOptions {
  filterByGroupIds?: string[];
  includePrimary?: boolean;
  language?: string;
}
