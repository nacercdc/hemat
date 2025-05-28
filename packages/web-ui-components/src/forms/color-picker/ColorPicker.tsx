"use client";

import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { useState } from "react";
import { cva } from "class-variance-authority";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "../../shadcn-ui";
import { cn } from "../../shadcn-ui/utils/cn";
import type { FormControlVariants } from "../form-control";
import { FormControl } from "../form-control";
import { isValidHexColor } from "@etm/utilities/string.utils";

const colorPickerVariants = cva(
  "flex items-center justify-between rounded-sm shadow-none transition w-full px-1 gap-1",
  {
    variants: {
      variant: {
        default: "border-[1px] bg-card",
        destructive: "border-destructive-500 border-[1px] bg-card",
        success: "border-success-500 border-[1px] bg-card",
        info: "border-info-500 border-[1px] bg-card",
        warning: "border-warning-500 border-[1px] bg-card",
      },
      size: {
        sm: " h-8 text-xs",
        md: " h-9 text-sm",
        lg: " h-10 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const colorPickerInputVariants = cva(
  "flex items-center justify-between rounded-sm shadow-none transition bg-card w-full",
  {
    variants: {
      size: {
        sm: " h-7 text-xs",
        md: " h-8 text-sm",
        lg: " h-9 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const pickerSizes = {
  sm: { width: 98, height: 100 },
  md: { width: 178, height: 150 },
  lg: { width: 258, height: 200 },
};

export interface Props
  extends Omit<
      React.HTMLAttributes<HTMLDivElement>,
      "size" | "className" | "style" | "onChange"
    >,
    VariantProps<typeof colorPickerVariants> {
  value?: string;
  defaultValue?: string;
  onChange: (color: string) => void;
  name?: string;
  label?: string;
  error?: string;
  description?: string;
  labelVariant?: FormControlVariants["variant"];
  labelSize?: FormControlVariants["size"];
  align?: "start" | "center" | "end";
  inModal?: boolean;
}

export const ColorPicker = ({
  value: propValue,
  defaultValue,
  onChange,
  name,
  label,
  variant,
  size,
  error,
  description,
  labelVariant,
  labelSize,
  align = "start",
  inModal = false,
  ...props
}: Props) => {
  const [open, setOpen] = useState(false);
  const { width, height } = pickerSizes[size || "md"];

  const value =
    propValue && isValidHexColor(propValue) ? propValue : defaultValue || "";

  const handleChange = (color: string) => {
    if (color === "" || !isValidHexColor(color)) {
      onChange(defaultValue || "");
    } else {
      onChange(color);
    }
  };
  return (
    <FormControl
      name={name}
      label={label}
      error={error}
      description={description}
      variant={labelVariant}
      size={labelSize}
    >
      <Popover open={open} onOpenChange={setOpen} modal={inModal}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              colorPickerVariants({ variant, size }),
              error && "border-destructive-500",
              "cursor-pointer"
            )}
            {...props}
          >
            <div
              className="h-6 w-6 rounded border border-dark-lighter"
              style={{ backgroundColor: value }}
            />
            <HexColorInput
              id={name}
              color={value}
              onChange={handleChange}
              className={cn(
                colorPickerInputVariants({ size }),
                "flex-1 border-none focus:outline-none focus:ring-0 w-full"
              )}
              placeholder={defaultValue || ""}
              aria-invalid={error ? "true" : "false"}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 border border-input"
          align={align}
          style={{ width: `${width}px` }}
        >
          <HexColorPicker
            color={value}
            onChange={handleChange}
            className="w-full rounded-md"
            style={{ width: `${width}px`, height: `${height}px` }}
          />
        </PopoverContent>
      </Popover>
    </FormControl>
  );
};
