import type { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
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
  children: ReactNode;
  actionLabel: string;
  onAction: () => void;
  actionVariant?: ActionVariant;
}

export function Dialog({
  trigger,
  title,
  children,
  actionLabel,
  onAction,
  actionVariant = "default",
}: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{children}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onAction}
            className={cn(actionVariantClasses[actionVariant])}
          >
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
