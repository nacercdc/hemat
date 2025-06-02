import type { VariantProps } from "class-variance-authority";
import React from "react";
import { cva } from "class-variance-authority";

import { Checkbox as ShadcnCheckbox } from "../../shadcn-ui";
import { cn } from "../../shadcn-ui/utils/cn";
import { FormControl } from "../form-control";
import { Label } from "../../shadcn-ui";

const checkboxVariants = cva(
  "h-4 w-4 rounded border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-text data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:ring-primary bg-white",
        destructive:
          "border-text data-[state=checked]:bg-destructive data-[state=checked]:border-destructive focus-visible:ring-destructive",
        success:
          "border-text data-[state=checked]:bg-success data-[state=checked]:border-success focus-visible:ring-success",
        info: "border-text data-[state=checked]:bg-info data-[state=checked]:border-info focus-visible:ring-info",
        dark: "border-text data-[state=checked]:bg-basic data-[state=checked]:border-basic focus-visible:ring-basic",
        warning:
          "border-text data-[state=checked]:bg-warning data-[state=checked]:border-warning focus-visible:ring-warning",
      },
      size: {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export type CheckboxVariants = VariantProps<typeof checkboxVariants>;

type ShadcnCheckboxPropsWithoutColor = Omit<
  React.ComponentProps<typeof ShadcnCheckbox>,
  "className" | "style" | "variant" | "size" | "color"
>;

export interface Props extends ShadcnCheckboxPropsWithoutColor {
  label?: string;
  error?: string;
  description?: string;
  variant?: CheckboxVariants["variant"];
  size?: CheckboxVariants["size"];
  formControlLabel?: string;
}

export const Checkbox = ({
  variant,
  size,
  name,
  label,
  formControlLabel,
  error,
  description,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  required,
  ...props
}: Props) => {
  return (
    <FormControl
      name={name}
      label={formControlLabel}
      error={error}
      description={description}
    >
      <div className="flex items-center space-x-2">
        <ShadcnCheckbox
          {...props}
          id={name}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          required={required}
          className={cn(
            checkboxVariants({ variant, size }),
            error && "border-destructive-500"
          )}
        />
        {label && (
          <Label
            htmlFor={name}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              error && "text-destructive-500",
              disabled && "opacity-50"
            )}
          >
            {label}
          </Label>
        )}
      </div>
    </FormControl>
  );
};
