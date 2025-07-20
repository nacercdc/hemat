"use client";

import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import * as React from "react";

interface Props {
  className?: string;
  placeholderClassName?: string;
  placeholder: string;
}

export default function LexicalContentEditable({
  className,
  placeholder,
  placeholderClassName,
}: Props) {
  return (
    <ContentEditable
      className={
        className ??
        "border-0 text-[15px] block relative outline-0 p-[8px_46px_40px] h-fit lg:p-[8px_8px_40px]"
      }
      aria-placeholder={placeholder}
      placeholder={
        <div
          className={
            placeholderClassName ??
            "text-[15px] text-gray-400 overflow-hidden absolute text-ellipsis top-2 left-[46px] right-7 select-none whitespace-nowrap inline-block pointer-events-none lg:left-2 lg:right-2"
          }
        >
          {placeholder}
        </div>
      }
    />
  );
}
