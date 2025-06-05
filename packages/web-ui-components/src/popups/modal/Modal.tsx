"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Icon } from "@iconify/react";

import type { ReactNode } from "react";
import * as RDialog from "@radix-ui/react-dialog";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  DialogClose,
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
      <RDialog.Root
        open={open ?? isModalOpen}
        onOpenChange={onOpenChangeHandler}
      >
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <RDialog.Portal>
          <RDialog.Overlay className="fixed inset-0 z-50 !bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <RDialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border-none shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg max-w-[700px] max-h-fit overflow-auto p-0 bg-card border-secondary !rounded-xl [&>button]:hidden">
            {title ? (
              <DialogHeader className="p-7 pb-0 flex flex-col gap-0 max-h-fit">
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
              <DialogFooter className="p-6">
                <Button
                  type="submit"
                  onClick={onAction}
                  className={cn(
                    actionVariantClasses[actionVariant ?? "default"]
                  )}
                >
                  {actionLabel}
                </Button>
              </DialogFooter>
            ) : null}
            <DialogClose
              asChild
              className="absolute right-4 top-4 cursor-pointer z-20"
            >
              <Icon
                icon="material-symbols:close"
                className="!w-8 !h-8 hover:bg-basic/10 rounded-full p-1"
              />
            </DialogClose>
          </RDialog.Content>
        </RDialog.Portal>
      </RDialog.Root>
    );
  }
);
