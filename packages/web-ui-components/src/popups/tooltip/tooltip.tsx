import * as React from "react";
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../shadcn-ui/tooltip";
import { Spinner } from "../../presentation";
import { cn } from "../../shadcn-ui/utils/cn";

interface Props {
  color?: "dark" | "light";
  trigger: React.ReactNode;
  content: React.ReactNode | null;
  contentLoading: boolean;
}

export function Tooltip({
  color = "light",
  trigger,
  content,
  contentLoading,
}: Props) {
  return (
    <ShadcnTooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent
        className={cn(
          "text-dark border-dark-lighter/20 border-[1px]",
          color === "dark" && "bg-dark/60 text-white",
          color === "light" && "bg-white text-dark"
        )}
      >
        {!contentLoading && <div>{content}</div>}
        {contentLoading && (
          <div>
            <Spinner
              color={color === "light" ? "primary" : "light"}
              size="sm"
            />
          </div>
        )}
      </TooltipContent>
    </ShadcnTooltip>
  );
}
