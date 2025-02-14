import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { Switch as ShadcnSwitch } from "../../shadcn-ui";
import { cn } from "../../shadcn-ui/utils/cn";
import { FormControl } from "../form-control";
import { Label } from "../../shadcn-ui";

const switchVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-current data-[state=unchecked]:bg-input [&>span[data-state]]:transition-transform",
  {
    variants: {
      variant: {
        default:
          "border-primary-500 text-primary-500 focus-visible:ring-primary-500",
        destructive:
          "border-destructive-500 text-destructive-500 focus-visible:ring-destructive-500",
        success:
          "border-success-500 text-success-500 focus-visible:ring-success-500",
        info: "border-info-500 text-info-500 focus-visible:ring-info-500",
        warning:
          "border-warning-500 text-warning-500 focus-visible:ring-warning-500",
      },
      size: {
        sm: [
          "h-[20px] w-[36px]",
          "[&>span[data-state]]:h-[14px] [&>span[data-state]]:w-[14px]",
          "[&>span[data-state=checked]]:translate-x-[18px]",
          "[&>span[data-state=unchecked]]:translate-x-[2px]",
        ],
        md: [
          "h-[24px] w-[44px]",
          "[&>span[data-state]]:h-[18px] [&>span[data-state]]:w-[18px]",
          "[&>span[data-state=checked]]:translate-x-[22px]",
          "[&>span[data-state=unchecked]]:translate-x-[2px]",
        ],
        lg: [
          "h-[28px] w-[52px]",
          "[&>span[data-state]]:h-[22px] [&>span[data-state]]:w-[22px]",
          "[&>span[data-state=checked]]:translate-x-[26px]",
          "[&>span[data-state=unchecked]]:translate-x-[2px]",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export type SwitchVariants = VariantProps<typeof switchVariants>;

type ShadcnSwitchPropsWithoutColor = Omit<
  React.ComponentProps<typeof ShadcnSwitch>,
  "className" | "style" | "variant" | "size" | "color"
>;

export interface Props extends ShadcnSwitchPropsWithoutColor {
  label?: string;
  error?: string;
  description?: string;
  checked?: boolean;
  variant?: SwitchVariants["variant"];
  size?: SwitchVariants["size"];
}

export const Switch = ({
  name,
  label,
  variant,
  size,
  error,
  description,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  required,
}: Props) => {
  return (
    <FormControl
      name={name}
      label={label}
      error={error}
      description={description}
    >
      <div className="flex items-center space-x-2">
        <ShadcnSwitch
          id={name}
          name={name}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          className={cn(
            switchVariants({ variant, size }),
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
