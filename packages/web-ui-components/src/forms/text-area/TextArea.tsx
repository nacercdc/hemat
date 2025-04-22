import type { VariantProps } from "class-variance-authority";
import React, { forwardRef } from "react";
import { cva } from "class-variance-authority";

import { Textarea as ShadcnTextArea } from "../../shadcn-ui";
import { cn } from "../../shadcn-ui/utils/cn";
import type { FormControlVariants } from "../form-control";
import { FormControl } from "../form-control";

const textAreaVariants = cva(
  "flex w-full rounded-md border px-3 py-2 text-sm transition focus-visible:ring-2",
  {
    variants: {
      variant: {
        default:
          "focus-visible:ring-basic-100  bg-white focus:bg-white active:bg-white",
        destructive:
          "border-destructive-500 focus:border-destructive-600 focus-visible:ring-destructive-500",
        success:
          "border-success-500 focus:border-success-600 focus-visible:ring-success-500",
        info: "border-info-500 focus:border-info-600 focus-visible:ring-info-500",
        warning:
          "border-warning-500 focus:border-warning-600 focus-visible:ring-warning-500",
      },
      size: {
        sm: "px-2 py-1 !text-xs",
        md: "px-3 py-2 !text-sm",
        lg: "px-4 py-3 !text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface Props
  extends Omit<
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
      "size" | "className" | "style"
    >,
    VariantProps<typeof textAreaVariants> {
  label?: string;
  error?: string;
  description?: string;
  labelVariant?: FormControlVariants["variant"];
  labelSize?: FormControlVariants["size"];
}

export const TextArea = forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      name,
      label,
      variant,
      size,
      error,
      description,
      labelVariant,
      labelSize,
      ...props
    },
    ref
  ) => {
    return (
      <FormControl
        name={name}
        label={label}
        error={error}
        description={description}
        variant={labelVariant}
        size={labelSize}
      >
        <div className="relative flex items-center">
          <ShadcnTextArea
            {...props}
            id={name}
            className={cn(
              textAreaVariants({ variant, size }),
              error && "border-destructive-500"
            )}
            aria-invalid={error ? "true" : "false"}
            ref={ref}
          />
        </div>
      </FormControl>
    );
  }
);
