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
          "border-primary-300 data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500 focus-visible:ring-primary-500",
        destructive:
          "border-destructive-500 data-[state=checked]:bg-destructive-500 data-[state=checked]:border-destructive-500 focus-visible:ring-destructive-500",
        success:
          "border-success-500 data-[state=checked]:bg-success-500 data-[state=checked]:border-success-500 focus-visible:ring-success-500",
        info: "border-info-500 data-[state=checked]:bg-info-500 data-[state=checked]:border-info-500 focus-visible:ring-info-500",
        dark: "border-basic-500 data-[state=checked]:bg-basic-500 data-[state=checked]:border-basic-500 focus-visible:ring-basic-500",
        warning:
          "border-warning-500 data-[state=checked]:bg-warning-500 data-[state=checked]:border-warning-500 focus-visible:ring-warning-500",
      },
      size: {
        sm: "h-3 w-3 [&-svg]:h-3 [&-svg]:w-3",
        md: "h-4 w-4 [&-svg]:h-4 [&-svg]:w-4",
        lg: "h-5 w-5 [&-svg]:h-5 [&-svg]:w-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

type CheckboxVariants = VariantProps<typeof checkboxVariants>;

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
}

export const Checkbox = ({
  variant,
  size,
  name,
  label,
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
      label={label}
      error={error}
      description={description}
    >
      <div className="flex items-center space-x-2">
        <ShadcnCheckbox
          {...props}
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
