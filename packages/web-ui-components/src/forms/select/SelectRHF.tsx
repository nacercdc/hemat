import type { Control, FieldValues, Path } from "react-hook-form";
import * as React from "react";
import { Controller } from "react-hook-form";

import type { Props as SelectProps } from "./Select";
import { Select } from "./Select";

interface Props<K, T extends FieldValues>
  extends Omit<SelectProps<K>, "defaultValue"> {
  name: Path<T>;
  control: Control<T>;
}

export function SelectRHF<K, T extends FieldValues>({
  name,
  control,
  ...props
}: Props<K, T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Select
          {...props}
          name={name as string}
          id={name}
          error={error?.message}
          onSelect={field.onChange}
          defaultValue={field.value}
        />
      )}
    />
  );
}
