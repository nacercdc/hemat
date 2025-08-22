"use client";

import React, { useState } from "react";
import { ComponentCollapsible } from "./ComponentCollapsible";
import { cn } from "~/utils/cn.util";

import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type { Domain } from "~/libs/models/domain.model";
import { Skeleton } from "@etm/web-ui-components";

interface IComponent {
  id: string;
  name: string;
  averageRate: number;
}

export interface CollapsibleItem {
  icon: React.ReactNode;
  color: string;
  title: string;
  domain: Domain;
  content: { title: string; content: string; score: number }[];
}

export function ComponentCollapsibleList() {
  const [selectedDomain, _setSelectedDomain] = useState<Domain | null>(null);

  const [openIndex, setOpenIndex] = useState<number>(-1);

  const { data: components, ...componentsState } = useFindAll<IComponent[]>({
    path: `/dashboard/domains/${selectedDomain?.id}/components/average-rate`,
    isProtected: false,
    tqOptions: {
      enabled: !!selectedDomain?.id,
      queryKey: ["components", selectedDomain?.id],
    },
  });

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const isLoading = componentsState.isLoading || componentsState.isFetching;

  if (isLoading) return <DomainCollapsibleListSkeleton />;

  return (
    <div
      className={cn(
        "px-16 2xl:px-52 pr-24 2xl:pr-64 w-full bg-[#FAFAFA]",
        !selectedDomain && "hidden"
      )}
    >
      {selectedDomain &&
        (components as unknown as IComponent[])?.map((item, index) => (
          <ComponentCollapsible
            key={item.id + new Date().toString()}
            icon={null}
            title={item.name}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
            id={item.id}
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

function DomainCollapsibleListSkeleton() {
  return (
    <div className="px-16 2xl:px-52 pr-24 2xl:pr-64 w-full bg-[#FAFAFA]">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="w-full my-3 mx-5">
          <Skeleton className="rounded-sm w-full h-12" />
        </div>
      ))}
    </div>
  );
}
