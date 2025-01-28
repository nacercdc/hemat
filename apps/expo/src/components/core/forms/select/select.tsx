import React from "react";
import type { SelectProps } from "@ui-kitten/components";
import { SelectItem, Select as UKSelect } from "@ui-kitten/components";
import Text from "../../presentations/text/Text";
import { cn } from "~/utils/cn";
import View from "../../presentations/view/View";

type OptionValue = string | number;

export interface SelectOption {
  label: string;
  value: OptionValue;
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
  label?: string;
  isRequired?: boolean;
  error?: string;
  mode?: "row" | "col";
  options: SelectOption[];
  value: OptionValue;
  onChange: (value: OptionValue) => void;
}

export default function Select({
  mode,
  options,
  value,
  onChange,
  label,
  status,
}: Props) {
  const selectedIndex = options.findIndex((option) => option.value === value);

  const handleIndexChange = (index: number) => {
    const selectedOption = options[index];
    if (selectedOption) {
      const selectedValue = selectedOption.value;
      onChange(selectedValue);
    }
  };

  return (
    <View>
      {label && <Text category="label">{label}</Text>}
      <UKSelect
        selectedIndex={selectedIndex}
        onChange={handleIndexChange}
        className={cn("flex gap-2 ", {
          "flex-col": mode === "col",
          "flex-row": mode === "row",
        })}
      >
        {options.map((option) => (
          <SelectItem
            key={option.value}
            status={status}
            disabled={option.disabled}
            children={option.label}
          />
        ))}
      </UKSelect>
    </View>
  );
}
