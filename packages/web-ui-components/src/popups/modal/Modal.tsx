import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
} from "../../shadcn-ui";
import { cn } from "../../shadcn-ui/utils/cn";

type ActionVariant =
  | "default"
  | "secondary"
  | "warning"
  | "destructive"
  | "success";

const actionVariantClasses: Record<ActionVariant, string> = {
  default:
    "bg-basic text-basic-100 shadow-sm hover:bg-basic/90 hover:text-basic",
  destructive:
    "bg-destructive text-destructive-100 shadow-sm hover:bg-destructive/90 hover:text-destructive",
  secondary: "bg-info text-info-100 shadow-sm hover:bg-info/90 hover:text-info",
  warning:
    "bg-warning text-warning-100 shadow-sm hover:bg-warning/90 hover:text-warning",
  success:
    "bg-success text-success-100 shadow-sm hover:bg-success/90 hover:text-success",
};

interface Props {
  trigger: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
  onAction: () => void;
  actionLabel: string;
  actionVariant?: ActionVariant;
}

export function Modal({
  trigger,
  title,
  description,
  children,
  onAction,
  actionLabel,
  actionVariant = "default",
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          <Button
            type="submit"
            onClick={onAction}
            className={cn(actionVariantClasses[actionVariant])}
          >
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
