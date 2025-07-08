"use client";

import React, { useState } from "react";
import { DomainToolsCollapsible } from "./DomainToolsCollapsible";
import { Domains } from "../../constants";

export function DomainToolsCollapsibleList() {
  const [openIndex, setOpenIndex] = useState<number>(-1);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {Domains?.map((item, index) => (
        <DomainToolsCollapsible
          key={index}
          domain={item}
          isOpen={openIndex === index}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  );
}

interface IconWrapperProps {
  children: React.ReactNode;
  backColor: string;
}

export function IconWrapper({ children, backColor }: IconWrapperProps) {
  return (
    <div
      className="flex items-center justify-center rounded-full w-8 h-8"
      style={{ backgroundColor: `${backColor}` }}
    >
      {children}
    </div>
  );
}
