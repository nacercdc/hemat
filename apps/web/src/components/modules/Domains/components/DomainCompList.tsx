"use client";

import React from "react";
import { DomainCompListItem } from "./DomainCompListItem";

import type { ListItemType, ListType } from "./DomainCompCard";
import { cn } from "~/utils/cn.util";

interface Props {
  list: ListType;
  selectedItem: ListItemType | null;
  onSelectItem?: (item: ListItemType) => void;
}

export function DomainsList({ list, selectedItem, onSelectItem }: Props) {
  const isItemSelected = (item: ListItemType) => {
    if (selectedItem) return item.id === selectedItem.id;
  };

  return (
    <div className="flex flex-col gap-5">
      {list.map((listItem) => (
        <div
          key={listItem.id}
          className={cn(isItemSelected(listItem) && "bg-info/20 rounded-lg")}
        >
          <DomainCompListItem item={listItem} onClick={onSelectItem} />
        </div>
      ))}
    </div>
  );
}
