import type { Control, FieldValues, Path } from "react-hook-form";
import React from "react";
import { Controller } from "react-hook-form";

import type { Props as TextAreaProps } from "./TextArea";
import { TextArera } from "./TextArea";

interface Props<T extends FieldValues> extends TextAreaProps {
  name: Path<T>;
  control: Control<T>;
}

export const TextAreaRHF = <T extends FieldValues>({
  name,
  control,
  ...props
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextArera
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
