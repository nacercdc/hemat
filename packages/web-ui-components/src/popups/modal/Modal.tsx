"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { forwardRef, useImperativeHandle, useState } from "react";
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

export interface ModalRef {
  openModal: () => void;
  closeModal: () => void;
}

interface Props {
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  defaultOpen?: boolean;
  trigger?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  onAction?: () => void;
  actionLabel?: string;
  actionVariant?: ActionVariant;
  onOpenChange?: (open: boolean) => void;
}

export const Modal = forwardRef<ModalRef, Props>(
  (
    {
      open,
      setOpen,
      defaultOpen = false,
      trigger,
      title,
      description,
      children,
      onAction,
      actionLabel,
      actionVariant,
      onOpenChange,
    },
    ref
  ) => {
    const [isModalOpen, setIsModalOpen] = useState(defaultOpen);

    useImperativeHandle(ref, () => {
      return {
        openModal: () => setIsModalOpen(true),
        closeModal: () => setIsModalOpen(false),
      };
    }, []);

    const onOpenChangeHandler = (newOpenState: boolean) => {
      if (onOpenChange) {
        onOpenChange(newOpenState);
      }
      setIsModalOpen(newOpenState);
      setOpen?.(newOpenState);
    };
    return (
      <Dialog open={open ?? isModalOpen} onOpenChange={onOpenChangeHandler}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent className="min-w-fit max-h-fit overflow-auto p-0 bg-card border border-secondary rounded-none">
          {title ? (
            <DialogHeader className="p-4 pb-0 flex flex-col gap-0 max-h-fit">
              <DialogTitle className="p-0">{title}</DialogTitle>
              <DialogDescription className="p-0">
                {description}
              </DialogDescription>
            </DialogHeader>
          ) : (
            <VisuallyHidden>
              <DialogHeader className="p-6 pb-0 ">
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
              </DialogHeader>
            </VisuallyHidden>
          )}

          {children}
          {actionLabel && actionVariant ? (
            <DialogFooter className="p-6 ">
              <Button
                type="submit"
                onClick={onAction}
                className={cn(actionVariantClasses[actionVariant ?? "default"])}
              >
                {actionLabel}
              </Button>
            </DialogFooter>
          ) : null}
        </DialogContent>
      </Dialog>
    );
  }
);
