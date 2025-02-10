import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { cva } from "class-variance-authority";
import { cn } from "../../shadcn-ui/utils/cn";
import { FormControl } from "../form-control";
import { Button as ShadcnButton } from "../../shadcn-ui";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        pagination: "h-6 w-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
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
  size,
  children,
  error,
  description,
  loading,
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
        className={cn(buttonVariants({ variant, size }))}
        disabled={loading}
        id={name}
        {...props}
      >
        <>
          {loading && (
            <Icon
              icon="bx:loader-alt"
              className={cn("h-5 w-5 animate-spin", children && "mr-2")}
            />
          )}
          {children}
        </>
      </ShadcnButton>
    </FormControl>
  );
};
