import type { ReactNode } from "react";
import React from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../../shadcn-ui";

type Variant = "default" | "secondary" | "warning" | "destructive" | "success";
type Size = "sm" | "md" | "lg";

export interface DropDownMenuOption {
  value: string;
  label: string;
  leftNode?: ReactNode;
  separator?: boolean;
  onClick?: () => void;
  submenu?: DropDownMenuOption[];
}
interface Props {
  label?: string;
  options: DropDownMenuOption[];
  variant?: Variant;
  size?: Size;
  placeholder?: string;
}
export function DropDownMenu({
  label,
  options,
  variant = "default",
  size = "md",
  placeholder = "Select an option",
}: Props) {
  const renderMenuItems = (items: DropDownMenuOption[]) => {
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
            <DropdownMenuItem onSelect={() => item.onClick?.()}>
              <div className="flex space-x-1 items-center">
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-[250px]">
        {/** This Button will be replaced by our own, and will have dynamic variances */}
        <Button variant={"outline"} size={"lg"}>
          {placeholder}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[250px] space-y-1">
        {label && <DropdownMenuLabel>My Account</DropdownMenuLabel>}
        {label && <DropdownMenuSeparator />}
        {renderMenuItems(options)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
