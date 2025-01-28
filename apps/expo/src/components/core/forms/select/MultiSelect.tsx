import React from "react";
import type { SelectProps } from "@ui-kitten/components";
import {
  SelectItem,
  Select as UKSelect,
  IndexPath,
} from "@ui-kitten/components";

import { Label } from "~/components/shared/ui/Label";
import View from "../../presentations/view/View";
import { omit } from "~/utils/object";
import type { OptionValue, SelectOption } from ".";

interface Props
  extends Omit<
    SelectProps,
    "className" | "style" | "textStyle" | "selectedIndex" | "onSelect"
  > {
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
  label?: string;
  isRequired?: boolean;
  error?: string;
  options: SelectOption[];
  values: OptionValue[];
  onChange: (values: OptionValue[]) => void;
}

export default function MultiSelect({
  options,
  values,
  onChange,
  label,
  status,
  ...props
}: Props) {
  const selectedIndices = values
    .map((v) => new IndexPath(options.findIndex((opt) => opt.value === v)))
    .filter((index) => index.row >= 0);

  const displayValue = values
    .map((v) => options.find((opt) => opt.value === v)?.label)
    .filter(Boolean)
    .join(", ");

  const handleIndexChange = (indices: IndexPath | IndexPath[]) => {
    const indexArray = Array.isArray(indices) ? indices : [indices];
    const selectedValues = indexArray
      .map((idx) => options[idx.row]?.value)
      .filter((value): value is OptionValue => value !== undefined);
    onChange(selectedValues);
  };

  return (
    <View className="flex w-full">
      {label && <Label text={label} isRequired={props.isRequired} />}
      <UKSelect
        status={status}
        selectedIndex={selectedIndices}
        onSelect={handleIndexChange}
        value={displayValue}
        multiSelect={true}
        {...props}
        {...omit(
          props as SelectProps,
          "className",
          "style",
          "selectedIndex",
          "onSelect"
        )}
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
