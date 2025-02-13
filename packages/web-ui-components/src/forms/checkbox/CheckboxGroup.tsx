import * as React from "react";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import get from "lodash.get";
import type { DeepKeyOf } from "@e-market/utilities";
import { Checkbox } from "../../../../web-ui-components/src/forms/checkbox";

import { FormControl } from "../form-control";
import { cn } from "../../shadcn-ui/utils/cn";

const checkboxGroupVariants = cva("flex", {
  variants: {
    layout: {
      horizontal: "flex-row gap-4 flex-wrap",
      vertical: "flex-col gap-2",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    layout: "vertical",
    size: "md",
  },
});

export interface CheckboxGroupProps<T>
  extends VariantProps<typeof checkboxGroupVariants> {
  name: string;
  options: T[];
  values?: T[];
  valueKey: DeepKeyOf<T>;
  labelKey: DeepKeyOf<T>;
  label?: string;
  description?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  variant?: "default" | "destructive" | "success" | "info" | "warning";
  onValuesChange: (values: T[]) => void;
}

export function CheckboxGroup<T>({
  name,
  options,
  values = [],
  valueKey,
  labelKey,
  label,
  description,
  error,
  disabled,
  required,
  variant = "default",
  size = "md",
  layout = "vertical",
  onValuesChange,
}: CheckboxGroupProps<T>) {
  const isOptionSelected = (option: T) =>
    values.some((value) => get(value, valueKey) === get(option, valueKey));

  const handleCheckboxChange = (option: T, checked: boolean) => {
    if (checked) {
      onValuesChange([...values, option]);
    } else {
      onValuesChange(
        values.filter((value) => get(value, valueKey) !== get(option, valueKey))
      );
    }
  };

  return (
    <FormControl
      name={name}
      label={label}
      error={error}
      description={description}
    >
      <div className={cn(checkboxGroupVariants({ layout, size }))}>
        {options.map((option, index) => {
          const optionValue = get(option, valueKey);
          const optionLabel = get(option, labelKey);

          return (
            <Checkbox
              key={`${name}-${index}-${optionValue}`}
              name={`${name}-${optionValue}`}
              label={String(optionLabel)}
              checked={isOptionSelected(option)}
              onCheckedChange={(checked) =>
                handleCheckboxChange(option, checked)
              }
              disabled={disabled}
              required={required}
              variant={variant}
              size={size}
            />
          );
        })}
      </div>
    </FormControl>
  );
}
