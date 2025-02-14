"use client";

import type { Control, FieldValues, Path } from "react-hook-form";
import React from "react";
import { Controller } from "react-hook-form";

import type { Props as SwitchProps } from "./Switch";
import { Switch } from "./Switch";

interface SwitchRHFProps<T extends FieldValues>
  extends Omit<SwitchProps, "checked" | "onCheckedChange"> {
  name: Path<T>;
  control: Control<T>;
}

export const SwitchRHF = <T extends FieldValues>({
  name,
  control,
  ...props
}: SwitchRHFProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Switch
          {...props}
          name={name as string}
          error={error?.message}
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      )}
    />
  );
};
