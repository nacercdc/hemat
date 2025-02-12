import * as React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../shadcn-ui/utils/cn";
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
      },
      color: {
        default: "bg-blue-500 hover:bg-blue-600 text-white border-blue-500",
        secondary:
          "bg-purple-500 hover:bg-purple-600 text-white border-purple-500",
        success: "bg-green-500 hover:bg-green-600 text-white border-green-500",
        failed: "bg-red-500 hover:bg-red-600 text-white border-red-500",
        warning:
          "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500",
      },
      size: {
        sm: "px-2 py-1 !text-sm",
        md: "px-3 py-2 !text-base",
        lg: "px-4 py-3 !text-xl",
      },
    },
    compoundVariants: [
      {
        variant: "outline",
        color: "default",
        className:
          "bg-transparent text-blue-500 hover:bg-blue-50 border-blue-500",
      },
      {
        variant: "outline",
        color: "secondary",
        className:
          "bg-transparent text-purple-500 hover:bg-purple-50 border-purple-500",
      },
      {
        variant: "outline",
        color: "success",
        className:
          "bg-transparent text-green-500 hover:bg-green-50 border-green-500",
      },
      {
        variant: "outline",
        color: "failed",
        className: "bg-transparent text-red-500 hover:bg-red-50 border-red-500",
      },
      {
        variant: "outline",
        color: "warning",
        className:
          "bg-transparent text-yellow-500 hover:bg-yellow-50 border-yellow-500",
      },
      {
        variant: "ghost",
        color: "default",
        className: "bg-transparent text-blue-500 hover:bg-blue-50 border-none",
      },
      {
        variant: "ghost",
        color: "secondary",
        className:
          "bg-transparent text-purple-500 hover:bg-purple-50 border-none",
      },
      {
        variant: "ghost",
        color: "success",
        className:
          "bg-transparent text-green-500 hover:bg-green-50 border-none",
      },
      {
        variant: "ghost",
        color: "failed",
        className: "bg-transparent text-red-500 hover:bg-red-50 border-none",
      },
      {
        variant: "ghost",
        color: "warning",
        className:
          "bg-transparent text-yellow-500 hover:bg-yellow-50 border-none",
      },
      {
        variant: "link",
        color: "default",
        className:
          "bg-transparent hover:bg-transparent text-blue-600 hover:text-blue-800 border-none shadow-none",
      },
      {
        variant: "link",
        color: "secondary",
        className:
          "bg-transparent hover:bg-transparent text-purple-600 hover:text-purple-800 border-none shadow-none",
      },
      {
        variant: "link",
        color: "success",
        className:
          "bg-transparent hover:bg-transparent text-green-600 hover:text-green-800 border-none shadow-none",
      },
      {
        variant: "link",
        color: "failed",
        className:
          "bg-transparent hover:bg-transparent text-red-600 hover:text-red-800 border-none shadow-none",
      },
      {
        variant: "link",
        color: "warning",
        className:
          "bg-transparent hover:bg-transparent text-yellow-600 hover:text-yellow-800 border-none shadow-none",
      },
    ],
    defaultVariants: {
      variant: "default",
      color: "default",
      size: "md",
    },
  }
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

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

export const Button = ({
  name,
  variant,
  color,
  size,
  children,
  loading,
  leftNode,
  rightNode,
  ...props
}: Props) => {
  return (
    <ShadcnButton
      {...props}
      className={cn(
        buttonVariants({ variant, size, color }),
        variant === "link" && "h-auto px-0"
      )}
      variant={variant}
      disabled={loading}
      id={name}
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
};
