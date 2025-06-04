/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { cn } from "../../shadcn-ui/utils/cn";
import { Button as ShadcnButton } from "../../shadcn-ui";
export const sizeVariants = {
  sm: "px-2 h-8 !text-xs",
  md: "px-3 h-9 !text-xs",
  lg: "px-4 h-10 !text-xs",
  xl: "px-8 h-12 !text-base",
  fullSm: "w-full h-8 !text-xs",
  fullMd: "w-full h-9 !text-xs",
  fullLg: "w-full h-10 !text-xs",
  fullXl: "w-full h-12 !text-base",
};
export const colorVariants = {
  default:
    "bg-primary hover:bg-primary-600 hover:border-primary-600 text-background border-primary",
  primaryLight: "bg-primary-50 border-primary-100 text-primary",
  destructive:
    "bg-destructive-500 hover:bg-destructive-600 text-background border-destructive-500",
  success:
    "bg-success-500 hover:bg-success-600 text-background border-success-500",
  dark: "bg-basic hover:bg-basic-800 text-background border-basic-800",
  info: "bg-info-500 hover:bg-info-600 text-background border-info-500",
  warning:
    "bg-warning-500 hover:bg-warning-600 text-background border-warning-500",
  lightGray: "bg-card border-[1px]",
  card: "bg-card text-dark ",
};

export const variantVariants = {
  default: "border shadow-sm",
  outline: "border-[1px]",
  ghost: "!p-0 !m-0",
  link: "p-0 h-auto underline hover:no-underline",
};

export const compoundVariants = [
  {
    variant: "outline",
    color: "default",
    className:
      "bg-transparent text-basic hover:bg-transparent border-basic-300 hover:border-basic-400 hover:text-dark-500",
  },
  {
    variant: "outline",
    color: "destructive",
    className:
      "bg-transparent text-destructive-500 hover:bg-destructive-50 border-destructive-500",
  },
  {
    variant: "outline",
    color: "success",
    className:
      "bg-transparent text-success-500 hover:bg-success-50 border-success-500",
  },
  {
    variant: "outline",
    color: "info",
    className: "bg-transparent text-info-500 hover:bg-info-50 border-info-500",
  },
  {
    variant: "outline",
    color: "warning",
    className:
      "bg-transparent text-warning-500 hover:bg-warning-50 border-warning-500",
  },
  {
    variant: "outline",
    color: "dark",
    className:
      "bg-transparent text-basic-500 hover:bg-basic-50 border-basic-400",
  },
  {
    variant: "ghost",
    color: "default",
    className:
      "bg-transparent text-primary-500 hover:bg-primary-50 border-none",
  },
  {
    variant: "ghost",
    color: "destructive",
    className:
      "bg-transparent text-destructive-500 hover:bg-destructive-50 border-none",
  },
  {
    variant: "ghost",
    color: "success",
    className:
      "bg-transparent text-success-500 hover:bg-success-50 border-none",
  },
  {
    variant: "ghost",
    color: "info",
    className: "bg-transparent text-info-500 hover:bg-info-50 border-none",
  },
  {
    variant: "ghost",
    color: "warning",
    className:
      "bg-transparent text-warning-500 hover:bg-warning-50 border-none",
  },
  {
    variant: "ghost",
    color: "dark",
    className: "bg-transparent text-basic-500 hover:bg-basic-50 border-none",
  },
  {
    variant: "link",
    color: "default",
    className:
      "bg-transparent hover:bg-transparent text-primary-600 hover:text-primary-800 border-none shadow-none",
  },
  {
    variant: "link",
    color: "destructive",
    className:
      "bg-transparent hover:bg-transparent text-destructive-600 hover:text-destructive-800 border-none shadow-none",
  },
  {
    variant: "link",
    color: "success",
    className:
      "bg-transparent hover:bg-transparent text-success-600 hover:text-success-800 border-none shadow-none",
  },
  {
    variant: "link",
    color: "info",
    className:
      "bg-transparent hover:bg-transparent text-info-600 hover:text-info-800 border-none shadow-none",
  },
  {
    variant: "link",
    color: "warning",
    className:
      "bg-transparent hover:bg-transparent text-warning-600 hover:text-warning-800 border-none shadow-none",
  },
  {
    variant: "link",
    color: "dark",
    className:
      "bg-transparent hover:bg-transparent text-basic-600 hover:text-basic-800 border-none shadow-none",
  },
];

export const defaultVariants = {
  variant: "default",
  color: "default",
  size: "md",
};

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: variantVariants,
      color: colorVariants,
      size: sizeVariants,
    },
    compoundVariants: compoundVariants as any,
    defaultVariants: defaultVariants as any,
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

type ShadcnButtonPropsWithoutColor = Omit<
  React.ComponentProps<typeof ShadcnButton>,
  "className" | "style" | "variant" | "size" | "color"
>;

interface Props extends ShadcnButtonPropsWithoutColor {
  leftNode?: React.ReactNode;
  rightNode?: React.ReactNode;
  loading?: boolean;
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  color?: ButtonVariants["color"];
}

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  (
    {
      name,
      variant,
      color,
      size,
      children,
      loading,
      disabled,
      leftNode,
      rightNode,
      ...props
    },
    ref
  ) => {
    return (
      <ShadcnButton
        {...props}
        className={cn(
          buttonVariants({ variant, size, color }),
          variant === "link" && "h-auto px-0"
        )}
        variant={variant}
        disabled={loading || disabled}
        id={name}
        ref={ref}
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
    );
  }
);
