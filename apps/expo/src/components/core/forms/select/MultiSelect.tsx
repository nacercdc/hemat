import React from "react";
import type { SelectItemProps, SelectProps } from "@ui-kitten/components";
import { SelectItem, Select as UKSelect } from "@ui-kitten/components";

import View from "../../presentations/view/View";
import { omit } from "~/utils/object";

export interface MultiSelectOption
  extends Omit<SelectItemProps, "className" | "style"> {
  status?:
    | "basic"
    | "primary"
    | "success"
    | "info"
    | "warning"
    | "danger"
    | "control";
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
    | "control";
  options: MultiSelectOption[];
}

export default function MultiSelect({ options, ...props }: Props) {
  return (
    <View className="flex w-full">
      <UKSelect
        multiSelect={true}
        {...omit(props as SelectProps, "className", "style")}
      >
        {options.map((option, index) => (
          <SelectItem
            key={index}
            {...omit(option as SelectItemProps, "className", "style")}
          />
        ))}
      </UKSelect>
    </View>
  );
}
