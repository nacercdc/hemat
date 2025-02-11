import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { cva } from "class-variance-authority";
import { cn } from "../../shadcn-ui/utils/cn";
import { FormControl } from "../form-control";
import { Button as ShadcnButton } from "../../shadcn-ui";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border shadow-sm",
        outline: "border-2",
        ghost: "",
        link: "p-0 h-auto underline hover:no-underline",
        primary: "shadow-sm",
      },
      statusColor: {
        primary: "bg-blue-500 hover:bg-blue-600 text-white border-blue-500",
        secondary:
          "bg-purple-500 hover:bg-purple-600 text-white border-purple-500",
        success: "bg-green-500 hover:bg-green-600 text-white border-green-500",
        failed: "bg-red-500 hover:bg-red-600 text-white border-red-500",
        warning:
          "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500",
      },
      size: {
        sm: "h-9 rounded-md px-3",
        md: "h-10 px-4 py-2",
        lg: "h-11 rounded-md px-8",
      },
    },
    compoundVariants: [
      {
        variant: "outline",
        statusColor: "primary",
        className:
          "bg-transparent text-blue-500 hover:bg-blue-50 border-blue-500",
      },
      {
        variant: "outline",
        statusColor: "secondary",
        className:
          "bg-transparent text-purple-500 hover:bg-purple-50 border-purple-500",
      },
      {
        variant: "outline",
        statusColor: "success",
        className:
          "bg-transparent text-green-500 hover:bg-green-50 border-green-500",
      },
      {
        variant: "outline",
        statusColor: "failed",
        className: "bg-transparent text-red-500 hover:bg-red-50 border-red-500",
      },
      {
        variant: "outline",
        statusColor: "warning",
        className:
          "bg-transparent text-yellow-500 hover:bg-yellow-50 border-yellow-500",
      },
      {
        variant: "ghost",
        statusColor: "primary",
        className: "bg-transparent text-blue-500 hover:bg-blue-50 border-none",
      },
      {
        variant: "ghost",
        statusColor: "secondary",
        className:
          "bg-transparent text-purple-500 hover:bg-purple-50 border-none",
      },
      {
        variant: "ghost",
        statusColor: "success",
        className:
          "bg-transparent text-green-500 hover:bg-green-50 border-none",
      },
      {
        variant: "ghost",
        statusColor: "failed",
        className: "bg-transparent text-red-500 hover:bg-red-50 border-none",
      },
      {
        variant: "ghost",
        statusColor: "warning",
        className:
          "bg-transparent text-yellow-500 hover:bg-yellow-50 border-none",
      },
      {
        variant: "link",
        statusColor: "primary",
        className:
          "bg-transparent hover:bg-transparent text-blue-600 hover:text-blue-800 border-none shadow-none",
      },
      {
        variant: "link",
        statusColor: "secondary",
        className:
          "bg-transparent hover:bg-transparent text-purple-600 hover:text-purple-800 border-none shadow-none",
      },
      {
        variant: "link",
        statusColor: "success",
        className:
          "bg-transparent hover:bg-transparent text-green-600 hover:text-green-800 border-none shadow-none",
      },
      {
        variant: "link",
        statusColor: "failed",
        className:
          "bg-transparent hover:bg-transparent text-red-600 hover:text-red-800 border-none shadow-none",
      },
      {
        variant: "link",
        statusColor: "warning",
        className:
          "bg-transparent hover:bg-transparent text-yellow-600 hover:text-yellow-800 border-none shadow-none",
      },
    ],
    defaultVariants: {
      variant: "default",
      statusColor: "primary",
      size: "md",
    },
  },
);

export interface Props
  extends Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      "size" | "className" | "style"
    >,
    VariantProps<typeof buttonVariants> {
  leftNode?: React.ReactNode;
  rightNode?: React.ReactNode;
  children?: React.ReactNode;
  name?: string;
  label?: string;
  error?: string;
  description?: string;
  loading?: boolean;
}

export const Button = ({
  name,
  label,
  variant,
  color,
  size,
  children,
  error,
  description,
  loading,
  leftNode,
  rightNode,
  ...props
}: Props) => {
  return (
    <FormControl
      name={name}
      label={label}
      error={error}
      description={description}
    >
      <ShadcnButton
        className={cn(
          buttonVariants({ variant, size }),
          variant === "link" && "h-auto px-0",
        )}
        disabled={loading}
        id={name}
        {...props}
      >
        {leftNode}
        {loading && (
          <Icon
            icon="bx:loader-alt"
            className={cn("h-5 w-5 animate-spin", children && "mx-2")}
          />
        )}
        {children}
        {rightNode}
      </ShadcnButton>
    </FormControl>
  );
};
