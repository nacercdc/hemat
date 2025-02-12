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
      default: "border-basic text-basic",
      destructive:
        "border-destructive-500 bg-destructive-500 text-destructive-100",
      success: "border-success-500 bg-success-500 text-success-100",
      info: "border-info-500 bg-info-500 text-info-100",
      warning: "border-warning-500 bg-warning-500 text-warning-100",
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
  message: string;
  variant?: ToastVariant;
  duration?: number;
  position?: ToastPosition;
  actionText?: string;
  onAction?: () => void;
}

const iconMap: Record<ToastVariant, React.ReactNode> = {
  default: null,
  destructive: <Icon icon="lucide:circle-x" className="h-6 w-6" />,
  warning: <Icon icon="lucide:triangle-alert" className="h-6 w-6" />,
  success: <Icon icon="lucide:circle-check" className="h-6 w-6" />,
  info: <Icon icon="lucide:info" className="h-6 w-6" />,
};

export function useToast() {
  const { toast: shadcnToast } = shadcnUseToast();
  return {
    toast: ({
      title,
      message,
      variant = "info",
      duration = 3000,
      position = "bottom-right",
      actionText,
      onAction,
    }: Props) =>
      shadcnToast({
        description: (
          <div
            className={cn(
              "flex gap-2 w-[420px] rounded-md border px-3 py-2",
              toastVariants({ variant })
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
                className={`text-${variant}-500 right-12 absolute`}
              >
                {actionText}
              </Button>
            )}
          </div>
        ),
        className: cn(
          toastVariants({ position }),
          `w-[420px] flex fixed p-0 border-none text-${variant}-100`
        ),
        duration,
      }),
  };
}
