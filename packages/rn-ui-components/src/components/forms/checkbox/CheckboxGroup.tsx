import type { ComponentPropsWithoutRef } from "react";
import { View } from "react-native";
import type { Checkbox as NWCheckbox } from "../../../nativewindui/components/checkbox/Checkbox";
import { FormController } from "../helper/FormController";
import { getValueFromPath } from "@etm/utilities";
import type { DeepKeyOf } from "@etm/utilities";
import { Text } from "../../presentations/text/Text";
import { cn } from "../../../nativewindui/lib/cn.util";
import type { CheckboxGroupOption } from "./types";
import { CheckboxGroupItem } from "./components/CheckboxGroupItem";

type CheckboxGroupLayout = "row" | "col";

type CheckboxBaseProps = Omit<
  ComponentPropsWithoutRef<typeof NWCheckbox>,
  "onCheckedChange" | "className" | "style"
>;

interface Props<T> extends CheckboxBaseProps {
  caption?: string;
  errorMessage?: string;
  label?: string;
  options: CheckboxGroupOption<T>[];
  key?: DeepKeyOf<T>;
  displayText?: DeepKeyOf<T>;
  selectedValues: T[];
  onChange: (values: T[]) => void;
  layout?: CheckboxGroupLayout;
}

export const CheckboxGroup = <T,>({
  caption,
  errorMessage,
  label,
  options,
  key,
  displayText,
  selectedValues,
  onChange,
  layout = "col",
}: Props<T>) => {
  const handleToggle = (value: T) => {
    const isSelected = selectedValues.some((v) =>
      typeof value === "object" && key
        ? getValueFromPath(v, key) === getValueFromPath(value, key)
        : v === value
    );

    const newValues = isSelected
      ? selectedValues.filter((v) =>
          typeof value === "object" && key
            ? getValueFromPath(v, key) !== getValueFromPath(value, key)
            : v !== value
        )
      : [...selectedValues, value];

    onChange(newValues);
  };

  return (
    <FormController errorMessage={errorMessage} caption={caption}>
      {label && (
        <Text className="text-sm font-medium text-foreground">{label}</Text>
      )}
      <View
        className={cn("flex", {
          "flex-col gap-3": layout === "col",
          "flex-row flex-wrap gap-4": layout === "row",
        })}
      >
        {options.map((option, index) => (
          <CheckboxGroupItem
            key={index}
            option={option}
            index={index}
            selectedValues={selectedValues}
            displayText={displayText}
            onToggle={handleToggle}
          />
        ))}
      </View>
    </FormController>
  );
};
