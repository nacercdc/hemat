"use client";

import type { ReactNode } from "react";
import { forwardRef, useImperativeHandle, useState } from "react";
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
import { Button } from "../../forms";

type ActionVariant =
  | "default"
  | "secondary"
  | "warning"
  | "destructive"
  | "success";

const actionVariantClasses: Record<ActionVariant, string> = {
  default:
    "bg-primary text-primary-50 shadow-sm hover:bg-primary-50 hover:text-primary",
  destructive:
    "bg-destructive text-destructive-50 shadow-sm hover:bg-destructive-50 hover:text-destructive",
  secondary: "bg-info text-info-50 shadow-sm hover:bg-info-50 hover:text-info",
  warning:
    "bg-warning text-warning-50 shadow-sm hover:bg-warning-50 hover:text-warning",
  success:
    "bg-success text-success-50 shadow-sm hover:bg-success-50 hover:text-success",
};

export interface DialogRef {
  openDialog: () => void;
  closeDialog: () => void;
}

interface Props {
  open?: boolean;
  trigger?: ReactNode;
  title: string;
  children: ReactNode;
  actionLabel: string;
  actionVariant?: ActionVariant;
  autoClosable?: boolean;
  actionLoading?: boolean;
  onAction: () => void;
  onOpenChange?: (open: boolean) => void;
}

export const Dialog = forwardRef<DialogRef, Props>(
  (
    {
      open,
      trigger,
      title,
      children,
      actionLabel,
      actionVariant = "default",
      autoClosable = true,
      actionLoading = false,
      onAction,
      onOpenChange,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);

    useImperativeHandle(ref, () => {
      return {
        openDialog: () => setIsOpen(true),
        closeDialog: () => setIsOpen(false),
      };
    }, []);

    const onOpenChangeHandler = (newOpenState: boolean) => {
      if (onOpenChange) {
        onOpenChange(newOpenState);
      }
      setIsOpen(newOpenState);
    };

    return (
      <AlertDialog open={open ?? isOpen} onOpenChange={onOpenChangeHandler}>
        {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{children}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {autoClosable && (
              <AlertDialogAction
                onClick={onAction}
                className={cn(actionVariantClasses[actionVariant])}
              >
                {actionLabel}
              </AlertDialogAction>
            )}
            {!autoClosable && (
              <Button
                onClick={onAction}
                loading={actionLoading}
                color="destructive"
              >
                {actionLabel}
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
);
