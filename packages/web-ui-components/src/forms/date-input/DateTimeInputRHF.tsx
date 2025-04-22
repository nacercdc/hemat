"use client";

import type { Control, FieldValues, Path } from "react-hook-form";
import React from "react";
import { Controller } from "react-hook-form";
import type { DateTimePickerProps } from "./DateTimeInput";
import { DateTimePicker } from "./DateTimeInput";

interface DateTimePickerRHFProps<T extends FieldValues>
  extends Omit<DateTimePickerProps, "value" | "onChange"> {
  name: Path<T>;
  control: Control<T>;
}

export const DateTimePickerRHF = <T extends FieldValues>({
  name,
  control,
  ...props
}: DateTimePickerRHFProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DateTimePicker
          {...props}
          name={name as string}
          value={field.value}
          onChange={field.onChange}
          error={error?.message}
        />
      )}
    />
  );
};
