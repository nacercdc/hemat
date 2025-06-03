"use client";

import type { Control, FieldValues, Path } from "react-hook-form";
import React from "react";
import { Controller } from "react-hook-form";

import type { FileInputProps, FileInputRef } from "./FileInput";
import { FileInput } from "./FileInput";

interface Props<T extends FieldValues>
  extends Omit<FileInputProps, "onChange"> {
  name: Path<T>;
  control: Control<T>;
  onChange?: (files: File[]) => void;
}

export const FileInputRHF = React.forwardRef(
  <T extends FieldValues>(
    { name, control, ...props }: Props<T>,
    ref: React.ForwardedRef<FileInputRef>,
  ) => {
    return (
      <Controller
        name={name}
        control={control}
        render={({
          field: { onChange: fieldOnChange, ...field },
          fieldState: { error },
        }) => (
          <FileInput
            {...field}
            {...props}
            ref={ref}
            onChange={(files) => {
              fieldOnChange(files);
            }}
            name={name as string}
            id={name}
            error={
              Array.isArray(error)
                ? error
                    .map((e: Record<"message", string>) => e.message)
                    .join(", ")
                : error?.message
            }
          />
        )}
      />
    );
  },
) as <T extends FieldValues>(
  props: Props<T> & {
    ref?: React.ForwardedRef<FileInputRef>;
  },
) => React.ReactElement;
