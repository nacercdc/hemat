import type { VariantProps } from "class-variance-authority";
import React, { forwardRef } from "react";
import { cva } from "class-variance-authority";

import { Input as ShadcnInput } from "../../shadcn-ui";
import { cn } from "../../shadcn-ui/utils/cn";
import type { FormControlVariants } from "../form-control";
import { FormControl } from "../form-control";

export const inputVariants = cva(
  "flex w-full rounded-md border py-2 text-sm transition focus-visible:ring-2",
  {
    variants: {
      variant: {
        default:
          "focus-visible:ring-basic-100 bg-white focus:bg-white active:bg-white",
        destructive:
          "border-destructive-500 focus:border-destructive-600 focus-visible:ring-destructive-500",
        success:
          "border-success-500 focus:border-success-600 focus-visible:ring-success-500",
        info: "border-info-500 focus:border-info-600 focus-visible:ring-info-500",
        warning:
          "border-warning-500 focus:border-warning-600 focus-visible:ring-warning-500",
        search: "border-white bg-white",
      },

      size: {
        sm: "h-9 text-sm max-[770px]:text-xs",
        md: "h-10 text-base max-[770px]:text-sm",
        lg: "h-11 text-lg",
        xl: "h-12 rounded-2 border-[1px] text-lg max-[770px]:text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export type InputVariantProps = VariantProps<typeof inputVariants>;

export interface Props
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "size" | "className" | "style" | "required"
    >,
    VariantProps<typeof inputVariants> {
  leftNode?: React.ReactNode;
  rightNode?: React.ReactNode;
  name: string;
  label?: string;
  labelVariant?: FormControlVariants["variant"];
  labelSize?: FormControlVariants["size"];
  error?: string;
  description?: string;
  isPhone?: boolean;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      name,
      label,
      variant,
      size,
      leftNode,
      rightNode,
      error,
      description,
      labelVariant,
      labelSize,
      isPhone = false,
      required = false,
      ...props
    },
    ref
  ) => {
    const InputComponent = (
      <div
        className={cn(
          "grid grid-cols-[auto_1fr_auto] items-center",
          inputVariants({ variant, size }),
          error && "border-destructive-500",
          isPhone && "rounded-s-none border-s-0 focus-visible:ring-0 fill",
          props.type === "search" && "border-none"
        )}
      >
        {leftNode && <div className="bg-transparent">{leftNode}</div>}

        <ShadcnInput
          {...props}
          id={name}
          className={
            "w-full py-2 outline-none bg-transparent border-none shadow-none active:outline-none focus-visible:outline-none focus-visible:border-none focus-visible:ring-0"
          }
          aria-invalid={error ? "true" : "false"}
          ref={ref}
        />

        {rightNode && <div className="bg-transparent">{rightNode}</div>}
      </div>
    );

    return (
      <>
        {!isPhone && (
          <FormControl
            name={name}
            label={label}
            error={error}
            variant={labelVariant}
            size={labelSize}
            description={description}
            required={required}
          >
            {InputComponent}
          </FormControl>
        )}
        {isPhone && InputComponent}
      </>
    );
  }
);

Input.displayName = "Input";
