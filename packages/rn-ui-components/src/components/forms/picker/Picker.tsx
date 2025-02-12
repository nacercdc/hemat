import type { ComponentPropsWithoutRef } from "react";
import {
  Picker as NWPicker,
  PickerItem as NWPickerItem,
} from "../../../nativewindui/components/picker/Picker";

import { FormController } from "../helper/FormController";
import { getValueFromPath } from "@e-market/utilities";
import type { DeepKeyOf } from "@e-market/utilities";

import type { PickerOption } from "./types";

type PickerBaseProps = Pick<
  ComponentPropsWithoutRef<typeof NWPicker>,
  "enabled"
>;
type PickerItemBaseProps = Pick<
  ComponentPropsWithoutRef<typeof NWPickerItem>,
  "enabled"
>;

interface Props<T> extends PickerBaseProps {
  caption?: string;
  errorMessage?: string;
  label?: string;
  options: PickerOption<T>[];
  displayText?: DeepKeyOf<T>;
  selectedValue?: T;
  onChange: (value: T) => void;
}

export const Picker = <T,>({
  caption,
  errorMessage,
  options,
  displayText,
  selectedValue,
  onChange,
}: Props<T>) => {
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
      <NWPicker selectedValue={selectedValue} onValueChange={onChange} enabled>
        {options.map((option, index) => {
          const { entity, ...rest } = option;
          return (
            <NWPickerItem
              key={index}
              value={option}
              label={getDisplayText(entity, displayText)}
              enabled={option.enabled}
              {...(rest as PickerItemBaseProps)}
            />
          );
        })}
      </NWPicker>
    </FormController>
  );
};
