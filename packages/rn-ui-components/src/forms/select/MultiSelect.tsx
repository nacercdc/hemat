import type { ReactText } from "react";
import React, { useState } from "react";
import type {
  SelectProps,
  SelectItemProps,
  IndexPath,
} from "@ui-kitten/components";
import { SelectItem, Select as UKSelect } from "@ui-kitten/components";

import {View} from "../../presentations/view/View";
import type { SelectOption } from "./types";
import { omit } from "@e-market/utilities";

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
  selectedItem?: Entity[];
  displayText: keyof Entity;
  onSelectItem: (entity: Entity[]) => void;
}

export const MultiSelect=<Entity extends object>({
  options,
  displayText,
  selectedItem,
  onSelectItem,
  ...props
}: Props<Entity>)=> {
  const [selectedIndex, setSelectedIndex] = useState<IndexPath | IndexPath[]>();

  const getValues = (index: IndexPath | IndexPath[]) => {
    if (Array.isArray(index)) {
      return index
        .map((v) => options[v.row])
        .filter((v) => v !== undefined)
        .map((v) => v.entity);
    }
    return [];
  };

  const handleSelect = (index: IndexPath | IndexPath[]) => {
    setSelectedIndex(index);
    const entity = getValues(index);
    if (entity.length) onSelectItem(entity);
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
        multiSelect
        value={
          selectedItem && selectedItem.length > 0
            ? selectedItem.map((v) => v[displayText]).join(", ")
            : undefined
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
