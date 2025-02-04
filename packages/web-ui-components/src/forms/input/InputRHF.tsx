import type { Control, FieldValues, Path } from "react-hook-form";
import React from "react";
import { Controller } from "react-hook-form";

import type { Props as InputProps } from "./Input";
import { Input } from "./Input";

interface Props<T extends FieldValues> extends InputProps {
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
          name={name as string}
          id={name}
          error={error?.message}
        />
      )}
    />
  );
};
