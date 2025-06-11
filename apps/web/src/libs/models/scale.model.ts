export interface Scale {
  id: string;
  name: string;
  rate: number;
  color: string;
  description: string;
  created_at?: string;
}

export type ScaleIncluded = "supplier" | "taxes";

export type ScaleFilterable =
  | "issue_date"
  | "due_date"
  | "status"
  | "is_recurring"
  | "created_at";

export type ScaleSortable = "created_at";

export type ScaleSorts = ScaleSortable[];
export type ScaleIncludes = ScaleIncluded | Scale[];
export type ScaleFilters = ScaleFilterable[];
