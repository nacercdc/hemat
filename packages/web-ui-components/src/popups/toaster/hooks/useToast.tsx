import React from "react";
import { Button } from "../../../shadcn-ui";
import { Icon } from "@iconify/react";
import { useToast as shadcnUseToast } from "../../../shadcn-ui/hooks/use-toast";
import { cn } from "../../../shadcn-ui/utils/cn";
import { cva } from "class-variance-authority";

type ToastVariant = "default" | "success" | "destructive" | "warning" | "info";
type ToastPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const toastVariants = cva("flex", {
  variants: {
    variant: {
      default: "border-dark-light text-dark",
      destructive: "border-destructive-200 text-dark",
      success: "border-success-200 text-dark",
      info: "border-primary-200 text-dark",
      warning: "border-warning-200 text-dark",
    },
    position: {
      "top-left":
        "left-5 top-5 data-[state=closed]:slide-out-to-left-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-top-full",
      "top-right":
        "right-5 top-5 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-top-full",
      "bottom-left":
        "left-5 bottom-5 data-[state=closed]:slide-out-to-left-full data-[state=open]:slide-in-from-bottom-full data-[state=open]:sm:slide-in-from-bottom-full",
      "bottom-right":
        "right-5 bottom-5 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full data-[state=open]:sm:slide-in-from-bottom-full",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface Props {
  title?: string;
  message: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
  position?: ToastPosition;
  actionText?: string;
  onAction?: () => void;
}

const iconMap: Record<ToastVariant, React.ReactNode> = {
  default: null,
  destructive: (
    <Icon icon="lucide:circle-x" className="h-6 w-6 text-destructive" />
  ),
  warning: (
    <Icon icon="lucide:triangle-alert" className="h-6 w-6 text-warning-500" />
  ),
  success: <Icon icon="lucide:circle-check" className="h-6 w-6 text-success" />,
  info: <Icon icon="lucide:info" className="h-6 w-6 text-primary" />,
};

export function useToast() {
  const { toast: shadcnToast } = shadcnUseToast();
  return {
    toast: ({
      title,
      message,
      variant = "info",
      duration = 3000,
      position = "top-right",
      actionText,
      onAction,
    }: Props) =>
      shadcnToast({
        description: (
          <div
            className={cn(
              "flex gap-4 w-[420px] rounded-md border px-3 py-2",
              toastVariants({ variant }),
            )}
          >
            {iconMap[variant]}
            <div className="w-full flex flex-col gap-1">
              {title && <div className="font-bold">{title}</div>}
              {message && <div className="text-xs">{message}</div>}
            </div>
            {onAction && actionText && (
              <Button
                variant="outline"
                onClick={onAction}
                size="sm"
                className={`text-basic border-${variant}-200 right-12 absolute`}
              >
                {actionText}
              </Button>
            )}
          </div>
        ),
        className: cn(
          toastVariants({ position }),
          `w-[420px] flex fixed p-0 border-none text-${variant}-500`,
        ),
        duration,
      }),
  };
}
