import type { Control, FieldValues, Path } from "react-hook-form";
import React from "react";
import { Controller } from "react-hook-form";

import type { Props as ButtonProps } from "./Button";
import { Button } from "./Button";

interface Props<T extends FieldValues> extends ButtonProps {
  name: Path<T>;
  control: Control<T>;
}

export const ButtonRHF = <T extends FieldValues>({
  name,
  control,
  ...props
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Button
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
