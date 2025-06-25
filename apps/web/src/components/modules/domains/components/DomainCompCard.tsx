"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@etm/web-ui-components";
import { cn } from "~/utils/cn.util";
import type { ListTypeLabel } from "../types";

export const ListTypeColors: Record<ListTypeLabel, string> = {
  Domain: "#edf4fb",
  Component: "#e9ebfb",
  SubComponent: "#f9f5f0",
};

interface Props {
  cardListType: ListTypeLabel;
  children: React.ReactNode;
  actionDisabled?: boolean;
  className?: string;
  onAddActionHandler: (itemType: ListTypeLabel) => void;
}

export function DomainCompCard({
  cardListType,
  children,
  actionDisabled = true,
  className,
  onAddActionHandler,
}: Props) {
  return (
    <div
      className={cn(
        "h-full w-full flex flex-col bg-tbaccent border rounded-lg lg:rounded-none lg:border-t lg:border-b overflow-hidden",
        className
      )}
    >
      <div
        className="flex justify-between items-center px-4 py-2"
        style={{ backgroundColor: `${ListTypeColors[cardListType]}` }}
      >
        <h1 className="text-[1rem] font-bold">
          {cardListType === "SubComponent" ? "Sub-Component" : cardListType}
        </h1>
        <Button
          type="button"
          variant="ghost"
          onClick={() => onAddActionHandler(cardListType)}
          disabled={actionDisabled}
        >
          <Icon icon="tabler:plus" className={cn("!w-6 !h-6")} />
        </Button>
      </div>
      <div className="px-4 my-5">{children}</div>
    </div>
  );
}
