import React from "react";
import { Icon } from "@iconify/react";
import { buttonVariants, DropdownMenu } from "@etm/web-ui-components";
import { cn } from "~/utils/cn.util";

export default function Toolbar() {
  return (
    <DropdownMenu
      align="end"
      trigger={
        <div
          className={cn(
            buttonVariants({
              variant: "outline",
              size: "md",
            }),
            "flex items-center gap-2 px-2 border-white bg-white"
          )}
        >
          <span className="flex items-center gap-1.5">
            <Icon icon="mage:filter" className="text-lg" />
            <span className="text-sm font-medium">Filters</span>
          </span>
          <Icon icon="stash:chevron-down-light" className="text-lg" />
        </div>
      }
      label=""
    />
  );
}
