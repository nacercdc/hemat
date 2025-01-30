import type { ReactText } from "react";
import React, { useState } from "react";
import type {
  SelectProps,
  SelectItemProps,
  IndexPath,
} from "@ui-kitten/components";
import { SelectItem, Select as UKSelect } from "@ui-kitten/components";

import { omit } from "~/utils/object";
import View from "../../presentations/view/View";
import type { SelectOption } from "./types";

interface Props<Entity>
  extends Omit<
    SelectProps,
    | "className"
    | "style"
    | "textStyle"
    | "children"
    | "value"
    | "multiSelect"
    | "selectedIndex"
    | "onSelect"
  > {
  size?: "small" | "medium" | "large";
  status?:
    | "basic"
    | "primary"
    | "success"
    | "info"
    | "warning"
    | "danger"
    | "control";

  options: SelectOption<Entity>[];
  selectedItem?: Entity;
  displayText: keyof Entity;
  onSelectItem: (entity: Entity) => void;
}

export default function Select<Entity extends object>({
  options,
  displayText,
  selectedItem,
  onSelectItem,
  ...props
}: Props<Entity>) {
  const [selectedIndex, setSelectedIndex] = useState<IndexPath | IndexPath[]>();

  const getValues = (index: IndexPath | IndexPath[]) => {
    return options[(index as IndexPath).row]?.entity;
  };

  const handleSelect = (index: IndexPath | IndexPath[]) => {
    setSelectedIndex(index);
    const entity = getValues(index);
    if (entity) onSelectItem(entity);
  };

  return (
    <View className="w-full">
      <UKSelect
        {...omit(
          props as SelectProps,
          "className",
          "style",
          "children",
          "value",
          "multiSelect",
          "selectedIndex",
          "onSelect"
        )}
        value={
          selectedItem ? (selectedItem[displayText] as ReactText) : undefined
        }
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
      >
        {options.map((option, index) => {
          const { entity, ...rest } = option;
          return (
            <SelectItem
              key={index}
              title={entity[displayText] as ReactText}
              {...omit(
                rest as SelectItemProps,
                "className",
                "style",
                "children"
              )}
            />
          );
        })}
      </UKSelect>
    </View>
  );
}
