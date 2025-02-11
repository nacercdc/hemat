import type { Control, FieldValues, Path } from "react-hook-form";
import * as React from "react";
import { Controller } from "react-hook-form";

import type { Props as MultiSelectProps } from "./MultiSelect";
import { MultiSelect } from "./MultiSelect";

interface Props<K, T extends FieldValues>
  extends Omit<MultiSelectProps<K>, "defaultValue" | "onSelect" | "values"> {
  name: Path<T>;
  control: Control<T>;
}

export function MultiSelectRHF<K, T extends FieldValues>({
  name,
  control,
  ...props
}: Props<K, T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <MultiSelect
          {...props}
          name={name as string}
          id={name}
          error={error?.message}
          onSelect={field.onChange}
          values={field.value}
        />
      )}
    />
  );
}
