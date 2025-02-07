import type { ComponentPropsWithoutRef } from "react";
import { View } from "react-native";
import { Checkbox as NWCheckbox } from "../../../nativewindui/components/checkbox/Checkbox";
import { FormController } from "../helper/FormController";
import { TouchableOpacity } from "react-native";
import { omit } from "@e-market/utilities";
import { Text } from "../../presentations/text/Text";

interface Option {
  label: string;
  value: string;
}

interface Props
  extends Omit<
    ComponentPropsWithoutRef<typeof NWCheckbox>,
    "onCheckedChange" | "className" | "style"
  > {
  caption?: string;
  errorMessage?: string;
  label?: string;
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  layout?: "col" | "row";
}

export const CheckboxGroup = ({
  caption,
  errorMessage,
  label,
  options,
  selectedValues,
  onChange,
  layout = "col",
  ...props
}: Props) => {
  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  return (
    <FormController errorMessage={errorMessage} caption={caption}>
      {label && (
        <Text className="text-sm font-medium text-foreground mb-1">
          {label}
        </Text>
      )}
      <View
        className={`flex ${layout === "col" ? "flex-col gap-3" : "flex-row flex-wrap gap-4"}`}
      >
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => handleToggle(option.value)}
            activeOpacity={1}
            className="flex flex-row items-center gap-2"
          >
            <NWCheckbox
              checked={selectedValues.includes(option.value)}
              onCheckedChange={() => handleToggle(option.value)}
              {...omit(
                props as ComponentPropsWithoutRef<typeof NWCheckbox>,
                "onCheckedChange",
                "className",
                "style"
              )}
            />
            <Text className="text-sm text-foreground">{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </FormController>
  );
};
