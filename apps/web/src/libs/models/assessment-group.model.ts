import type { Domain } from "./domain.model";

export interface Group {
  id: string;
  name: string;
  assessmentId: string;
  domains: Domain[];
}

export type GroupIncludeAble = "domains";
