import React from "react";
import type { SelectProps, SelectItemProps } from "@ui-kitten/components";
import { SelectItem, Select as UKSelect } from "@ui-kitten/components";

import { omit } from "~/utils/object";
import View from "../../presentations/view/View";

export interface SelectOption
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
  options: SelectOption[];
}

export default function Select({ options, ...props }: Props) {
  return (
    <View className="w-full">
      <UKSelect {...omit(props as SelectProps, "className", "style")}>
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
