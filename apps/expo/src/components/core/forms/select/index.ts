export * from "./Select";
export * from "./MultiSelect";

export type OptionValue = string | number;

export interface SelectOption {
  label: string;
  value: OptionValue;
  disabled?: boolean;
}
