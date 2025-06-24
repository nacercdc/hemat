import * as React from "react";
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../shadcn-ui/tooltip";

interface Props {
  trigger: React.ReactNode;
  content: React.ReactNode;
}

export function Tooltip({ trigger, content }: Props) {
  return (
    <ShadcnTooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent className="bg-white text-dark border-dark-lighter/20 border-[1px]">
        {content}
      </TooltipContent>
    </ShadcnTooltip>
  );
}
