"use client";

import type { Control, FieldValues, Path } from "react-hook-form";
import React from "react";
import { Controller } from "react-hook-form";

import type { FileInputProps } from "./FileInput";
import { FileInput } from "./FileInput";

interface Props<T extends FieldValues>
  extends Omit<FileInputProps, "onChange"> {
  name: Path<T>;
  control: Control<T>;
  onChange?: (files: FileList | null) => void;
}

export const FileInputRHF = <T extends FieldValues>({
  name,
  control,
  onChange,
  ...props
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange: fieldOnChange, value, ...field },
        fieldState: { error },
      }) => (
        <FileInput
          {...field}
          {...props}
          onChange={(e) => {
            const files = e.target.files;
            fieldOnChange(files);
            onChange?.(files);
          }}
          name={name as string}
          id={name}
          error={error?.message}
        />
      )}
    />
  );
};
