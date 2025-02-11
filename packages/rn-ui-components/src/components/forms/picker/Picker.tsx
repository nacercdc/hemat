import type { ComponentPropsWithoutRef } from "react";
import {
  Picker as NWPicker,
  PickerItem as NWPickerItem,
} from "../../../nativewindui/components/picker/Picker";

import { FormController } from "../helper/FormController";
import { getValueFromPath, pick } from "@e-market/utilities";
import type { DeepKeyOf } from "@e-market/utilities";

import type { PickerOption } from "./types";

type PickerBaseProps = Omit<
  ComponentPropsWithoutRef<typeof NWPicker>,
  "className"
>;
type PickerItemBaseProps = Omit<
  ComponentPropsWithoutRef<typeof NWPickerItem>,
  "className" | "style"
>;

interface Props<T> extends PickerBaseProps {
  caption?: string;
  errorMessage?: string;
  label?: string;
  options: PickerOption<T>[];
  key?: DeepKeyOf<T>;
  displayText?: DeepKeyOf<T>;
  selectedValue?: T;
  onChange: (value: T) => void;
}

export const Picker = <T,>({
  caption,
  errorMessage,
  options,
  displayText,
  key,
  selectedValue,
  onChange,
}: Props<T>) => {
  const isSelected = (value: T) => {
    return selectedValue
      ? typeof value === "object" && key
        ? getValueFromPath(value, key) === getValueFromPath(selectedValue, key)
        : value === selectedValue
      : false;
  };

  const getDisplayText = <T,>(
    entity: T,
    displayText?: DeepKeyOf<T>
  ): string => {
    if (typeof entity === "object" && displayText) {
      return getValueFromPath(entity, displayText);
    }
    return String(entity);
  };
  return (
    <FormController errorMessage={errorMessage} caption={caption}>
      <NWPicker
        selectedValue={selectedValue}
        onValueChange={onChange}
        enabled
        selectionColor={"green"}
        className="flex border-2 border-red-500 rounded-md"
      >
        {options.map((option, index) => {
          const { entity, ...rest } = option;
          console.log(
            selectedValue
              ? typeof entity === "object" && key
                ? getValueFromPath(entity, key) ===
                  getValueFromPath(selectedValue, key)
                : entity === selectedValue
              : false
          );
          return (
            <NWPickerItem
              key={index}
              value={option}
              label={getDisplayText(entity, displayText)}
              enabled={option.enabled}
              style={{
                color: "black",
                backgroundColor: "green",
              }}
              {...pick(rest as PickerItemBaseProps, "enabled")}
            />
          );
        })}
      </NWPicker>
    </FormController>
  );
};
