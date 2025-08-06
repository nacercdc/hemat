"use client";

import React, { useState } from "react";
import { DomainToolsCollapsible } from "./DomainToolsCollapsible";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { Skeleton } from "@etm/web-ui-components";

export interface ITemplateDomain {
  id: string;
  name: string;
}

export function DomainToolsCollapsibleList() {
  const [openIndex, setOpenIndex] = useState<number>(-1);

  const { data: templateDomains, ...templateDomainsState } = useFindAll<
    ITemplateDomain[]
  >({ path: "/dashboard/template/domains", isProtected: false });

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  if (templateDomainsState.isLoading || templateDomainsState.isFetching) {
    return <DomainToolsListSkeleton />;
  }

  return (
    <div className="w-full flex flex-col gap-2">
      {(templateDomains as unknown as ITemplateDomain[])?.map((item, index) => (
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

function DomainToolsListSkeleton() {
  return (
    <div className="flex flex-col gap-2 w-full">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-16 rounded-sm"></Skeleton>
      ))}
    </div>
  );
}
