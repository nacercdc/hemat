"use client";

import type { ToolTipColorType } from "@etm/web-ui-components";
import { Tooltip } from "@etm/web-ui-components";

interface Props {
  text: string;
  maxLength?: number;
  toolTipVariant?: ToolTipColorType;
}

export function TruncatedText({
  text,
  maxLength = 20,
  toolTipVariant = "light",
}: Props) {
  const needsTruncation = text.length > maxLength;
  const displayedText = needsTruncation
    ? `${text.slice(0, maxLength)}...`
    : text;

  const ToolTipTrigger = (
    <span className="inline-block cursor-context-menu">{displayedText}</span>
  );

  const ToolTipContent = <p className="max-w-xs break-words">{text}</p>;

  return (
    <Tooltip
      color={toolTipVariant}
      trigger={ToolTipTrigger}
      content={ToolTipContent}
    />
  );
}
