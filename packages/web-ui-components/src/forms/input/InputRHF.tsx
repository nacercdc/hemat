"use client";

import type { Control, FieldValues, Path } from "react-hook-form";
import type { ComponentProps } from "react";
import React from "react";
import { Controller } from "react-hook-form";

import { Input } from "./Input";

interface Props<T extends FieldValues> extends ComponentProps<typeof Input> {
  name: Path<T>;
  control: Control<T>;
}

export const InputRHF = <T extends FieldValues>({
  name,
  control,
  ...props
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Input
          {...field}
          {...props}
          onChange={(e) =>
            field.onChange(
              props.type === "number"
                ? parseFloat(e.target.value) || 0
                : e.target.value
            )
          }
          name={name as string}
          id={name}
          error={error?.message}
        />
      )}
    />
  );
};
