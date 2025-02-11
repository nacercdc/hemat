"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetDescription,
  SheetTitle,
  SheetFooter,
} from "../../shadcn-ui";
import { cn } from "../../shadcn-ui/utils/cn";

type Direction = "left" | "right" | "top" | "bottom";
type Size = "sm" | "md" | "lg";

interface Props {
  open?: boolean;
  defaultOpen?: boolean;
  direction?: Direction;
  size?: Size;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  children: React.ReactNode;
  closeNode?: ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export function Drawer({
  open,
  defaultOpen = false,
  direction = "right",
  size = "md",
  trigger,
  title,
  description,
  children,
  closeNode,
  onOpenChange,
}: Props) {
  const [isSheetOpen, setIsSheetOpen] = useState(defaultOpen);

  const onOpenChangeHandler = (newOpenState: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpenState);
    }
    setIsSheetOpen(newOpenState);
  };

  const sizeClasses = {
    sm:
      direction === "top" || direction === "bottom" ? "h-[300px]" : "w-[300px]",
    md:
      direction === "top" || direction === "bottom" ? "h-[500px]" : "w-[500px]",
    lg:
      direction === "top" || direction === "bottom" ? "h-[700px]" : "w-[700px]",
  };

  return (
    <Sheet open={open ?? isSheetOpen} onOpenChange={onOpenChangeHandler}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}

      <SheetContent
        side={direction}
        className={cn(sizeClasses[size], "flex flex-col space-y-1")}
      >
        <div className="flex flex-col space-y-1 p-2">
          {title && (
            <SheetTitle className="text-lg font-medium">{title}</SheetTitle>
          )}
          {description && (
            <SheetDescription className="text-sm text-basic-600">
              {description}
            </SheetDescription>
          )}
        </div>

        <div className="p-2">{children}</div>
        {closeNode && (
          <SheetFooter>
            <SheetClose asChild>{closeNode}</SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
