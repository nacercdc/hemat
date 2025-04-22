import * as React from "react";

import { Label } from "../../shadcn-ui";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { cn } from "../../shadcn-ui/utils/cn";

const formControlVariants = cva("", {
  variants: {
    variant: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    },
    size: {
      sm: "!text-sm",
      lg: "!text-base",
    },
  },
  defaultVariants: {
    variant: "normal",
    size: "sm",
  },
});

export type FormControlVariants = VariantProps<typeof formControlVariants>;

interface Props
  extends Omit<
    React.HTMLProps<HTMLDivElement>,
    "className" | "style" | "size"
  > {
  label?: string;
  variant?: FormControlVariants["variant"];
  size?: FormControlVariants["size"];
  description?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FormControl = ({
  name,
  label,
  variant,
  size,
  description,
  error,
  required,
  children,
}: Props) => {
  return (
    <div className="flex w-full flex-col space-y-1">
      {label && (
        <Label
          htmlFor={name}
          className={cn(
            "text-sm font-medium",
            formControlVariants({ variant, size })
          )}
        >
          {label} {required && <span className="text-destructive-500">*</span>}
        </Label>
      )}
      {children}
      {description && !error && (
        <p className="text-xs text-basic-500">{description}</p>
      )}
      <p className="text-xs text-destructive-500 h-1">{error}</p>
    </div>
  );
};
