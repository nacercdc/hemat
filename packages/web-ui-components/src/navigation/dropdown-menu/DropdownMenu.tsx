import type { ReactNode } from "react";
import React from "react";
import {
  DropdownMenu as ShadcnDropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../../shadcn-ui";
import { Button } from "../../forms/button";
import { cn } from "../../shadcn-ui/utils/cn";
import { cva } from "class-variance-authority";

type Variant = "default" | "dark" | "warning" | "destructive" | "success";
type Size = "sm" | "md" | "lg";

export const dropdownMenuVariants = cva("flex gap-2 items-center", {
  variants: {
    size: {
      sm: "!text-xs",
      md: "!text-xs",
      lg: "!text-xs",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface DropdownMenuOption {
  value: string;
  label: React.ReactNode;
  leftNode?: ReactNode;
  separator?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  submenu?: DropdownMenuOption[];
  destructive?: boolean;
}
interface Props {
  align?: "center" | "end" | "start";
  triggerTextAlign?: "start" | "center" | "end";
  label?: React.ReactNode;
  options?: DropdownMenuOption[];
  variant?: Variant;
  size?: Size;
  placeholder?: string;
  trigger?: React.ReactNode;
  isModal?: boolean;
}
export function DropdownMenu({
  align = "center",
  triggerTextAlign = "center",
  label,
  options = [],
  variant = "default",
  size = "md",
  placeholder = "Select an option",
  trigger,
  isModal = false,
}: Props) {
  const renderMenuItems = (items: DropdownMenuOption[]) => {
    return items.map((item) => {
      if (item.submenu) {
        return (
          <DropdownMenuSub key={item.value}>
            <DropdownMenuSubTrigger>{item.label}</DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-[150px] space-y-1">
              {renderMenuItems(item.submenu)}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        );
      } else {
        return (
          <div key={item.value}>
            {item.separator && <DropdownMenuSeparator />}
            <DropdownMenuItem
              disabled={item.disabled}
              onSelect={() => item.onClick?.()}
            >
              <div
                className={cn(
                  {
                    "text-destructive": item.destructive,
                  },
                  dropdownMenuVariants({ size })
                )}
              >
                {item.leftNode && (
                  <div className="w-6 h-6 flex items-center">
                    {item.leftNode}
                  </div>
                )}
                {item.label}
              </div>
            </DropdownMenuItem>
          </div>
        );
      }
    });
  };
  return (
    <ShadcnDropdownMenu modal={isModal}>
      {trigger && (
        <DropdownMenuTrigger asChild className="cursor-pointer">
          {trigger && (
            <div
              className={cn(
                `min-w-12 min-h-12 flex items-center justify-${triggerTextAlign}`,
                triggerTextAlign === "end" && "w-full"
              )}
            >
              {trigger}
            </div>
          )}
        </DropdownMenuTrigger>
      )}
      {!trigger && (
        <DropdownMenuTrigger asChild className="w-[250px] cursor-pointer">
          <Button variant={"outline"} color={variant} size={size}>
            {placeholder}
          </Button>
        </DropdownMenuTrigger>
      )}
      <DropdownMenuContent
        className={cn(!trigger && "w-[250px]", "space-y-1")}
        align={align}
      >
        {label && <DropdownMenuLabel>{label}</DropdownMenuLabel>}
        {renderMenuItems(options)}
      </DropdownMenuContent>
    </ShadcnDropdownMenu>
  );
}
