"use client";

import { Tooltip } from "@etm/web-ui-components";

interface Props {
  text: string;
  maxLength?: number;
}

export function TruncatedText({ text, maxLength = 20 }: Props) {
  const needsTruncation = text.length > maxLength;
  const displayedText = needsTruncation
    ? `${text.slice(0, maxLength)}...`
    : text;

  const ToolTipTrigger = (
    <span className="inline-block cursor-context-menu">{displayedText}</span>
  );

  const ToolTipContent = <p className="max-w-xs break-words">{text}</p>;

  return <Tooltip trigger={ToolTipTrigger} content={ToolTipContent} />;
}
