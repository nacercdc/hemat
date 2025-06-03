import * as React from "react";
import {
  Alert as ShadcnAlert,
  AlertDescription,
  AlertTitle,
} from "../../shadcn-ui";
import { Icon } from "@iconify/react";
import { cva } from "class-variance-authority";
import { cn } from "../../shadcn-ui/utils/cn";

type AlertVariant = "default" | "info" | "warning" | "destructive" | "success";

const alertVariants = cva("flex w-full rounded-md border px-3 py-2", {
  variants: {
    variant: {
      default: "border-basic/50 text-basic-500",
      destructive: "border-destructive/50 text-destructive-500",
      success: "border-success/50 text-success-500",
      info: "border-info/50 text-info-500",
      warning: "border-warning/50 text-warning-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const iconMap: Record<AlertVariant, React.ReactNode> = {
  default: null,
  info: <Icon icon="lucide:info" className="h-4 w-4" />,
  warning: <Icon icon="lucide:triangle-alert" className="h-4 w-4" />,
  destructive: <Icon icon="lucide:circle-x" className="h-4 w-4" />,
  success: <Icon icon="lucide:circle-check" className="h-4 w-4" />,
};

interface Props {
  variant: AlertVariant;
  title: string;
  description: string;
  onClose?: () => void;
}

export function Alert({ variant, title, description, onClose }: Props) {
  return (
    <ShadcnAlert className={cn(alertVariants({ variant }))}>
      <div className="flex items-center space-x-2">
        {iconMap[variant]}
        <div>
          <AlertTitle>{title}</AlertTitle>
          {description && <AlertDescription>{description}</AlertDescription>}
        </div>
      </div>

      {onClose && (
        <button
          type="button"
          className="absolute top-2 right-2 p-1 rounded-md hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          onClick={onClose}
        >
          <Icon icon="lucide:x" className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      )}
    </ShadcnAlert>
  );
}
