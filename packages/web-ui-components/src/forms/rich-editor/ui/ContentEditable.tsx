"use client";

import "./ContentEditable.css";

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
      className={className ?? "ContentEditable__root"}
      aria-placeholder={placeholder}
      placeholder={
        <div className={placeholderClassName ?? "ContentEditable__placeholder"}>
          {placeholder}
        </div>
      }
    />
  );
}
