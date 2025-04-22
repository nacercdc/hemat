"use client";

import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { Props as PhoneNumberInputProps } from "./PhoneNumberInput";
import { PhoneNumberInput } from "./PhoneNumberInput";

interface Props<T extends FieldValues> extends PhoneNumberInputProps {
  name: Path<T>;
  control: Control<T>;
}

export const PhoneNumberInputRHF = <T extends FieldValues>({
  name,
  control,
  ...props
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      render={({ field, fieldState: { error } }) => (
        <PhoneNumberInput {...field} {...props} error={error?.message} />
      )}
    />
  );
};
