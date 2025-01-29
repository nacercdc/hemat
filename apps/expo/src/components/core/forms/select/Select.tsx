import React from "react";
import type { SelectProps } from "@ui-kitten/components";
import { SelectItem, Select as UKSelect } from "@ui-kitten/components";

import { omit } from "~/utils/object";
import View from "../../presentations/view/View";
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface Props extends Omit<SelectProps, "className" | "style" | "textStyle"> {
  size?: "small" | "medium" | "large";
  status?:
    | "basic"
    | "primary"
    | "success"
    | "info"
    | "warning"
    | "danger"
    | "control"
    | "link";
  options: SelectOption[];
}

export default function Select({ options, ...props }: Props) {
  return (
    <View className="w-full">
      <UKSelect
        {...props}
        {...omit(props as SelectProps, "className", "style")}
      >
        {options.map((option) => (
          <SelectItem
            key={option.value}
            disabled={option.disabled}
            title={option.label}
          />
        ))}
      </UKSelect>
    </View>
  );
}
