import type { ComponentPropsWithoutRef } from "react";
import { TouchableOpacity } from "react-native";
import { Checkbox as NWCheckbox } from "../../../nativewindui/components/checkbox/Checkbox";
import type { DeepKeyOf } from "@e-market/utilities";
import { Text } from "../../presentations/text/Text";
import { cn } from "../../../nativewindui/lib/cn.util";
import { get } from "lodash";
import type { CheckboxGroupOption } from "./types";

type CheckboxBaseProps = Omit<
  ComponentPropsWithoutRef<typeof NWCheckbox>,
  "onCheckedChange" | "className" | "style"
>;

interface CheckboxItemProps<T> {
  option: CheckboxGroupOption<T>;
  index: number;
  selectedValues: T[];
  displayText?: DeepKeyOf<T>;
  onToggle: (value: T) => void;
}

const getValueFromPath = <T,>(entity: T, path: DeepKeyOf<T>): string => {
  return get(entity, path) as string;
};

const getDisplayText = <T,>(option: T, displayText?: DeepKeyOf<T>): string => {
  if (typeof option === "object" && displayText) {
    return getValueFromPath(option, displayText);
  }
  return String(option);
};

export const CheckboxGroupItem = <T,>({
  option,
  index,
  selectedValues,
  displayText,
  onToggle,
}: CheckboxItemProps<T>) => {
  const { entity, ...rest } = option;

  return (
    <TouchableOpacity
      key={index}
      onPress={() => !rest.disabled && onToggle(entity as T)}
      activeOpacity={1}
      className="flex flex-row items-center gap-2"
    >
      <NWCheckbox
        checked={selectedValues.some((v) =>
          typeof option === "object" && displayText
            ? getValueFromPath(v, displayText) ===
              getValueFromPath(entity as T, displayText)
            : v === option
        )}
        onCheckedChange={() => onToggle(entity as T)}
        {...(rest as CheckboxBaseProps)}
      />
      <Text
        className={cn("text-sm text-foreground", {
          "text-muted-foreground": rest.disabled,
        })}
      >
        {getDisplayText(entity as T, displayText)}
      </Text>
    </TouchableOpacity>
  );
};
