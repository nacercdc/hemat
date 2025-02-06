/* eslint-disable @typescript-eslint/no-non-null-assertion */
"use client";

import * as React from "react";
import {
  RadioGroup as ShadRadioGroup,
  RadioGroupItem,
  Label,
} from "../../shadcn-ui";
import get from "lodash.get";
import type { DeepKeyOf } from "@e-market/utilities";
import { cn } from "../../shadcn-ui/utils/cn";
import { FormControl } from "../form-control";

type Variant = "default" | "secondary" | "warning" | "destructive" | "success";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  default: "border border-2 border-basic text-basic hover:border-basic-500",
  secondary:
    "border border-2 border-info text-info hover:border-info-500 hover:text-info-500",
  warning:
    "border border-2 border-warning text-warning hover:border-warning-500 hover:text-warning-500",
  destructive:
    "border border-2 border-destructive text-destructive hover:border-destructive-500 hover:text-destructive-500",
  success:
    "border border-2 border-success text-success hover:border-success-500 hover:text-success-500",
};

const sizesClasses: Record<Size, string> = {
  sm: "p-1 text-sm",
  md: "p-2 text-base",
  lg: "p-3 text-lg",
};

export interface Props<T> {
  name?: string;
  id?: string;
  options: T[];
  valueKey: DeepKeyOf<T>;
  labelKey: DeepKeyOf<T>;
  defaultValue?: T;
  onValueChange: (value: T) => void;
  size?: Size;
  variant?: Variant;
  error?: string;
  displayLabel?: string;
  displayDescription?: string;
}

export function RadioGroup<T>({
  displayLabel,
  displayDescription,
  error,
  name,
  options,
  valueKey,
  labelKey,
  defaultValue,
  onValueChange,
  size = "sm",
  variant = "default",
}: Props<T>) {
  return (
    <FormControl
      name={name}
      label={displayLabel}
      error={error}
      description={displayDescription}
    >
      <ShadRadioGroup
        defaultValue={String(get(defaultValue, valueKey))}
        onValueChange={(value) => {
          const selectedValue = options.find(
            (option) => String(get(option, valueKey)) === value
          )!;
          onValueChange(selectedValue);
        }}
        className={cn("flex flex-col space-y-1")}
      >
        {options.map((option, index) => (
          <div key={index} className={cn("flex items-center space-x-2")}>
            <RadioGroupItem
              className={cn(
                "flex items-center justify-center",
                variantClasses[variant],
                sizesClasses[size]
              )}
              value={String(get(option, valueKey))}
              id={`radio-${index}`}
            />
            <Label
              className={cn(
                `text-${variant}`,
                variant === "default" && "text-basic",
                variant === "secondary" && "text-info",
                `text-${size}`
              )}
              htmlFor={`radio-${index}`}
            >
              {String(get(option, labelKey))}
            </Label>
          </div>
        ))}
      </ShadRadioGroup>
    </FormControl>
  );
}
