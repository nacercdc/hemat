"use client";

import React, { useEffect, useState } from "react";
import { DomainCollapsible } from "./DomainCollapsible";
import { cn } from "~/utils/cn.util";
import { useSelectedDomain } from "../../context/selected-domain/useSelectedDomain";
import type { Domain } from "~/libs/models/domain.model";
import { collapsibleItems } from "../../constants";

export interface CollapsibleItem {
  icon: React.ReactNode;
  color: string;
  title: string;
  domain: Domain;
  content: { title: string; content: string; score: number }[];
}

export function DomainCollapsibleList() {
  const selectedDomainCtx = useSelectedDomain();

  const [openIndex, setOpenIndex] = useState<number>(-1);

  const [filteredItems, setFilteredItems] = useState<CollapsibleItem[]>();

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  useEffect(() => {
    setFilteredItems(
      collapsibleItems.filter(
        (item) => item.domain.name === selectedDomainCtx?.selectedDomain?.name
      )
    );
  }, [selectedDomainCtx?.selectedDomain]);

  return (
    <div
      className={cn(
        "px-40 2xl:px-52 pr-52 2xl:pr-64 w-full bg-[#FAFAFA]",
        !selectedDomainCtx?.selectedDomain && "hidden"
      )}
    >
      {selectedDomainCtx?.selectedDomain &&
        filteredItems?.map((item, index) => (
          <DomainCollapsible
            key={index}
            icon={<IconWrapper backColor={item.color}>{item.icon}</IconWrapper>}
            title={item.title}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
            content={item.content}
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
