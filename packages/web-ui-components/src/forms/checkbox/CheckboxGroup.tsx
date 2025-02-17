import * as React from "react";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import get from "lodash.get";
import type { DeepKeyOf } from "@e-market/utilities";
import {
  Checkbox,
  CheckboxVariants,
} from "../../../../web-ui-components/src/forms/checkbox";
import { FormControl } from "../form-control";
import { cn } from "../../shadcn-ui/utils/cn";

const checkboxGroupVariants = cva("flex", {
  variants: {
    layout: {
      horizontal: "flex-row gap-4",
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

type CheckboxGroupVariants = VariantProps<typeof checkboxGroupVariants>;

type ShadcnCheckboxGroupPropsWithoutColor = Omit<
  React.ComponentProps<typeof Checkbox>,
  "className" | "style" | "variant" | "size" | "color"
>;

export interface CheckboxGroupProps<T>
  extends ShadcnCheckboxGroupPropsWithoutColor {
  options: T[];
  values?: T[];
  valueKey: DeepKeyOf<T>;
  labelKey: DeepKeyOf<T>;
  layout?: CheckboxGroupVariants["layout"];
  variant?: CheckboxVariants["variant"];
  size?: CheckboxVariants["size"];
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
  size = "md",
  layout = "vertical",
  variant = "default",
  onValuesChange,
}: CheckboxGroupProps<T>) {
  const isOptionSelected = (option: T) =>
    values.some((value) => get(value, valueKey) === get(option, valueKey));

  const handleCheckboxChange = (
    option: T,
    checked: boolean | "indeterminate"
  ) => {
    if (typeof checked === "boolean") {
      if (checked) {
        onValuesChange([...values, option]);
      } else {
        onValuesChange(
          values.filter(
            (value) => get(value, valueKey) !== get(option, valueKey)
          )
        );
      }
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
