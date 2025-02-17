"use client";

import type { Control, FieldValues, Path } from "react-hook-form";
import * as React from "react";
import { Controller } from "react-hook-form";

import type { CheckboxGroupProps } from "./CheckboxGroup";
import { CheckboxGroup } from "./CheckboxGroup";

interface CheckboxGroupRHFProps<K, T extends FieldValues>
  extends Omit<CheckboxGroupProps<K>, "values" | "onValuesChange"> {
  name: Path<T>;
  control: Control<T>;
}

export function CheckboxGroupRHF<K, T extends FieldValues>({
  name,
  control,
  ...props
}: CheckboxGroupRHFProps<K, T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <CheckboxGroup
          {...props}
          name={name as string}
          error={error?.message}
          values={field.value}
          onValuesChange={field.onChange}
        />
      )}
    />
  );
}
