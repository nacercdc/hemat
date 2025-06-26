/* eslint-disable @typescript-eslint/no-non-null-assertion */
"use client";

import * as React from "react";
import {
  RadioGroup as ShadRadioGroup,
  RadioGroupItem,
  Label,
} from "../../shadcn-ui";
import get from "lodash.get";
import type { DeepKeyOf } from "@etm/utilities";
import { cn } from "../../shadcn-ui/utils/cn";
import { FormControl } from "../form-control";

type Variant = "default" | "secondary" | "warning" | "destructive" | "success";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  default:
    "border border-[1px] border-primary text-primary hover:border-primary/50",
  secondary:
    "border border-[1px] border-info text-info hover:border-info-500 hover:text-info-500",
  warning:
    "border border-[1px] border-warning text-warning hover:border-warning-500 hover:text-warning-500",
  destructive:
    "border border-[1px] border-destructive text-destructive hover:border-destructive-500 hover:text-destructive-500",
  success:
    "border border-[1px] border-success text-success hover:border-success-500 hover:text-success-500",
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
  value: T;
  size?: Size;
  variant?: Variant;
  error?: string;
  displayLabel?: string;
  displayDescription?: string;
  badge?: React.ReactNode;
  alignment?: "column" | "row" | "grid";
  onBadgeLeave?: () => void;
  onBadgeHover?: (values: T) => void;
  onValueChange: (value: T) => void;
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
  value,
  onValueChange,
  size = "sm",
  variant = "default",
  badge,
  alignment = "column",
  onBadgeHover,
  onBadgeLeave,
}: Props<T>) {
  const [radioValue, setRadioValue] = React.useState<T | undefined>();

  React.useEffect(() => {
    setRadioValue(value);
  }, [value]);
  return (
    <FormControl
      name={name}
      label={displayLabel}
      error={error}
      description={displayDescription}
    >
      <ShadRadioGroup
        defaultValue={String(get(defaultValue, valueKey))}
        value={radioValue ? String(get(radioValue, valueKey)) : undefined}
        onValueChange={(value) => {
          const selectedValue = options.find(
            (option) => String(get(option, valueKey)) === value
          )!;
          onValueChange(selectedValue);
        }}
        className={cn(
          "gap-2 w-fit",
          alignment === "row" && "flex flex-row",
          alignment === "column" && "flex flex-col",
          alignment === "grid" &&
            !badge &&
            "grid lg:grid-cols-2 lg:gap-4 gap-2 grid-cols-1",
          alignment === "grid" &&
            badge &&
            "grid lg:grid-cols-2 lg:gap-8 gap-2 grid-cols-1"
        )}
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
                `text-${variant} text-nowrap`,
                variant === "default" && "text-basic",
                variant === "secondary" && "text-info",
                `text-${size}`,
                badge && "relative"
              )}
              htmlFor={`radio-${index}`}
            >
              {String(get(option, labelKey))}
              <div
                className="absolute top-0.5 -right-[18px] cursor-pointer"
                onMouseEnter={() => onBadgeHover?.(option)}
                onMouseLeave={onBadgeLeave}
              >
                {badge}
              </div>
            </Label>
          </div>
        ))}
      </ShadRadioGroup>
    </FormControl>
  );
}
