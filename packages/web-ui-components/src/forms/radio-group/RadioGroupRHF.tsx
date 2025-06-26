"use client";

import type { Control, FieldValues, Path } from "react-hook-form";
import * as React from "react";
import { Controller } from "react-hook-form";

import type { Props as RadioProps } from "./RadioGroup";
import { RadioGroup } from "./RadioGroup";

interface Props<K, T extends FieldValues>
  extends Omit<RadioProps<K>, "defaultValue" | "onValueChange"> {
  name: Path<T>;
  control: Control<T>;
}

export function RadioGroupRHF<K, T extends FieldValues>({
  name,
  control,
  ...props
}: Props<K, T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <RadioGroup
          {...props}
          id={name}
          error={error?.message}
          value={field.value}
          onValueChange={field.onChange}
          defaultValue={field.value}
        />
      )}
    />
  );
}
