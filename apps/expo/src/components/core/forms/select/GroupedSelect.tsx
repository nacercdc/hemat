import React from "react";
import type { SelectItemProps, SelectProps } from "@ui-kitten/components";
import {
  SelectGroup,
  SelectItem,
  Select as UKSelect,
} from "@ui-kitten/components";

import View from "../../presentations/view/View";
import { omit } from "~/utils/object";

export interface GroupedSelectItemOption
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

export interface GroupedSelectOption {
  name: string;
  options: GroupedSelectItemOption[];
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
  groups: GroupedSelectOption[];
}

export default function GroupedSelect({ groups, ...props }: Props) {
  return (
    <View className="flex w-full">
      <UKSelect
        multiSelect={true}
        {...omit(props as SelectProps, "className", "style")}
      >
        {groups.map((group, groupIndex) => (
          <SelectGroup key={groupIndex} title={group.name}>
            {group.options.map((option, index) => (
              <SelectItem
                key={index}
                {...omit(option as SelectItemProps, "className", "style")}
              />
            ))}
          </SelectGroup>
        ))}
      </UKSelect>
    </View>
  );
}
