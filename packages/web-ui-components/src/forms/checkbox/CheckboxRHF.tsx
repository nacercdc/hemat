"use client";

import type { Control, FieldValues, Path } from "react-hook-form";
import type { ComponentProps } from "react";
import React from "react";
import { Controller } from "react-hook-form";

import { Checkbox } from "./Checkbox";

interface CheckboxRHFProps<T extends FieldValues>
  extends Omit<ComponentProps<typeof Checkbox>, "checked" | "onCheckedChange"> {
  name: Path<T>;
  control: Control<T>;
}

export const CheckboxRHF = <T extends FieldValues>({
  name,
  control,
  ...props
}: CheckboxRHFProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Checkbox
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
